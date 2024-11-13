let referenceIds = {}

JSB.newAddon = function (mainPath) {
  JSB.require('utils')
  JSB.require('pinyin')
  if (!toolbarUtils.checkMNUtilsFolder(mainPath)) {return undefined}
  JSB.require('webviewController');
  JSB.require('settingController');
  // JSB.require('UIPencilInteraction');
  /** @return {MNToolbarClass} */
  const getMNToolbarClass = ()=>self  
  var MNToolbarClass = JSB.defineClass(
    'MNToolbar : JSExtension',
    { /* Instance members */
      sceneWillConnect: async function () { //Window initialize
        if (!(await toolbarUtils.checkMNUtil(true))) return
        let self = getMNToolbarClass()
        self.init(mainPath)
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
        MNUtil.addObserver(self, 'onPopupMenuOnNote:', 'PopupMenuOnNote')
        MNUtil.addObserver(self, 'onPopupMenuOnSelection:', 'PopupMenuOnSelection')
        MNUtil.addObserver(self, 'onToggleDynamic:', 'toggleDynamic')
        MNUtil.addObserver(self, 'onTogglePreprocessMode:', 'togglePreprocessMode')
        MNUtil.addObserver(self, 'onClosePopupMenuOnNote:', 'ClosePopupMenuOnNote')
        MNUtil.addObserver(self, 'onRemoveMNToolbar:', 'removeMNToolbar')
        MNUtil.addObserver(self, 'onToggleMindmapToolbar:', 'toggleMindmapToolbar')
        MNUtil.addObserver(self, 'onRefreshToolbarButton:', 'refreshToolbarButton')
        MNUtil.addObserver(self, 'onOpenToolbarSetting:', 'openToolbarSetting')
        MNUtil.addObserver(self, 'onTextDidBeginEditing:', 'UITextViewTextDidBeginEditingNotification')
        // MNUtil.addObserver(self, 'onTest:', 'cloudConfigChange')
        // MNUtil.addObserver(self, 'onAddonBroadcast:', 'AddonBroadcast');
        try {
          
        // toolbarConfig.addCloudChangeObserver(self, 'onCloudConfigChange:', 'NSUbiquitousKeyValueStoreDidChangeExternallyNotification')
        } catch (error) {
          toolbarUtils.addErrorLog(error, "addCloudChangeObserver")
        }
      },

      sceneDidDisconnect: function () { // Window disconnect 在插件页面关闭插件（不是删除）
        if (typeof MNUtil === 'undefined') return
        MNUtil.removeObserver(self,'PopupMenuOnNote')
        MNUtil.removeObserver(self,'toggleDynamic')
        MNUtil.removeObserver(self,'togglePreprocessMode')
        MNUtil.removeObserver(self,'ClosePopupMenuOnNote')
        MNUtil.removeObserver(self,'removeMNToolbar')
        MNUtil.removeObserver(self,'UITextViewTextDidBeginEditingNotification')
        MNUtil.removeObserver(self,'refreshToolbarButton')
        MNUtil.removeObserver(self,'openToolbarSetting')
        // MNUtil.removeObserver(self,'NSUbiquitousKeyValueStoreDidChangeExternallyNotification')
        // MNUtil.showHUD("remove")
      },

      sceneWillResignActive: function () { // Window resign active
      },

      sceneDidBecomeActive: function () { // Window become active
      },

      notebookWillOpen: async function (notebookid) {
        if (!(await toolbarUtils.checkMNUtil(false,0.1))) return
        if (MNUtil.studyMode < 3) {
          let self = getMNToolbarClass()
          self.init(mainPath)
          await MNUtil.delay(0.5)
          self.ensureView(true)
          MNUtil.refreshAddonCommands();
          self.addonController.dynamic = toolbarConfig.dynamic
          self.addonController.notebookid = notebookid
          self.notebookid = notebookid
          toolbarUtils.notebookId = notebookid
        }
        MNNote.prototype.getLinksCommentsIndexArray = function(){
          let linksCommentsIndexArray = []
          this.comments.forEach((comment,index)=>{
            if (
              comment.type == "TextNote" &&
              /^marginnote\dapp:\/\/note\//.test(comment.text)
            ) {
              linksCommentsIndexArray.push(index)
            }
          })
          return linksCommentsIndexArray
        }
        MNNote.prototype.getCommentIndexArray = function(text){
          let linksCommentsIndexArray = []
          this.comments.forEach((comment,index)=>{
            if (
              comment.type == "TextNote" &&
              comment.text.includes(text)
            ) {
              linksCommentsIndexArray.push(index)
            }
          })
          return linksCommentsIndexArray
        }
        MNNote.prototype.hasComment = function(comment){
          let comments = this.comments
          for (let i = 0; i < comments.length; i++) {
            if (
              comments[i].text &&
              comments[i].text === comment
            ) {
              return true
            }
          }
          return false
        }
        MNNote.prototype.noteURL = function(){
          return "marginnote4app://note/"+this.noteId
        }
        MNNote.prototype.clearAllLinks = function(){
          for (let i = this.comments.length-1; i >= 0; i--) {
            let comment = this.comments[i]
            if (
              comment.type == "TextNote" &&
              (
                comment.text.includes("marginnote3") ||
                comment.text.includes("marginnote4")
              )
            ) {
              this.removeCommentByIndex(i)
            }
          }
        }
        MNNote.prototype.linksConvertToMN4Type = function(){
          for (let i = this.comments.length-1; i >= 0; i--) {
            let comment = this.comments[i]
            if (
              comment.type == "TextNote" &&
              comment.text.startsWith("marginnote3app://note/")
            ) {
              let targetNoteId = comment.text.match(/marginnote3app:\/\/note\/(.*)/)[1]
              let targetNote = MNNote.new(targetNoteId)
              if (targetNote) {
                this.removeCommentByIndex(i)
                this.appendNoteLink(targetNote, "To")
                this.moveComment(this.comments.length-1, i)
              } else {
                this.removeCommentByIndex(i)
              }
            }
          }
        }
        // TODO：失效
        MNNote.prototype.clearAllFailedLinks = function() {
          // this.linksConvertToMN4Type()
          // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
          for (let i = this.comments.length-1; i >= 0; i--) {
            let comment = this.comments[i]
            if (
              comment.type == "TextNote" &&
              comment.text.includes("marginnote3app://note/")
            ) {
              this.removeCommentByIndex(i)
            } else if (
              comment.type == "TextNote" &&
              comment.text.includes("marginnote4app://note/")
            ) {
              let targetNoteId = comment.text.match(/marginnote4app:\/\/note\/(.*)/)[1]
              if (!targetNoteId.includes("/summary/")) {  // 防止把概要的链接处理了
                let targetNote = MNNote.new(targetNoteId)
                if (!targetNote) {
                  this.removeCommentByIndex(i)
                }
              }
            }
          }
        }
        MNUtil.delay(0.2).then(()=>{
          MNUtil.studyView.becomeFirstResponder(); //For dismiss keyboard on iOS
        })
          
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
      onPopupMenuOnSelection: async function (sender) { // Clicking note
        if (typeof MNUtil === 'undefined') return
        let self = getMNToolbarClass()
        // showHUD("note")
        // let noteid = sender.userInfo.note.noteId
        // var pasteBoard = UIPasteboard.generalPasteboard()
        // pasteBoard.string = url
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        self.addonController.popupReplace()
        if (!toolbarConfig.dynamic) {
          return
        }
      },
      onPopupMenuOnNote: async function (sender) { // Clicking note
        if (typeof MNUtil === 'undefined') return
        let self = getMNToolbarClass()
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        // let noteid = sender.userInfo.note.noteId
        // var pasteBoard = UIPasteboard.generalPasteboard()
        // pasteBoard.string = url
        try {
        self.addonController.popupReplace()
          
        } catch (error) {
          
        }
        if (!toolbarConfig.dynamic) {
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
          self.testController.dynamicWindow = true
          self.testController.mainPath = mainPath;
          self.testController.dynamic = toolbarConfig.dynamic
          self.testController.view.hidden = true
          self.testController.addonController = self.addonController
          // self.testController.action = self.addonController.action
          // showHUD(self.testController.action)
          self.addonController.dynamicToolbar = self.testController
          MNUtil.studyView.addSubview(self.testController.view);
          lastFrame = self.addonController.view.frame
          let buttonNumber = toolbarConfig.getWindowState("dynamicButton")
          lastFrame.height = 45*buttonNumber+15
          // lastFrame.height = toolbarUtils.checkHeight(lastFrame.height,buttonNumber)
        }else{
          self.testController.refreshHeight()
          lastFrame = self.testController.view.frame
          // MNUtil.copyJSON(lastFrame)
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
          }else{
            let splitLine = MNUtil.splitLine
            // MNUtil.showHUD("splitline:"+splitLine)
            let studyFrame = MNUtil.studyView.bounds
            let currentFrame = self.addonController.currentFrame
            // showHUD(JSON.stringify(currentFrame))
            if (currentFrame.x+currentFrame.width*0.5 >= studyFrame.width) {
              currentFrame.x = studyFrame.width-currentFrame.width*0.5              
            }
            if (currentFrame.y >= studyFrame.height) {
              currentFrame.y = studyFrame.height-20              
            }
            currentFrame.height = toolbarUtils.checkHeight(currentFrame.height,self.addonController.maxButtonNumber)
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
        }
        if (self.testController) {
          if (self.testController.onAnimate || self.testController.onResize) {
          }else{
            let currentFrame = self.testController.currentFrame
            let buttonNumber = toolbarConfig.getWindowState("dynamicButton");
            currentFrame.height = toolbarUtils.checkHeight(currentFrame.height,buttonNumber)
            self.testController.view.frame = currentFrame
            self.testController.currentFrame = currentFrame
          }
        }
        if (self.settingController && !self.settingController.onAnimate) {
          let currentFrame = self.settingController.currentFrame
          // currentFrame.height = toolbarUtils.checkHeight(currentFrame.height)
          self.settingController.view.frame = currentFrame
          self.settingController.currentFrame = currentFrame
        }
      },

      queryAddonCommandStatus: function () {
        // MNUtil.showHUD("queryAddonCommandStatus")
        if (typeof MNUtil === 'undefined') return null
        if (MNUtil.studyMode < 3) {
          self.ensureView(false)
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
      onOpenToolbarSetting:function (params) {
        if (typeof MNUtil === 'undefined') return
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        self.openSetting()
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
      onTogglePreprocessMode:function (sender) {
        
        if (typeof MNUtil === 'undefined') return
        toolbarConfig.preprocessMode = !toolbarConfig.preprocessMode
        self.addonController.preprocessMode = toolbarConfig.preprocessMode
        if (toolbarConfig.preprocessMode) {
          MNUtil.showHUD("预处理模式 ✅")
        }else{
          self.testController.view.hidden = true
        }
        toolbarConfig.save("MNToolbar_preprocessMode")
        // NSUserDefaults.standardUserDefaults().setObjectForKey(toolbarConfig.dynamic,"MNToolbar_dynamic")
        self.testController.preprocessMode = toolbarConfig.preprocessMode
      },
      onToggleMindmapToolbar:function (sender) {
        if ("target" in sender.userInfo) {
          switch (sender.userInfo.target) {
            case "addonBar":
              if (!self.addonBar) {
                self.addonBar = MNUtil.studyView.subviews.find(subview=>{
                  let frame = subview.frame
                  if (!subview.hidden && frame.y > 100 && frame.width === 40 && (frame.x < 100 || frame.x > MNUtil.studyView.bounds.width-150)) {
                    if (self.addonController.view && subview === self.addonController.view) {
                      return false
                    }
                    return true
                  }
                  return false
                
                })
                // self.addonBar = MNUtil.studyView.subviews[37]
              }
              // MNUtil.copyJSON(self.addonBar.frame)
              if (self.isAddonBarRemoved) {
                MNUtil.studyView.addSubview(self.addonBar)
                self.isAddonBarRemoved = false
              }else{
                self.addonBar.removeFromSuperview()
                self.isAddonBarRemoved = true
              }
              break;
            case "mindmapToolbar":
              if (!self.view0) {
                self.isRemoved = false
                self.view0 = MNUtil.mindmapView.superview.subviews.at(-4)
                self.view1 = MNUtil.mindmapView.superview.subviews.at(-6)
                self.view2 = MNUtil.mindmapView.superview.subviews.at(-1)
                // MNUtil.copy(self.view2.frame.width)
              }
              if (!self.isRemoved) {
                self.isRemoved = true
                // if (self.view2.subviews.length === 9) {
                  self.view0.removeFromSuperview()
                  self.view1.removeFromSuperview()
                  self.view2.removeFromSuperview()
                // }
                // let frame = self.view0.frame
                // frame
              }else{
                self.isRemoved = false
                MNUtil.mindmapView.superview.addSubview(self.view1)
                MNUtil.mindmapView.superview.addSubview(self.view0)
                MNUtil.mindmapView.superview.addSubview(self.view2)
              }
              break;
            default:
              break;
          }


        }

      },
      onAddonBroadcast: function (sender) {
        if (typeof MNUtil === 'undefined') return
        if (self.window !== MNUtil.currentWindow) {
          return
        }
        let message = sender.userInfo.message
        if (/onCloudConfigChange/.test(message)) {
          MNUtil.showHUD(message)
          // toolbarConfig.readCloudConfig()
        }
      },

      onCloudConfigChange: function (sender) {
        //这个会闪退
        Application.sharedInstance().showHUD("message", self.window, 2)
        // if (typeof MNUtil === 'undefined') return
        // if (self.window !== MNUtil.currentWindow) {
        //   return
        // }
            // toolbarUtils.addErrorLog("error", "onCloudConfigChange")
        // let res =  getAllProperties(sender.userInfo)
        // MNUtil.copyJSON(res)
        // let shouldUpdate = toolbarConfig.readCloudConfig()
        // if (shouldUpdate) {
        //   try {
        //     // MNUtil.copy("update")
        //   let allActions = toolbarConfig.getAllActions()
        //   // MNUtil.copyJSON(allActions)
        //   // if (self.settingController) {
        //   //   self.settingController.setButtonText(allActions,self.settingController.selectedItem)
        //   // }
        //   // self.addonController.view.hidden = true
        //   self.addonController.setToolbarButton(allActions)
        //   } catch (error) {
        //     MNUtil.copy(error.toString())
        //     // toolbarUtils.addErrorLog(error, "onCloudConfigChange")
        //   }
        // }
        
        // MNUtil.openURL("marginnote4app://addon/onCloudConfigChange")
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
          MNUtil.animate(()=>{
            self.testController.view.layer.opacity = 0
          }).then(()=>{
            self.testController.view.layer.opacity = preOpacity
            self.testController.view.hidden = true
          })
          // UIView.animateWithDurationAnimationsCompletion(0.1,()=>{
          //   self.testController.view.layer.opacity = 0
          // },()=>{
          //   self.testController.view.layer.opacity = preOpacity
          //   self.testController.view.hidden = true
          // })
        }
        let textView = param.object
        toolbarUtils.textView = textView
        if (!toolbarConfig.showEditorOnNoteEdit) {
          return
        }
        let mindmapView = toolbarUtils.getMindmapview(textView)
        if (toolbarUtils.checkExtendView(textView)) {
          if (textView.text && textView.text.trim()) {
           //do nothing 
          }else{
            textView.text = "placeholder"
            textView.endEditing(true)
          }
          let focusNote = MNNote.getFocusNote()
          if (focusNote) {
            MNUtil.postNotification("openInEditor",{noteId:focusNote.noteId})
          }
          // MNUtil.showHUD("message")
          return
        }
        if (mindmapView) {
          let noteView = mindmapView.selViewLst[0].view
          // let focusNote = MNNote.getFocusNote()
          let focusNote = MNNote.new(mindmapView.selViewLst[0].note.note)
          let beginFrame = noteView.convertRectToView(noteView.bounds, MNUtil.studyView)
          if (!focusNote.noteTitle && !focusNote.excerptText && !focusNote.comments.length) {
            // MNUtil.copyJSON(param.object)
            param.object.text = "placeholder"
            // focusNote.noteTitle = "Title"
            // focusNote.excerptText = "Excerpt"
          }
          // MNUtil.beginTime = Date.now()
          // return
          if (focusNote) {
            let noteId = focusNote.noteId
            let studyFrame = MNUtil.studyView.bounds
            if (beginFrame.x+450 > studyFrame.width) {
              let endFrame = Frame.gen(studyFrame.width-450, beginFrame.y-10, 450, 500)
              if (beginFrame.y+490 > studyFrame.height) {
                endFrame.y = studyFrame.height-500
              }
              MNUtil.postNotification("openInEditor",{noteId:noteId,beginFrame:beginFrame,endFrame:endFrame})
            }else{
              let endFrame = Frame.gen(beginFrame.x, beginFrame.y-10, 450, 500)
              if (beginFrame.y+490 > studyFrame.height) {
                endFrame.y = studyFrame.height-500
              }
              MNUtil.postNotification("openInEditor",{noteId:noteId,beginFrame:beginFrame,endFrame:endFrame})
            }
          }
        }
        // MNUtil.showHUD(param.object.text)
        // MNUtil.copyJSON(params.userInfo)

} catch (error) {
  toolbarUtils.addErrorLog(error, "onTextDidBeginEditing")
}
      },
      onRefreshToolbarButton: function (sender) {
        try {
        self.addonController.setToolbarButton()
        if (self.settingController) {
          self.settingController.setButtonText()
        }
        } catch (error) {
          toolbarUtils.addErrorLog(error, "onRefreshToolbarButton")
        }
      },
      openSetting:function () {
        if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
        self.openSetting()
      },
      toggleToolbar:function () {
        if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
        self.init(mainPath)
        self.ensureView(true)
        if (toolbarConfig.isFirst) {
          let buttonFrame = self.addonBar.frame
          // self.addonController.moveButton.hidden = true
          if (buttonFrame.x === 0) {
            Frame.set(self.addonController.view,40,buttonFrame.y,40,290)
          }else{
            Frame.set(self.addonController.view,buttonFrame.x-40,buttonFrame.y,40,290)
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
      },
      togglePreprocessMode:function () {
        if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
        if (typeof MNUtil === 'undefined') return
        toolbarConfig.preprocessMode = !toolbarConfig.preprocessMode
        if (toolbarConfig.preprocessMode) {
          MNUtil.showHUD("预处理模式 ✅")
        }else{
          MNUtil.showHUD("预处理模式 ❌")
          if (self.testController) {
            self.testController.view.hidden = true
          }
          // self.testController.view.hidden = true
        }
        toolbarConfig.save("MNToolbar_preprocessMode")
        // NSUserDefaults.standardUserDefaults().setObjectForKey(toolbarConfig.dynamic,"MNToolbar_dynamic")
        if (self.testController) {
          self.testController.preprocessMode = toolbarConfig.preprocessMode
        }
        MNUtil.refreshAddonCommands()
      },
      toggleDynamic:function () {
        if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
        if (typeof MNUtil === 'undefined') return
        toolbarConfig.dynamic = !toolbarConfig.dynamic
        if (toolbarConfig.dynamic) {
          MNUtil.showHUD("Dynamic ✅")
        }else{
          MNUtil.showHUD("Dynamic ❌")
          if (self.testController) {
            self.testController.view.hidden = true
          }
          // self.testController.view.hidden = true
        }
        toolbarConfig.save("MNToolbar_dynamic")
        // NSUserDefaults.standardUserDefaults().setObjectForKey(toolbarConfig.dynamic,"MNToolbar_dynamic")
        if (self.testController) {
          self.testController.dynamic = toolbarConfig.dynamic
        }
        MNUtil.refreshAddonCommands()
      },
      openDocument:function (button) {
        if (typeof MNUtil === 'undefined') return
        MNUtil.postNotification("openInBrowser", {url:"https://mnaddon.craft.me/toolbar"})
      },
        // if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
      toggleAddon:function (button) {
      try {
        if (typeof MNUtil === 'undefined') return
        let self = getMNToolbarClass()
        if (!self.addonBar) {
          self.addonBar = button.superview.superview
          self.addonController.addonBar = self.addonBar
        }
        var commandTable = [
            {title:'⚙️   Setting',object:self,selector:'openSetting:',param:[1,2,3]},
            {title:'🛠️   Toolbar',object:self,selector:'toggleToolbar:',param:[1,3,2],checked:!self.addonController.view.hidden},
            {title:'🌟   Dynamic',object:self,selector:'toggleDynamic:',param:[1,3,2],checked:toolbarConfig.dynamic},
            {title:'🌟   预处理模式',object:self,selector:'togglePreprocessMode:',param:[1,3,2],checked:toolbarConfig.preprocessMode},
            {title:'📄   Document',object:self,selector:'openDocument:',param:[1,3,2]},
            // {title:'🗃️   Open Sidebar',object:self,selector:'openSideBar:',param:[1,2,3]}
          ];
        if (self.addonBar.frame.x < 100) {
          self.popoverController = MNUtil.getPopoverAndPresent(button,commandTable,200,4)
        }else{
          self.popoverController = MNUtil.getPopoverAndPresent(button,commandTable,200,0)
        }
      } catch (error) {
        toolbarUtils.addErrorLog(error, "toggleAddon")
      }
        return
        
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
        // toolbarUtils.addErrorLog("error", "applicationWillEnterForeground")
      },

      applicationDidEnterBackground: function () {
      },

      applicationDidReceiveLocalNotification: function (notify) {
      }
    }
  );
  MNToolbarClass.prototype.init = function(mainPath){ 
  try {

    if (!this.initialized) {
      toolbarUtils.init()
      toolbarConfig.init(mainPath)
      this.initialized = true
    }
  } catch (error) {
    toolbarUtils.addErrorLog(error, "init")
  }
  }
  MNToolbarClass.prototype.ensureView = function (refresh = true) {
  try {
    if (!this.addonController) {
      this.addonController = toolbarController.new();
      this.addonController.view.hidden = true;
      MNUtil.studyView.addSubview(this.addonController.view);
    }
    if (!MNUtil.isDescendantOfStudyView(this.addonController.view)) {
      MNUtil.studyView.addSubview(this.addonController.view)
      this.addonController.view.hidden = true
      if (refresh) {
        MNUtil.refreshAddonCommands()
      }
    }
    if (this.lastFrame) {
      this.addonController.view.frame = this.lastFrame
      this.addonController.currentFrame = this.lastFrame
    }else{
      Frame.set(this.addonController.view,10,10,40,200)
      this.addonController.currentFrame = this.addonController.view.frame
    }
    if (toolbarConfig.windowState.frame) {
      this.addonController.view.frame = toolbarConfig.windowState.frame;
      this.addonController.currentFrame = toolbarConfig.windowState.frame;
      // this.addonController.view.hidden = !toolbarConfig.windowState.open;
      this.addonController.view.hidden = !toolbarConfig.getWindowState("open");
      toolbarConfig.isFirst = false
    }else{
      toolbarConfig.windowState={}
    }
      } catch (error) {
      toolbarUtils.showHUD(error,5)
  }
  }
  /**
   * 
   * @this {MNToolbarClass} 
   */
  MNToolbarClass.prototype.openSetting = function () {
    try {
    if (!this.settingController) {
      this.settingController = settingController.new();
      this.settingController.toolbarController = this.addonController
      this.settingController.mainPath = toolbarConfig.mainPath;
      this.settingController.action = toolbarConfig.action
      // this.settingController.dynamicToolbar = this.dynamicToolbar
      MNUtil.studyView.addSubview(this.settingController.view)
      // toolbarUtils.studyController().view.addSubview(this.settingController.view)
    }
    this.settingController.show()
    } catch (error) {
      toolbarUtils.addErrorLog(error, "openSetting")
    }
}
  return MNToolbarClass;
};