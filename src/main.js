
JSB.newAddon = function (mainPath) {
  JSB.require('webviewController');
  var temSender;
  /** @return {MNToolbarClass} */
  const getMNToolbarClass = ()=>self  
  var MNToolbarClass = JSB.defineClass(
    'MNToolbar : JSExtension',
    { /* Instance members */
      sceneWillConnect: function () { //Window initialize
        let self = getMNToolbarClass()
        self.appInstance = Application.sharedInstance();
        self.addonController = toolbarController.new();
        self.addonController.mainPath = mainPath;
        self.isNewWindow = false;
        self.watchMode = false;
        self.textSelected = ""
        self.textProcessed = false;
        self.dateGetText = Date.now();
        self.dateNow = Date.now();
        self.rect = '{{0, 0}, {10, 10}}';
        self.arrow = 1;
        self.isFirst = true
        self.dynamic = getLocalDataByKey("MNToolbar_dynamic")
        self.windowState = getLocalDataByKey("MNToolbar_windowState")
        // removeDataByKey("MNToolbar_actionConfig")
        // showHUD("dynamic:"+self.dynamic)
        // Application.sharedInstance().showHUD(self.addonController.appearOnNewExcerpt,self.window,2)

        // NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'trst:', 'onReciveTrst');
        // NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onClosePopupMenuOnSelection:', 'ClosePopupMenuOnSelection');
          NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onPopupMenuOnNote:', 'PopupMenuOnNote');
          NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onToggleDynamic:', 'toggleDynamic');

          NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onClosePopupMenuOnNote:', 'ClosePopupMenuOnNote');
      },

      sceneDidDisconnect: function () { // Window disconnect
        NSNotificationCenter.defaultCenter().removeObserverName(self, 'PopupMenuOnNote');
        NSNotificationCenter.defaultCenter().removeObserverName(self, 'toggleDynamic');
        NSNotificationCenter.defaultCenter().removeObserverName(self, 'ClosePopupMenuOnNote');
        showHUD("remove")
      },

      sceneWillResignActive: function () { // Window resign active
      },

      sceneDidBecomeActive: function () { // Window become active
      },

      notebookWillOpen: function (notebookid) {
        if (studyController().studyMode < 3) {
          studyController().refreshAddonCommands();
          studyController().view.addSubview(self.addonController.view);
          self.addonController.view.hidden = true;
          self.addonController.dynamic = self.dynamic
          self.addonController.notebookid = notebookid
          self.notebookid = notebookid
          if (self.lastFrame) {
            self.addonController.view.frame = self.lastFrame
            self.addonController.currentFrame = self.lastFrame
          }else{
            self.addonController.view.frame = genFrame(10,10,40,200)
            self.addonController.currentFrame = genFrame(10,10,40,200)
          }
          if (self.windowState) {
            // showHUD(JSON.stringify(self.windowState.frame))
            self.addonController.view.frame = self.windowState.frame;
            self.addonController.currentFrame = self.windowState.frame;
            self.addonController.view.hidden = !self.windowState.open;
            self.isFirst = false
          }else{
            self.windowState={}
          }

          // NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onProcessNewExcerpt:', 'ProcessNewExcerpt');
          }
          NSTimer.scheduledTimerWithTimeInterval(0.2, false, function () {
            studyController().becomeFirstResponder(); //For dismiss keyboard on iOS
          });
          
      },

      notebookWillClose: function (notebookid) {
        self.lastFrame = self.addonController.view.frame
        if (self.testController) {
          self.testController.view.hidden = true
        }
        if (self.addonController.settingController) {
          self.addonController.settingController.hide()
        }
        self.windowState.open = !self.addonController.view.hidden
        self.windowState.frame = self.addonController.view.frame
        setLocalDataByKey(self.windowState, "MNToolbar_windowState")
      },
      onPopupMenuOnNote: function (sender) { // Clicking note
        let self = getMNToolbarClass()
        // showHUD("note")
        // let noteid = sender.userInfo.note.noteId
        // var pasteBoard = UIPasteboard.generalPasteboard()
        // pasteBoard.string = url

        if (!self.appInstance.checkNotifySenderInWindow(sender, self.window) || !self.dynamic) return; // Don't process message from other window
        self.onPopupMenuOnNoteTime = Date.now()
        self.noteid = sender.userInfo.note.noteId
        self.notShow = false
        let rectArr = sender.userInfo.winRect.replace(/{/g, '').replace(/}/g, '').replace(/\s/g, '').split(',')
        let X = Number(rectArr[0])
        let Y = Number(rectArr[1])
        let H = Number(rectArr[3])
        let W = Number(rectArr[2])
        let docMapSplitMode = Application.sharedInstance().studyController(self.window).docMapSplitMode
        // let x = Application.sharedInstance().studyController(self.window).view.frame.x
        // showHUD('x'+x)
        // let focusNoteView =self.appInstance.studyController(self.window).notebookController.mindmapView.selViewLst[0].view.superview.subviews[2]
        // showHUD("length:"+focusNoteView.length)
        // focusNoteView.hidden = true
        // let frame = focusNoteView.frame
        // // frame.width = 200
        // frame.height = frame.height+50
        // focusNoteView.frame = frame
        // refreshAfterDBChanged(self.notebookid)
        // showHUD(JSON.stringify(focusNoteView.frame))
        if (H <=11 && W <=11 && docMapSplitMode!==0) {
          self.testController.view.hidden = true
          return
        }
        let studyFrame = studyController().view.frame
        let studyFrameX = studyFrame.x
        let studyHeight = studyFrame.height
        let lastFrame 
        try {
          
        if (!self.testController) {
          self.testController = toolbarController.new();
          self.testController.mainPath = mainPath;
          self.testController.dynamic = self.dynamic
          self.testController.view.hidden = true
          self.testController.dynamicWindow = true
          self.testController.addonController = self.addonController
          // self.testController.action = self.addonController.action
          // showHUD(self.testController.action)
          self.addonController.dynamicToolbar = self.testController
          studyController().view.addSubview(self.testController.view);
          lastFrame = self.addonController.view.frame
        }else{
          self.testController.refreshHeight()
          lastFrame = self.testController.view.frame
        }
        } catch (error) {
          showHUD(error)
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
        let delay = testController.view.hidden?0.5:0
        NSTimer.scheduledTimerWithTimeInterval(delay, false, function () {
        if (self.notShow) {
          return
        }
        if (testController.view.hidden) {
          let preOpacity = testController.view.layer.opacity
          testController.view.frame = lastFrame
          testController.currentFrame = lastFrame
          testController.view.layer.opacity = 0
          testController.view.hidden = false
          UIView.animateWithDurationAnimationsCompletion(0.2,()=>{
            testController.view.layer.opacity = preOpacity
          },()=>{
            let preFrame = testController.view.frame
            let yBottom = preFrame.height    
            for (let index = 0; index < testController.buttonNumber; index++) {
              testController["ColorButton"+index].hidden = (testController["ColorButton"+index].frame.y+40 > yBottom)
            }
          })
        }else{
        // showHUD("frame:"+JSON.stringify(lastFrame))
          UIView.animateWithDurationAnimations(0.2,()=>{
            testController.view.frame = lastFrame
            testController.currentFrame = lastFrame
            testController.view.hidden = false
          })
        }
      })
      },
      onClosePopupMenuOnNote: function (sender) {
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
      documentDidOpen: function (docmd5) {
      },

      documentWillClose: function (docmd5) {
      },

      controllerWillLayoutSubviews: function (controller) {
        if (controller !== self.appInstance.studyController(self.window)) {
          return;
        };
        if (!self.addonController.view.hidden) {
          if (self.addonController.onAnimate) {
            // showHUD("reject")
            return
          }
          let splitLine = getSplitLine()
          let studyFrame = Application.sharedInstance().studyController(this.window).view.bounds
          let currentFrame = self.addonController.currentFrame
          // showHUD(JSON.stringify(currentFrame))
          if (currentFrame.x+currentFrame.width*0.5 >= studyFrame.width) {
            currentFrame.x = studyFrame.width-currentFrame.width*0.5              
          }
          if (currentFrame.y >= studyFrame.height) {
            currentFrame.y = studyFrame.height-20              
          }
          currentFrame.height = checkHeight(currentFrame.height)
          if (self.addonController.splitMode) {
            // Application.sharedInstance().showHUD("useDefault",self.window,2)
            currentFrame.x = splitLine-20
          }

          currentFrame.width = 40
          self.addonController.view.frame = currentFrame
          self.addonController.currentFrame = currentFrame
        }
        if (self.testController) {
          let currentFrame = self.testController.currentFrame
          currentFrame.height = checkHeight(currentFrame.height)
          self.testController.view.frame = currentFrame
          self.testController.currentFrame = currentFrame
        }
      },

      queryAddonCommandStatus: function () {
        if (self.appInstance.studyController(self.window).studyMode < 3) {
          return {
            image: 'logo.png',
            object: self,
            selector: 'toggleAddon:',
            checked: false
          };
        } else {
          return null;
        }
      },
      onToggleDynamic:function (sender) {
        self.dynamic = !self.dynamic
        self.addonController.dynamic = self.dynamic
        if (self.dynamic) {
          showHUD("Dynamic ✅")
        }else{
          self.testController.view.hidden = true
        }
        NSUserDefaults.standardUserDefaults().setObjectForKey(self.dynamic,"MNToolbar_dynamic")
        self.testController.dynamic = self.dynamic
      },
      toggleAddon:function (sender) {
        if (!self.addonBar) {
          self.addonBar = sender.superview.superview
          self.addonController.addonBar = self.addonBar
        }
        if (self.isFirst) {
          // Application.sharedInstance().showHUD("first",self.window,2)
          let buttonFrame = self.addonBar.frame
          // self.addonController.moveButton.hidden = true
          if (buttonFrame.x === 0) {
            self.addonController.view.frame = {x:40,y:buttonFrame.y,width:40,height:290}
          }else{
            self.addonController.view.frame = {x:buttonFrame.x-40,y:buttonFrame.y,width:40,height:290}
          }
          self.addonController.currentFrame = self.addonController.view.frame
          self.isFirst = false;
        }
        if (self.addonController.view.hidden) {
          self.windowState.open = true
          self.windowState.frame = self.addonController.view.frame
          // showHUD(JSON.stringify(self.addonBar.frame))
          self.addonController.show(self.addonBar.frame)
          setLocalDataByKey(self.windowState, "MNToolbar_windowState")
        }else{
          self.windowState.open = false
          self.windowState.frame = self.addonController.view.frame
          self.addonController.hide(self.addonBar.frame)
          setLocalDataByKey(self.windowState, "MNToolbar_windowState")
        }
      // self.addonController.view.hidden = !self.addonController.view.hidden
      }
    },
    { /* Class members */
      addonDidConnect: function () {
      },

      addonWillDisconnect: function () {
        removeDataByKey("MNToolbar_dynamic")
        removeDataByKey("MNToolbar_windowState")
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