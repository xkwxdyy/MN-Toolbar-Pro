
JSB.newAddon = function (mainPath) {
  JSB.require('utils')
  if (!toolbarUtils.checkMNUtilsFolder(mainPath)) {
    Application.sharedInstance().showHUD("MN OCR: Please install 'MN Utils' first!",Application.sharedInstance().focusWindow,5)
    return undefined
  }
  JSB.require('webviewController');
  JSB.require('settingController');
  /** @return {MNToolbarClass} */
  const getMNToolbarClass = ()=>self  
  var MNToolbarClass = JSB.defineClass(
    'MNToolbar : JSExtension',
    { /* Instance members */
      sceneWillConnect: function () { //Window initialize
        if (typeof MNUtil === 'undefined') {
          Application.sharedInstance().showHUD("MN OCR: Please install 'MN Utils' first!",Application.sharedInstance().focusWindow,5)
          return
        }
        let self = getMNToolbarClass()
        // MNUtil.showHUD("mntoolbar")
        self.appInstance = Application.sharedInstance();
        // self.popUpNote
        self.isNewWindow = false;
        self.watchMode = false;
        self.textSelected = ""
        self.textProcessed = false;
        self.dateGetText = Date.now();
        self.dateNow = Date.now();
        self.rect = '{{0, 0}, {10, 10}}';
        self.arrow = 1;
        try {
        // toolbarConfig.remove("MNToolbar_actionConfig")
        // toolbarConfig.remove("MNToolbar_action")
        // toolbarConfig.remove("MNToolbar_windowState")
        // toolbarConfig.remove("MNToolbar_dynamic")
          toolbarUtils.init()
          toolbarConfig.init()
          toolbarConfig.mainPath = mainPath
        } catch (error) {
          MNUtil.showHUD(error)
          toolbarUtils.copy(error)
        }
        MNUtil.addObserver(self, 'onPopupMenuOnNote:', 'PopupMenuOnNote')
        MNUtil.addObserver(self, 'onToggleDynamic:', 'toggleDynamic')
        MNUtil.addObserver(self, 'onClosePopupMenuOnNote:', 'ClosePopupMenuOnNote')
        MNUtil.addObserver(self, 'onRemoveMNToolbar:', 'removeMNToolbar')
        MNUtil.addObserver(self, 'onTextDidBeginEditing:', 'UITextViewTextDidBeginEditingNotification')
      },

      sceneDidDisconnect: function () { // Window disconnect 在插件页面关闭插件（不是删除）
        if (typeof MNUtil === 'undefined') return
        MNUtil.removeObserver(self,'PopupMenuOnNote')
        MNUtil.removeObserver(self,'toggleDynamic')
        MNUtil.removeObserver(self,'ClosePopupMenuOnNote')
        MNUtil.removeObserver(self,'removeMNToolbar')
        MNUtil.removeObserver(self,'UITextViewTextDidBeginEditingNotification')
        // MNUtil.showHUD("remove")
      },

      sceneWillResignActive: function () { // Window resign active
      },

      sceneDidBecomeActive: function () { // Window become active
      },

      notebookWillOpen: async function (notebookid) {
        if (typeof MNUtil === 'undefined') return
        let studyView = MNUtil.studyView
        if (MNUtil.studyMode < 3) {
          await MNUtil.delay(0.5)
          // toolbarUtils.refreshSubscriptionStatus()
          if (!self.addonController) {
            self.addonController = toolbarController.new();
            self.addonController.mainPath = mainPath;
          }
          studyView.addSubview(self.addonController.view);
          MNUtil.refreshAddonCommands();
          self.addonController.view.hidden = true;
          self.addonController.dynamic = toolbarConfig.dynamic
          self.addonController.notebookid = notebookid
          self.notebookid = notebookid
          toolbarUtils.notebookId = notebookid
          if (self.lastFrame) {
            self.addonController.view.frame = self.lastFrame
            self.addonController.currentFrame = self.lastFrame
          }else{
            self.addonController.view.frame = MNUtil.genFrame(10,10,40,200)
            self.addonController.currentFrame = MNUtil.genFrame(10,10,40,200)
          }
          if (toolbarConfig.windowState.frame) {
            self.addonController.view.frame = toolbarConfig.windowState.frame;
            self.addonController.currentFrame = toolbarConfig.windowState.frame;
            self.addonController.view.hidden = !toolbarConfig.windowState.open;
            toolbarConfig.isFirst = false
          }else{
            toolbarConfig.windowState={}
          }
          }
          NSTimer.scheduledTimerWithTimeInterval(0.2, false, function () {
            MNUtil.studyController.becomeFirstResponder(); //For dismiss keyboard on iOS
          });
          // if (toolbarConfig.dynamic && !self.testController) {
          //   self.testController = toolbarController.new();
          //   self.testController.mainPath = mainPath;
          //   self.testController.dynamic = toolbarConfig.dynamic
          //   self.testController.view.hidden = true
          //   self.testController.dynamicWindow = true
          //   self.testController.addonController = self.addonController
          //   // self.testController.action = self.addonController.action
          //   // showHUD(self.testController.action)
          //   self.addonController.dynamicToolbar = self.testController
          //   MNUtil.studyView.addSubview(self.testController.view);
          //   let lastFrame = self.addonController.view.frame
          //   let buttomNumber = toolbarConfig.windowState.dynamicButton??9
          //   lastFrame.height = toolbarUtils.checkHeight(lastFrame.height,buttomNumber)
          //   self.addonController.view.frame = lastFrame
          // }
          
      },

      notebookWillClose: function (notebookid) {
        if (typeof MNUtil === 'undefined') return
        self.lastFrame = self.addonController.view.frame
        if (self.testController) {
          self.testController.view.hidden = true
        }
        if (self.addonController.settingController) {
          self.addonController.settingController.hide()
        }
        toolbarConfig.windowState.open  = !self.addonController.view.hidden
        toolbarConfig.windowState.frame = self.addonController.view.frame
        toolbarConfig.save("MNToolbar_windowState")
      },
      onPopupMenuOnNote: async function (sender) { // Clicking note
        if (typeof MNUtil === 'undefined') return
        let self = getMNToolbarClass()
        // showHUD("note")
        // let noteid = sender.userInfo.note.noteId
        // var pasteBoard = UIPasteboard.generalPasteboard()
        // pasteBoard.string = url
        if (self.window !== MNUtil.currentWindow || !toolbarConfig.dynamic) {
          return
        }
        // if (!self.appInstance.checkNotifySenderInWindow(sender, self.window) || !toolbarConfig.dynamic) return; // Don't process message from other window
        self.onPopupMenuOnNoteTime = Date.now()
        self.noteid = sender.userInfo.note.noteId
        toolbarUtils.currentNoteId = sender.userInfo.note.noteId
        self.notShow = false
        let rectArr = sender.userInfo.winRect.replace(/{/g, '').replace(/}/g, '').replace(/\s/g, '').split(',')
        let X = Number(rectArr[0])
        let Y = Number(rectArr[1])
        let H = Number(rectArr[3])
        let W = Number(rectArr[2])
        let docMapSplitMode = MNUtil.studyController.docMapSplitMode
        if (H <=11 && W <=11 && docMapSplitMode!==0) {
          self.testController.view.hidden = true
          return
        }
        let studyFrame = MNUtil.studyView.frame
        let studyFrameX = studyFrame.x
        let studyHeight = studyFrame.height
        let lastFrame 
        try {
          
        if (!self.testController) {
          self.testController = toolbarController.new();
          self.testController.mainPath = mainPath;
          self.testController.dynamic = toolbarConfig.dynamic
          self.testController.view.hidden = true
          self.testController.dynamicWindow = true
          self.testController.addonController = self.addonController
          // self.testController.action = self.addonController.action
          // showHUD(self.testController.action)
          self.addonController.dynamicToolbar = self.testController
          MNUtil.studyView.addSubview(self.testController.view);
          lastFrame = self.addonController.view.frame
          let buttomNumber = toolbarConfig.windowState.dynamicButton??9
          lastFrame.height = toolbarUtils.checkHeight(lastFrame.height,buttomNumber)
        }else{
          self.testController.refreshHeight()
          lastFrame = self.testController.view.frame
        }
        } catch (error) {
          MNUtil.showHUD(error)
        }
        self.testController.onClick = false
        if (X-40<0) {
          lastFrame.x = X+W-studyFrameX
        }else{
          lastFrame.x = X-40-studyFrameX
        }
        if (Y-15<0) {
          lastFrame.y = 0
        }else{
          lastFrame.y = Y-20
        }
        if (Y+lastFrame.height>studyHeight) {
          lastFrame.y = studyHeight-lastFrame.height
        }
        lastFrame.width = 40
        let testController = self.testController
        // let delay = testController.view.hidden?0.5:0
        // await MNUtil.delay(delay)
        if (self.notShow) {
          return
        }
        if (testController.view.hidden) {
          let preOpacity = testController.view.layer.opacity
          testController.view.frame = lastFrame
          testController.currentFrame = lastFrame
          testController.view.layer.opacity = 0
          testController.view.hidden = false
          MNUtil.animate(()=>{
            testController.view.layer.opacity = preOpacity
          }).then(()=>{
            // testController.moveButton.hidden = false
            testController.screenButton.hidden = false
            let preFrame = testController.view.frame
            let yBottom = preFrame.height    
            for (let index = 0; index < testController.buttonNumber; index++) {
              testController["ColorButton"+index].hidden = (testController["ColorButton"+index].frame.y+40 > yBottom)
            }
          })
        }else{
        // showHUD("frame:"+JSON.stringify(lastFrame))
          MNUtil.animate(()=>{
            testController.view.frame = lastFrame
            testController.currentFrame = lastFrame
            testController.view.hidden = false
            // testController.moveButton.hidden = false
            testController.screenButton.hidden = false
          })
        }
      },
      onClosePopupMenuOnNote: function (sender) {
        if (typeof MNUtil === 'undefined') return
        // showHUD("close")
        // if (!self.appInstance.checkNotifySenderInWindow(sender, self.window)) {
        //   return; // Don't process message from other window
        // }
        self.onClosePopupMenuOnNoteTime = Date.now()
        // showHUD("message")
        if (self.noteid === sender.userInfo.noteid && Date.now()-self.onPopupMenuOnNoteTime < 500) {
          // showHUD("not show")
          self.notShow = true
        }
        if (self.onClosePopupMenuOnNoteTime>self.onPopupMenuOnNoteTime+300 && !self.testController.onClick) {
          let preOpacity = self.testController.view.layer.opacity
          UIView.animateWithDurationAnimationsCompletion(0.1,()=>{
            self.testController.view.layer.opacity = 0
          },()=>{
            self.testController.view.layer.opacity = preOpacity
            self.testController.view.hidden = true
          })
          return
        }
      },
      // onMNToolbarRefreshLayout: function (params) {
      //   Application.sharedInstance().showHUD("message", self.window, 2)
      //   // MNUtil.showHUD("message",2,self.window)
      // },
      documentDidOpen: function (docmd5) {
      },

      documentWillClose: function (docmd5) {
      },

      controllerWillLayoutSubviews: function (controller) {
        if (typeof MNUtil === 'undefined') return
        if (controller !== MNUtil.studyController) {
          // MNUtil.showHUD("return")
          return;
        };
          // MNUtil.showHUD("accept")
        if (!self.addonController.view.hidden) {
          if (self.addonController.onAnimate || self.addonController.onResize) {
            // showHUD("reject")
            return
          }
          let splitLine = MNUtil.splitLine
          // MNUtil.showHUD("splitline:"+splitLine)
          let studyFrame = toolbarUtils.studyView().bounds
          let currentFrame = self.addonController.currentFrame
          // showHUD(JSON.stringify(currentFrame))
          if (currentFrame.x+currentFrame.width*0.5 >= studyFrame.width) {
            currentFrame.x = studyFrame.width-currentFrame.width*0.5              
          }
          if (currentFrame.y >= studyFrame.height) {
            currentFrame.y = studyFrame.height-20              
          }
          currentFrame.height = toolbarUtils.checkHeight(currentFrame.height,self.addonController.buttonNumber)
          if (self.addonController.splitMode) {
            if (splitLine) {
              currentFrame.x = splitLine-20
            }else{
              if (currentFrame.x < studyFrame.width*0.5) {
                currentFrame.x = 0
              }else{
                currentFrame.x = studyFrame.width-40
              }
            }
          }
          if (self.addonController.sideMode) {
            switch (self.addonController.sideMode) {
              case "left":
                currentFrame.x = 0
                break;
              case "right":
                currentFrame.x = studyFrame.width-40
                break;
              default:
                break;
            }
          }
          currentFrame.width = 40
          if (currentFrame.x > (studyFrame.width-40)) {
            currentFrame.x = studyFrame.width-40
            // MNUtil.showHUD("message")
          }
          self.addonController.view.frame = currentFrame
          self.addonController.currentFrame = currentFrame
        }
        if (self.testController) {
          if (self.testController.onAnimate || self.testController.onResize) {
            // showHUD("reject")
            return
          }
          let currentFrame = self.testController.currentFrame
          let buttomNumber = toolbarConfig.windowState.dynamicButton??9
          currentFrame.height = toolbarUtils.checkHeight(currentFrame.height,buttomNumber)
          self.testController.view.frame = currentFrame
          self.testController.currentFrame = currentFrame
        }
        if (self.addonController.settingController) {
          let currentFrame = self.addonController.settingController.currentFrame
          // currentFrame.height = toolbarUtils.checkHeight(currentFrame.height)
          self.addonController.settingController.view.frame = currentFrame
          self.addonController.settingController.currentFrame = currentFrame
        }
      },

      queryAddonCommandStatus: function () {
        // MNUtil.showHUD("queryAddonCommandStatus")
        if (typeof MNUtil === 'undefined') return null
        if (MNUtil.studyMode < 3) {
          if (self.addonController) {
            self.addonController.setToolbarButton()
          }
          // toolbarUtils.refreshSubscriptionStatus()
          return {
            image: 'logo.png',
            object: self,
            selector: 'toggleAddon:',
            checked: toolbarConfig.dynamic
          };
        } else {
          return null;
        }
      },
      onToggleDynamic:function (sender) {
        if (typeof MNUtil === 'undefined') return
        toolbarConfig.dynamic = !toolbarConfig.dynamic
        self.addonController.dynamic = toolbarConfig.dynamic
        if (toolbarConfig.dynamic) {
          MNUtil.showHUD("Dynamic ✅")
        }else{
          self.testController.view.hidden = true
        }
        toolbarConfig.save("MNToolbar_dynamic")
        // NSUserDefaults.standardUserDefaults().setObjectForKey(toolbarConfig.dynamic,"MNToolbar_dynamic")
        self.testController.dynamic = toolbarConfig.dynamic
      },
      onRemoveMNToolbar:function (params) {
        self.addonController.view.removeFromSuperview()
        toolbarConfig.addonLogos = {}
      },
      /**
       * 
       * @param {{object:UITextView}} param 
       */
      onTextDidBeginEditing:function (param) {
try {
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        if (MNUtil.studyMode === 3) {
          return
        }
        if (self.testController && !self.testController.view.hidden) {
          let preOpacity = self.testController.view.layer.opacity
          UIView.animateWithDurationAnimationsCompletion(0.1,()=>{
            self.testController.view.layer.opacity = 0
          },()=>{
            self.testController.view.layer.opacity = preOpacity
            self.testController.view.hidden = true
          })
        }
        if (!toolbarConfig.showEditorOnNoteEdit) {
          return
        }
        // if (MNUtil.studyController.docMapSplitMode === 2) {
        //   return
        // }
        // if (MNUtil.notebookController.outlineView && !MNUtil.notebookController.outlineView.hidden) {
        //   return
        // }
        // //0:未知
        // //1：未知
        // //8:studyView
        // //9:侧边栏
        // MNUtil.showHUD("message"+MNUtil.studyController.view.superview.subviews.length)
        // MNUtil.studyController.view.superview.subviews[7].hidden = true
        // // param.object.superview.superview.superview.hidden = true
        // return
        // let noteView = MNUtil.notebookController.mindmapView.mindmapNodes[0].frame
        let textView = param.object
        // let check = []
        // check.push(textView.superview === MNUtil.studyView)
        // check.push(textView.superview.superview === MNUtil.studyView)
        // check.push(textView.superview.superview.superview === MNUtil.studyView)
        // check.push(textView.superview.superview.superview.superview === MNUtil.studyView)
        // check.push(textView.superview.superview.superview.superview.superview === MNUtil.studyView)
        // check.push(textView.superview.superview.superview.superview.superview.superview === MNUtil.studyView)
        // check.push(textView.superview.superview.superview.superview.superview.superview.superview === MNUtil.studyView)
        // check.push(textView.superview.superview.superview.superview.superview.superview.superview.superview === MNUtil.studyView)
        // check.push(textView.superview.superview.superview.superview.superview.superview.superview.superview.superview === MNUtil.studyView)
        // MNUtil.copyJSON(check)
        // if (textView.superview.superview.superview.superview.superview !== MNUtil.mindmapView) {
        //   return
        // }
        // MNUtil.notebookController.view
        // let check = []
        // check.push(textView.isDescendantOfView(MNUtil.studyController.view))
        // check.push(textView.isDescendantOfView(MNUtil.notebookController.view))
        // check.push(textView.isDescendantOfView(MNUtil.readerController.view))
        // check.push(textView.isDescendantOfView(MNUtil.mindmapView))
        // check.push(textView.isDescendantOfView(MNUtil.notebookController.outlineView))
        // // check.push(textView.isDescendantOfView(MNUtil.readerController.currentDocumentController.view))
        // // check.push(textView.isDescendantOfView(MNUtil.notebookController.view))
        // // check.push(textView.isDescendantOfView(MNUtil.notebookController.view))
        // // check.push(textView.isDescendantOfView(MNUtil.notebookController.view))
        // MNUtil.copyJSON(check)
        // MNUtil.showHUD("message"+textView.isDescendantOfView(MNUtil.notebookController.view))
        // MNUtil.copyJSON(beginFrame)
        let mindmapView = toolbarUtils.getMindmapview(textView)

        // if (!(textView.isDescendantOfView(MNUtil.mindmapView) || textView.superview.superview.superview.superview.superview.superview.superview.superview === MNUtil.studyView)) {
        //   return
        // }
        // let mindmapView
        // if (textView.isDescendantOfView(MNUtil.mindmapView)) {
        //   mindmapView = MNUtil.mindmapView
        // }else{
        //   mindmapView = textView.superview.superview.superview.superview.superview
        //   MNUtil.floatMindMapView = mindmapView
        // }
        if (!mindmapView) {
          return
        }
        let noteView = mindmapView.selViewLst[0].view
        // let foucsNote = MNNote.getFocusNote()
        let foucsNote = MNNote.new(mindmapView.selViewLst[0].note.note)
        let beginFrame = noteView.convertRectToView(noteView.bounds, MNUtil.studyView)
        if (!foucsNote.noteTitle && !foucsNote.excerptText && !foucsNote.comments.length) {
          // MNUtil.copyJSON(param.object)
          param.object.text = "placeholder"
          // foucsNote.noteTitle = "Title"
          // foucsNote.excerptText = "Excerpt"
        }
        // MNUtil.beginTime = Date.now()
        // return
        if (foucsNote) {
          let noteId = foucsNote.noteId
          let studyFrame = MNUtil.studyView.bounds
          if (beginFrame.x+450 > studyFrame.width) {
            let endFrame = MNUtil.genFrame(studyFrame.width-450, beginFrame.y-10, 450, 500)
            if (beginFrame.y+490 > studyFrame.height) {
              endFrame.y = studyFrame.height-500
            }
            MNUtil.postNotification("openInEditor",{noteId:noteId,beginFrame:beginFrame,endFrame:endFrame})
          }else{
            let endFrame = MNUtil.genFrame(beginFrame.x, beginFrame.y-10, 450, 500)
            if (beginFrame.y+490 > studyFrame.height) {
              endFrame.y = studyFrame.height-500
            }
            MNUtil.postNotification("openInEditor",{noteId:noteId,beginFrame:beginFrame,endFrame:endFrame})
          }
        }
        // MNUtil.showHUD(param.object.text)
        // MNUtil.copyJSON(params.userInfo)

} catch (error) {
  toolbarUtils.addErrorLog(error, "onTextDidBeginEditing")
}
      },
      toggleAddon:function (sender) {
        if (typeof MNUtil === 'undefined') return
        if (!self.addonBar) {
          self.addonBar = sender.superview.superview
          self.addonController.addonBar = self.addonBar
        }
        if (toolbarConfig.isFirst) {
          let buttonFrame = self.addonBar.frame
          // self.addonController.moveButton.hidden = true
          if (buttonFrame.x === 0) {
            self.addonController.view.frame = {x:40,y:buttonFrame.y,width:40,height:290}
          }else{
            self.addonController.view.frame = {x:buttonFrame.x-40,y:buttonFrame.y,width:40,height:290}
          }
          self.addonController.currentFrame = self.addonController.view.frame
          toolbarConfig.isFirst = false;
        }
        if (self.addonController.view.hidden) {
          toolbarConfig.windowState.open = true
          toolbarConfig.windowState.frame = self.addonController.view.frame
          // showHUD(JSON.stringify(self.addonBar.frame))
          self.addonController.show(self.addonBar.frame)
          toolbarConfig.save("MNToolbar_windowState")
        }else{
          toolbarConfig.windowState.open = false
          toolbarConfig.windowState.frame = self.addonController.view.frame
          self.addonController.hide(self.addonBar.frame)
          toolbarConfig.save("MNToolbar_windowState")
        }
      // self.addonController.view.hidden = !self.addonController.view.hidden
      }
    },
    { /* Class members */
      addonDidConnect: function () {
      },

      addonWillDisconnect: async function () {
        let confirm = await MNUtil.confirm("Remove all config?\n删除所有配置？", "")
        if (confirm) {
          toolbarConfig.remove("MNToolbar_dynamic")
          toolbarConfig.remove("MNToolbar_windowState")
          toolbarConfig.remove("MNToolbar_action")
          toolbarConfig.remove("MNToolbar_actionConfig")
        }
        MNUtil.postNotification("removeMNToolbar", {})
      },

      applicationWillEnterForeground: function () {
      },

      applicationDidEnterBackground: function () {
      },

      applicationDidReceiveLocalNotification: function (notify) {
      }
    }
  );
  return MNToolbarClass;
};