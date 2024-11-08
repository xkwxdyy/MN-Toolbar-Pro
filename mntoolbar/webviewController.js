// JSB.require('utils')
// JSB.require('settingController');
/** @return {toolbarController} */
const getToolbarController = ()=>self

var toolbarController = JSB.defineClass('toolbarController : UIViewController <UIImagePickerControllerDelegate,UINavigationControllerDelegate>', {
  viewDidLoad: function() {
  try {
    
    let self = getToolbarController()
    self.custom = false;
    self.customMode = "None"
    self.miniMode = false;
    self.isLoading = false;
    self.lastFrame = self.view.frame;
    self.currentFrame = self.view.frame
    self.maxButtonNumber = 20
    self.buttonNumber = 22
      // MNUtil.copy("refreshHeight: "+self.buttonNumber)
    if (self.dynamicWindow) {
      // self.maxButtonNumber = 9
      self.buttonNumber = toolbarConfig.getWindowState("dynamicButton");
      // MNUtil.copy("refreshHeight: "+self.buttonNumber)
    }else{
      let lastFrame = toolbarConfig.getWindowState("frame")
      if (lastFrame) {
        // MNUtil.copyJSON(lastFrame)
        self.buttonNumber = Math.floor(lastFrame.height/45)
  // MNUtil.copy("refreshHeight: "+Math.floor(lastFrame.height/45))
  // MNUtil.copy("refreshHeight: "+self.buttonNumber)
      }
    }

    // self.buttonNumber = 9
    self.mode = 0
    self.sideMode = toolbarConfig.getWindowState("sideMode")
    self.splitMode = toolbarConfig.getWindowState("splitMode")
    self.moveDate = Date.now()
    self.settingMode = false
    self.view.layer.shadowOffset = {width: 0, height: 0};
    self.view.layer.shadowRadius = 15;
    self.view.layer.shadowOpacity = 0.5;
    self.view.layer.shadowColor = MNUtil.hexColorAlpha(toolbarConfig.buttonConfig.color, toolbarConfig.buttonConfig.alpha)
    self.view.layer.opacity = 1.0
    self.view.layer.cornerRadius = 5
    self.view.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0)
    self.view.mntoolbar = true
    if (toolbarConfig.action.length == 27) {
      toolbarConfig.action = toolbarConfig.action.concat(["custom1","custom2","custom3","custom4","custom5","custom6","custom7","custom8","custom9"])
    }
    self.setToolbarButton(toolbarConfig.action)
  // MNUtil.copy("refreshHeight: "+self.buttonNumber)

    // >>> max button >>>
    self.maxButton = UIButton.buttonWithType(0);
    // self.setButtonLayout(self.maxButton,"maxButtonTapped:")
    self.maxButton.setTitleForState('➕', 0);
    self.maxButton.titleLabel.font = UIFont.systemFontOfSize(10);
    // <<< max button <<<


    // <<< search button <<<
    // >>> move button >>>
    // self.moveButton = UIButton.buttonWithType(0);
    // self.setButtonLayout(self.moveButton)
    // <<< move button <<<
    // self.imageModeButton.setTitleForState('🔍', 0);
    // self.tabButton      = UIButton.buttonWithType(0);
        // >>> screen button >>>
    self.screenButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.screenButton,"changeScreen:")
    self.screenButton.layer.cornerRadius = 7;

    // let command = self.keyCommandWithInputModifierFlagsAction('d',1 << 0,'test:')
    // let command = UIKeyCommand.keyCommandWithInputModifierFlagsAction('d',1 << 0,'test:')
    // <<< screen button <<<
    self.moveGesture = new UIPanGestureRecognizer(self,"onMoveGesture:")
    self.view.addGestureRecognizer(self.moveGesture)
    self.moveGesture.view.hidden = false
    // self.moveGesture.addTargetAction(self,"onMoveGesture:")
    // self.moveButton.addGestureRecognizer(self.moveGesture)
    // self.imageModeButton.addGestureRecognizer(self.moveGesture)
    // self.bothModeButton.addGestureRecognizer(self.moveGesture)

    self.resizeGesture = new UIPanGestureRecognizer(self,"onResizeGesture:")
    self.screenButton.addGestureRecognizer(self.resizeGesture)
    self.resizeGesture.view.hidden = false
    // self.resizeGesture.addTargetAction(self,"onResizeGesture:")
  } catch (error) {
    toolbarUtils.addErrorLog(error, "viewDidLoad")
  }
  },
  viewWillAppear: function(animated) {
  },
  viewWillDisappear: function(animated) {
  },
// onPencilDoubleTap(){
//   MNUtil.showHUD("message")
// },
// onPencilDoubleTapPerform(perform){
//   MNUtil.showHUD("message")
// },
viewWillLayoutSubviews: function() {
  if (self.onAnimate) {
    return
  }
    var viewFrame = self.view.bounds;
    var xLeft     = viewFrame.x
    var xRight    = xLeft + 40
    var yTop      = viewFrame.y
    var yBottom   = yTop + viewFrame.height
    // self.moveButton.frame = {x: 0 ,y: 0,width: 40,height: 15};
    self.screenButton.frame = {x: 0 ,y: yBottom-15,width: 40,height: 15};

    let initX = 0
    let initY = 0
    for (let index = 0; index < self.maxButtonNumber; index++) {
      initX = 0
      self["ColorButton"+index].frame = {  x: xLeft+initX,  y: initY,  width: 40,  height: 40,};
      initY = initY+45
      self["ColorButton"+index].hidden = (initY > (yBottom+5))
    }

  },
  scrollViewDidScroll: function() {
  },
  changeOpacity: function(sender) {
    self.checkPopoverController()
    // if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    var menuController = MenuController.new();
    menuController.commandTable = [
      {title:'100%',object:self,selector:'changeOpacityTo:',param:1.0},
      {title:'90%',object:self,selector:'changeOpacityTo:',param:0.9},
      {title:'80%',object:self,selector:'changeOpacityTo:',param:0.8},
      {title:'70%',object:self,selector:'changeOpacityTo:',param:0.7},
      {title:'60%',object:self,selector:'changeOpacityTo:',param:0.6},
      {title:'50%',object:self,selector:'changeOpacityTo:',param:0.5}
    ];
    menuController.rowHeight = 35;
    menuController.preferredContentSize = {
      width: 100,
      height: menuController.rowHeight * menuController.commandTable.length
    };
    var studyView = MNUtil.studyView
    self.popoverController = new UIPopoverController(menuController);
    var r = sender.convertRectToView(sender.bounds,studyView);
    self.popoverController.presentPopoverFromRect(r, studyView, 1 << 1, true);
  },
  changeOpacityTo:function (opacity) {
    self.view.layer.opacity = opacity
    // self.webAppButton.setTitleForState(`${opacity*100}%`, 0);
  },
  changeScreen: function(sender) {
    let clickDate = Date.now()
    // if (self.dynamicWindow) {
    //   return
    // }
    self.checkPopoverController()
    // if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    var commandTable = [
      {title:'🌟 Dynamic',object:self,selector:'toggleDynamic:',param:1.0,checked:toolbarConfig.dynamic},
      {title:'🌟 预处理模式',object:self,selector:'togglePreprocessMode:',param:1.0,checked:toolbarConfig.preprocessMode},
      {title:'⚙️ Setting',object:self,selector:'setting:',param:1.0}
    ];
    self.popoverController = MNUtil.getPopoverAndPresent(sender, commandTable,200)
  },
  toggleDynamic: function () {
try {
  

    // MNUtil.showHUD("message")
    self.onClick = true
    self.checkPopoverController()
    // if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    // MNUtil.postNotification('toggleDynamic', {test:123})
    if (typeof MNUtil === 'undefined') return
    toolbarConfig.dynamic = !toolbarConfig.dynamic
    if (toolbarConfig.dynamic) {
      MNUtil.showHUD("Dynamic ✅")
    }else{
      MNUtil.showHUD("Dynamic ❌")
      if (self.dynamicToolbar) {
        self.dynamicToolbar.view.hidden = true
      }
      // self.testController.view.hidden = true
    }
    toolbarConfig.save("MNToolbar_dynamic")
    // NSUserDefaults.standardUserDefaults().setObjectForKey(toolbarConfig.dynamic,"MNToolbar_dynamic")
    if (self.dynamicToolbar) {
      self.dynamicToolbar.dynamic = toolbarConfig.dynamic
    }
    MNUtil.refreshAddonCommands()
} catch (error) {
  MNUtil.showHUD(error)
}
  },
  // 卡片预处理模式
  togglePreprocessMode: function () {
    try {
        self.onClick = true
        self.checkPopoverController()
        if (typeof MNUtil === 'undefined') return
        toolbarConfig.preprocessMode = !toolbarConfig.preprocessMode
        if (toolbarConfig.preprocessMode) {
          MNUtil.showHUD("预处理模式 ✅")
        }else{
          MNUtil.showHUD("预处理模式 ❌")
          if (self.preprocessMode) {
            self.preprocessMode.view.hidden = true
          }
        }
        toolbarConfig.save("MNToolbar_preprocessMode")
        MNUtil.refreshAddonCommands()
    } catch (error) {
      MNUtil.showHUD(error)
    }
  },
  /**
   * 
   * @param {UIButton} button 
   */
  setColor: function (button) {
    let color = button.color
    MNUtil.delay(0.1).then(()=>{
      toolbarUtils.setColor(color)
    })
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }

    self.hideAfterDelay()
  },
  execute: async function (button) {
    let code = toolbarConfig.getExecuteCode()
    toolbarSandbox.execute(code)
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  /**
   * @param {UIButton} button 
   * @returns 
   */
  customAction: async function (button) {
    let self = getToolbarController()
    // eval("MNUtil.showHUD('123')")
    // return
    let actionName = button.target ?? toolbarConfig.action[button.index]//这个是key
    let des = toolbarConfig.getDescriptionByName(actionName)
    if ("doubleClick" in des) {
      button.delay = true //让菜单延迟关闭,保证双击可以被执行
      self.onClick = true
      if (button.menu) {
        button.menu.stopHide = true
      }
      if (button.doubleClick) {
        button.doubleClick = false
        let doubleClick = des.doubleClick
        if (!("action" in doubleClick)) {
          doubleClick.action = des.action
        }
        self.customActionByDes(button, doubleClick)
        return
      }
    }
    self.customActionByDes(button,des)
  },
  customActionByMenu: async function (param) {
    let des = param.des
    if (typeof des === "string" || !("action" in des)) {
      return
    }
    let button = param.button
    if (des.action === "menu") {
      self.onClick = true
      self.checkPopoverController()
      if (("autoClose" in des) && des.autoClose) {
        self.hideAfterDelay(0.1)
      }
      let menuItems = des.menuItems
      let width = des.menuWidth??200
      if (menuItems.length) {
        var commandTable = menuItems.map(item=>{
          let title = (typeof item === "string")?item:(item.menuTitle ?? item.action)
          return {title:title,object:self,selector:'customActionByMenu:',param:{des:item,button:button}}
        })
        commandTable.unshift({title:toolbarUtils.emojiNumber(self.commandTables.length)+" 🔙",object:self,selector:'lastPopover:',param:button})
        self.commandTables.push(commandTable)
        self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
      }
      return
    }
    if (!("autoClose" in des) || des.autoClose) {
      self.checkPopoverController()
      self.hideAfterDelay(0.1)
    }else{
      self.checkPopoverController()
    }
    // MNUtil.copyJSON(des)
    // return
    self.commandTables = []
    self.customActionByDes(button,des)
  },
lastPopover: function (button) {
      self.checkPopoverController()
      self.commandTables.pop()
      let commandTable = self.commandTables.at(-1)
      self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,200,4)
},
  imagePickerControllerDidFinishPickingMediaWithInfo:async function (UIImagePickerController,info) {
    try {
      
    let image = info.UIImagePickerControllerOriginalImage
    // MNUtil.copy(image.pngData().base64Encoding())
    // MNUtil.copyJSON(info)
    MNUtil.studyController.dismissViewControllerAnimatedCompletion(true,undefined)
    if (self.compression) {
      MNUtil.copyImage(image.jpegData(0.0))
    }else{
      MNUtil.copyImage(image.pngData())
    }
    await MNUtil.delay(0.1)
    MNNote.new(self.currentNoteId).paste()
    // MNNote.getFocusNote().paste()
    } catch (error) {
      MNUtil.showHUD(error)
    }
  },
  imagePickerControllerDidCancel:function (params) {
    // MNUtil.copy("text")
    MNUtil.studyController.dismissViewControllerAnimatedCompletion(true,undefined)
    
  },
  copy:function (button) {
    let self = getToolbarController()
    self.onClick = true
    let des = toolbarConfig.getDescriptionByName("copy")
    if (button.doubleClick) {
      // self.onClick = true
      button.doubleClick = false
      if (button.menu) {
        button.menu.stopHide = true
      }
      if ("doubleClick" in des) {
        let doubleClick = des.doubleClick
        doubleClick.action = "copy"
        self.customActionByDes(button, doubleClick, false)
        return
      }
      let focusNote = MNNote.getFocusNote()
      if (focusNote) {
        let text = focusNote.noteTitle
        if (text) {
          MNUtil.copy(text)
          MNUtil.showHUD('标题已复制')
        }else{
          MNUtil.showHUD('无标题')
        }
        button.doubleClick = false
      }else{
        MNUtil.showHUD('无选中卡片')
      }
      self.onClick = false
      if (button.menu) {
        button.menu.dismissAnimated(true)
      }
      self.hideAfterDelay()
      return
    }
    if (des && Object.keys(des).length) {
      des.action = "copy"
      button.delay = true
      self.customActionByDes(button, des, false)
      if (self.dynamicWindow) {
        self.hideAfterDelay()
      }
      return
    }
    toolbarUtils.smartCopy()
    self.hideAfterDelay()
    toolbarUtils.dismissPopupMenu(button.menu,self.onClick)
  },
  copyAsMarkdownLink(button) {
    self.onClick = true
try {
  

    const nodes = MNNote.getFocusNotes()

    let text = ""
    if (button.doubleClick) {
      button.doubleClick = false
      for (const note of nodes) {
        text = text+note.noteURL+'\n'
      }
      MNUtil.showHUD("链接已复制")

    }else{
      for (const note of nodes) {
        let noteTitle = note.noteTitle??"noTitle"
        text = text+'['+noteTitle+']('+note.noteURL+')'+'\n'
      }
      MNUtil.showHUD("Markdown链接已复制")
    }
    MNUtil.copy(text.trim())
} catch (error) {
  MNUtil.showHUD(error)
}
  if (button.menu) {
    button.menu.dismissAnimated(true)
    return
  }
    self.hideAfterDelay()
  },

  searchInEudic:function (button) {
  try {
    self.onClick = true
    let textSelected = MNUtil.selectionText
    if (!textSelected) {
      let focusNote = MNNote.getFocusNote()
      if (focusNote) {
        if (focusNote.excerptText) {
          textSelected = focusNote.excerptText
        }else if (focusNote.noteTitle) {
          textSelected = focusNote.noteTitle
        }else{
          let firstComment = focusNote.comments.filter(comment=>comment.type === "TextNote")[0]
          if (firstComment) {
            textSelected = firstComment.text
          }
        }
      }
    }
    if (textSelected) {
      let textEncoded = encodeURIComponent(textSelected)
      let url = "eudic://dict/"+textEncoded
      // let des = toolbarConfig.getDescriptionByName("searchInEudic")
      // if (des && des.source) {
      //   // MNUtil.copyJSON(des)
      //   switch (des.source) {
      //     case "eudic":
      //       //donothing
      //       break;
      //     case "yddict":
      //       MNUtil.copy(textSelected)
      //       url = "yddict://"
      //       break;
      //     case "iciba":
      //       url = "iciba://word="+textEncoded
      //       break;
      //     case "sogodict":
      //       url = "bingdict://"+textEncoded
      //       break;
      //     case "bingdict":
      //       url = "sogodict://"+textEncoded
      //       break;
      //     default:
      //       MNUtil.showHUD("Invalid source")
      //       return
      //   }
      // }
      // showHUD(url)
      MNUtil.openURL(url)
    }else{
      MNUtil.showHUD('未找到有效文字')
    }
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
    
  } catch (error) {
    toolbarUtils.addErrorLog(error, "searchInEudic")
  }
  },
  switchTitleorExcerpt(button) {
    self.onClick = true
    let focusNotes = MNNote.getFocusNotes()
    for (const note of focusNotes) {
      let title = note.noteTitle ?? ""
      let text = note.excerptText ?? ""
      // 只允许存在一个
      MNUtil.undoGrouping(()=>{
        if ((title && text) && (title !== text)) {
          note.noteTitle = ""
          note.excerptText = title
          note.appendMarkdownComment(text)
        }else if (title || text) {
          // 去除划重点留下的 ****
          note.noteTitle = text.replace(/\*\*(.*?)\*\*/g, "$1")
          note.excerptText = title
        }else if (title == text) {
          // 如果摘录与标题相同，MN 只显示标题，此时我们必然想切换到摘录
          note.noteTitle = ""
        }
      })
    }
    // MNUtil.showHUD("标题转换完成")
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  bigbang: function (button) {
    self.onClick = true
    let focusNote = MNNote.getFocusNote()
    MNUtil.postNotification("bigbangNote",{noteid:focusNote.noteId})
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  snipaste: function (button) {
    self.onClick = true
    let focusNote = MNNote.getFocusNote()
    MNUtil.postNotification("snipasteNote",{noteid:focusNote.noteId})
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  chatglm: function (button) {
    let des = toolbarConfig.getDescriptionByName("chatglm")
    if (des) {
      des.action = "chatAI"
      self.customActionByDes(button, des,false)
    }else{
      MNUtil.postNotification("customChat",{})
    }
    // toolbarUtils.chatAI(des)
    if (button.menu && !self.onClick) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  search: function (button) {
    let self = getToolbarController()
    let des = toolbarConfig.getDescriptionByName("search")
    if (des) {
      des.action = "search"
      self.customActionByDes(button, des,false)
      return
    }else{
      // MNUtil.postNotification("customChat",{})
    }
    self.onClick = true
    let selectionText = MNUtil.selectionText
    let noteId = undefined
    let focusNote = MNNote.getFocusNote()
    if (focusNote) {
      noteId = focusNote.noteId
    }
    let studyFrame = MNUtil.studyView.bounds
    let beginFrame = self.view.frame
    if (button.menu) {
      beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
    }
    let endFrame
    beginFrame.y = beginFrame.y-10
    if (beginFrame.x+490 > studyFrame.width) {
      endFrame = MNUtil.genFrame(beginFrame.x-450, beginFrame.y-10, 450, 500)
      if (beginFrame.y+490 > studyFrame.height) {
        endFrame.y = studyFrame.height-500
      }
    }else{
      endFrame = MNUtil.genFrame(beginFrame.x+40, beginFrame.y-10, 450, 500)
      if (beginFrame.y+490 > studyFrame.height) {
        endFrame.y = studyFrame.height-500
      }
    }
    if (selectionText) {
      // MNUtil.showHUD("Text:"+selectionText)
      MNUtil.postNotification("searchInBrowser",{text:selectionText,beginFrame:beginFrame,endFrame:endFrame})
    }else{
      // MNUtil.showHUD("NoteId:"+noteId)
      MNUtil.postNotification("searchInBrowser",{noteid:noteId,beginFrame:beginFrame,endFrame:endFrame})
    }
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  sidebar: function (button) {
    MNUtil.toggleExtensionPanel()
    
    // MNUtil.showHUD("sidebar")
  },
  /**
   * 
   * @param {UIButton} button 
   * @returns 
   */
  edit: function (button) {
    let noteId = undefined
    if (self.dynamicWindow && toolbarUtils.currentNoteId) {
      noteId = toolbarUtils.currentNoteId
    }else{
      let focusNote = MNNote.getFocusNote()
      if (focusNote) {
        noteId = focusNote.noteId
      }
    }
    if (!noteId) {
      MNUtil.showHUD("No note")
      return
    }
    let studyFrame = MNUtil.studyView.bounds
    if (button.menu) {
      button.menu.dismissAnimated(true)
      let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
      let endFrame = MNUtil.genFrame(beginFrame.x-225, beginFrame.y-50, 450, 500)
      endFrame.y = toolbarUtils.constrain(endFrame.y, 0, studyFrame.height-500)
      endFrame.x = toolbarUtils.constrain(endFrame.x, 0, studyFrame.width-500)
      MNUtil.postNotification("openInEditor",{noteId:noteId,beginFrame:beginFrame,endFrame:endFrame})
      return
    }
    let beginFrame = self.view.frame
    beginFrame.y = beginFrame.y-10
    if (beginFrame.x+490 > studyFrame.width) {
      let endFrame = MNUtil.genFrame(beginFrame.x-450, beginFrame.y-10, 450, 500)
      if (beginFrame.y+490 > studyFrame.height) {
        endFrame.y = studyFrame.height-500
      }
      MNUtil.postNotification("openInEditor",{noteId:noteId,beginFrame:beginFrame,endFrame:endFrame})
    }else{
      let endFrame = MNUtil.genFrame(beginFrame.x+40, beginFrame.y-10, 450, 500)
      if (beginFrame.y+490 > studyFrame.height) {
        endFrame.y = studyFrame.height-500
      }
      MNUtil.postNotification("openInEditor",{noteId:noteId,beginFrame:beginFrame,endFrame:endFrame})
    }
    self.hideAfterDelay()
  },
  ocr: async function (button) {
    if (typeof ocrUtils === 'undefined') {
      MNUtil.showHUD("MN Toolbar: Please install 'MN OCR' first!")
      return
    }
    toolbarUtils.ocr()
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  setting: function (button) {
    MNUtil.postNotification("openToolbarSetting", {})
    // let self = getToolbarController()
    // self.checkPopoverController()
    // // if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    // try {
    // if (!self.settingController) {
    //   self.settingController = settingController.new();
    //   self.settingController.toolbarController = self
    //   self.settingController.mainPath = toolbarConfig.mainPath;
    //   self.settingController.action = toolbarConfig.action
    //   // self.settingController.dynamicToolbar = self.dynamicToolbar
    //   MNUtil.studyView.addSubview(self.settingController.view)
    //   // toolbarUtils.studyController().view.addSubview(self.settingController.view)
    // }
      
    // self.settingController.show()
    // } catch (error) {
    //   MNUtil.showHUD(error)
    // }
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  pasteAsTitle:function (button) {
    let self = getToolbarController()
    let des = toolbarConfig.getDescriptionByName("pasteAsTitle")
    if (des && "doubleClick" in des) {
      self.onClick = true
    }
    if (button.doubleClick) {
      // self.onClick = true
      button.doubleClick = false
      if (button.menu) {
        button.menu.stopHide = true
      }
      if ("doubleClick" in des) {
        let doubleClick = des.doubleClick
        doubleClick.action = "paste"
        self.customActionByDes(button, doubleClick, false)
      }
      return
    }
    if (des && des.target && Object.keys(des).length) {
      des.action = "paste"
      button.delay = true
      self.customActionByDes(button, des, false)
      if (self.dynamicWindow) {
        MNUtil.showHUD("hide")
        self.hideAfterDelay()
      }
      return
    }
    let focusNote = MNNote.getFocusNote()
    let text = MNUtil.clipboardText
    MNUtil.undoGrouping(()=>{
      focusNote.noteTitle = text
    })
    self.hideAfterDelay()
    toolbarUtils.dismissPopupMenu(button.menu,self.onClick)
  },
  clearFormat:function (button) {
    let self = getToolbarController()
    self.onClick = true
    let focusNotes = MNNote.getFocusNotes()
    MNUtil.undoGrouping(()=>{
      focusNotes.map(note=>{
        note.clearFormat()
      })
    })
    // let focusNote = MNNote.getFocusNote()
    // MNUtil.undoGrouping(()=>{
    //   focusNote.clearFormat()
    // })
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  doubleClick:function (button) {
    button.doubleClick = true
  },
  onMoveGesture:function (gesture) {
  try {
    

    let self = getToolbarController()
    // MNUtil.showHUD("move")
    self.onAnimate = false
    if (self.dynamicWindow) {
      // self.hideAfterDelay()
      self.hide()
      return
    }
    self.onClick = true

    let locationToMN = gesture.locationInView(MNUtil.studyView)
    if ( (Date.now() - self.moveDate) > 100) {
      let translation = gesture.translationInView(MNUtil.studyView)
      let locationToBrowser = gesture.locationInView(self.view)
      if (gesture.state === 1 ) {
        gesture.locationToBrowser = {x:locationToBrowser.x-translation.x,y:locationToBrowser.y-translation.y}
      }
    }
    self.moveDate = Date.now()
    let splitLine = MNUtil.splitLine
    let docMapSplitMode = MNUtil.studyController.docMapSplitMode
    let location = {x:locationToMN.x - gesture.locationToBrowser.x,y:locationToMN.y -gesture.locationToBrowser.y}
    let frame = self.view.frame
    var viewFrame = self.view.bounds;
    let studyFrame = MNUtil.studyView.bounds
    let y = location.y
    if (y<=0) {
      y = 0
    }
    if (y>=studyFrame.height-15) {
      y = studyFrame.height-15
    }
    let x = location.x
    self.sideMode = ""
    if (x<20) {
      x = 0
      self.sideMode = "left"
      self.splitMode = false
    }
    if (x>studyFrame.width-60) {
      x = studyFrame.width-40
      self.sideMode = "right"
      self.splitMode = false
    }
    if (splitLine && docMapSplitMode===1) {
      if (x<splitLine && x>splitLine-40) {
        x = splitLine-20
        self.splitMode = true
        self.sideMode = ""
      }else{
        self.splitMode = false
      }
    }else{
      self.splitMode = false
    }
    // MNUtil.showHUD(studyFrame.height+"message"+(y+self.lastFrame.height))
    frame.height = 45*self.buttonNumber+15
    if ((y+frame.height) > studyFrame.height) {
      frame.height = studyFrame.height - y
    }
    self.view.frame = {x:x,y:y,width:40,height:toolbarUtils.checkHeight(frame.height,self.maxButtonNumber)}
    self.currentFrame  = self.view.frame
    if (gesture.state === 3) {
      // self.resi
      MNUtil.studyView.bringSubviewToFront(self.view)
      toolbarConfig.windowState.open = true
      toolbarConfig.windowState.frame = self.view.frame
      toolbarConfig.windowState.splitMode = self.splitMode
      toolbarConfig.windowState.sideMode = self.sideMode
      toolbarConfig.save("MNToolbar_windowState")
      self.setToolbarLayout()
    }
    self.custom = false;
  } catch (error) {
    toolbarUtils.addErrorLog(error, "onMoveGesture")
  }
  },
  onResizeGesture:function (gesture) {
    self.onClick = true
    self.custom = false;
    self.onResize = true
    let baseframe = gesture.view.frame
    let locationInView = gesture.locationInView(gesture.view)
    let frame = self.view.frame
    let height = locationInView.y+baseframe.y+baseframe.height*0.5
    if (frame.y + height > MNUtil.studyView.bounds.height) {
      height = MNUtil.studyView.bounds.height - frame.y
    }
    height = toolbarUtils.checkHeight(height,self.maxButtonNumber)
    self.view.frame = {x:frame.x,y:frame.y,width:40,height:height}
    self.currentFrame  = self.view.frame
    if (gesture.state === 3) {
      let buttonNumber = Math.floor(height/45)
      //当用户拖拽距离过短时，不触发配置存储
      if (self.buttonNumber !== buttonNumber) {
        self.buttonNumber = buttonNumber
        self.view.bringSubviewToFront(self.screenButton)
        let windowState = toolbarConfig.windowState
        if (self.dynamicWindow) {
          windowState.dynamicButton = buttonNumber
          // toolbarConfig.save("MNToolbar_windowState",{open:toolbarConfig.windowState.open,frame:self.view.frame})
        }else{
          windowState.frame = self.view.frame
          windowState.open = true
        }
        toolbarConfig.save("MNToolbar_windowState",windowState)
      }
      self.onResize = false
    }
  },
});
toolbarController.prototype.setButtonLayout = function (button,targetAction) {
    button.autoresizingMask = (1 << 0 | 1 << 3);
    button.setTitleColorForState(UIColor.whiteColor(),0);
    button.setTitleColorForState(toolbarConfig.highlightColor, 1);
    button.backgroundColor = UIColor.colorWithHexString("#9bb2d6").colorWithAlphaComponent(0.8);
    button.layer.cornerRadius = 5;
    button.layer.masksToBounds = true;
    if (targetAction) {
      button.addTargetActionForControlEvents(this, targetAction, 1 << 6);
    }
    this.view.addSubview(button);
}

/**
 * 
 * @param {UIButton} button 
 * @param {*} targetAction 
 * @param {*} color 
 */
toolbarController.prototype.setColorButtonLayout = function (button,targetAction,color) {
    button.autoresizingMask = (1 << 0 | 1 << 3);
    button.setTitleColorForState(UIColor.blackColor(),0);
    button.setTitleColorForState(toolbarConfig.highlightColor, 1);
    button.backgroundColor = color
    button.layer.cornerRadius = 10;
    button.layer.masksToBounds = true;
    if (targetAction) {
      //1，3，4按下就触发，不用抬起
      //64按下再抬起
      let number = 64
      button.removeTargetActionForControlEvents(this, targetAction, number)
      button.addTargetActionForControlEvents(this, targetAction, number);
      button.addTargetActionForControlEvents(this, "doubleClick:", 1 << 1);
    }
    this.view.addSubview(button);
}

/**
 * @this {toolbarController}
 */
toolbarController.prototype.show = async function (frame) {
  let preFrame = this.view.frame
  preFrame.width = 40
  preFrame.height = toolbarUtils.checkHeight(preFrame.height,this.maxButtonNumber)
  if (preFrame.x < 0) {
    preFrame.x = 0
  }
  if ((preFrame.x+40) > MNUtil.studyView.frame.width) {
    preFrame.x = MNUtil.studyView.frame.width-40
  }
  this.onAnimate = true
  // preFrame.width = 40
  let yBottom = preFrame.y+preFrame.height
  let preOpacity = this.view.layer.opacity
  this.view.layer.opacity = 0.2
  if (frame) {
    frame.width = 40
    frame.height = toolbarUtils.checkHeight(frame.height,this.maxButtonNumber)
    this.view.frame = frame
    this.currentFrame = frame
  }
  this.view.hidden = false
  // this.moveButton.hidden = true
  this.screenButton.hidden = true
  // for (let index = 0; index < this.buttonNumber; index++) {
  //   this["ColorButton"+index].hidden = true
  // }
  this.setToolbarButton(toolbarConfig.action)

  // showHUD(JSON.stringify(preFrame))
  MNUtil.animate(()=>{
    this.view.layer.opacity = preOpacity
    this.view.frame = preFrame
    this.currentFrame = preFrame
  }).then(()=>{
    try {
      this.view.layer.borderWidth = 0
      // this.moveButton.hidden = false
      this.screenButton.hidden = false
      let number = preFrame.height/40
      if (number > 9) {
        number = 9
      }
      // showHUD("number:"+number)
      for (let index = 0; index < number-1; index++) {
        this["ColorButton"+index].hidden = false
      }
      this.onAnimate = false
      this.setToolbarLayout()
    } catch (error) {
      MNUtil.showHUD("Error in show: "+error)

    }
  })
  // UIView.animateWithDurationAnimationsCompletion(0.2,()=>{
  //   this.view.layer.opacity = preOpacity
  //   this.view.frame = preFrame
  //   this.currentFrame = preFrame
  // },
  // ()=>{
  // try {
    
  //   this.view.layer.borderWidth = 0
  //   this.moveButton.hidden = false
  //   this.screenButton.hidden = false
  //   let number = preFrame.height/40
  //   if (number > 9) {
  //     number = 9
  //   }
  //   // showHUD("number:"+number)
  //   for (let index = 0; index < number-1; index++) {
  //     this["ColorButton"+index].hidden = false
  //   }
  //   this.onAnimate = false
  //   this.setToolbarLayout()
  // } catch (error) {
  //   MNUtil.showHUD(error)
  // }
  // })
}
/**
 * @this {toolbarController}
 */
toolbarController.prototype.hide = function (frame) {
  let preFrame = this.currentFrame
  this.onAnimate = true
  this.view.frame = this.currentFrame
  // copy(JSON.stringify(preFrame))
  let preOpacity = 1.0
  // for (let index = 0; index < this.buttonNumber; index++) {
  //   this["ColorButton"+index].hidden = true
  // }
  // this.moveButton.hidden = true
  this.screenButton.hidden = true
  // return
  // showHUD("frame:"+JSON.stringify(this.currentFrame))
  UIView.animateWithDurationAnimationsCompletion(0.25,()=>{
    this.view.layer.opacity = 0.2
    if (frame) {
      this.view.frame = frame
      this.currentFrame = frame
    }
    // this.view.frame = {x:preFrame.x+preFrame.width*0.1,y:preFrame.y+preFrame.height*0.1,width:preFrame.width*0.8,height:preFrame.height*0.8}
    // this.currentFrame = {x:preFrame.x+preFrame.width*0.1,y:preFrame.y+preFrame.height*0.1,width:preFrame.width*0.8,height:preFrame.height*0.8}
  },
  ()=>{
    this.view.hidden = true;
    this.view.layer.opacity = preOpacity      
    this.view.frame = preFrame
    this.currentFrame = preFrame
    this.onAnimate = false
  })
}

/**
 * @this {toolbarController}
 * @param {number} delay
 * @param {UIButton|undefined} button
 */
toolbarController.prototype.hideAfterDelay = function (delay = 0.5,button = undefined) {
  if (this.view.hidden) {
    return
  }
  if (this.dynamicWindow) {
    MNUtil.delay(delay).then(()=>{
      if (button) {
        //prevent hide
      }else{
        this.hide()
      }
    })
  }
}

/**
 * @this {toolbarController}
 */
toolbarController.prototype.setToolbarButton = function (actionNames = toolbarConfig.action,newActions=undefined) {
try {
  let buttonColor = toolbarUtils.getButtonColor()
  this.view.layer.shadowColor = buttonColor
  
  let actions
  if (newActions) {
    toolbarConfig.actions = newActions
  }
  actions = toolbarConfig.actions
  let defaultActions = toolbarConfig.getActions()
  let defaultActionNames = toolbarConfig.getDefaultActionKeys()
  if (!actionNames) {
    actionNames = defaultActionNames
    toolbarConfig.action = actionNames
  }else{
    toolbarConfig.action = actionNames
  }
  // MNUtil.copyJSON(actionNames)
  // let activeActionNumbers = actionNames.length
  for (let index = 0; index < this.maxButtonNumber; index++) {
    let actionName = actionNames[index]
    if (this["ColorButton"+index]) {
    }else{
      this["ColorButton"+index] = UIButton.buttonWithType(0);
      this["moveGesture"+index] = new UIPanGestureRecognizer(this,"onMoveGesture:")
      this["ColorButton"+index].addGestureRecognizer(this["moveGesture"+index])
      this["moveGesture"+index].view.hidden = false
    }
    this["ColorButton"+index].index = index
    if (actionName) {
      if (actionName.includes("color")) {
        this["ColorButton"+index].color = parseInt(actionName.slice(5))
        this.setColorButtonLayout(this["ColorButton"+index],"setColor:",buttonColor)
      }else if(actionName.includes("custom")){
        this.setColorButtonLayout(this["ColorButton"+index],"customAction:",buttonColor)
      }else{
        this.setColorButtonLayout(this["ColorButton"+index],actionName+":",buttonColor)
      }
      this["ColorButton"+index].setImageForState(toolbarConfig.imageConfigs[actionName],0)
    }
  }
  if (this.dynamicToolbar) {
    this.dynamicToolbar.setToolbarButton(actionNames,newActions)
  }
  this.refreshHeight()
} catch (error) {
  MNUtil.showHUD("Error in setToolbarButton: "+error)
}
}
/**
 * 
 * @param {*} frame 
 * @this {toolbarController}
 */
toolbarController.prototype.refreshHeight = function () {
  try {
    

  let lastFrame = this.view.frame
  let currentHeight = lastFrame.height
  if (currentHeight > 420 && !toolbarUtils.isSubscribed(false)) {
    lastFrame.height = 420
    this.view.frame = lastFrame
    return
  }
  let height = 45*this.buttonNumber+15
  // MNUtil.copyJSON(lastFrame)
  if (lastFrame.y+lastFrame.height > MNUtil.studyView.frame.height) {

  // MNUtil.showHUD("message")
    let remainHeight = MNUtil.studyView.frame.height - lastFrame.y
    let remainButton = Math.floor(remainHeight/45)
    lastFrame.height = 45*(remainButton)+15
  }else{
    lastFrame.height = height
  }
  this.view.frame = lastFrame
  this.currentFrame = lastFrame
  // showHUD("number:"+height)
  } catch (error) {
    toolbarUtils.addErrorLog(error, "refreshHeight")
  }
}

toolbarController.prototype.setToolbarLayout = function () {
  if (this.onAnimate) {
    return
  }
    var viewFrame = this.view.bounds;
    var xLeft     = viewFrame.x
    var xRight    = xLeft + 40
    var yTop      = viewFrame.y
    var yBottom   = yTop + viewFrame.height
    // this.moveButton.frame = {x: 0 ,y: 0,width: 40,height: 15};
    this.screenButton.frame = {x: 0 ,y: yBottom-15,width: 40,height: 15};
    this.view.bringSubviewToFront(this.screenButton)

    let initX = 0
    let initY = 0
    for (let index = 0; index < this.buttonNumber; index++) {
      initX = 0
      this["ColorButton"+index].frame = {  x: xLeft+initX,  y: initY,  width: 40,  height: 40,};
      initY = initY+45
      this["ColorButton"+index].hidden = (initY > yBottom)
    }

}
toolbarController.prototype.checkPopoverController = function () {
  if (this.popoverController) {this.popoverController.dismissPopoverAnimated(true);}
}
toolbarController.prototype.customAction = async function (actionName) {//这里actionName指的是key
  try {
    if (!toolbarUtils.checkSubscribe(true)) {
      return
    }
    let des = JSON.parse(toolbarConfig.actions[actionName].description)
    let focusNote = MNNote.getFocusNote()? MNNote.getFocusNote():undefined
    let focusNotes = MNNote.getFocusNotes() ? MNNote.getFocusNotes():undefined
    // MNUtil.showHUD("message"+(focusNote instanceof MNNote))
    let color,config
    let targetNoteId
    let parentNote
    let focusNoteType
    let focusNoteColorIndex = focusNote? focusNote.note.colorIndex : 0
    switch (des.action) {
      /* 夏大鱼羊定制 - start */
      case "pasteAsChildNotesByIdArrFromClipboard":
        MNUtil.undoGrouping(()=>{
          try {
            // 先把 MNUtils.clipboardText 转成数组
            let idsArr = MNUtil.clipboardText.split(",")
            // 再把数组中的 ID 对应的卡片作为选中卡片的子卡片
            focusNote.pasteChildNotesByIdArr(idsArr)
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "convertNoteToNonexcerptVersion":
        MNUtil.showHUD("卡片转化为非摘录版本")
        try {
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(focusNote=>{
              if (focusNote.excerptText) {
                toolbarUtils.convertNoteToNonexcerptVersion(focusNote)
              }
            })
          })
        } catch (error) {
          MNUtil.showHUD(error)
        }
        break;
      case "ifExceptVersion":
        if (focusNote.excerptText) {
          MNUtil.showHUD("摘录版本")
        } else {
          MNUtil.showHUD("非摘录版本")
        }
        break;
      case "showColorIndex":
        MNUtil.showHUD("ColorIndex: " + focusNote.note.colorIndex)
        break;
      case "showCommentType":
        let focusNoteComments = focusNote.comments
        let chosenComment = focusNoteComments[des.index-1]
        MNUtil.showHUD("CommentType: " + chosenComment.type)
        break;
      case "convetHtmlToMarkdown":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.convetHtmlToMarkdown(focusNote)
          })
        } catch (error) {
          MNUtil.showHUD(error)
        }
        break;
      case "addThought":
        MNUtil.undoGrouping(()=>{
          try {
            toolbarUtils.addThought(focusNotes)
          } catch (error) {
            MNUtil.showHUD(error)
          }
        })
        break;
      case "clearContentKeepText":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.clearContentKeepText(focusNote)
          })
        } catch (error) {
          MNUtil.showHUD(error)
        }
        break;
      case "clearContentKeepExcerptAndImage":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.clearContentKeepExcerptAndImage(focusNote)
          })
        } catch (error) {
          MNUtil.showHUD(error)
        }
        break;
      case "addTopic":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.addTopic(focusNote)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "addTemplate":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.addTemplate(focusNote,focusNoteColorIndex)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "achieveCards":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.achieveCards(focusNote)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "renewCards":
        try {
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(focusNote=>{
              toolbarUtils.renewCards(focusNote)
            })
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "changeChildNotesPrefix":
        MNUtil.undoGrouping(()=>{
          try {
            toolbarUtils.changeChildNotesPrefix(focusNote)
            focusNote.descendantNodes.descendant.forEach(descendantNote => {
              if ([0, 1, 4].includes(descendantNote.note.colorIndex)) {
                try {
                  // MNUtil.undoGrouping(()=>{
                    toolbarUtils.changeChildNotesPrefix(descendantNote)
                  // })
                } catch (error) {
                  MNUtil.showHUD(error);
                }
              }
            })
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "moveUpLinkNotes":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.moveUpLinkNotes(focusNotes)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "renewProof":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.renewProof(focusNotes)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "hideAddonBar":
        MNUtil.postNotification("toggleMindmapToolbar", {target:"addonBar"})
        break;
      case "makeCards":
        try {
          // MNUtil.showHUD("制卡")
          MNUtil.undoGrouping(()=>{
            // focusNotes.forEach(focusNote=>{
            for (let i = 0; i < focusNotes.length; i++) {
              focusNote = focusNotes[i]
              /* 初始化 */
              let ifParentNoteChosen = false

              toolbarUtils.renewCards(focusNote)

              /* 先将卡变成非摘录版本 */
              // 如果是非摘录版本的就不处理，否则已有链接会失效（卡片里的失去箭头，被链接的失效，因为此时的卡片被合并了，id 不是原来的 id 了）
              if (focusNote.excerptText) {
                toolbarUtils.convertNoteToNonexcerptVersion(focusNote)
                // 注意此时 focusNote 变成非摘录版本后，下面的代码中 focusNote 就失焦了（因为被合并到其它卡片了）
                // 所以下面的代码不会执行，这就产生了一个效果：
                // 点击第一次：将摘录版本变成非摘录版本
                // 点击第二次：开始制卡
                // 误打误撞产生最佳效果了属于是
                break
              }

              /* 确定卡片类型 */
              switch (focusNoteColorIndex) {
                case 0: // 淡黄色
                  focusNoteType = "classification"
                  break;
                case 2: // 淡蓝色：定义类
                  focusNoteType = "definition"
                  break;
                case 3: // 淡粉色：反例
                  focusNoteType = "antiexample"
                  break;
                case 4: // 黄色：归类
                  focusNoteType = "classification"
                  break;
                case 6: // 蓝色：应用
                  focusNoteType = "application"
                  break;
                case 9: // 深绿色：思想方法
                  focusNoteType = "method"
                  break;
                case 10: // 深蓝色：定理命题
                  focusNoteType = "theorem"
                  break;
                case 13: // 淡灰色：问题
                  focusNoteType = "question"
                  break;
                case 15: // 淡紫色：例子
                  focusNoteType = "example"
                  break;
              }

              /* 预处理 */
              /* 只对淡蓝色、淡粉色、深绿色、深蓝色、淡紫色的卡片进行制卡 */
              if (
                [0, 2, 3, 4, 6, 9, 10, 13, 15].includes(focusNoteColorIndex) &&
                !focusNote.noteTitle.startsWith("【文献")  // 防止文献卡片被制卡
              ) {

                /* 检测父卡片的存在和颜色 */
                parentNote = focusNote.parentNote
                if (parentNote) {
                  // 有父节点
                  // 检测父卡片是否是淡黄色、淡绿色或黄色的，不是的话获取父卡片的父卡片，直到是为止，获取第一次出现特定颜色的父卡片作为 parentNote
                  while (parentNote) {
                    if (parentNote.colorIndex == 0 || parentNote.colorIndex == 1 || parentNote.colorIndex == 4) {
                      ifParentNoteChosen = true
                      break
                    }
                    parentNote = parentNote.parentNote
                  }
                  if (!ifParentNoteChosen) {
                    parentNote = undefined
                  }
                }
              } else {
                MNUtil.showHUD("此卡片不支持制卡！")
                return // 使用 return 来提前结束函数, 避免了在内部函数中使用 break 导致的语法错误。
              }

              let parentNoteType = toolbarUtils.getClassificationNoteTypeByTitle(parentNote.noteTitle)
              if (
                [2,3,6,9,10,13,15].includes(focusNoteColorIndex) ||
                !focusNote.noteTitle.match(/“.*”相关.*/)
              ) {
                switch (parentNoteType) {
                  case "定义":
                    focusNoteType = "definition"
                    focusNote.note.colorIndex = 2
                    break
                  case "命题":
                    focusNoteType = "theorem"
                    focusNote.note.colorIndex = 10
                    break
                  case "反例":
                    focusNoteType = "antiexample"
                    focusNote.note.colorIndex = 3
                    break
                  case "例子":
                    focusNoteType = "example"
                    focusNote.note.colorIndex = 15
                    break
                  case "思想方法":
                    focusNoteType = "method"
                    focusNote.note.colorIndex = 9
                    break
                  case "问题":
                    focusNoteType = "question"
                    focusNote.note.colorIndex = 13
                    break
                  case "应用":
                    focusNoteType = "application"
                    focusNote.note.colorIndex = 6
                    break
                }
              }
              
              if ([2, 3, 6, 9, 10, 13, 15].includes(focusNote.note.colorIndex)) {
                MNUtil.excuteCommand("AddToReview")
              }

              /* 开始制卡 */
              /* 合并第一层模板 */
              toolbarUtils.makeCardsAuxFirstLayerTemplate(focusNote, focusNoteType)
              /* 与父卡片的链接 */
              try {
                // MNUtil.undoGrouping(()=>{
                  toolbarUtils.makeCardsAuxLinkToParentNote(focusNote, focusNoteType, parentNote)
                // })
              } catch (error) {
                MNUtil.showHUD(error);
              }
              /* 修改卡片前缀 */
              toolbarUtils.makeCardsAuxChangefocusNotePrefix(focusNote, parentNote)
              /* 合并第二层模板 */
              toolbarUtils.makeCardsAuxSecondLayerTemplate(focusNote, focusNoteType)

              // bug：先应用再证明时，无反应
              /* 移动“应用：”和链接部分到最下方 */
              toolbarUtils.makeCardsAuxMoveDownApplicationsComments(focusNote)
              /* 
                移动“证明：”到最上方
                但要注意
                - 反例类型的是“反例及证明：”
                - 思想方法类型的是“原理：”
              */
              if (focusNoteType !== "definition" && focusNoteType !== "classification") {
                try {
                  toolbarUtils.makeCardsAuxMoveProofHtmlComment(focusNote,focusNoteType)
                } catch (error) {
                  MNUtil.showHUD(error)
                }
              }
              focusNote.refresh()
              if (focusNotes.length == 1) {
                try {
                  // MNUtil.undoGrouping(()=>{
                    focusNote.focusInMindMap()
                  // })
                } catch (error) {
                  MNUtil.showHUD(error);
                }
              }
            }
          })
        } catch (error) {
          MNUtil.showHUD(error)
        }
        break;
      /* 夏大鱼羊定制 - end */
      case "cloneAndMerge":
      try {
        MNUtil.showHUD("cloneAndMerge")
        targetNoteId= MNUtil.getNoteIdByURL(des.target)
        MNUtil.undoGrouping(()=>{
          try {
          MNNote.getFocusNotes().forEach(focusNote=>{
            toolbarUtils.cloneAndMerge(focusNote.note, targetNoteId)
          })
          } catch (error) {
            MNUtil.showHUD(error)
          }
        })
      } catch (error) {
        MNUtil.showHUD(error)
      }
        break;
      case "cloneAsChildNote":
        MNUtil.showHUD("cloneAsChildNote")
        targetNoteId= MNUtil.getNoteIdByURL(des.target)
        MNUtil.undoGrouping(()=>{
          MNNote.getFocusNotes().forEach(focusNote=>{
            toolbarUtils.cloneAsChildNote(focusNote, targetNoteId)
          })
        })
        break;
      case "addChildNote":
        MNUtil.showHUD("addChildNote")
        config = {}
        if (des.title) {
          config.title = toolbarUtils.detectAndReplace(des.title)
        }
        if (des.content) {
          config.content = toolbarUtils.detectAndReplace(des.content)
        }
        if (des.markdown) {
          config.markdown = des.content
        }
        color = undefined
        if (des.color) {
          switch (des.color) {
            case "{{parent}}":
              color = focusNote.colorIndex
              break;
            default:
              if (typeof des.color === "number") {
                color = des.color
              }else{
                color = parseInt(des.color.trim())
              }
              break;
          }
          config.color = color
        }
        focusNote.createChildNote(config)
        break;
      case "addBrotherNote":
        MNUtil.showHUD("addBrotherNote")
        config = {}
        if (des.title) {
          config.title = toolbarUtils.detectAndReplace(des.title)
        }
        if (des.content) {
          config.content = toolbarUtils.detectAndReplace(des.content)
        }
        if (des.markdown) {
          config.markdown = des.markdown
        }
        color = undefined
        if (des.color) {
          switch (des.color) {
            case "{{parent}}":
              color = focusNote.parentNote.colorIndex
              break;
            case "{{current}}":
              color = focusNote.colorIndex
              break;
            default:
              if (typeof des.color === "number") {
                color = des.color
              }else{
                color = parseInt(des.color.trim())
              }
              break;
          }
          config.color = color
        }
        focusNote.createBrotherNote(config)
        break;
      case "copy":
        MNUtil.showHUD("copy")
        let target = des.target
        let element = undefined
        if (target) {
          switch (target) {
            case "selectionText":
              element = MNUtil.selectionText
              break;
            case "title":
              if (focusNote) {
                element = focusNote.noteTitle
              }
              break;
            case "excerpt":
              if (focusNote) {
                element = focusNote.excerptText
              }
              break
            case "notesText":
              if (focusNote) {
                element = focusNote.notesText
              }
              break;
            case "commtent":
              if (focusNote) {
                let index = 1
                if (des.index) {
                  index = des.index
                }
                let comments = focusNote.comments
                let commentsLength = comments.length
                if (index > commentsLength) {
                  index = commentsLength
                }
                element = comments[index-1].text
              }
              break;
            case "noteId":
              if (focusNote) {
                element = focusNote.noteId
              }
              break;
            default:
              break;
          }
        }
        let copyContent = des.content
        if (copyContent) {
          let replacedText = toolbarUtils.detectAndReplace(copyContent,element)
          MNUtil.copy(replacedText)
        }else{//没有提供content参数则直接复制目标内容
          MNUtil.copy(element)
        }
        break;
      case "addComment":
        MNUtil.showHUD("addComment")
        let comment = des.content
        let markdown = des.markdown ?? true
        if (comment) {
          let replacedText = toolbarUtils.detectAndReplace(des.content)
          let focusNotes = MNNote.getFocusNotes()
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(note => {
              if (markdown) {
                if ("index" in des) {
                  note.appendMarkdownComment(replacedText,des.index)
                }else{
                  note.appendMarkdownComment(replacedText)
                }
              }else{
                if ("index" in des) {
                  note.appendTextComment(replacedText,des.index)
                }else{
                  note.appendTextComment(replacedText)
                }
              }
            })
          })
        }
        break;
      case "removeComment":
        MNUtil.showHUD("removeComment")
        toolbarUtils.removeComment(des)
        break;
      case "moveComment":
        MNUtil.showHUD("moveComment")
        toolbarUtils.moveComment(des)
        break;
      case "link":
        let linkType = des.linkType ?? "Both"
        let targetUrl = des.target
        if (targetUrl === "{{clipboardText}}") {
          targetUrl = MNUtil.clipboardText
        }
        // MNUtil.showHUD(targetUrl)
        let targetNote = MNNote.new(targetUrl)
        MNUtil.undoGrouping(()=>{
          if (targetNote) {
            MNNote.getFocusNotes().forEach(note=>{
              note.appendNoteLink(targetNote,linkType)
            })
          }else{
            MNUtil.showHUD("Invalid target note!")
          }
        })
        break;
      case "clearContent":
        toolbarUtils.clearContent(des)
        break;
      case "setContent":
        MNUtil.undoGrouping(()=>{
          let content = des.content ?? "content"
          let replacedText = toolbarUtils.detectAndReplace(content)
          toolbarUtils.setContent(replacedText, des)
        })
        break;
      case "showInFloatWindow":
        let targetNoteid
        switch (des.target) {
          case "{{noteInClipboard}}":
          case "noteInClipboard":
            targetNoteid = MNNote.new(MNUtil.clipboardText).noteId
            break;
          case "{{currentNote}}":
          case "currentNote":
            targetNoteid = MNNote.getFocusNote().noteId
            break;
          case "{{currentChildMap}}":
          case "currentChildMap":
            if (MNUtil.mindmapView ) {
              targetNoteid = MNUtil.mindmapView.mindmapNodes[0].note.childMindMap.noteId
            }else{
              targetNoteid = undefined
            }
            break;
          case "{{parentNote}}":
          case "parentNote":
            targetNoteid = MNNote.getFocusNote().parentNote.noteId
            break;
          case "{{currentNoteInMindMap}}":
          case "currentNoteInMindMap":
            let notebookController = MNUtil.notebookController
            let currentNotebookId = notebookController.notebookId
            
            if (!notebookController.view.hidden && notebookController.mindmapView && notebookController.focusNote) {
              targetNoteid = notebookController.focusNote.noteId
            }else{
              let testNote = MNUtil.currentDocController.focusNote
              targetNoteid = testNote.realGroupNoteIdForTopicId(currentNotebookId)
            }
            break;
          case "menu":

          default:
            targetNoteid= MNUtil.getNoteIdByURL(des.target)
            break;
        }
        if (targetNoteid) {
          MNNote.focusInFloatMindMap(targetNoteid)
        }else{
          MNUtil.showHUD("No Note found!")
        }
        // toolbarUtils.studyController().focusNoteInFloatMindMapById(targetNoteid)
        break;
      case "openURL":
        if (des.url) {
          let url = toolbarUtils.detectAndReplace(des.url)
          url = encodeURI(url)
          MNUtil.openURL(url)
          break;
          // MNUtil.showHUD("message")
        }
        MNUtil.showHUD("No valid argument!")
        break;
      case "command":
        let urlPre = "marginnote4app://command/"
        if (des.commands) {
          for (let i = 0; i < des.commands.length; i++) {
            const command = des.commands[i];
            let url = urlPre+command
            MNUtil.openURL(url)
            await MNUtil.delay(0.1)
          }
          break
        }
        if (des.command) {
          let url = urlPre+des.command
          MNUtil.openURL(url)
          break
        }
        MNUtil.showHUD("No valid argument!")
        break
      case "shortcut":
        let shortcutName = des.name
        let url = "shortcuts://run-shortcut?name="+encodeURIComponent(shortcutName)
        if (des.input) {
          url = url+"&input="+encodeURIComponent(des.input)
        }
        if (des.text) {
          let text = toolbarUtils.detectAndReplace(des.text)
          url = url+"&text="+encodeURIComponent(text)
        }
        MNUtil.openURL(url)
        break
      case "replace":
        let mod= des.mod ?? "g"
        let ptt
        if ("reg" in des) {
          ptt = new RegExp(des.reg,mod)
        }else{
          ptt = new RegExp(toolbarUtils.escapeStringRegexp(des.from),mod)
        }
        let range = des.range ?? "currentNotes"
        let targetNotes = toolbarUtils.getNotesByRange(range)
        MNUtil.undoGrouping(()=>{
          targetNotes.forEach(note=>{
            toolbarUtils.replace(note, ptt, des)
          })
        })
        break
      case "mergeText":
        MNUtil.undoGrouping(()=>{
          let range = des.range ?? "currentNotes"
          let targetNotes = toolbarUtils.getNotesByRange(range)
          targetNotes.forEach((note,index)=>{
            let mergedText = toolbarUtils.getMergedText(note, des, index)
            if (mergedText === undefined) {
              return
            }
            switch (des.target) {
              case "excerptText":
                note.excerptText = mergedText
                if ("markdown" in des) {
                  note.excerptTextMarkdown = des.markdown
                }
                break;
              case "title":
                note.noteTitle = mergedText
                break;
              case "newComment":
                if ("markdown" in des && des.markdown) {
                  note.appendMarkdownComment(mergedText)
                }else{
                  note.appendTextComment(mergedText)
                }
                break;
              case "clipboard":
                MNUtil.copy(mergedText)
                break;
              default:
                break;
            }
          })
        })
        if (toolbarUtils.sourceToRemove.length) {
          MNUtil.undoGrouping(()=>{
            // MNUtil.showHUD("remove")
            toolbarUtils.sourceToRemove.forEach(note=>{
              note.excerptText = ""
            })
            MNUtil.delay(1).then(()=>{
              toolbarUtils.sourceToRemove = []
            })
          })
        }
        if (Object.keys(toolbarUtils.commentToRemove).length) {
          MNUtil.undoGrouping(()=>{
            let commentInfos = Object.keys(toolbarUtils.commentToRemove)
            commentInfos.forEach(noteId => {
              let note = MNNote.new(noteId)
              let sortedIndex = MNUtil.sort(toolbarUtils.commentToRemove[noteId],"decrement")
              sortedIndex.forEach(commentIndex=>{
                if (commentIndex < 0) {
                  note.noteTitle = ""
                }else{
                  note.removeCommentByIndex(commentIndex)
                }
              })
            })
            MNUtil.delay(1).then(()=>{
              toolbarUtils.commentToRemove = {}
            })
          })
        }
        break;
      case "chatAI":
        if (des.prompt) {
          MNUtil.postNotification("customChat",{prompt:des.prompt})
          break;
        }
        if(des.user){
          let question = {user:des.user}
          if (des.system) {
            question.system = des.system
          }
          MNUtil.postNotification("customChat",question)
          // MNUtil.showHUD("Not supported yet...")
          break;
        }
        MNUtil.showHUD("No valid argument!")
        break
      case "addImageComment":
        let source = des.source ?? "photo"
        this.compression = des.compression ?? true
        this.currentNoteId = focusNote.noteId
        switch (source) {
          case "camera":
            this.imagePickerController = UIImagePickerController.new()
            this.imagePickerController.delegate = this  // 设置代理
            this.imagePickerController.sourceType = 1  // 设置图片源为相机
            // this.imagePickerController.allowsEditing = true  // 设置图片源为相册
            MNUtil.studyController.presentViewControllerAnimatedCompletion(this.imagePickerController,true,undefined)
            break;
          case "photo":
            this.imagePickerController = UIImagePickerController.new()
            this.imagePickerController.delegate = this  // 设置代理
            this.imagePickerController.sourceType = 0  // 设置图片源为相册
            // this.imagePickerController.allowsEditing = true  // 设置图片源为相册
            MNUtil.studyController.presentViewControllerAnimatedCompletion(this.imagePickerController,true,undefined)
            break;
          case "file":
            let UTI = ["public.image"]
            let path = await MNUtil.importFile(UTI)
            let imageData = MNUtil.getFile(path)
            MNUtil.showHUD("Import: "+MNUtil.getFileName(path))
            MNUtil.copyImage(imageData)
            focusNote.paste()
            break;
          default:
            MNUtil.showHUD("unknown source")
            break;
        }
        // this.presentViewControllerAnimatedCompletion(this.imagePickerController,true,undefined)
        // 展示图片选择器
        // present(imagePickerController, animated: true, completion: nil)
        break;
      case "focus":
        toolbarUtils.focus(focusNote, des)
        break 
      case "toggleView":
        if ("targets" in des) {
          des.targets.map(target=>{
            MNUtil.postNotification("toggleMindmapToolbar", {target:target})
          })
        }else{
          MNUtil.postNotification("toggleMindmapToolbar", {target:des.target})
        }
        break
      case "setButtonImage":
        await MNUtil.delay(0.01)
        if ("imageConfig" in des) {
          let config = des.imageConfig
          let keys = Object.keys(config)
          for (let i = 0; i < keys.length; i++) {
            let url = config[keys[i]].url
            let scale = config[keys[i]].scale??3
            MNUtil.showHUD("setButtonImage: "+keys[i])
            toolbarConfig.setImageByURL(keys[i], url,false,scale)
          }
          // await Promise.all(asyncActions)
          MNUtil.postNotification("refreshToolbarButton", {})
        }else{
          MNUtil.showHUD("Missing imageConfig")
        }
        break;
      default:
        MNUtil.showHUD("Not supported yet...")
        break;
    }
    // if (this.dynamicWindow) {
    //   this.hideAfterDelay()
    // }
    // copyJSON(des)
  } catch (error) {
    toolbarUtils.addErrorLog(error, "customAction")
    // MNUtil.showHUD(error)
  }
}
/**
 * @this {toolbarController}
 * @param {UIButton} button 
 * @param {object} des 
 * @returns 
 */
toolbarController.prototype.customActionByDes = async function (button,des,checkSubscribe = true) {//这里actionName指的是key
  try {
    if (checkSubscribe && !toolbarUtils.checkSubscribe(true)) {
      return
    }
    if (this.customActionMenu(button,des)) {
      // MNUtil.showHUD("reject")
      //如果返回true则表示菜单弹出已执行，则不再执行下面的代码
      return
    }
    let focusNote = MNNote.getFocusNote()? MNNote.getFocusNote():undefined
    let focusNotes = MNNote.getFocusNotes() ? MNNote.getFocusNotes():undefined
    // MNUtil.showHUD("message"+(focusNote instanceof MNNote))
    let color,config
    let targetNoteId
    let parentNote
    let focusNoteType
    let focusNoteColorIndex = focusNote? focusNote.note.colorIndex : 0
    let copyTitlePart
    let userInput
    let bibTextIndex, bibContent
    let bibContentArr = []
    let currentDocmd5
    let path, UTI
    let currentDocName
    switch (des.action) {
      /* 夏大鱼羊定制 - start */
      case "test":
        const name = "鱼羊";
        // MNUtil.showHUD(Pinyin.pinyin(name))
        MNUtil.showHUD(toolbarUtils.getAbbreviationsOfName("Kangwei Xia"))
        break;
      // case "":
      //   break;
      // case "":
      //   UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      //     "输入文献号",
      //     "",
      //     2,
      //     "取消",
      //     ["确定"],
      //     (alert, buttonIndex) => {
      //       try {
      //         MNUtil.undoGrouping(()=>{
      //           let refNum = alert.textFieldAtIndex(0).text;
    //             if (buttonIndex == 1) {
                  
    //             }
      //         })
      //       } catch (error) {
      //         MNUtil.showHUD(error);
      //       }
      //     }
      //   )
      //   break;
      /**
       * 更新归类卡片情况
       */
      case "getNewClassificationInformation":
        MNUtil.undoGrouping(()=>{
          try {
            focusNote.toBeClassificationInfoNote()
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
      /**
       * 把证明的内容移到最下方
       */
      case "moveProofDown":
        MNUtil.undoGrouping(()=>{
          try {
            focusNote.moveProofDown()
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * MN 原生的一些功能
       */
      case "MNFocusNote": // 焦点
        MNUtil.excuteCommand("FocusNote")
        break;
      case "MNEditDeleteNote": // 删除卡片
        let confirm = await MNUtil.confirm("删除卡片", "确定要删除这张卡片吗？")
        if (confirm) {
          MNUtil.excuteCommand("EditDeleteNote")
        }
        break;
      /**
       * 移动摘录
       */
      case "moveToExcerptPartTop":
        MNUtil.undoGrouping(()=>{
          try {
            let newContentsIndexArr = focusNote.getNewContentIndexArr()
            focusNote.moveCommentsByIndexArrTo(newContentsIndexArr, "excerpt", false)
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "moveToExcerptPartBottom":
        MNUtil.undoGrouping(()=>{
          try {
            let newContentsIndexArr = focusNote.getNewContentIndexArr()
            focusNote.moveCommentsByIndexArrTo(newContentsIndexArr, "excerpt")
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * 进度标记
       */
      case "toBeProgressNote":
        MNUtil.undoGrouping(()=>{
          try {
            focusNote.toBeProgressNote()
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
      /**
       * 卡片独立出来
       */
      case "toBeIndependent":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              focusNote.toBeIndependent()
            })
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
        * 移动卡片到「输入」区
        */
      case "moveToInput":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              focusNote.moveToInput()
            })
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * 移动卡片到「内化」区
       */
      case "moveToInternalize":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              focusNote.moveToInternalize()
            })
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * 移动卡片到「待归类」区
       */
      case "moveToBeClassified":
        MNUtil.undoGrouping(()=>{
          try {
            if (MNUtil.currentNotebookId == "A07420C1-661A-4C7D-BA06-C7035C18DA74") {
              UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                "移动到「待归类」区",
                "请选择科目",
                0,
                "取消",
                [
                  "数学基础",
                  "泛函分析",
                  "实分析",
                  "复分析",
                  "数学分析",
                  "高等代数"
                ],
                (alert, buttonIndex) => {
                  let targetNoteId
                  switch (buttonIndex) {
                    case 1: // 数学基础
                      targetNoteId = "EF75F2C8-2655-4BAD-92E1-C9C11D1A37C3"
                      break;
                    case 2: // 泛函分析
                      targetNoteId = "23E0024A-F2C9-4E45-9F64-86DD30C0D497"
                      break;
                    case 3: // 实分析
                      targetNoteId = "97672F06-1C40-475D-8F44-16759CCADA8C"
                      break;
                    case 4: // 复分析
                      targetNoteId = "16920F8B-700E-4BA6-A7EE-F887F28A502B"
                      break;
                    case 5: // 数学分析
                      targetNoteId = "9AAE346D-D7ED-472E-9D30-A7E1DE843F83"
                      break;
                    case 6: // 高等代数
                      targetNoteId = "B9B3FB57-AAC0-4282-9BFE-3EF008EA2085"
                      break;
                  }
                  MNUtil.undoGrouping(()=>{
                    focusNotes.forEach(focusNote=>{
                      focusNote.moveToBeClassified(targetNoteId)
                    })
                  })
                }
              )
            } else {
              focusNotes.forEach(focusNote=>{
                focusNote.moveToBeClassified()
              })
            }
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * 通过弹窗选择，移动最后三个评论到指定位置
       */
      case "moveLastThreeCommentByPopupTo":
        MNUtil.undoGrouping(()=>{
          try {
            let newContentsIndexArr = [
              focusNote.comments.length-3,
              focusNote.comments.length-2,
              focusNote.comments.length-1
            ]
            focusNote.moveCommentsByIndexArrAndButtonTo(newContentsIndexArr, "移动「最后3️⃣条」评论到", "")
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * 通过弹窗选择，移动最后两个评论到指定位置
       */
      case "moveLastTwoCommentByPopupTo":
        MNUtil.undoGrouping(()=>{
          try {
            let newContentsIndexArr = [
              focusNote.comments.length-2,
              focusNote.comments.length-1
            ]
            focusNote.moveCommentsByIndexArrAndButtonTo(newContentsIndexArr, "移动「最后2️⃣条」评论到", "")
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * 通过弹窗选择，移动最后一个评论到指定位置
       */
      case "moveLastOneCommentByPopupTo":
        MNUtil.undoGrouping(()=>{
          try {
            let newContentsIndexArr = [
              focusNote.comments.length-1
            ]
            focusNote.moveCommentsByIndexArrAndButtonTo(newContentsIndexArr, "移动「最后1️⃣条」评论到", "")
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * 自动识别新内容，并通过弹窗选择，移动到指定位置
       */
      case "moveNewContentsByPopupTo":
        MNUtil.undoGrouping(()=>{
          try {
            let newContentsIndexArr = focusNote.getNewContentIndexArr()
            focusNote.moveCommentsByIndexArrAndButtonTo(newContentsIndexArr, "移动「新增」评论到", "")
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
          
        case "AddToReview":
          MNUtil.excuteCommand("AddToReview")
          break;
        /**
         * 将剪切板中的 ID Arr 对应的卡片剪切过来作为选中卡片的子卡片
         */
        case "pasteAsChildNotesByIdArrFromClipboard":
          MNUtil.undoGrouping(()=>{
            try {
              // 先把 MNUtils.clipboardText 转成数组
              let idsArr = MNUtil.clipboardText.split(",")
              // 再把数组中的 ID 对应的卡片作为选中卡片的子卡片
              focusNote.pasteChildNotesByIdArr(idsArr)
            } catch (error) {
              MNUtil.showHUD(error);
            }
          })
          break;
      /**
       * 复制批量选中的卡片的 ID 到剪贴板
       */
      case "copyFocusNotesIdArr":
        MNUtil.undoGrouping(()=>{
          try {
            let idsArr = toolbarUtils.getNoteIdArr(focusNotes)
            MNUtil.copy(idsArr)
            MNUtil.showHUD(idsArr)
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "generateCustomTitleLink":
        MNUtil.undoGrouping(()=>{
          toolbarUtils.generateCustomTitleLink()
        })
        break;
      case "generateCustomTitleLinkFromFocusNote":
        MNUtil.undoGrouping(()=>{
          toolbarUtils.generateCustomTitleLinkFromFocusNote(focusNote)
        })
        break;
      case "pasteNoteAsChildNote":
        MNUtil.undoGrouping(()=>{
          try {
            toolbarUtils.pasteNoteAsChildNote(focusNote)
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "moveLastCommentToProofStart":
        MNUtil.undoGrouping(()=>{
          try {
            let targetIndex = toolbarUtils.getProofHtmlCommentIndex(focusNote) + 1
            focusNote.moveComment(focusNote.comments.length-1,targetIndex)
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "moveProofToStart":
        MNUtil.undoGrouping(()=>{
          try {
            let targetIndex = toolbarUtils.getProofHtmlCommentIndex(focusNote) + 1
            toolbarUtils.moveProofToIndex(focusNote, targetIndex)
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "renewCommentsInProofToHtmlType":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(
              focusNote=>{
                let proofHtmlCommentIndex = focusNote.getCommentIndex("证明：", true)
                let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
                if (
                  proofHtmlCommentIndex !== -1 &&
                  thoughtHtmlCommentIndex !== -1
                ) {
                  focusNote.comments.forEach(
                    (comment, index) => {
                      if (
                        proofHtmlCommentIndex < index &&
                        index < thoughtHtmlCommentIndex &&
                        comment.type == "TextNote" &&
                        comment.text.startsWith("- ")
                      ) {
                        let commentContent = comment.text.slice(2).trim()
                        focusNote.removeCommentByIndex(index)
                        focusNote.appendMarkdownComment(
                          '<span style="font-weight: bold; color: #1A6584; background-color: #e8e9eb; font-size: 1.18em; padding-top: 5px; padding-bottom: 5px">'+ commentContent +'</span>',
                          index
                        )
                      }
                    }
                  )
                }
              }
            )
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "linkRemoveDuplicatesAfterApplication":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(
              focusNote=>{
                let applicationHtmlCommentIndex = Math.max(
                  focusNote.getIncludingCommentIndex("应用：", true),
                  focusNote.getIncludingCommentIndex("的应用")
                )
                toolbarUtils.linkRemoveDuplicatesAfterIndex(focusNote,applicationHtmlCommentIndex)
              }
            )
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "moveOneCommentToLinkNote":
        MNUtil.undoGrouping(()=>{
          try {
            let proofHtmlCommentIndex = Math.max(
              focusNote.getCommentIndex("原理：", true),
              focusNote.getCommentIndex("反例及证明：", true),
              focusNote.getCommentIndex("证明：", true)
            )
            let targetIndex = (proofHtmlCommentIndex == -1)?focusNote.getCommentIndex("相关思考：",true):proofHtmlCommentIndex
            focusNote.moveComment(focusNote.comments.length-1,targetIndex)
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "htmlCommentToProofTop":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入注释",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let comment = alert.textFieldAtIndex(0).text;
                if (buttonIndex == 1) {
                  let targetIndex = focusNote.getCommentIndex("证明：",true) + 1
                  focusNote.appendMarkdownComment(
                    '<span style="font-weight: bold; color: #1A6584; background-color: #e8e9eb; font-size: 1.18em; padding-top: 5px; padding-bottom: 5px">'+ comment +'</span>',
                    targetIndex
                  )
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "htmlCommentToProofFromClipboard":
        MNUtil.undoGrouping(()=>{
          try {
            let dotCommentIndex = (focusNote.getCommentIndex("-") == -1)?focusNote.getCommentIndex("- "):focusNote.getCommentIndex("-")
            if (dotCommentIndex !== -1) {
              focusNote.removeCommentByIndex(dotCommentIndex)
              focusNote.appendMarkdownComment(
                '<span style="font-weight: bold; color: #1A6584; background-color: #e8e9eb; font-size: 1.18em; padding-top: 5px; padding-bottom: 5px">'+ MNUtil.clipboardText +'</span>'
                , dotCommentIndex
              )
            } else {
              focusNote.appendMarkdownComment(
                '<span style="font-weight: bold; color: #1A6584; background-color: #e8e9eb; font-size: 1.18em; padding-top: 5px; padding-bottom: 5px">'+ MNUtil.clipboardText +'</span>'
                , focusNote.getCommentIndex("相关思考：",true)
              )
            }
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "htmlCommentToBottom":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入注释",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let comment = alert.textFieldAtIndex(0).text;
                if (buttonIndex == 1) {
                  focusNote.appendMarkdownComment(
                    '<span style="font-weight: bold; color: #1A6584; background-color: #e8e9eb; font-size: 1.18em; padding-top: 5px; padding-bottom: 5px">'+ comment +'</span>'
                  )
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "htmlCommentToProofBottom":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入注释",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let comment = alert.textFieldAtIndex(0).text;
                if (buttonIndex == 1) {
                  let targetIndex = focusNote.getCommentIndex("相关思考：",true)
                  focusNote.appendMarkdownComment(
                    '<span style="font-weight: bold; color: #1A6584; background-color: #e8e9eb; font-size: 1.18em; padding-top: 5px; padding-bottom: 5px">'+ comment +'</span>',
                    targetIndex
                  )
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "moveUpLinkToBelonging":
        MNUtil.undoGrouping(()=>{
          let type = focusNote.title.match(/“.*”：“.*”相关(.*)/)[1]
          if (type) {
            let targetIndex = focusNote.getCommentIndex("相关"+type+"：",true)
            if (targetIndex !== -1) {
              focusNote.moveComment(focusNote.comments.length-1,targetIndex)
            }
          }
        })
        break;
      case "addOldNoteKeyword":
        MNUtil.undoGrouping(()=>{
          let keywordsHtmlCommentIndex = focusNote.getCommentIndex("关键词：",true)
          focusNote.appendMarkdownComment("-",keywordsHtmlCommentIndex+1)
        })
        break;
      case "addProofToStartFromClipboard":
        try {
          MNUtil.undoGrouping(()=>{
            MNUtil.excuteCommand("EditPaste")
            MNUtil.delay(0.1).then(()=>{
              let targetIndex = toolbarUtils.getProofHtmlCommentIndex(focusNote) + 1
              focusNote.moveComment(focusNote.comments.length-1,targetIndex)
            })
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "addProofFromClipboard":
        try {
          MNUtil.undoGrouping(()=>{
            MNUtil.excuteCommand("EditPaste")
            MNUtil.delay(0.1).then(()=>{
              toolbarUtils.moveLastCommentToProof(focusNote)
            })
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "copiedTextHandleSpaces":
        MNUtil.showHUD(Pangu.spacing(MNUtil.selectionText))
        MNUtil.copy(Pangu.spacing(MNUtil.selectionText))
        break;
      case "selectionTextHandleSpaces":
        MNUtil.showHUD(Pangu.spacing(MNUtil.clipboardText))
        MNUtil.copy(Pangu.spacing(MNUtil.clipboardText))
        break;
      case "handleTitleSpaces":
        try {
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(
              focusNote => {
                focusNote.noteTitle = Pangu.spacing(focusNote.noteTitle)
                focusNote.refresh()
                focusNote.refreshAll()
              }
            )
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "focusInMindMap":
        MNUtil.undoGrouping(()=>{
          focusNote.focusInMindMap()
        })
        break;
      case "focusInFloatMindMap":
        MNUtil.undoGrouping(()=>{
          focusNote.focusInFloatMindMap()
        })
        break;
      case "selectionTextToLowerCase":
        MNUtil.showHUD(MNUtil.selectionText.toLowerCase())
        MNUtil.copy(MNUtil.selectionText.toLowerCase())
        break;
      case "selectionTextToTitleCase":
        MNUtil.showHUD(MNUtil.selectionText.toTitleCase())
        MNUtil.copy(MNUtil.selectionText.toTitleCase())
        break;
      case "copiedTextToTitleCase":
        MNUtil.showHUD(MNUtil.clipboardText.toTitleCase())
        MNUtil.copy(MNUtil.clipboardText.toTitleCase())
        break;
      case "copiedTextToLowerCase":
        MNUtil.showHUD(MNUtil.clipboardText.toLowerCase())
        MNUtil.copy(MNUtil.clipboardText.toLowerCase())
        break;
      case "proofAddMethodComment":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入方法数",
          "",
          2,
          "取消",
          ["确定"],
          (alertI, buttonIndexI) => {
            try {
              MNUtil.undoGrouping(()=>{
                let methodNum = alertI.textFieldAtIndex(0).text;
                let findMethod = false
                let methodIndex = -1
                if (buttonIndexI == 1) {
                  for (let i = 0; i < focusNote.comments.length; i++) {
                    let comment = focusNote.comments[i];
                    if (
                      comment.text &&
                      comment.text.startsWith("<span") &&
                      comment.text.includes("方法"+toolbarUtils.numberToChinese(methodNum))
                    ) {
                      methodIndex = i
                      findMethod = true
                      break
                    }
                  }
                  if (!findMethod) {
                    MNUtil.showHUD("没有此方法！")
                  } else {
                    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                      "输入此方法的注释",
                      "",
                      2,
                      "取消",
                      ["确定"],
                      (alert, buttonIndex) => {
                        try {
                          MNUtil.undoGrouping(()=>{
                            let methodComment = alert.textFieldAtIndex(0).text;
                            if (methodComment == "") {
                              methodComment = "- - - - - - - - - - - - - - -"
                            }
                            if (buttonIndex == 1) {
                              focusNote.removeCommentByIndex(methodIndex)
                              focusNote.appendMarkdownComment(
                                '<span style="font-weight: bold; color: #014f9c; background-color: #ecf5fc; font-size: 1.15em; padding-top: 5px; padding-bottom: 5px"> 方法'+ toolbarUtils.numberToChinese(methodNum) +'：'+ methodComment +'</span>',
                                methodIndex
                              )
                            }
                          })
                        } catch (error) {
                          MNUtil.showHUD(error);
                        }
                      }
                    )
                  }
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "proofAddNewAntiexampleWithComment":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入此反例的注释",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let antiexampleComment = alert.textFieldAtIndex(0).text;
                if (antiexampleComment == "") {
                  antiexampleComment = "- - - - - - - - - - - - - - -"
                }
                if (buttonIndex == 1) {
                  let antiexampleNum = 0
                  focusNote.comments.forEach(comment=>{
                    if (
                      comment.text &&
                      comment.text.startsWith("<span") &&
                      comment.text.includes("反例")
                    ) {
                      antiexampleNum++
                    }
                  })
                  let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：",true)
                  let proofHtmlCommentIndex = focusNote.getCommentIndex("证明：",true)
                  let targetIndex = (antiexampleNum == 0)?proofHtmlCommentIndex+1:thoughtHtmlCommentIndex
                  focusNote.appendMarkdownComment(
                    '<span style="font-weight: bold; color: #081F3C; background-color: #B9EDD0; font-size: 1.15em; padding-top: 5px; padding-bottom: 5px"> 反例'+ toolbarUtils.numberToChinese(antiexampleNum+1) +'：'+ antiexampleComment +'</span>',
                    targetIndex
                  )
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break
      case "proofAddNewMethodWithComment":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入此方法的注释",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let methodComment = alert.textFieldAtIndex(0).text;
                if (methodComment == "") {
                  methodComment = "- - - - - - - - - - - - - - -"
                }
                if (buttonIndex == 1) {
                  let methodNum = 0
                  focusNote.comments.forEach(comment=>{
                    if (
                      comment.text &&
                      comment.text.startsWith("<span") &&
                      comment.text.includes("方法")
                    ) {
                      methodNum++
                    }
                  })
                  let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：",true)
                  let proofHtmlCommentIndex = focusNote.getCommentIndex("证明：",true)
                  let targetIndex = (methodNum == 0)?proofHtmlCommentIndex+1:thoughtHtmlCommentIndex
                  focusNote.appendMarkdownComment(
                    '<span style="font-weight: bold; color: #081F3C; background-color: #B9EDD0; font-size: 1.15em; padding-top: 5px; padding-bottom: 5px"> 方法'+ toolbarUtils.numberToChinese(methodNum+1) +'：'+ methodComment +'</span>',
                    targetIndex
                  )
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break
      case "proofAddNewAntiexample":
        try {
          MNUtil.undoGrouping(()=>{
            let antiexampleNum = 0
            focusNote.comments.forEach(comment=>{
              if (
                comment.text &&
                comment.text.startsWith("<span") &&
                comment.text.includes("反例")
              ) {
                antiexampleNum++
              }
            })
            let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：",true)
            let proofHtmlCommentIndex = focusNote.getCommentIndex("证明：",true)
            let targetIndex = (antiexampleNum == 0)?proofHtmlCommentIndex+1:thoughtHtmlCommentIndex
            focusNote.appendMarkdownComment(
              '<span style="font-weight: bold; color: #081F3C; background-color: #B9EDD0; font-size: 1.15em; padding-top: 5px; padding-bottom: 5px"> 反例'+ toolbarUtils.numberToChinese(antiexampleNum+1) +'：- - - - - - - - - - - - - - - </span>',
              targetIndex
            )
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "proofAddNewMethod":
        try {
          MNUtil.undoGrouping(()=>{
            let methodNum = 0
            focusNote.comments.forEach(comment=>{
              if (
                comment.text &&
                comment.text.startsWith("<span") &&
                comment.text.includes("方法")
              ) {
                methodNum++
              }
            })
            let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：",true)
            let proofHtmlCommentIndex = focusNote.getCommentIndex("证明：",true)
            let targetIndex = (methodNum == 0)?proofHtmlCommentIndex+1:thoughtHtmlCommentIndex
            focusNote.appendMarkdownComment(
              '<span style="font-weight: bold; color: #081F3C; background-color: #B9EDD0; font-size: 1.15em; padding-top: 5px; padding-bottom: 5px"> 方法'+ toolbarUtils.numberToChinese(methodNum+1) +'：- - - - - - - - - - - - - - - </span>',
              targetIndex
            )
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "renewLinksBetweenClassificationNoteAndExtensionNote":
        try {
          MNUtil.undoGrouping(()=>{
            let targetNoteId = MNUtil.getNoteIdByURL(focusNote.comments[focusNote.comments.length - 1].text)
            let targetNote = MNNote.new(targetNoteId)
            let targetNoteColorIndex = targetNote.note.colorIndex
            let targetNoteType
            let targetClassificationNoteType = toolbarUtils.getClassificationNoteTypeByTitle(targetNote.noteTitle)
            let focusClassificationNoteType = toolbarUtils.getClassificationNoteTypeByTitle(focusNote.noteTitle)
            let targetCommentIndex
            if ([0,1,4].includes(targetNoteColorIndex)) {
              targetNoteType = "classification"
            } else {
              switch (targetNoteColorIndex) {
                case 2: // 淡蓝色：定义类
                  targetNoteType = "definition"
                  break;
                case 3: // 淡粉色：反例
                  targetNoteType = "antiexample"
                  break;
                case 6: // 蓝色：应用
                  targetNoteType = "application"
                  break;
                case 9: // 深绿色：思想方法
                  targetNoteType = "method"
                  break;
                case 10: // 深蓝色：定理命题
                  targetNoteType = "theorem"
                  break;
                case 13: // 淡灰色：问题
                  targetNoteType = "question"
                  break;
                case 15: // 淡紫色：例子
                  targetNoteType = "example"
                  break;
              }
            }

            let focusNoteType
            switch (focusNoteColorIndex) {
              case 0: // 淡黄色：归类
                focusNoteType = "classification"
                break;
              case 1: // 淡绿色：归类
                focusNoteType = "classification"
                break;
              case 2: // 淡蓝色：定义类
                focusNoteType = "definition"
                break;
              case 3: // 淡粉色：反例
                focusNoteType = "antiexample"
                break;
              case 4: // 黄色：归类
                focusNoteType = "classification"
                break;
              case 6: // 蓝色：应用
                focusNoteType = "application"
                break;
              case 9: // 深绿色：思想方法
                focusNoteType = "method"
                break;
              case 10: // 深蓝色：定理命题
                focusNoteType = "theorem"
                break;
              case 13: // 淡灰色：问题
                focusNoteType = "question"
                break;
              case 15: // 淡紫色：例子
                focusNoteType = "example"
                break;
            }

            switch (focusNoteType) {
              case "definition":
                // 概念卡片只会和归类卡片链接
                targetCommentIndex = toolbarUtils.moveLastCommentAboveComment(targetNote, "相关"+targetClassificationNoteType+"：" )
                if (targetCommentIndex == -1) {
                  toolbarUtils.moveLastCommentAboveComment(
                    targetNote,
                    "包含："
                  )
                }

                toolbarUtils.moveLastCommentAboveComment(focusNote, "相关概念：")
                break;
              case "classification":
                switch (targetNoteType) {
                  case "definition":
                    // 淡绿色只会和概念卡片链接
                    targetCommentIndex = toolbarUtils.moveLastCommentAboveComment(focusNote, "相关"+focusClassificationNoteType+"：" )
                    if (targetCommentIndex == -1) {
                      toolbarUtils.moveLastCommentAboveComment(
                        focusNote,
                        "包含："
                      )
                    }
    
                    toolbarUtils.moveLastCommentAboveComment(targetNote, "相关概念：")
                    break;
                  case "classification":
                    // 此时黄色只能和黄色卡片链接，因为黄色和绿色只有一种链接
                    // 此时就是移动到“相关xxx”下方
                    toolbarUtils.moveLastCommentAboveComment(focusNote, "包含：" )
                    toolbarUtils.moveLastCommentAboveComment(targetNote, "包含：" )
                    break;
                  default:
                    // 其余的知识卡片都只移动知识卡片的链接
                    toolbarUtils.moveLastCommentAboveComment(targetNote, "应用：" )
                    break;
                }
                break;
              default:
                // 知识卡片只与归类卡片链接
                toolbarUtils.moveLastCommentAboveComment(focusNote, "应用：" )
                break;
            }

            // if (focusNoteColorIndex == 2) {
            //   // 如果选择的是概念类型卡片
              
            //   let targetNoteType = toolbarUtils.getClassificationNoteTypeByTitle(targetNote.noteTitle)
            //   let relatedHtmlCommentIndex = targetNote.getCommentIndex("相关"+targetNoteType+"：",true)
            //   let includingHtmlCommentIndex = targetNote.getCommentIndex("包含：",true)
            //   let targetNoteTargetIndex = (relatedHtmlCommentIndex==-1)? includingHtmlCommentIndex: relatedHtmlCommentIndex
            //   targetNote.moveComment(
            //     targetNote.comments.length-1,
            //     targetNoteTargetIndex
            //   )

            //   // 处理概念卡片
            //   let definitionHtmlCommentIndex = focusNote.getCommentIndex("相关概念：",true)
            //   focusNote.moveComment(
            //     focusNote.comments.length-1,
            //     definitionHtmlCommentIndex
            //   )
            // } else {
            //   if (
            //     focusNoteColorIndex == 0 ||
            //     focusNoteColorIndex == 1 ||
            //     focusNoteColorIndex == 4
            //   ) {
            //     // 选择的是归类型卡片
            //     let targetNoteId = MNUtil.getNoteIdByURL(focusNote.comments[focusNote.comments.length - 1].text)

            //     // 处理概念卡片
            //     let targetNote = MNNote.new(targetNoteId)
            //     let definitionHtmlCommentIndex = targetNote.getCommentIndex("相关概念：",true)
            //     targetNote.moveComment(
            //       targetNote.comments.length-1,
            //       definitionHtmlCommentIndex
            //     )


            //     // 处理衍生卡片
            //     let focusNoteType = toolbarUtils.getClassificationNoteTypeByTitle(focusNote.noteTitle)
            //     let relatedHtmlCommentIndex = focusNote.getCommentIndex("相关"+focusNoteType+"：",true)
            //     let includingHtmlCommentIndex = focusNote.getCommentIndex("包含：",true)
            //     let focusNoteTargetIndex = (relatedHtmlCommentIndex==-1)? includingHtmlCommentIndex: relatedHtmlCommentIndex
            //     focusNote.moveComment(
            //       focusNote.comments.length-1,
            //       focusNoteTargetIndex
            //     )

            //   }
            // }
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "referenceRefByRefNumAddFocusInFloatMindMap":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入文献号",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let refNum = alert.textFieldAtIndex(0).text;
                if (buttonIndex == 1) {
                  let refNote = toolbarUtils.referenceRefByRefNum(focusNote, refNum)[0]
                  let classificationNote = toolbarUtils.referenceRefByRefNum(focusNote, refNum)[1]
                  classificationNote.addChild(refNote.note)
                  refNote.focusInFloatMindMap(0.3)
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceRefByRefNumAndFocusInMindMap":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入文献号",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let refNum = alert.textFieldAtIndex(0).text;
                if (buttonIndex == 1) {
                  let refNote = toolbarUtils.referenceRefByRefNum(focusNote, refNum)[0]
                  let classificationNote = toolbarUtils.referenceRefByRefNum(focusNote, refNum)[1]
                  classificationNote.addChild(refNote.note)
                  refNote.focusInMindMap(0.3)
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceRefByRefNum":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入文献号",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let refNum = alert.textFieldAtIndex(0).text;
                if (buttonIndex == 1) {
                  toolbarUtils.referenceRefByRefNum(focusNote, refNum)
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceCreateClassificationNoteByIdAndFocusNote":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入文献号",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                if (buttonIndex == 1) {
                  let refNum = alert.textFieldAtIndex(0).text
                  let currentDocmd5 = MNUtil.currentDocmd5
                  let findClassificationNote = false
                  let classificationNote
                  if (referenceIds.hasOwnProperty(currentDocmd5)) {
                    if (referenceIds[currentDocmd5].hasOwnProperty(refNum)) {
                      if (referenceIds[currentDocmd5][0] == undefined) {
                        MNUtil.showHUD("文档未绑定 ID")
                      } else {
                        let refSourceNoteId = referenceIds[currentDocmd5][0]
                        let refSourceNote = MNNote.new(refSourceNoteId)
                        let refSourceNoteTitle = toolbarUtils.getFirstKeywordFromTitle(refSourceNote.noteTitle)
                        let refSourceNoteAuthor = toolbarUtils.getFirstAuthorFromReferenceById(refSourceNoteId)
                        let refedNoteId = referenceIds[currentDocmd5][refNum]
                        let refedNote = MNNote.new(refedNoteId)
                        let refedNoteTitle = toolbarUtils.getFirstKeywordFromTitle(refedNote.noteTitle)
                        let refedNoteAuthor = toolbarUtils.getFirstAuthorFromReferenceById(refedNoteId)
                        // 先看 refedNote 有没有归类的子卡片了
                        for (let i = 0; i < refedNote.childNotes.length; i++) {
                          let childNote = refedNote.childNotes[i]
                          if (
                            childNote.noteTitle &&
                            childNote.noteTitle.includes("[" + refNum + "] " + refedNoteTitle)
                          ) {
                            classificationNote = refedNote.childNotes[i]
                            findClassificationNote = true
                            break
                          }
                        }
                        if (!findClassificationNote) {
                          // 没有的话就创建一个
                          classificationNote = MNNote.clone("C24C2604-4B3A-4B6F-97E6-147F3EC67143")
                          classificationNote.noteTitle = 
                            "「" + refSourceNoteTitle + " - " + refSourceNoteAuthor +"」引用" + "「[" + refNum + "] " + refedNoteTitle + " - " + refedNoteAuthor + "」情况"
                        } else {
                          // 如果找到的话就更新一下标题
                          // 因为可能会出现偶尔忘记写作者导致的 No author 
                          classificationNote.noteTitle = 
                            "「" + refSourceNoteTitle + " - " + refSourceNoteAuthor +"」引用" + "「[" + refNum + "] " + refedNoteTitle + " - " + refedNoteAuthor + "」情况"
                        }
                        refedNote.addChild(classificationNote.note)
                        // 移动链接到“引用：”
                        let refedNoteIdIndexInClassificationNote = classificationNote.getCommentIndex("marginnote4app://note/" + refedNoteId)
                        if (refedNoteIdIndexInClassificationNote == -1){
                          classificationNote.appendNoteLink(refedNote, "To")
                          classificationNote.moveComment(classificationNote.comments.length-1,classificationNote.getCommentIndex("具体引用：", true))
                        } else {
                          classificationNote.moveComment(refedNoteIdIndexInClassificationNote,classificationNote.getCommentIndex("具体引用：", true) - 1)
                        }
                        // 移动链接到“原文献”
                        let refSourceNoteIdIndexInClassificationNote = classificationNote.getCommentIndex("marginnote4app://note/" + refSourceNoteId)
                        if (refSourceNoteIdIndexInClassificationNote == -1){
                          classificationNote.appendNoteLink(refSourceNote, "To")
                          classificationNote.moveComment(classificationNote.comments.length-1,classificationNote.getCommentIndex("引用：", true))
                        } else {
                          classificationNote.moveComment(refSourceNoteIdIndexInClassificationNote,classificationNote.getCommentIndex("引用：", true) - 1)
                        }
                        // 链接归类卡片到 refSourceNote
                        let classificationNoteIdIndexInRefSourceNote = refSourceNote.getCommentIndex("marginnote4app://note/" + classificationNote.noteId)
                        if (classificationNoteIdIndexInRefSourceNote == -1){
                          refSourceNote.appendNoteLink(classificationNote, "To")
                        }
                        // 链接归类卡片到 refedNote
                        let classificationNoteIdIndexInRefedNote = refedNote.getCommentIndex("marginnote4app://note/" + classificationNote.noteId)
                        if (classificationNoteIdIndexInRefedNote == -1){
                          refedNote.appendNoteLink(classificationNote, "To")
                          refedNote.moveComment(refedNote.comments.length-1,refedNote.getCommentIndex("参考文献：", true))
                        } else {
                          refedNote.moveComment(classificationNoteIdIndexInRefedNote,refedNote.getCommentIndex("参考文献：", true) - 1)
                        }
                        classificationNote.merge(focusNote.note)
                        classificationNote.moveComment(
                          classificationNote.comments.length-1,
                          classificationNote.getCommentIndex("引用：", true) + 1
                        )
                        classificationNote.focusInFloatMindMap(0.5)
                      }
                    } else {
                      MNUtil.showHUD("["+refNum+"] 未进行 ID 绑定")
                    }
                  } else {
                    MNUtil.showHUD("当前文档并未开始绑定 ID")
                  }
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceCreateClassificationNoteById":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入文献号",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                if (buttonIndex == 1) {
                  let refNum = alert.textFieldAtIndex(0).text
                  let currentDocmd5 = MNUtil.currentDocmd5
                  let findClassificationNote = false
                  let classificationNote
                  if (referenceIds.hasOwnProperty(currentDocmd5)) {
                    if (referenceIds[currentDocmd5].hasOwnProperty(refNum)) {
                      if (referenceIds[currentDocmd5][0] == undefined) {
                        MNUtil.showHUD("文档未绑定 ID")
                      } else {
                        let refSourceNoteId = referenceIds[currentDocmd5][0]
                        let refSourceNote = MNNote.new(refSourceNoteId)
                        let refSourceNoteTitle = toolbarUtils.getFirstKeywordFromTitle(refSourceNote.noteTitle)
                        let refSourceNoteAuthor = toolbarUtils.getFirstAuthorFromReferenceById(refSourceNoteId)
                        let refedNoteId = referenceIds[currentDocmd5][refNum]
                        let refedNote = MNNote.new(refedNoteId)
                        let refedNoteTitle = toolbarUtils.getFirstKeywordFromTitle(refedNote.noteTitle)
                        let refedNoteAuthor = toolbarUtils.getFirstAuthorFromReferenceById(refedNoteId)
                        // 先看 refedNote 有没有归类的子卡片了
                        for (let i = 0; i < refedNote.childNotes.length; i++) {
                          let childNote = refedNote.childNotes[i]
                          if (
                            childNote.noteTitle &&
                            childNote.noteTitle.includes("[" + refNum + "] " + refedNoteTitle)
                          ) {
                            classificationNote = refedNote.childNotes[i]
                            findClassificationNote = true
                            break
                          }
                        }
                        if (!findClassificationNote) {
                          // 没有的话就创建一个
                          classificationNote = MNNote.clone("C24C2604-4B3A-4B6F-97E6-147F3EC67143")
                          classificationNote.noteTitle = 
                            "「" + refSourceNoteTitle + " - " + refSourceNoteAuthor +"」引用" + "「[" + refNum + "] " + refedNoteTitle + " - " + refedNoteAuthor + "」情况"
                        } else {
                          // 如果找到的话就更新一下标题
                          // 因为可能会出现偶尔忘记写作者导致的 No author 
                          classificationNote.noteTitle = 
                            "「" + refSourceNoteTitle + " - " + refSourceNoteAuthor +"」引用" + "「[" + refNum + "] " + refedNoteTitle + " - " + refedNoteAuthor + "」情况"
                        }
                        refedNote.addChild(classificationNote.note)
                        // 移动链接到“引用：”
                        let refedNoteIdIndexInClassificationNote = classificationNote.getCommentIndex("marginnote4app://note/" + refedNoteId)
                        if (refedNoteIdIndexInClassificationNote == -1){
                          classificationNote.appendNoteLink(refedNote, "To")
                          classificationNote.moveComment(classificationNote.comments.length-1,classificationNote.getCommentIndex("具体引用：", true))
                        } else {
                          classificationNote.moveComment(refedNoteIdIndexInClassificationNote,classificationNote.getCommentIndex("具体引用：", true))
                        }
                        // 移动链接到“原文献”
                        let refSourceNoteIdIndexInClassificationNote = classificationNote.getCommentIndex("marginnote4app://note/" + refSourceNoteId)
                        if (refSourceNoteIdIndexInClassificationNote == -1){
                          classificationNote.appendNoteLink(refSourceNote, "To")
                          classificationNote.moveComment(classificationNote.comments.length-1,classificationNote.getCommentIndex("引用：", true))
                        } else {
                          classificationNote.moveComment(refSourceNoteIdIndexInClassificationNote,classificationNote.getCommentIndex("引用：", true))
                        }
                        // 链接归类卡片到 refSourceNote
                        let classificationNoteIdIndexInRefSourceNote = refSourceNote.getCommentIndex("marginnote4app://note/" + classificationNote.noteId)
                        if (classificationNoteIdIndexInRefSourceNote == -1){
                          refSourceNote.appendNoteLink(classificationNote, "To")
                        }
                        // 链接归类卡片到 refedNote
                        let classificationNoteIdIndexInRefedNote = refedNote.getCommentIndex("marginnote4app://note/" + classificationNote.noteId)
                        if (classificationNoteIdIndexInRefedNote == -1){
                          refedNote.appendNoteLink(classificationNote, "To")
                          refedNote.moveComment(refedNote.comments.length-1,refedNote.getCommentIndex("参考文献：", true))
                        } else {
                          refedNote.moveComment(classificationNoteIdIndexInRefedNote,refedNote.getCommentIndex("参考文献：", true))
                        }
                        classificationNote.focusInFloatMindMap(0.5)
                      }
                    } else {
                      MNUtil.showHUD("["+refNum+"] 未进行 ID 绑定")
                    }
                  } else {
                    MNUtil.showHUD("当前文档并未开始绑定 ID")
                  }
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "refreshNotes":
        try {
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(focusNote=>{
              focusNote.refresh()
            })
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "refreshCardsAndAncestorsAndDescendants":
        try {
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(focusNote=>{
              focusNote.refreshAll()
            })
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "referenceTestIfIdInCurrentDoc":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入文献号",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                if (buttonIndex == 1) {
                  let refNum = alert.textFieldAtIndex(0).text
                  let currentDocmd5 = MNUtil.currentDocmd5
                  if (referenceIds.hasOwnProperty(currentDocmd5)) {
                    if (referenceIds[currentDocmd5].hasOwnProperty(refNum)) {
                      MNUtil.showHUD("["+refNum+"] 与「" + MNNote.new(referenceIds[currentDocmd5][refNum]).noteTitle + "」绑定")
                    } else {
                      MNUtil.showHUD("["+refNum+"] 未进行 ID 绑定")
                    }
                  } else {
                    MNUtil.showHUD("当前文档并未开始绑定 ID")
                  }
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceStoreOneIdForCurrentDocByFocusNote":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入文献号",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                if (buttonIndex == 1) {
                  let refNum = alert.textFieldAtIndex(0).text
                  let refId = focusNote.noteId
                  let currentDocmd5 = MNUtil.currentDocmd5
                  if (referenceIds.hasOwnProperty(currentDocmd5)) {
                    referenceIds[currentDocmd5][refNum] = refId
                  } else {
                    referenceIds[currentDocmd5] = {}
                    referenceIds[currentDocmd5][refNum] = refId
                  }
                  MNUtil.showHUD("Save: [" + refNum + "] -> " + refId);
                  toolbarConfig.save("MNToolbar_referenceIds")
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceStoreOneIdForCurrentDoc":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "绑定参考文献号和对应文献卡片 ID",
          "格式：num@ID\n比如：1@11-22--33",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let input = alert.textFieldAtIndex(0).text
                if (buttonIndex == 1) {
                  toolbarUtils.referenceStoreOneIdForCurrentDoc(input)
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceStoreIdsForCurrentDoc":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "绑定参考文献号和对应文献卡片 ID",
          "格式：num@ID\n比如：1@11-22--33\n\n多个 ID 之间用\n- 中文分号；\n- 英文分号;\n- 中文逗号，\n- 英文逗号,\n之一隔开",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let idsArr = toolbarUtils.splitStringByFourSeparators(alert.textFieldAtIndex(0).text)
                if (buttonIndex == 1) {
                  idsArr.forEach(id=>{
                    toolbarUtils.referenceStoreOneIdForCurrentDoc(id)
                  })
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceStoreIdsForCurrentDocFromClipboard":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "确定要从剪切板导入所有参考文献 ID 吗？",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            if (buttonIndex == 1) {
              try {
                MNUtil.undoGrouping(()=>{
                  let idsArr = toolbarUtils.splitStringByFourSeparators(MNUtil.clipboardText)
                  idsArr.forEach(id=>{
                    toolbarUtils.referenceStoreOneIdForCurrentDoc(id)
                  })
                })
              } catch (error) {
                MNUtil.showHUD(error);
              }
            }
          }
        )
        break;
      case "referenceExportReferenceIdsToClipboard":
        MNUtil.copy(
          JSON.stringify(referenceIds, null, 2)
        )
        MNUtil.showHUD("Copy successfully!")
        break;
      case "referenceExportReferenceIdsToFile":
        // 导出到 .JSON 文件
        path = MNUtil.cacheFolder+"/exportReferenceIds.json"
        MNUtil.writeText(path, JSON.stringify(referenceIds, null, 2))
        UTI = ["public.json"]
        MNUtil.saveFile(path, UTI)
        break;
      case "referenceInputReferenceIdsFromClipboard":
        // MNUtil.copy(
        //   JSON.stringify(referenceIds, null, 2)
        // )
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "确定要从剪切板导入所有参考文献 ID 吗？",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            if (buttonIndex == 1) {
              try {
                MNUtil.undoGrouping(()=>{
                  referenceIds = JSON.parse(MNUtil.clipboardText)
                  toolbarConfig.save("MNToolbar_referenceIds")
                })
              } catch (error) {
                MNUtil.showHUD(error);
              }
            }
          }
        )
        break;
      case "referenceInputReferenceIdsFromFile":
        try {
          // MNUtil.undoGrouping(()=>{
            UTI = ["public.json"]
            path = await MNUtil.importFile(UTI)
            referenceIds = MNUtil.readJSON(path)
            toolbarConfig.save("MNToolbar_referenceIds")
          // })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        // MNUtil.copy(
        //   JSON.stringify(referenceIds, null, 2)
        // )
        break;
      case "referenceClearIdsForCurrentDoc":
        try {
          // MNUtil.undoGrouping(()=>{
            currentDocmd5 = MNUtil.currentDocmd5
            currentDocName = MNUtil.currentDocController.document.docTitle
            referenceIds[currentDocmd5] = {}
            toolbarConfig.save("MNToolbar_referenceIds")
            MNUtil.showHUD("已清空文档「"+currentDocName+"」的所有参考文献 ID");
          // })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        // MNUtil.copy(
        //   JSON.stringify(referenceIds, null, 2)
        // )
        break;
      case "referenceStoreIdForCurrentDocByFocusNote":
        try {
          // MNUtil.undoGrouping(()=>{
            let refNum = 0
            let refId = focusNote.noteId
            currentDocmd5 = MNUtil.currentDocmd5
            currentDocName = MNUtil.currentDocController.document.docTitle
            if (referenceIds.hasOwnProperty(currentDocmd5)) {
              referenceIds[currentDocmd5][refNum] = refId
            } else {
              referenceIds[currentDocmd5] = {}
              referenceIds[currentDocmd5][refNum] = refId
            }
            MNUtil.showHUD("文档「" +currentDocName+ "」与 "+refId + "绑定");
            toolbarConfig.save("MNToolbar_referenceIds")
          // })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        // MNUtil.copy(
        //   JSON.stringify(referenceIds, null, 2)
        // )
        break;
      case "referenceAuthorInfoFromClipboard":
        MNUtil.undoGrouping(()=>{
          // let infoHtmlCommentIndex = focusNote.getCommentIndex("个人信息：", true)
          let referenceHtmlCommentIndex = focusNote.getCommentIndex("文献：", true)
          focusNote.appendMarkdownComment(
            MNUtil.clipboardText, referenceHtmlCommentIndex
          )
        })
        break;
      case "referenceAuthorRenewAbbreviation":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(
            focusNote => {
              let authorName = toolbarUtils.getFirstKeywordFromTitle(focusNote.noteTitle)
              let abbreviations = toolbarUtils.getAbbreviationsOfName(authorName)
              abbreviations.forEach(abbreviation => {
                if (!focusNote.noteTitle.includes(abbreviation)) {
                  focusNote.noteTitle += "; " + abbreviation
                }
              })
            }
          )
        })
        break;
      case "renewAuthorNotes":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            for (let i = focusNote.comments.length-1; i >= 0; i--) {
              let comment = focusNote.comments[i]
              if (
                !comment.text ||
                !comment.text.includes("marginnote")
              ) {
                focusNote.removeCommentByIndex(i)
              }
            }
            toolbarUtils.cloneAndMerge(focusNote, "782A91F4-421E-456B-80E6-2B34D402911A")
            focusNote.moveComment(focusNote.comments.length-1,0)
            focusNote.moveComment(focusNote.comments.length-1,0)
            focusNote.moveComment(focusNote.comments.length-1,0)
            focusNote.moveComment(focusNote.comments.length-1,0)
          })
        })
        break 
      case "referencePaperMakeCards":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            if (focusNote.excerptText) {
              toolbarUtils.convertNoteToNonexcerptVersion(focusNote)
            }
            focusNote.note.colorIndex = 15
            if (focusNote.noteTitle.startsWith("【文献：")) {
              // 把  focusNote.noteTitle 开头的【.*】 删掉
              let reg = new RegExp("^【.*】")
              focusNote.noteTitle = focusNote.noteTitle.replace(reg, "【文献：论文】")
            } else {
              focusNote.noteTitle = "【文献：论文】; " + focusNote.noteTitle
            }
            let referenceInfoHtmlCommentIndex = focusNote.getCommentIndex("文献信息：", true)
            if (referenceInfoHtmlCommentIndex == -1) {
              toolbarUtils.cloneAndMerge(focusNote, "F09C0EEB-4FB5-476C-8329-8CC5AEFECC43")
            }
            let paperLibraryNote = MNNote.new("785225AC-5A2A-41BA-8760-3FEF10CF4AE0")
            paperLibraryNote.addChild(focusNote.note)
            focusNote.focusInMindMap(0.5)
          })
        })
        break;
      case "referenceBookMakeCards":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            if (focusNote.excerptText) {
              toolbarUtils.convertNoteToNonexcerptVersion(focusNote)
            }
            focusNote.note.colorIndex = 15
            if (focusNote.noteTitle.startsWith("【文献：")) {
              // 把  focusNote.noteTitle 开头的【.*】 删掉
              let reg = new RegExp("^【.*】")
              focusNote.noteTitle = focusNote.noteTitle.replace(reg, "【文献：书作】")
            } else {
              focusNote.noteTitle = "【文献：书作】; " + focusNote.noteTitle
            }
            let referenceInfoHtmlCommentIndex = focusNote.getCommentIndex("文献信息：", true)
            if (referenceInfoHtmlCommentIndex == -1) {
              toolbarUtils.cloneAndMerge(focusNote, "F09C0EEB-4FB5-476C-8329-8CC5AEFECC43")
            }
            let bookLibraryNote = MNNote.new("49102A3D-7C64-42AD-864D-55EDA5EC3097")
            bookLibraryNote.addChild(focusNote.note)
            focusNote.focusInMindMap(0.5)
          })
        })
        break;
      case "referenceSeriesBookMakeCard":
        try {
          MNUtil.undoGrouping(()=>{
            UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
              "系列书作",
              "输入系列名",
              2,
              "取消",
              ["确定"],
              (alert, buttonIndex) => {
                if (buttonIndex === 1) {
                  let seriesName = alert.textFieldAtIndex(0).text;
                  UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                    "系列号",
                    "",
                    2,
                    "取消",
                    ["确定"],
                    (alertI, buttonIndexI) => {
                      if (buttonIndex == 1) {
                        let seriesNum = alertI.textFieldAtIndex(0).text;
                        try {
                          toolbarUtils.referenceSeriesBookMakeCard(focusNote, seriesName, seriesNum)
                        } catch (error) {
                          MNUtil.showHUD(error);
                        }
                      }
                    }
                  )
                }
              }
            )
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "referenceOneVolumeJournalMakeCards":
        try {
          MNUtil.undoGrouping(()=>{
            let journalVolNum
            let journalName
            if (focusNote.excerptText) {
              toolbarUtils.convertNoteToNonexcerptVersion(focusNote)
            } else {
              focusNote.note.colorIndex = 15
              UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                "整卷期刊",
                "输入期刊名",
                2,
                "取消",
                ["确定"],
                (alert, buttonIndex) => {
                  MNUtil.undoGrouping(()=>{
                    journalName = alert.textFieldAtIndex(0).text;
                    if (buttonIndex === 1) {
                      let journalLibraryNote = MNNote.new("1D83F1FA-E54D-4E0E-9E74-930199F9838E")
                      let findJournal = false
                      let targetJournalNote
                      let focusNoteIndexInTargetJournalNote
                      for (let i = 0; i <= journalLibraryNote.childNotes.length-1; i++) {
                        if (journalLibraryNote.childNotes[i].noteTitle.includes(journalName)) {
                          targetJournalNote = journalLibraryNote.childNotes[i]
                          journalName = toolbarUtils.getFirstKeywordFromTitle(targetJournalNote.noteTitle)
                          findJournal = true
                          break;
                        }
                      }
                      if (!findJournal) {
                        targetJournalNote = MNNote.clone("129EB4D6-D57A-4367-8087-5C89864D3595")
                        targetJournalNote.note.noteTitle = "【文献：期刊】; " + journalName
                        journalLibraryNote.addChild(targetJournalNote.note)
                      }
                      let journalInfoHtmlCommentIndex = focusNote.getCommentIndex("文献信息：", true)
                      if (journalInfoHtmlCommentIndex == -1) {
                        toolbarUtils.cloneAndMerge(focusNote, "1C976BDD-A04D-46D0-8790-34CE0F6671A4")
                      }
                      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                        "卷号",
                        "",
                        2,
                        "取消",
                        ["确定"],
                        (alertI, buttonIndex) => {
                          if (buttonIndex == 1) {
                            journalVolNum = alertI.textFieldAtIndex(0).text;
                            let journalTextIndex = focusNote.getIncludingCommentIndex("- 整卷期刊：", true)
                            // let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
                            let includingHtmlCommentIndex = focusNote.getCommentIndex("包含：", true)
                            focusNote.noteTitle = toolbarUtils.replaceStringStartWithSquarebracketContent(
                              focusNote.noteTitle,
                              "【文献：整卷期刊："+ journalName + " - Vol. "+ journalVolNum + "】"
                            )
                            if (journalTextIndex == -1) {
                              focusNote.appendMarkdownComment("- 整卷期刊：Vol. " + journalVolNum, includingHtmlCommentIndex)
                              focusNote.appendNoteLink(targetJournalNote, "To")
                              focusNote.moveComment(focusNote.comments.length-1,includingHtmlCommentIndex+1)
                            } else {
                              // focusNote.appendNoteLink(targetJournalNote, "To")
                              // focusNote.moveComment(focusNote.comments.length-1,journalTextIndex + 1)
                              focusNote.removeCommentByIndex(journalTextIndex)
                              focusNote.appendMarkdownComment("- 整卷期刊：Vol. " + journalVolNum, journalTextIndex)
                              if (focusNote.getCommentIndex("marginnote4app://note/" + targetJournalNote.noteId) == -1) {
                                focusNote.appendNoteLink(targetJournalNote, "To")
                                focusNote.moveComment(focusNote.comments.length-1,journalTextIndex + 1)
                              }
                            }
                            focusNoteIndexInTargetJournalNote = targetJournalNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                            let singleInfoIndexInTargetJournalNote = targetJournalNote.getIncludingCommentIndex("**单份**")
                            if (focusNoteIndexInTargetJournalNote == -1){
                              targetJournalNote.appendNoteLink(focusNote, "To")
                              targetJournalNote.moveComment(targetJournalNote.comments.length-1,singleInfoIndexInTargetJournalNote)
                            } else {
                              targetJournalNote.moveComment(focusNoteIndexInTargetJournalNote,singleInfoIndexInTargetJournalNote)
                            }
                            // toolbarUtils.sortNoteByVolNum(targetJournalNote, 1)
                            let bookLibraryNote = MNNote.new("49102A3D-7C64-42AD-864D-55EDA5EC3097")
                            MNUtil.undoGrouping(()=>{
                              bookLibraryNote.addChild(focusNote.note)
                              focusNote.focusInMindMap(0.5)
                            })
                          }
                        }
                      )
                    }
                  })
                }
              )
            }
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "referenceBibInfoCopy":
        bibContentArr = []
        focusNotes.forEach(focusNote=>{
          bibContentArr.push(toolbarUtils.extractBibFromReferenceNote(focusNote))
        })
        if (bibContentArr.length > 0) {
          if (bibContentArr.length == 1) {
            bibContent = bibContentArr[0]
            MNUtil.copy(bibContent)
            MNUtil.showHUD("已复制 1 条 .bib 条目到剪贴板")
          } else {
            if (bibContentArr.length > 1) {
              bibContent = bibContentArr.join("\n\n")
              MNUtil.copy(bibContent)
              MNUtil.showHUD("已复制" + bibContentArr.length + "条 .bib 条目到剪贴板")
            }
          }
        }
        break;
      case "referenceBibInfoExport":
        bibContentArr = []
        focusNotes.forEach(focusNote=>{
          bibContentArr.push(toolbarUtils.extractBibFromReferenceNote(focusNote))
        })
        if (bibContentArr.length > 0) {
          if (bibContentArr.length == 1) {
            bibContent = bibContentArr[0]
            MNUtil.copy(bibContent)
            // MNUtil.showHUD("已复制 1 条 .bib 条目到剪贴板")
          } else {
            if (bibContentArr.length > 1) {
              bibContent = bibContentArr.join("\n\n")
              MNUtil.copy(bibContent)
              // MNUtil.showHUD("已复制" + bibContentArr.length + "条 .bib 条目到剪贴板")
            }
          }
          // 导出到 .bib 文件
          let docPath = MNUtil.cacheFolder+"/exportBibItems.bib"
          MNUtil.writeText(docPath, bibContent)
          let UTI = ["public.bib"]
          MNUtil.saveFile(docPath, UTI)
        }
        break;
      case "referenceBibInfoInitialize":
        break;
      case "referenceBibInfoPasteFromClipboard":
        MNUtil.undoGrouping(()=>{
          bibTextIndex = focusNote.getIncludingCommentIndex("- `.bib`")
          if (bibTextIndex !== -1) {
            focusNote.removeCommentByIndex(bibTextIndex)
          }
          let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
          let bibContent = "- `.bib` 条目：\n  ```bib\n  ";
          // 为MNUtil.clipboardText中的每一行增加四个空格的预处理
          let processedClipboardText = MNUtil.clipboardText.replace(/\n/g, "\n  "); // 在每个换行符前添加四个空格
          bibContent += processedClipboardText; // 将处理后的文本添加到bibContent中
          bibContent += "\n  ```"; // 继续构建最终字符串
          focusNote.appendMarkdownComment(bibContent, thoughtHtmlCommentIndex)
        })
        break;
      case "renewJournalNotes":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            focusNote.removeCommentByIndex(0)
            focusNote.removeCommentByIndex(0)
            focusNote.removeCommentByIndex(0)
            focusNote.removeCommentByIndex(0)
            focusNote.removeCommentByIndex(0)
            toolbarUtils.cloneAndMerge(focusNote, "129EB4D6-D57A-4367-8087-5C89864D3595")
            focusNote.moveComment(focusNote.comments.length-1,0)
            focusNote.moveComment(focusNote.comments.length-1,0)
            focusNote.moveComment(focusNote.comments.length-1,0)
            focusNote.moveComment(focusNote.comments.length-1,0)
          })
        })
        break;
      case "renewPublisherNotes":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            focusNote.removeCommentByIndex(0)
            focusNote.removeCommentByIndex(0)
            focusNote.removeCommentByIndex(0)
            focusNote.removeCommentByIndex(0)
            focusNote.removeCommentByIndex(0)
            toolbarUtils.cloneAndMerge(focusNote, "1E34F27B-DB2D-40BD-B0A3-9D47159E68E7")
            focusNote.moveComment(focusNote.comments.length-1,0)
            focusNote.moveComment(focusNote.comments.length-1,0)
            focusNote.moveComment(focusNote.comments.length-1,0)
            focusNote.moveComment(focusNote.comments.length-1,0)
          })
        })
        break;
      case "renewBookSeriesNotes":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            let title = focusNote.noteTitle
            let seriesName = title.match(/【文献：系列书作：(.*) - (\d+)】/)[1]
            let seriesNum = title.match(/【文献：系列书作：(.*) - (\d+)】/)[2]
            // MNUtil.showHUD(seriesName,seriesNum)
            toolbarUtils.referenceSeriesBookMakeCard(focusNote, seriesName, seriesNum)
          })
        })
        break;
      case "renewBookNotes":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            let title = focusNote.noteTitle
            let yearMatch = toolbarUtils.isFourDigitNumber(toolbarUtils.getFirstKeywordFromTitle(title))
            if (yearMatch) {
              // MNUtil.showHUD(toolbarUtils.getFirstKeywordFromTitle(title))
              let year = toolbarUtils.getFirstKeywordFromTitle(title)
              toolbarUtils.referenceYear(focusNote, year)
              focusNote.noteTitle = title.replace("; "+year, "")
            }
          })
        })
        break;
      case "referenceInfoDoiFromClipboard":
        try {
          MNUtil.undoGrouping(()=>{
            const doiRegex = /(?<=doi:|DOI:|Doi:)\s*(\S+)/i; // 正则表达式匹配以 "doi:" 开头的内容，后面可能有空格或其他字符
            const doiMatch = MNUtil.clipboardText.match(doiRegex); // 使用正则表达式进行匹配
            let doi = doiMatch ? doiMatch[1] : MNUtil.clipboardText.trim(); // 如果匹配成功，取出匹配的内容，否则取出原始输入的内容
            let doiTextIndex = focusNote.getIncludingCommentIndex("- DOI", true)
            if (doiTextIndex !== -1) {
              focusNote.removeCommentByIndex(doiTextIndex)
            }
            let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
            focusNote.appendMarkdownComment("- DOI（Digital Object Identifier）："+doi, thoughtHtmlCommentIndex)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "referenceInfoDoiFromTyping":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "增加 Doi",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                userInput = alert.textFieldAtIndex(0).text;
                const doiRegex = /(?<=doi:|DOI:|Doi:)\s*(\S+)/i; // 正则表达式匹配以 "doi:" 开头的内容，后面可能有空格或其他字符
                const doiMatch = userInput.match(doiRegex); // 使用正则表达式进行匹配
                let doi = doiMatch ? doiMatch[1] : userInput.trim(); // 如果匹配成功，取出匹配的内容，否则取出原始输入的内容
                  if (buttonIndex === 1) {
                    let doiTextIndex = focusNote.getIncludingCommentIndex("- DOI", true)
                    if (doiTextIndex !== -1) {
                      focusNote.removeCommentByIndex(doiTextIndex)
                    }
                    let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
                    focusNote.appendMarkdownComment("- DOI（Digital Object Identifier）："+doi, thoughtHtmlCommentIndex)
                  }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceInfoJournal":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "增加期刊",
          "",
          2,
          "取消",
          ["单份","整期/卷"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                journalName = alert.textFieldAtIndex(0).text;
                let journalLibraryNote = MNNote.new("1D83F1FA-E54D-4E0E-9E74-930199F9838E")
                let findJournal = false
                let targetJournalNote
                let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
                let focusNoteIndexInTargetJournalNote
                let singleInfoIndexInTargetJournalNote
                for (let i = 0; i <= journalLibraryNote.childNotes.length-1; i++) {
                  if (journalLibraryNote.childNotes[i].noteTitle.includes(journalName)) {
                    targetJournalNote = journalLibraryNote.childNotes[i]
                    findJournal = true
                    break;
                  }
                }
                if (!findJournal) {
                  targetJournalNote = MNNote.clone("129EB4D6-D57A-4367-8087-5C89864D3595")
                  targetJournalNote.note.noteTitle = "【文献：期刊】; " + journalName
                  journalLibraryNote.addChild(targetJournalNote.note)
                }
                let journalTextIndex = focusNote.getIncludingCommentIndex("- 期刊", true)
                if (journalTextIndex == -1) {
                  focusNote.appendMarkdownComment("- 期刊（Journal）：", thoughtHtmlCommentIndex)
                  focusNote.appendNoteLink(targetJournalNote, "To")
                  focusNote.moveComment(focusNote.comments.length-1,thoughtHtmlCommentIndex+1)
                } else {
                  // focusNote.appendNoteLink(targetJournalNote, "To")
                  // focusNote.moveComment(focusNote.comments.length-1,journalTextIndex + 1)
                  if (focusNote.getCommentIndex("marginnote4app://note/" + targetJournalNote.noteId) == -1) {
                    focusNote.appendNoteLink(targetJournalNote, "To")
                    focusNote.moveComment(focusNote.comments.length-1,journalTextIndex + 1)
                  } else {
                    focusNote.moveComment(focusNote.getCommentIndex("marginnote4app://note/" + targetJournalNote.noteId),journalTextIndex + 1)
                  }
                }
                focusNoteIndexInTargetJournalNote = targetJournalNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                singleInfoIndexInTargetJournalNote = targetJournalNote.getIncludingCommentIndex("**单份**")
                if (focusNoteIndexInTargetJournalNote == -1){
                  targetJournalNote.appendNoteLink(focusNote, "To")
                  if (buttonIndex !== 1) {
                    // 非单份
                    targetJournalNote.moveComment(targetJournalNote.comments.length-1, singleInfoIndexInTargetJournalNote)
                  } 
                } else {
                  if (buttonIndex !== 1) {
                    // 非单份
                    targetJournalNote.moveComment(focusNoteIndexInTargetJournalNote, singleInfoIndexInTargetJournalNote)
                  } else {
                    targetJournalNote.moveComment(focusNoteIndexInTargetJournalNote, targetJournalNote.comments.length-1)
                  }
                }
                // if (buttonIndex == 1) {
                // }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceInfoPublisher":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "增加出版社",
          "",
          2,
          "取消",
          ["单份","系列"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                publisherName = alert.textFieldAtIndex(0).text;
                let publisherLibraryNote = MNNote.new("9FC1044A-F9D2-4A75-912A-5BF3B02984E6")
                let findPublisher = false
                let targetPublisherNote
                let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
                let focusNoteIndexInTargetPublisherNote
                let singleInfoIndexInTargetPublisherNote
                for (let i = 0; i <= publisherLibraryNote.childNotes.length-1; i++) {
                  if (publisherLibraryNote.childNotes[i].noteTitle.includes(publisherName)) {
                    targetPublisherNote = publisherLibraryNote.childNotes[i]
                    findPublisher = true
                    break;
                  }
                }
                if (!findPublisher) {
                  targetPublisherNote = MNNote.clone("1E34F27B-DB2D-40BD-B0A3-9D47159E68E7")
                  targetPublisherNote.note.noteTitle = "【文献：出版社】; " + publisherName
                  publisherLibraryNote.addChild(targetPublisherNote.note)
                }
                let publisherTextIndex = focusNote.getIncludingCommentIndex("- 出版社", true)
                if (publisherTextIndex == -1) {
                  focusNote.appendMarkdownComment("- 出版社（Publisher）：", thoughtHtmlCommentIndex)
                  focusNote.appendNoteLink(targetPublisherNote, "To")
                  focusNote.moveComment(focusNote.comments.length-1,thoughtHtmlCommentIndex+1)
                } else {
                  if (focusNote.getCommentIndex("marginnote4app://note/" + targetPublisherNote.noteId) == -1) {
                    focusNote.appendNoteLink(targetPublisherNote, "To")
                    focusNote.moveComment(focusNote.comments.length-1,publisherTextIndex + 1)
                  } else {
                    focusNote.moveComment(focusNote.getCommentIndex("marginnote4app://note/" + targetPublisherNote.noteId),publisherTextIndex + 1)
                  }
                }
                focusNoteIndexInTargetPublisherNote = targetPublisherNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                singleInfoIndexInTargetPublisherNote = targetPublisherNote.getIncludingCommentIndex("**单份**")
                if (focusNoteIndexInTargetPublisherNote == -1){
                  targetPublisherNote.appendNoteLink(focusNote, "To")
                  if (buttonIndex !== 1) {
                    // 非单份
                    targetPublisherNote.moveComment(targetPublisherNote.comments.length-1, singleInfoIndexInTargetPublisherNote)
                  } 
                } else {
                  if (buttonIndex !== 1) {
                    // 非单份
                    targetPublisherNote.moveComment(focusNoteIndexInTargetPublisherNote, singleInfoIndexInTargetPublisherNote)
                  } else {
                    targetPublisherNote.moveComment(focusNoteIndexInTargetPublisherNote, targetPublisherNote.comments.length-1)
                  }
                }
                // if (buttonIndex == 1) {
                // }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceInfoKeywords":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "增加关键词",
          "若多个关键词，用\n- 中文分号；\n- 英文分号;\n- 中文逗号，\n- 英文逗号,\n之一隔开",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                userInput = alert.textFieldAtIndex(0).text;
                let keywordArr = toolbarUtils.splitStringByFourSeparators(userInput)
                let findKeyword = false
                let targetKeywordNote
                let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
                let focusNoteIndexInTargetKeywordNote
                if (buttonIndex === 1) {
                  let keywordLibraryNote = MNNote.new("3BA9E467-9443-4E5B-983A-CDC3F14D51DA")
                  // MNUtil.showHUD(keywordArr)
                  keywordArr.forEach(keyword=>{
                    findKeyword = false
                    for (let i = 0; i <= keywordLibraryNote.childNotes.length-1; i++) {
                      if (
                        keywordLibraryNote.childNotes[i].noteTitle.includes(keyword) ||
                        keywordLibraryNote.childNotes[i].noteTitle.includes(keyword.toLowerCase())
                      ) {
                        targetKeywordNote = keywordLibraryNote.childNotes[i]
                        findKeyword = true
                        // MNUtil.showHUD("存在！" + targetKeywordNote.noteTitle)
                        // MNUtil.delay(0.5).then(()=>{
                        //   targetKeywordNote.focusInFloatMindMap()
                        // })
                        break;
                      }
                    }
                    if (!findKeyword) {
                      // 若不存在，则添加关键词卡片
                      targetKeywordNote = MNNote.clone("D1EDF37C-7611-486A-86AF-5DBB2039D57D")
                      if (keyword.toLowerCase() !== keyword) {
                        targetKeywordNote.note.noteTitle += "; " + keyword + "; " + keyword.toLowerCase()
                      } else {
                        targetKeywordNote.note.noteTitle += "; " + keyword
                      }
                      keywordLibraryNote.addChild(targetKeywordNote.note)
                    } else {
                      if (targetKeywordNote.noteTitle.includes(keyword)) {
                        if (!targetKeywordNote.noteTitle.includes(keyword.toLowerCase())) {
                          targetKeywordNote.note.noteTitle += "; " + keyword.toLowerCase()
                        }
                      } else {
                        // 存在小写版本，但没有非小写版本
                        // 获取 noteTitle 中 【文献：关键词】部分后面的内容（假设这部分内容是固定的格式）
                        let noteTitleAfterKeywordPrefixPart = targetKeywordNote.noteTitle.split('【文献：关键词】')[1]; // 这会获取到"; xxx; yyy"这部分内容

                        // 在关键词后面添加新的关键词和对应的分号与空格
                        let newKeywordPart = '; ' + keyword; // 添加分号和空格以及新的关键词

                        // 重新组合字符串，把新的关键词部分放到原来位置
                        let updatedNoteTitle = `【文献：关键词】${newKeywordPart}${noteTitleAfterKeywordPrefixPart}`; // 使用模板字符串拼接新的标题

                        // 更新 targetKeywordNote 的 noteTitle 属性或者给新的变量赋值
                        targetKeywordNote.note.noteTitle = updatedNoteTitle; // 如果 noteTitle 是对象的一个属性的话
                      }
                    }
                    // MNUtil.delay(0.5).then(()=>{
                    //   targetKeywordNote.focusInFloatMindMap()
                    // })
                    let keywordTextIndex = focusNote.getIncludingCommentIndex("- 关键词", true)
                    if (keywordTextIndex == -1) {
                      focusNote.appendMarkdownComment("- 关键词（Keywords）：", thoughtHtmlCommentIndex)
                    }
                    let keywordIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + targetKeywordNote.noteId)
                    if (keywordIndexInFocusNote == -1) {
                      // 关键词卡片还没链接过来
                      focusNote.appendNoteLink(targetKeywordNote, "To")
                      let keywordLinksArr = []
                      focusNote.comments.forEach((comment,index)=>{
                        if (
                          comment.text && 
                          (
                            comment.text.includes("- 关键词") ||
                            comment.text.includes("marginnote4app://note/") ||
                            comment.text.includes("marginnote3app://note/")
                          )
                        ) {
                          keywordLinksArr.push(index)
                        }
                      })
                      keywordTextIndex = focusNote.getIncludingCommentIndex("- 关键词", true)
                      let keywordContinuousLinksArr = toolbarUtils.getContinuousSequenceFromNum(keywordLinksArr, keywordTextIndex)
                      focusNote.moveComment(focusNote.comments.length-1,keywordContinuousLinksArr[keywordContinuousLinksArr.length-1]+1)
                    } else {
                      // 已经有关键词链接
                      let keywordLinksArr = []
                      focusNote.comments.forEach((comment,index)=>{
                        if (
                          comment.text && 
                          (
                            comment.text.includes("- 关键词") ||
                            comment.text.includes("marginnote4app://note/") ||
                            comment.text.includes("marginnote3app://note/")
                          )
                        ) {
                          keywordLinksArr.push(index)
                        }
                      })
                      // MNUtil.showHUD(nextBarCommentIndex)
                      keywordTextIndex = focusNote.getIncludingCommentIndex("- 关键词", true)
                      let keywordContinuousLinksArr = toolbarUtils.getContinuousSequenceFromNum(keywordLinksArr, keywordTextIndex)
                      focusNote.moveComment(keywordIndexInFocusNote,keywordContinuousLinksArr[keywordContinuousLinksArr.length-1])
                    }

                    // 处理关键词卡片
                    focusNoteIndexInTargetKeywordNote = targetKeywordNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                    if (focusNoteIndexInTargetKeywordNote == -1){
                      targetKeywordNote.appendNoteLink(focusNote, "To")
                    }
                  })

                  targetKeywordNote.refresh()
                  focusNote.refresh()
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceInfoYear":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "增加年份",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                year = alert.textFieldAtIndex(0).text;
                if (buttonIndex === 1) {
                  toolbarUtils.referenceInfoYear(focusNote, year)
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceGetRelatedReferencesByKeywords":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "根据关键词进行文献筛选",
          "若多个关键词，用\n- 中文分号；\n- 英文分号;\n- 中文逗号，\n- 英文逗号,\n之一隔开",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                userInput = alert.textFieldAtIndex(0).text;
                let keywordArr = toolbarUtils.splitStringByFourSeparators(userInput)
                let findKeyword = false
                let targetKeywordNoteArr = []
                if (buttonIndex === 1) {
                  let keywordLibraryNote = MNNote.new("3BA9E467-9443-4E5B-983A-CDC3F14D51DA")
                  // MNUtil.showHUD(keywordArr)
                  for (let j = 0; j <= keywordArr.length-1; j++) {
                    let keyword = keywordArr[j]
                    findKeyword = false
                    for (let i = 0; i <= keywordLibraryNote.childNotes.length-1; i++) {
                      if (
                        keywordLibraryNote.childNotes[i].noteTitle.includes(keyword) ||
                        keywordLibraryNote.childNotes[i].noteTitle.includes(keyword.toLowerCase())
                      ) {
                        targetKeywordNoteArr.push(keywordLibraryNote.childNotes[i])
                        findKeyword = true
                        break;
                      }
                    }
                    if (!findKeyword) {
                      MNUtil.showHUD("关键词：「" + keyword + "」不存在！")
                      break;
                    } 
                  }
                  
                  try {
                    MNUtil.undoGrouping(()=>{
                      if (findKeyword) {
                        // MNUtil.showHUD(toolbarUtils.findCommonComments(targetKeywordNoteArr, "相关文献："))
                        let idsArr = toolbarUtils.findCommonComments(targetKeywordNoteArr, "相关文献：")
                        if (idsArr.length > 0) {
                          // 找到了共有的链接
                          let resultLibraryNote = MNNote.new("F1FAEB86-179E-454D-8ECB-53C3BB098701")
                          if (!resultLibraryNote) {
                            // 没有的话就放在“关键词库”下方
                            resultLibraryNote = MNNote.new("3BA9E467-9443-4E5B-983A-CDC3F14D51DA")
                          }
                          let findResultNote = false
                          let resultNote
                          let combinations = toolbarUtils.generateArrayCombinations(keywordArr," + "); // 生成所有可能的组合
                          // MNUtil.showHUD(combinations)
                          for (let i = 0; i <= resultLibraryNote.childNotes.length-1; i++) {
                            let childNote = resultLibraryNote.childNotes[i]
                            
                            findResultNote = false; // 用于标记是否找到匹配的笔记
                            
                            // 遍历所有组合进行匹配
                            for (let combination of combinations) {
                              if (childNote.noteTitle.match(/【.*】(.*)/)[1] === combination) { // 这里假设childNote已经定义且存在noteTitle属性
                                resultNote = childNote; // 更新匹配的笔记对象
                                findResultNote = true; // 设置找到匹配的笔记标记为true
                                break; // 如果找到了匹配项则跳出循环
                              }
                            }
                          }
                          // if (!findResultNote){
                          //   MNUtil.showHUD("false")
                          // } else {
                          //   MNUtil.showHUD("true")
                          // }
                          try {
                            if (!findResultNote) {
                              resultNote = MNNote.clone("DE4455DB-5C55-49F8-8C83-68D6D958E586")
                              resultNote.noteTitle = "【根据关键词筛选文献】" + keywordArr.join(" + ")
                              resultLibraryNote.addChild(resultNote.note)
                            } else {
                              // 清空 resultNote 的所有评论
                              // resultNote.comments.forEach((comment, index)=>{
                              //   resultNote.removeCommentByIndex(0)
                              // })
                              for (let i = resultNote.comments.length-1; i >= 0; i--) {
                                focusNote.removeCommentByIndex(i)
                              }
                              // 重新合并模板
                              toolbarUtils.cloneAndMerge(resultNote,"DE4455DB-5C55-49F8-8C83-68D6D958E586")
                            }
                            idsArr.forEach(
                              id => {
                                resultNote.appendNoteLink(MNNote.new(id), "To")
                              }
                            )
                            resultNote.focusInFloatMindMap(0.5)
                          } catch (error) {
                            MNUtil.showHUD(error);
                          }
                        } else {
                          MNUtil.showHUD("没有文献同时有关键词「" + keywordArr.join("; ") + "」")
                        }
                      }
                    })
                  } catch (error) {
                    MNUtil.showHUD(error);
                  }
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceKeywordsAddRelatedKeywords":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "增加相关关键词",
          "若多个关键词，用\n- 中文分号；\n- 英文分号;\n- 中文逗号，\n- 英文逗号,\n之一隔开",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                userInput = alert.textFieldAtIndex(0).text;
                let keywordArr = toolbarUtils.splitStringByFourSeparators(userInput)
                let findKeyword = false
                let targetKeywordNote
                let focusNoteIndexInTargetKeywordNote
                if (buttonIndex === 1) {
                  let keywordLibraryNote = MNNote.new("3BA9E467-9443-4E5B-983A-CDC3F14D51DA")
                  // MNUtil.showHUD(keywordArr)
                  keywordArr.forEach(keyword=>{
                    findKeyword = false
                    for (let i = 0; i <= keywordLibraryNote.childNotes.length-1; i++) {
                      if (
                        keywordLibraryNote.childNotes[i].noteTitle.includes(keyword) ||
                        keywordLibraryNote.childNotes[i].noteTitle.includes(keyword.toLowerCase())
                      ) {
                        targetKeywordNote = keywordLibraryNote.childNotes[i]
                        findKeyword = true
                        // MNUtil.showHUD("存在！" + targetKeywordNote.noteTitle)
                        // MNUtil.delay(0.5).then(()=>{
                        //   targetKeywordNote.focusInFloatMindMap()
                        // })
                        break;
                      }
                    }
                    if (!findKeyword) {
                      // 若不存在，则添加关键词卡片
                      targetKeywordNote = MNNote.clone("D1EDF37C-7611-486A-86AF-5DBB2039D57D")
                      if (keyword.toLowerCase() !== keyword) {
                        targetKeywordNote.note.noteTitle += "; " + keyword + "; " + keyword.toLowerCase()
                      } else {
                        targetKeywordNote.note.noteTitle += "; " + keyword
                      }
                      keywordLibraryNote.addChild(targetKeywordNote.note)
                    } else {
                      if (targetKeywordNote.noteTitle.includes(keyword)) {
                        if (!targetKeywordNote.noteTitle.includes(keyword.toLowerCase())) {
                          targetKeywordNote.note.noteTitle += "; " + keyword.toLowerCase()
                        }
                      } else {
                        // 存在小写版本，但没有非小写版本
                        // 获取 noteTitle 中 【文献：关键词】部分后面的内容（假设这部分内容是固定的格式）
                        let noteTitleAfterKeywordPrefixPart = targetKeywordNote.noteTitle.split('【文献：关键词】')[1]; // 这会获取到"; xxx; yyy"这部分内容

                        // 在关键词后面添加新的关键词和对应的分号与空格
                        let newKeywordPart = '; ' + keyword; // 添加分号和空格以及新的关键词

                        // 重新组合字符串，把新的关键词部分放到原来位置
                        let updatedNoteTitle = `【文献：关键词】${newKeywordPart}${noteTitleAfterKeywordPrefixPart}`; // 使用模板字符串拼接新的标题

                        // 更新 targetKeywordNote 的 noteTitle 属性或者给新的变量赋值
                        targetKeywordNote.note.noteTitle = updatedNoteTitle; // 如果 noteTitle 是对象的一个属性的话
                      }
                    }
                    let keywordIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + targetKeywordNote.noteId)
                    if (keywordIndexInFocusNote == -1) {
                      // 关键词卡片还没链接过来
                      focusNote.appendNoteLink(targetKeywordNote, "To")
                      let keywordLinksArr = []
                      focusNote.comments.forEach((comment,index)=>{
                        if (
                          comment.text && 
                          (
                            comment.text.includes("相关关键词") ||
                            comment.text.includes("marginnote4app://note/") ||
                            comment.text.includes("marginnote3app://note/")
                          )
                        ) {
                          keywordLinksArr.push(index)
                        }
                      })
                      let keywordContinuousLinksArr = toolbarUtils.getContinuousSequenceFromNum(keywordLinksArr, 0)
                      focusNote.moveComment(focusNote.comments.length-1,keywordContinuousLinksArr[keywordContinuousLinksArr.length-1]+1)
                    } else {
                      // 已经有关键词链接
                      let keywordLinksArr = []
                      focusNote.comments.forEach((comment,index)=>{
                        if (
                          comment.text && 
                          (
                            comment.text.includes("相关关键词") ||
                            comment.text.includes("marginnote4app://note/") ||
                            comment.text.includes("marginnote3app://note/")
                          )
                        ) {
                          keywordLinksArr.push(index)
                        }
                      })
                      // MNUtil.showHUD(nextBarCommentIndex)
                      let keywordContinuousLinksArr = toolbarUtils.getContinuousSequenceFromNum(keywordLinksArr, 0)
                      focusNote.moveComment(keywordIndexInFocusNote,keywordContinuousLinksArr[keywordContinuousLinksArr.length-1]+1)
                    }

                    // 处理关键词卡片
                    focusNoteIndexInTargetKeywordNote = targetKeywordNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                    if (focusNoteIndexInTargetKeywordNote == -1){
                      targetKeywordNote.appendNoteLink(focusNote, "To")
                      targetKeywordNote.moveComment(targetKeywordNote.comments.length-1,targetKeywordNote.getCommentIndex("相关文献：", true))
                    } else {
                      targetKeywordNote.moveComment(focusNoteIndexInTargetKeywordNote,targetKeywordNote.getCommentIndex("相关文献：", true))
                    }
                  })
                  targetKeywordNote.refresh()
                  focusNote.refresh()
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceInfoAuthor":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "增加文献作者",
          "若多个作者，用\n- 中文分号；\n- 英文分号;\n- 中文逗号，\n之一隔开", // 因为有些作者是缩写，包含西文逗号，所以不适合用西文逗号隔开
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let userInput = alert.textFieldAtIndex(0).text;
                let authorArr = toolbarUtils.splitStringByThreeSeparators(userInput)
                let findAuthor = false
                let targetAuthorNote
                let referenceInfoHtmlCommentIndex = focusNote.getCommentIndex("文献信息：", true)
                let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
                let focusNoteIndexInTargetAuthorNote
                let paperInfoIndexInTargetAuthorNote
                if (buttonIndex === 1) {
                  let authorLibraryNote = MNNote.new("A67469F8-FB6F-42C8-80A0-75EA1A93F746")
                  // MNUtil.showHUD(authorArr)
                  authorArr.forEach(author=>{
                    findAuthor = false
                    // let possibleAuthorFormatArr = [...new Set(
                    //   Object.values(toolbarUtils.getAbbreviationsOfName(author)).filter(value => value !== "Chinese" && value !== "English")
                    // )];
                    // try {
                      let possibleAuthorFormatArr = [
                        ...new Set(
                          Object.values(
                            toolbarUtils.getAbbreviationsOfName(author)
                          )
                        )
                      ]
                      // MNUtil.showHUD(possibleAuthorFormatArr)
                    // } catch (error) {
                    //   MNUtil.showHUD(error);
                    // }
                    for (let i = 0; i <= authorLibraryNote.childNotes.length-1; i++) {
                      // if (authorLibraryNote.childNotes[i].noteTitle.includes(author)) {
                      //   targetAuthorNote = authorLibraryNote.childNotes[i]
                      //   findAuthor = true
                      //   // MNUtil.showHUD("存在！" + targetAuthorNote.noteTitle)
                      //   // MNUtil.delay(0.5).then(()=>{
                      //   //   targetAuthorNote.focusInFloatMindMap()
                      //   // })
                      //   break;
                      // }
                      let findPossibleAuthor = possibleAuthorFormatArr.some(
                        possibleAuthor => authorLibraryNote.childNotes[i].noteTitle.includes(possibleAuthor)
                      )
                      if (findPossibleAuthor) {
                        targetAuthorNote = authorLibraryNote.childNotes[i]
                        findAuthor = true
                        break;
                      }
                    }
                    if (!findAuthor) {
                      // MNUtil.showHUD(possibleAuthorFormatArr)
                      // 若不存在，则添加作者卡片
                      targetAuthorNote = MNNote.clone("BBA8DDB0-1F74-4A84-9D8D-B04C5571E42A")
                      possibleAuthorFormatArr.forEach(possibleAuthor=>{
                        targetAuthorNote.note.noteTitle += "; " + possibleAuthor
                      })
                      authorLibraryNote.addChild(targetAuthorNote.note)
                    } else {
                      // 如果有的话就把 possibleAuthorFormatArr 里面 targetAuthorNote 的 noteTitle 里没有的加进去
                      for (let possibleAuthor of possibleAuthorFormatArr) {
                        if (!targetAuthorNote.note.noteTitle.includes(possibleAuthor)) {
                          targetAuthorNote.note.noteTitle += "; " + possibleAuthor
                        }
                      }
                    }
                    // MNUtil.delay(0.5).then(()=>{
                    //   targetAuthorNote.focusInFloatMindMap()
                    // })
                    let authorTextIndex = focusNote.getIncludingCommentIndex("- 作者", true)
                    if (authorTextIndex == -1) {
                      // focusNote.appendNoteLink(targetAuthorNote, "To")
                      // focusNote.moveComment(focusNote.comments.length-1,referenceInfoHtmlCommentIndex+1)
                      focusNote.appendMarkdownComment("- 作者（Authors）：", referenceInfoHtmlCommentIndex + 1)
                    }
                    let authorIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + targetAuthorNote.noteId)
                    if (authorIndexInFocusNote == -1) {
                      // 作者卡片还没链接过来
                      focusNote.appendNoteLink(targetAuthorNote, "To")
                      let authorLinksArr = []
                      focusNote.comments.forEach((comment,index)=>{
                        if (
                          comment.text && 
                          (
                            comment.text.includes("- 作者") ||
                            comment.text.includes("marginnote4app://note/") ||
                            comment.text.includes("marginnote3app://note/")
                          )
                        ) {
                          authorLinksArr.push(index)
                        }
                      })
                      let authorContinuousLinksArr = toolbarUtils.getContinuousSequenceFromNum(authorLinksArr, referenceInfoHtmlCommentIndex + 1)
                      focusNote.moveComment(focusNote.comments.length-1,authorContinuousLinksArr[authorContinuousLinksArr.length-1]+1)
                    } else {
                      // focusNote.moveComment(authorTextIndex, referenceInfoHtmlCommentIndex + 1)
                      let authorLinksArr = []
                      focusNote.comments.forEach((comment,index)=>{
                        if (
                          comment.text && 
                          (
                            comment.text.includes("- 作者") ||
                            comment.text.includes("marginnote4app://note/") ||
                            comment.text.includes("marginnote3app://note/")
                          )
                        ) {
                          authorLinksArr.push(index)
                        }
                      })
                      // MNUtil.showHUD(nextBarCommentIndex)
                      let authorContinuousLinksArr = toolbarUtils.getContinuousSequenceFromNum(authorLinksArr, referenceInfoHtmlCommentIndex + 1)
                      focusNote.moveComment(authorIndexInFocusNote,authorContinuousLinksArr[authorContinuousLinksArr.length-1])
                    }

                    // 处理作者卡片
                    focusNoteIndexInTargetAuthorNote = targetAuthorNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                    paperInfoIndexInTargetAuthorNote = targetAuthorNote.getIncludingCommentIndex("**论文**")
                    // let bookInfoIndexIntargetAuthorNote = targetAuthorNote.getIncludingCommentIndex("**书作**")
                    if (focusNoteIndexInTargetAuthorNote == -1){
                      targetAuthorNote.appendNoteLink(focusNote, "To")
                      if (toolbarUtils.getReferenceNoteType(focusNote) == "book") {
                        targetAuthorNote.moveComment(targetAuthorNote.comments.length-1, paperInfoIndexInTargetAuthorNote)
                      }
                    } else {
                      if (toolbarUtils.getReferenceNoteType(focusNote) == "book") {
                        if (focusNoteIndexInTargetAuthorNote > paperInfoIndexInTargetAuthorNote) {
                          targetAuthorNote.moveComment(focusNoteIndexInTargetAuthorNote, paperInfoIndexInTargetAuthorNote)
                        }
                      }
                    }
                  })

                  targetAuthorNote.refresh()
                  focusNote.refresh()
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceInfoInputRef":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "增加引用样式",
          "即文献的参考文献部分对该文献的具体引用样式",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let referenceContent = toolbarUtils.extractRefContentFromReference(alert.textFieldAtIndex(0).text)
                referenceContent = toolbarUtils.formatEnglishStringPunctuationSpace(referenceContent)
                  if (buttonIndex == 1) {
                    let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
                    let refTextIndex = focusNote.getIncludingCommentIndex("- 引用样式", true)
                    if (refTextIndex == -1) {
                      focusNote.appendMarkdownComment("- 引用样式：", thoughtHtmlCommentIndex)
                      focusNote.appendMarkdownComment(referenceContent, thoughtHtmlCommentIndex+1)
                    } else {
                      focusNote.appendMarkdownComment(referenceContent, refTextIndex+1)
                    }
                  }
                }
              )
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceInfoRefFromInputRefNum":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入文献号",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                if (buttonIndex == 1) {
                  if (focusNote.noteTitle !== "") {
                    MNUtil.showHUD("选错卡片了！应该选参考文献引用的摘录卡片！")
                  } else {
                    let referenceContent = toolbarUtils.extractRefContentFromReference(focusNote.excerptText)
                    referenceContent = toolbarUtils.formatEnglishStringPunctuationSpace(referenceContent)
                    let refNum = alert.textFieldAtIndex(0).text
                    if (refNum == 0) {
                      MNUtil.showHUD("当前文档没有绑定卡片 ID")
                    } else {
                      currentDocmd5 = MNUtil.currentDocmd5
                      let targetNoteId = referenceIds[currentDocmd5]?referenceIds[currentDocmd5][refNum]:undefined
                      if (targetNoteId == undefined) {
                        MNUtil.showHUD("卡片 ID 还没绑定")
                      } else {
                        let targetNote = MNNote.new(targetNoteId)
                        let thoughtHtmlCommentIndex = targetNote.getCommentIndex("相关思考：", true)
                        let refTextIndex = targetNote.getCommentIndex("- 引用样式：", true)
                        if (refTextIndex == -1) {
                          targetNote.appendMarkdownComment("- 引用样式：", thoughtHtmlCommentIndex)
                          targetNote.merge(focusNote)
                          targetNote.appendMarkdownComment(referenceContent)
                          targetNote.moveComment(targetNote.comments.length-1,thoughtHtmlCommentIndex+1)
                          targetNote.moveComment(targetNote.comments.length-1,thoughtHtmlCommentIndex+2)
                        } else {
                          targetNote.merge(focusNote)
                          targetNote.appendMarkdownComment(referenceContent)
                          targetNote.moveComment(targetNote.comments.length-1,refTextIndex+1)
                          targetNote.moveComment(targetNote.comments.length-1,refTextIndex+2)
                        }
                      }
                    }
                  }
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceInfoRefFromFocusNote":
        try {
          MNUtil.undoGrouping(()=>{
            if (focusNote.noteTitle !== "") {
              MNUtil.showHUD("选错卡片了！应该选参考文献引用的摘录卡片！")
            } else {
              let referenceContent = toolbarUtils.extractRefContentFromReference(focusNote.excerptText)
              referenceContent = toolbarUtils.formatEnglishStringPunctuationSpace(referenceContent)
              let refNum = toolbarUtils.extractRefNumFromReference(focusNote.excerptText)
              if (refNum == 0) {
                MNUtil.showHUD("当前文档没有绑定卡片 ID")
              } else {
                currentDocmd5 = MNUtil.currentDocmd5
                let targetNoteId = referenceIds[currentDocmd5]?referenceIds[currentDocmd5][refNum]:undefined
                if (targetNoteId == undefined) {
                  MNUtil.showHUD("卡片 ID 还没绑定")
                } else {
                  let targetNote = MNNote.new(targetNoteId)
                  let thoughtHtmlCommentIndex = targetNote.getCommentIndex("相关思考：", true)
                  let refTextIndex = targetNote.getCommentIndex("- 引用样式：", true)
                  if (refTextIndex == -1) {
                    targetNote.appendMarkdownComment("- 引用样式：", thoughtHtmlCommentIndex)
                    targetNote.merge(focusNote)
                    targetNote.appendMarkdownComment(referenceContent)
                    targetNote.moveComment(targetNote.comments.length-1,thoughtHtmlCommentIndex+1)
                    targetNote.moveComment(targetNote.comments.length-1,thoughtHtmlCommentIndex+2)
                  } else {
                    targetNote.merge(focusNote)
                    targetNote.appendMarkdownComment(referenceContent)
                    targetNote.moveComment(targetNote.comments.length-1,refTextIndex+1)
                    targetNote.moveComment(targetNote.comments.length-1,refTextIndex+2)
                  }
                }
              }
            }
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "cardCopyNoteId":
        MNUtil.copy(focusNote.noteId)
        MNUtil.showHUD(focusNote.noteId)
        break;
      case "findDuplicateTitles":
        const repeatedTitles = toolbarUtils.findDuplicateTitles(focusNote.childNotes);
        MNUtil.showHUD(repeatedTitles);
        if (repeatedTitles.length > 0) {
          MNUtil.copy(repeatedTitles[0]);
        }
        break;
      case "moveLastLinkToProof":
        let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
        MNUtil.undoGrouping(()=>{
          focusNote.moveComment(focusNote.comments.length-1,thoughtHtmlCommentIndex)
        })
        break;
      case "moveLastCommentToProof":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            toolbarUtils.moveLastCommentToProof(focusNote)
          })
        })
        break;
      case "moveLastCommentToThought":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            toolbarUtils.moveLastCommentToThought(focusNote)
          })
        })
        break;
      case "referenceMoveLastCommentToThought":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            toolbarUtils.referenceMoveLastCommentToThought(focusNote)
          })
        })
        break;
      case "moveLastTwoCommentsToProof":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            toolbarUtils.moveLastTwoCommentsToProof(focusNote)
          })
        })
        break;
      case "moveLastTwoCommentsToThought":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            toolbarUtils.moveLastTwoCommentsToThought(focusNote)
          })
        })
        break;
      case "moveLastTwoCommentsInBiLinkNotesToThought":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            toolbarUtils.moveLastTwoCommentsInBiLinkNotesToThought(focusNote)
          })
        })
        break;
      case "referenceMoveLastTwoCommentsToThought":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            toolbarUtils.referenceMoveLastTwoCommentsToThought(focusNote)
          })
        })
        break;
      case "addThoughtPointAndMoveLastCommentToThought":
        try {
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(focusNote=>{
              toolbarUtils.addThoughtPoint(focusNote)
              toolbarUtils.moveLastCommentToThought(focusNote)
            })
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "referenceAddThoughtPointAndMoveLastCommentToThought":
        try {
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(focusNote=>{
              toolbarUtils.referenceAddThoughtPoint(focusNote)
              toolbarUtils.referenceMoveLastCommentToThought(focusNote)
            })
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "copyWholeTitle":
        copyTitlePart = focusNote.noteTitle
        MNUtil.copy(copyTitlePart)
        MNUtil.showHUD(copyTitlePart)
        break;
      case "copyTitleSecondPart":
        if ([2, 3, 9, 10, 15].includes(focusNoteColorIndex)) {
          copyTitlePart = focusNote.noteTitle.match(/【.*】(.*)/)[1]
          MNUtil.copy(copyTitlePart)
          MNUtil.showHUD(copyTitlePart)
        }
        break;
      case "copyTitleFirstKeyword":
        if ([2, 3, 9, 10, 15].includes(focusNoteColorIndex)) {
          copyTitlePart = focusNote.noteTitle.match(/【.*】;\s*([^;]*?)(?:;|$)/)[1]
          MNUtil.copy(copyTitlePart)
          MNUtil.showHUD(copyTitlePart)
        }
        break;
      case "copyTitleFirstQuoteContent":
        if ([0,1,4].includes(focusNoteColorIndex)) {
          if (focusNoteColorIndex == 1) {
            copyTitlePart = focusNote.noteTitle.match(/“(.*)”相关.*/)[1]
          } else {
            copyTitlePart = focusNote.noteTitle.match(/“(.*)”：“.*”相关.*/)[1]
          }
          MNUtil.copy(copyTitlePart)
          MNUtil.showHUD(copyTitlePart)
        }
        break;
      case "copyTitleSecondQuoteContent":
        if ([0,1,4].includes(focusNoteColorIndex)) {
          if (focusNoteColorIndex == 1) {
            copyTitlePart = focusNote.noteTitle.match(/“(.*)”相关.*/)[1]
          } else {
            copyTitlePart = focusNote.noteTitle.match(/“.*”：“(.*)”相关.*/)[1]
          }
          MNUtil.copy(copyTitlePart)
          MNUtil.showHUD(copyTitlePart)
        }
        break;
      case "pasteInTitle":
        // MNUtil.undoGrouping(()=>{
        //   focusNote.noteTitle = MNUtil.clipboardText
        // })
        // focusNote.refreshAll()
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            focusNote.noteTitle = MNUtil.clipboardText
            focusNote.refreshAll()
          })
        })
        break;
      case "pasteAfterTitle":
        // MNUtil.undoGrouping(()=>{
        //   focusNote.noteTitle = focusNote.noteTitle + "; " + MNUtil.clipboardText
        // })
        // focusNote.refreshAll()
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            focusNote.noteTitle = focusNote.noteTitle + "; " + MNUtil.clipboardText
            focusNote.refreshAll()
          })
        })
        break;
      case "extractTitle":
        if (focusNote.noteTitle.match(/【.*】.*/)) {
          MNUtil.copy(focusNote.noteTitle.match(/【.*】;?(.*)/)[1])
          MNUtil.showHUD(focusNote.noteTitle.match(/【.*】;?(.*)/)[1])
        }
        break;
      case "convertNoteToNonexcerptVersion":
        // MNUtil.showHUD("卡片转化为非摘录版本")
        try {
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(focusNote=>{
              if (focusNote.excerptText) {
                focusNote.toNoExceptVersion()
              }
            })
          })
        } catch (error) {
          MNUtil.showHUD(error)
        }
        break;
      case "ifExceptVersion":
        if (focusNote.excerptText) {
          MNUtil.showHUD("摘录版本")
        } else {
          MNUtil.showHUD("非摘录版本")
        }
        break;
      case "showColorIndex":
        MNUtil.showHUD("ColorIndex: " + focusNote.note.colorIndex)
        break;
      case "showCommentType":
        let focusNoteComments = focusNote.comments
        let chosenComment = focusNoteComments[des.index-1]
        MNUtil.showHUD("CommentType: " + chosenComment.type)
        break;
      case "convetHtmlToMarkdown":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.convetHtmlToMarkdown(focusNote)
          })
        } catch (error) {
          MNUtil.showHUD(error)
        }
        break;
      case "linksConvertToMN4Type":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              toolbarUtils.linksConvertToMN4Type(focusNote)
            })
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "addThought":
        MNUtil.undoGrouping(()=>{
          try {
            toolbarUtils.addThought(focusNotes)
          } catch (error) {
            MNUtil.showHUD(error)
          }
        })
        break;
      case "addThoughtPoint":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              toolbarUtils.addThoughtPoint(focusNote)
            })
          } catch (error) {
            MNUtil.showHUD(error)
          }
        })
        break;
      case "referenceAddThoughtPoint":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              toolbarUtils.referenceAddThoughtPoint(focusNote)
            })
          } catch (error) {
            MNUtil.showHUD(error)
          }
        })
        break;
      case "moveUpThoughtPoints":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              toolbarUtils.moveUpThoughtPoints(focusNote)
            })
          } catch (error) {
            MNUtil.showHUD(error)
          }
        })
        break;
      case "referenceMoveUpThoughtPoints":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              toolbarUtils.referenceMoveUpThoughtPoints(focusNote)
            })
          } catch (error) {
            MNUtil.showHUD(error)
          }
        })
        break;
      case "clearContentKeepMarkdownText":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.clearContentKeepMarkdownText(focusNote)
          })
        } catch (error) {
          MNUtil.showHUD(error)
        }
        break;
      case "clearAllLinks":
        try {
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(focusNote=>{
              // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
              for (let i = focusNote.comments.length-1; i >= 0; i--) {
                let comment = focusNote.comments[i]
                if (
                  comment.type == "TextNote" &&
                  (
                    comment.text.includes("marginnote3") ||
                    comment.text.includes("marginnote4")
                  )
                ) {
                  focusNote.removeCommentByIndex(i)
                }
              }
            })
          })
        } catch (error) {
          MNUtil.showHUD(error)
        }
        break;
      case "clearAllFailedMN3Links":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              toolbarUtils.linksConvertToMN4Type(focusNote)
              // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
              for (let i = focusNote.comments.length-1; i >= 0; i--) {
                let comment = focusNote.comments[i]
                if (
                  comment.type == "TextNote" &&
                  comment.text.includes("marginnote3app://note/")
                ) {
                  focusNote.removeCommentByIndex(i)
                }
              }
            })
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "clearAllFailedLinks":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              toolbarUtils.clearAllFailedLinks(focusNote)
            })
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "reappendAllLinksInNote":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              toolbarUtils.reappendAllLinksInNote(focusNote)
            })
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "mergeInParentAndReappendAllLinks":
        MNUtil.undoGrouping(()=>{
          try {
            focusNote.mergeInto(focusNote.parentNote)
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "clearContentKeepExcerptAndHandwritingAndImage":
        try {
          MNUtil.undoGrouping(()=>{
            MNUtil.copy(focusNote.noteTitle)
            focusNote.noteTitle = ""
            // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
            for (let i = focusNote.comments.length-1; i >= 0; i--) {
              let comment = focusNote.comments[i]
              if (
                (comment.type == "TextNote")
                ||
                (comment.type == "HtmlNote")
              ) {
                focusNote.removeCommentByIndex(i)
              }
            }
          })
        } catch (error) {
          MNUtil.showHUD(error)
        }
        break;
      case "clearContentKeepExcerptWithTitle":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(
              focusNote=>{
                 // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
                for (let i = focusNote.comments.length-1; i >= 0; i--) {
                  let comment = focusNote.comments[i]
                  if (
                    (comment.type !== "LinkNote")
                  ) {
                    focusNote.removeCommentByIndex(i)
                  }
                }
              }
            )
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "clearContentKeepExcerpt":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(
              focusNote=>{
                MNUtil.copy(focusNote.noteTitle)
                focusNote.noteTitle = ""
                // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
                for (let i = focusNote.comments.length-1; i >= 0; i--) {
                  let comment = focusNote.comments[i]
                  if (
                    (comment.type !== "LinkNote")
                  ) {
                    focusNote.removeCommentByIndex(i)
                  }
                }
              }
            )
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "clearContentKeepHandwritingAndImage":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(
              focusNote=>{
                MNUtil.copy(focusNote.noteTitle)
                focusNote.noteTitle = ""
                // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
                for (let i = focusNote.comments.length-1; i >= 0; i--) {
                  let comment = focusNote.comments[i]
                  if (
                    (comment.type !== "PaintNote")
                  ) {
                    focusNote.removeCommentByIndex(i)
                  }
                }
              }
            )
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "clearContentKeepHtmlText":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(
              focusNote=>{
                MNUtil.copy(focusNote.noteTitle)
                focusNote.noteTitle = ""
                // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
                for (let i = focusNote.comments.length-1; i >= 0; i--) {
                  let comment = focusNote.comments[i]
                  if (
                    (comment.type !== "HtmlNote")
                  ) {
                    focusNote.removeCommentByIndex(i)
                  }
                }
              }
            )
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "clearContentKeepText":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(
              focusNote=>{
                MNUtil.copy(focusNote.noteTitle)
                focusNote.noteTitle = ""
                // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
                for (let i = focusNote.comments.length-1; i >= 0; i--) {
                  let comment = focusNote.comments[i]
                  if (
                    (comment.type !== "HtmlNote") &&
                    (comment.type !== "TextNote") 
                  ) {
                    focusNote.removeCommentByIndex(i)
                  }
                }
              }
            )
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "addTopic":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.addTopic(focusNote)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "addTemplate":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.addTemplate(focusNote,focusNoteColorIndex)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "achieveCards":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.achieveCards(focusNote)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "renewCards":
        try {
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(focusNote=>{
              toolbarUtils.renewCards(focusNote)
            })
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "changeChildNotesPrefix":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.changeChildNotesPrefix(focusNote)
            focusNote.descendantNodes.descendant.forEach(descendantNote => {
              if ([0, 1, 4].includes(descendantNote.note.colorIndex)) {
                try {
                  // MNUtil.undoGrouping(()=>{
                    toolbarUtils.changeChildNotesPrefix(descendantNote)
                  // })
                } catch (error) {
                  MNUtil.showHUD(error);
                }
              }
            })
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "renewChildNotesPrefix":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.renewChildNotesPrefix(focusNote)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "moveUpLinkNotes":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.moveUpLinkNotes(focusNotes)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "renewProof":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.renewProof(focusNotes)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "hideAddonBar":
        MNUtil.postNotification("toggleMindmapToolbar", {target:"addonBar"})
        break;
      case "moveProofToMethod":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入方法数",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let methodNum = alert.textFieldAtIndex(0).text;
                let findMethod = false
                if (buttonIndex == 1) {
                  for (let i = 0; i < focusNote.comments.length; i++) {
                    let comment = focusNote.comments[i];
                    if (
                      comment.text &&
                      comment.text.startsWith("<span") &&
                      comment.text.includes("方法"+toolbarUtils.numberToChinese(methodNum))
                    ) {
                      findMethod = true
                      break
                    }
                  }
                  if (!findMethod) {
                    MNUtil.showHUD("没有此方法！")
                  } else {
                    toolbarUtils.moveProofToMethod(focusNote,methodNum)
                  }
                }
              })
            } catch (error) {
              MNUtil.showHUD(error)
            }
          }
        )
        break
      case "addToReview":
        focusNotes.forEach(focusNote=>{
          focusNote.addToReview()
        })
        break;
      case "TemplateMakeNotes":
        MNUtil.undoGrouping(()=>{
          try {
            if (self.preprocessMode) {
              focusNotes.forEach(focusNote=>{
                toolbarUtils.TemplateMakeNote(focusNote)
                if (focusNote.getNoteTypeZh()=="顶层" || focusNote.getNoteTypeZh()=="归类") {
                  focusNote.descendantNodes.descendant.forEach(descendantNote => {
                    toolbarUtils.TemplateMakeNote(descendantNote)
                  })
  
                  focusNote.focusInMindMap(0.5)
                }
              })
            } else {
              focusNotes.forEach(focusNote=>{
                toolbarUtils.TemplateMakeNote(focusNote)
                focusNote.addToReview()
                if (focusNote.getNoteTypeZh()=="顶层" || focusNote.getNoteTypeZh()=="归类") {
                  focusNote.descendantNodes.descendant.forEach(descendantNote => {
                    toolbarUtils.TemplateMakeNote(descendantNote)
                  })
                  focusNote.focusInMindMap(0.5)
                }
              })
            }
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "makeCards":
        MNUtil.undoGrouping(()=>{
          try {
            // focusNotes.forEach(focusNote=>{
            for (let i = 0; i < focusNotes.length; i++) {
              focusNote = focusNotes[i]
              /* 初始化 */
              let ifParentNoteChosen = false

              toolbarUtils.renewCards(focusNote)

              /* 先将卡变成非摘录版本 */
              // 如果是非摘录版本的就不处理，否则已有链接会失效（卡片里的失去箭头，被链接的失效，因为此时的卡片被合并了，id 不是原来的 id 了）
              if (focusNote.excerptText) {
                toolbarUtils.convertNoteToNonexcerptVersion(focusNote)
                // 注意此时 focusNote 变成非摘录版本后，下面的代码中 focusNote 就失焦了（因为被合并到其它卡片了）
                // 所以下面的代码不会执行，这就产生了一个效果：
                // 点击第一次：将摘录版本变成非摘录版本
                // 点击第二次：开始制卡
                // 误打误撞产生最佳效果了属于是
                break
              }

              /* 确定卡片类型 */
              switch (focusNoteColorIndex) {
                case 0: // 淡黄色
                  focusNoteType = "classification"
                  break;
                case 2: // 淡蓝色：定义类
                  focusNoteType = "definition"
                  break;
                case 3: // 淡粉色：反例
                  focusNoteType = "antiexample"
                  break;
                case 4: // 黄色：归类
                  focusNoteType = "classification"
                  break;
                case 6: // 蓝色：应用
                  focusNoteType = "application"
                  break;
                case 9: // 深绿色：思想方法
                  focusNoteType = "method"
                  break;
                case 10: // 深蓝色：定理命题
                  focusNoteType = "theorem"
                  break;
                case 13: // 淡灰色：问题
                  focusNoteType = "question"
                  break;
                case 15: // 淡紫色：例子
                  focusNoteType = "example"
                  break;
              }

              /* 预处理 */
              /* 只对淡蓝色、淡粉色、深绿色、深蓝色、淡紫色的卡片进行制卡 */
              if (
                [0, 1, 2, 3, 4, 6, 9, 10, 13, 15].includes(focusNoteColorIndex) &&
                !focusNote.noteTitle.startsWith("【文献")  // 防止文献卡片被制卡
              ) {

                /* 检测父卡片的存在和颜色 */
                parentNote = focusNote.parentNote
                if (parentNote) {
                  // 有父节点
                  // 检测父卡片是否是淡黄色、淡绿色或黄色的，不是的话获取父卡片的父卡片，直到是为止，获取第一次出现特定颜色的父卡片作为 parentNote
                  while (parentNote) {
                    if (parentNote.colorIndex == 0 || parentNote.colorIndex == 1 || parentNote.colorIndex == 4) {
                      ifParentNoteChosen = true
                      break
                    }
                    parentNote = parentNote.parentNote
                  }
                  if (!ifParentNoteChosen) {
                    parentNote = undefined
                  }
                }
              } else {
                MNUtil.showHUD("此卡片不支持制卡！")
                return // 使用 return 来提前结束函数, 避免了在内部函数中使用 break 导致的语法错误。
              }

              let parentNoteType = toolbarUtils.getClassificationNoteTypeByTitle(parentNote.noteTitle)
              if (
                [1,2,3,6,9,10,13,15].includes(focusNoteColorIndex) ||
                !focusNote.noteTitle.match(/“.*”相关.*/) ||
                !focusNote.noteTitle.match(/“.*”：“.*”相关.*/)
              ) {
                switch (parentNoteType) {
                  case "定义":
                    focusNoteType = "definition"
                    focusNote.note.colorIndex = 2
                    break
                  case "命题":
                    focusNoteType = "theorem"
                    focusNote.note.colorIndex = 10
                    break
                  case "反例":
                    focusNoteType = "antiexample"
                    focusNote.note.colorIndex = 3
                    break
                  case "例子":
                    focusNoteType = "example"
                    focusNote.note.colorIndex = 15
                    break
                  case "思想方法":
                    focusNoteType = "method"
                    focusNote.note.colorIndex = 9
                    break
                  case "问题":
                    focusNoteType = "question"
                    focusNote.note.colorIndex = 13
                    break
                  case "应用":
                    focusNoteType = "application"
                    focusNote.note.colorIndex = 6
                    break
                }
              }
              
              if ([2, 3, 6, 9, 10, 13, 15].includes(focusNote.note.colorIndex)) {
                MNUtil.excuteCommand("AddToReview")
              }

              /* 开始制卡 */
              /* 合并第一层模板 */
              toolbarUtils.makeCardsAuxFirstLayerTemplate(focusNote, focusNoteType)
              /* 与父卡片的链接 */
              try {
                // MNUtil.undoGrouping(()=>{
                  toolbarUtils.makeCardsAuxLinkToParentNote(focusNote, focusNoteType, parentNote)
                // })
              } catch (error) {
                MNUtil.showHUD(error);
              }
              /* 修改卡片前缀 */
              toolbarUtils.makeCardsAuxChangefocusNotePrefix(focusNote, parentNote)
              /* 合并第二层模板 */
              toolbarUtils.makeCardsAuxSecondLayerTemplate(focusNote, focusNoteType)

              // bug：先应用再证明时，无反应
              /* 移动“应用：”和链接部分到最下方 */
              toolbarUtils.makeCardsAuxMoveDownApplicationsComments(focusNote)
              /* 
                移动“证明：”到最上方
                但要注意
                - 反例类型的是“反例及证明：”
                - 思想方法类型的是“原理：”
              */
              if (focusNoteType !== "definition" && focusNoteType !== "classification") {
                try {
                  toolbarUtils.makeCardsAuxMoveProofHtmlComment(focusNote,focusNoteType)
                } catch (error) {
                  MNUtil.showHUD(error)
                }
              }
              if (focusNoteType == "classification") {
                MNUtil.undoGrouping(()=>{
                  try {
                    toolbarUtils.changeChildNotesPrefix(focusNote)
                  } catch (error) {
                    MNUtil.showHUD(error);
                  }
                })
              }
              focusNote.refresh()
              // 处理卡片标题空格
              focusNote.noteTitle = Pangu.spacing(focusNote.noteTitle)
              toolbarUtils.removeDuplicateKeywordsInTitle(focusNote)
              
              if (focusNotes.length == 1) {
                try {
                  // MNUtil.undoGrouping(()=>{
                    focusNote.focusInMindMap()
                  // })
                } catch (error) {
                  MNUtil.showHUD(error);
                }
              }
            }
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /* 夏大鱼羊定制 - end */
      case "cloneAndMerge":
      try {
        MNUtil.showHUD("cloneAndMerge")
        targetNoteId= MNUtil.getNoteIdByURL(des.target)
        MNUtil.undoGrouping(()=>{
          try {
          MNNote.getFocusNotes().forEach(focusNote=>{
            toolbarUtils.cloneAndMerge(focusNote.note, targetNoteId)
          })
          } catch (error) {
            MNUtil.showHUD(error)
          }
        })
      } catch (error) {
        MNUtil.showHUD(error)
      }
        break;
      case "cloneAsChildNote":
        MNUtil.showHUD("cloneAsChildNote")
        targetNoteId= MNUtil.getNoteIdByURL(des.target)
        MNUtil.undoGrouping(()=>{
          MNNote.getFocusNotes().forEach(focusNote=>{
            toolbarUtils.cloneAsChildNote(focusNote, targetNoteId)
          })
        })
        break;
      case "noteHighlight":
        let newNote = await toolbarUtils.noteHighlight(des)
        // if ("parentNote" in des) {
        //   await MNUtil.delay(5)
        //   let parentNote = MNNote.new(des.parentNote)

        //   parentNote.focusInMindMap()
        //   MNUtil.showHUD("as childNote of "+parentNote.noteId)
        //   MNUtil.undoGrouping(()=>{
        //     parentNote.addChild(newNote)
        //   })
        // }
        break;
      case "addChildNote":
        MNUtil.showHUD("addChildNote")
        config = {}
        if (des.title) {
          config.title = toolbarUtils.detectAndReplace(des.title)
        }
        if (des.content) {
          config.content = toolbarUtils.detectAndReplace(des.content)
        }
        if (des.markdown) {
          config.markdown = des.content
        }
        color = undefined
        if (des.color) {
          switch (des.color) {
            case "{{parent}}":
              color = focusNote.colorIndex
              break;
            default:
              if (typeof des.color === "number") {
                color = des.color
              }else{
                color = parseInt(des.color.trim())
              }
              break;
          }
          config.color = color
        }
        focusNote.createChildNote(config)
        break;
      case "addBrotherNote":
        MNUtil.showHUD("addBrotherNote")
        config = {}
        if (des.title) {
          config.title = toolbarUtils.detectAndReplace(des.title)
        }
        if (des.content) {
          config.content = toolbarUtils.detectAndReplace(des.content)
        }
        if (des.markdown) {
          config.markdown = des.markdown
        }
        color = undefined
        if (des.color) {
          switch (des.color) {
            case "{{parent}}":
              color = focusNote.parentNote.colorIndex
              break;
            case "{{current}}":
              color = focusNote.colorIndex
              break;
            default:
              if (typeof des.color === "number") {
                color = des.color
              }else{
                color = parseInt(des.color.trim())
              }
              break;
          }
          config.color = color
        }
        focusNote.createBrotherNote(config)
        break;
      case "copy":
        if (des.target) {
          toolbarUtils.copy(des)
        }else{
          toolbarUtils.smartCopy()
        }
        break;
      case "crash":
        MNUtil.showHUD("crash")
        MNUtil.studyView.frame = {x:undefined}
        break;
      case "addComment":
        MNUtil.showHUD("addComment")
        let comment = des.content
        if (comment) {
          let replacedText = toolbarUtils.detectAndReplace(des.content)
          let focusNotes = MNNote.getFocusNotes()
          // MNUtil.copy("text"+focusNotes.length)
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(note => {
              // note.appendTextComment(replacedText)
              note.appendMarkdownComment(replacedText)
            })
          })
        }
        break;
      case "removeComment":
        MNUtil.showHUD("removeComment")
        toolbarUtils.removeComment(des)
        break;
      case "moveComment":
        MNUtil.showHUD("moveComment")
        toolbarUtils.moveComment(des)
        break;
      case "link":
        let linkType = des.linkType ?? "Both"
        let targetUrl = des.target
        if (targetUrl === "{{clipboardText}}") {
          targetUrl = MNUtil.clipboardText
        }
        // MNUtil.showHUD(targetUrl)
        let targetNote = MNNote.new(targetUrl)
        MNUtil.undoGrouping(()=>{
          if (targetNote) {
            MNNote.getFocusNotes().forEach(note=>{
              note.appendNoteLink(targetNote,linkType)
            })
          }else{
            MNUtil.showHUD("Invalid target note!")
          }
        })
        break;
      case "clearContent":
        toolbarUtils.clearContent(des)
        break;
      case "setContent":
          let content = des.content ?? "content"
          let replacedText = toolbarUtils.detectAndReplace(content)
          toolbarUtils.setContent(replacedText, des)
        break;
      case "showInFloatWindow":
        toolbarUtils.showInFloatWindow(des)
        break;
      case "openURL":
        if (des.url) {
          let url = toolbarUtils.detectAndReplace(des.url)
          MNUtil.openURL(url)
          break;
          // MNUtil.showHUD("message")
        }
        MNUtil.showHUD("No valid argument!")
        break;
      case "command":
        let urlPre = "marginnote4app://command/"
        if (des.commands) {
          for (let i = 0; i < des.commands.length; i++) {
            const command = des.commands[i];
            let url = urlPre+command
            MNUtil.openURL(url)
            await MNUtil.delay(0.1)
          }
          break
        }
        if (des.command) {
          let url = urlPre+des.command
          MNUtil.openURL(url)
          break
        }
        MNUtil.showHUD("No valid argument!")
        break
      case "shortcut":
        let shortcutName = des.name
        let url = "shortcuts://run-shortcut?name="+encodeURIComponent(shortcutName)
        if (des.input) {
          url = url+"&input="+encodeURIComponent(des.input)
        }
        if (des.text) {
          let text = toolbarUtils.detectAndReplace(des.text)
          url = url+"&text="+encodeURIComponent(text)
        }
        MNUtil.openURL(url)
        break
      case "replace":
        let mod= des.mod ?? "g"
        let ptt
        if ("reg" in des) {
          ptt = new RegExp(des.reg,mod)
        }else{
          ptt = new RegExp(toolbarUtils.escapeStringRegexp(des.from),mod)
        }
        let range = des.range ?? "currentNotes"
        let targetNotes = toolbarUtils.getNotesByRange(range)
        MNUtil.undoGrouping(()=>{
          targetNotes.forEach(note=>{
            toolbarUtils.replace(note, ptt, des)
          })
        })
        break
      case "mergeText":
        MNUtil.undoGrouping(()=>{
          let range = des.range ?? "currentNotes"
          let targetNotes = toolbarUtils.getNotesByRange(range)
          targetNotes.forEach((note,index)=>{
            let mergedText = toolbarUtils.getMergedText(note, des, index)
            if (mergedText === undefined) {
              return
            }
            switch (des.target) {
              case "excerptText":
                note.excerptText = mergedText
                if ("markdown" in des) {
                  note.excerptTextMarkdown = des.markdown
                }
                break;
              case "title":
                note.noteTitle = mergedText
                break;
              case "newComment":
                if ("markdown" in des && des.markdown) {
                  note.appendMarkdownComment(mergedText)
                }else{
                  note.appendTextComment(mergedText)
                }
                break;
              case "clipboard":
                MNUtil.copy(mergedText)
                break;
              default:
                break;
            }
          })
        })
        if (toolbarUtils.sourceToRemove.length) {
          MNUtil.undoGrouping(()=>{
            // MNUtil.showHUD("remove")
            toolbarUtils.sourceToRemove.forEach(note=>{
              note.excerptText = ""
            })
            MNUtil.delay(1).then(()=>{
              toolbarUtils.sourceToRemove = []
            })
          })
        }
        if (Object.keys(toolbarUtils.commentToRemove).length) {
          MNUtil.undoGrouping(()=>{
            let commentInfos = Object.keys(toolbarUtils.commentToRemove)
            commentInfos.forEach(noteId => {
              let note = MNNote.new(noteId)
              let sortedIndex = MNUtil.sort(toolbarUtils.commentToRemove[noteId],"decrement")
              sortedIndex.forEach(commentIndex=>{
                if (commentIndex < 0) {
                  note.noteTitle = ""
                }else{
                  note.removeCommentByIndex(commentIndex)
                }
              })
            })
            MNUtil.delay(1).then(()=>{
              toolbarUtils.commentToRemove = {}
            })
          })
        }
        break;
      case "chatAI":
        toolbarUtils.chatAI(des)
        break
      case "search":
        toolbarUtils.search(des,button)
        break
      case "addImageComment":
        let source = des.source ?? "photo"
        this.compression = des.compression ?? true
        this.currentNoteId = focusNote.noteId
        switch (source) {
          case "camera":
            this.imagePickerController = UIImagePickerController.new()
            this.imagePickerController.delegate = this  // 设置代理
            this.imagePickerController.sourceType = 1  // 设置图片源为相机
            // this.imagePickerController.allowsEditing = true  // 设置图片源为相册
            MNUtil.studyController.presentViewControllerAnimatedCompletion(this.imagePickerController,true,undefined)
            break;
          case "photo":
            this.imagePickerController = UIImagePickerController.new()
            this.imagePickerController.delegate = this  // 设置代理
            this.imagePickerController.sourceType = 0  // 设置图片源为相册
            // this.imagePickerController.allowsEditing = true  // 设置图片源为相册
            MNUtil.studyController.presentViewControllerAnimatedCompletion(this.imagePickerController,true,undefined)
            break;
          case "file":
            let UTI = ["public.image"]
            let path = await MNUtil.importFile(UTI)
            let imageData = MNUtil.getFile(path)
            MNUtil.showHUD("Import: "+MNUtil.getFileName(path))
            MNUtil.copyImage(imageData)
            focusNote.paste()
            break;
          default:
            MNUtil.showHUD("unknown source")
            break;
        }
        // this.presentViewControllerAnimatedCompletion(this.imagePickerController,true,undefined)
        // 展示图片选择器
        // present(imagePickerController, animated: true, completion: nil)
        break;
      case "focus":
        toolbarUtils.focus(focusNote, des)
        break 
      case "toggleView":
        if ("targets" in des) {
          des.targets.map(target=>{
            MNUtil.postNotification("toggleMindmapToolbar", {target:target})
          })
        }else{
          MNUtil.postNotification("toggleMindmapToolbar", {target:des.target})
        }
        break
      case "export":
        toolbarUtils.export(des)
        // let exportTarget = des.target ?? "auto"
        // let docPath = MNUtil.getDocById(focusNote.note.docMd5).fullPathFileName
        // MNUtil.saveFile(docPath, ["public.pdf"])
        break;
      case "setButtonImage":
        MNUtil.showHUD("setButtonImage...")
        await MNUtil.delay(0.01)
        if ("imageConfig" in des) {
          let config = des.imageConfig
          let keys = Object.keys(config)
          for (let i = 0; i < keys.length; i++) {
            let url = config[keys[i]].url
            let scale = config[keys[i]].scale??3
            MNUtil.showHUD("setButtonImage: "+keys[i])
            toolbarConfig.setImageByURL(keys[i], url,false,scale)
          }
          // await Promise.all(asyncActions)
          MNUtil.postNotification("refreshToolbarButton", {})
        }else{
          MNUtil.showHUD("Missing imageConfig")
        }
        break;
      default:
        MNUtil.showHUD("Not supported yet...")
        break;
    }
    if (button.delay) {
      this.hideAfterDelay()
      toolbarUtils.dismissPopupMenu(button.menu,true)
    }else{
      toolbarUtils.dismissPopupMenu(button.menu)
    }
    if ("onFinish" in des) {
      let finishAction = des.onFinish
      await MNUtil.delay(0.5)
      this.customActionByDes(button, finishAction)
    }
    // if (this.dynamicWindow) {
    //   this.hideAfterDelay()
    // }
    // copyJSON(des)
  } catch (error) {
    toolbarUtils.addErrorLog(error, "customActionByDes")
    // MNUtil.showHUD(error)
  }
}
/**
 * @this {toolbarController}
 * @param {UIButton} button 
 * @param {string} target 
 */
toolbarController.prototype.replaceButtonTo = async function (button,target) {
  button.setTitleForState("", 0)
  button.setTitleForState("", 1)
  button.removeTargetActionForControlEvents(undefined, undefined, 1 << 6);
  button.addTargetActionForControlEvents(this, target, 1 << 6);
  button.addTargetActionForControlEvents(this, "doubleClick:", 1 << 1);

}
/**
 * @this {toolbarController}
 */
toolbarController.prototype.popupReplace = async function (button) {
  await MNUtil.delay(0.01)//需要延迟一下才能拿到当前的popupMenu
  try {
  // MNUtil.showHUD("message")

  let menu = PopupMenu.currentMenu()
  if (menu) {
    let ids = menu.items.map(item=>item.actionString.replace(":", ""))
    // MNUtil.copyJSON(ids)
    let maxButtonNumber = (ids.length == menu.subviews.length)?ids.length:menu.subviews.length-1
    // MNUtil.showHUD("message"+ids.length+";"+menu.subviews.length)
    for (let i = 0; i < maxButtonNumber; i++) {
      let popupButton = menu.subviews[i].subviews[0]
      // MNUtil.showHUD("message"+menu.subviews.length)
      if (!toolbarConfig.getPopupConfig(ids[i])) {
        MNUtil.showHUD("Unknown popup button: "+ids[i])
        continue
      }
      // MNUtil.showHUD("popupReplace:"+ids[i]+":"+toolbarConfig.getPopupConfig(ids[i]).enabled)
      if (toolbarConfig.getPopupConfig(ids[i]).enabled) {
        // MNUtil.showHUD(toolbarConfig.getPopupConfig(ids[i]).target)
        let target = toolbarConfig.getPopupConfig(ids[i]).target
        if (target) {
        try {
          popupButton.menu = menu
          popupButton.target = target
          popupButton.setImageForState(toolbarConfig.imageConfigs[target],0)
          popupButton.setImageForState(toolbarConfig.imageConfigs[target],1)
          if (toolbarConfig.builtinActionKeys.includes(target)) {
            if (target.includes("color")) {
              popupButton.color = parseInt(target.slice(5))
              this.replaceButtonTo(popupButton, "setColor:")
            }else{
              this.replaceButtonTo(popupButton, target+":")
            }
          }else{
            this.replaceButtonTo(popupButton, "customAction:")
          }
        } catch (error) {
          toolbarUtils.addErrorLog(error, "popupReplace", ids[i])
        }
        }else{
          MNUtil.showHUD("message"+ids[i])
          // toolbarUtils.addErrorLog(error, "popupReplace", ids[i])
        }
      }
    }
  }else{
    // MNUtil.showHUD("popupReplaceError")
  }
  } catch (error) {
    toolbarUtils.addErrorLog(error, "popupReplace")
  }
}
/**
 * 检测是否需要弹出菜单,如果需要弹出菜单则返回true,否则返回false
 * @this {toolbarController}
 * @param {UIButton} button 
 * @param {object} des 
 * @returns {boolean}
 */
toolbarController.prototype.customActionMenu =  function (button,des) {
  let buttonX = toolbarUtils.getButtonFrame(button).x//转化成相对于studyview的
  try {
    //先处理menu这个自定义动作
    if (des.action === "menu") {
      this.onClick = true
      if ("autoClose" in des) {
        this.onClick = !des.autoClose
      }
      let menuItems = des.menuItems
      let width = des.menuWidth??200
      if (menuItems.length) {
        var commandTable = menuItems.map(item=>{
          let title = (typeof item === "string")?item:(item.menuTitle ?? item.action)
          return {title:title,object:this,selector:'customActionByMenu:',param:{des:item,button:button}}
        })
        this.commandTables = [commandTable]
        if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
          this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
        }else{
          this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
        }
      }
      return true
    }

    if (des.action === "chatAI" && des.target) {
      if (des.target === "openFloat") {
        MNUtil.postNotification("chatAIOpenFloat", {beginFrame:button.convertRectToView(button.bounds,MNUtil.studyView)})
        return true
      }
      // if (des.target === "openSetting") {
      //   MNUtil.postNotification("chatAIOpenSetting", {endFrame:button.convertRectToView(button.bounds,MNUtil.studyView)})
      //   return true
      // }
      if (des.target === "currentPrompt") {
        MNUtil.postNotification("customChat",{})
        return true
      }
      if (des.target === "menu") {
        this.onClick = true
        let promptKeys = chatAIConfig.getConfig("promptNames")
        let prompts = chatAIConfig.prompts
        var commandTable = promptKeys.map(promptKey=>{
          let title = prompts[promptKey].title.trim()
          return {title:"🚀   "+title,object:this,selector:'customActionByMenu:',param:{des:{action:"chatAI",prompt:title},button:button}}
        })
        let width = 250
        if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
          this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
        }else{
          this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
        }
        return true
      }
    }
    if (des.action === "paste" && des.target && des.target === "menu") {
      this.onClick = true
      var commandTable = [
        {title:"default",object:this,selector:'customActionByMenu:',param:{des:{action:"paste",target:"default"},button:button}},
        {title:"title",object:this,selector:'customActionByMenu:',param:{des:{action:"paste",target:"title"},button:button}},
        {title:"excerpt",object:this,selector:'customActionByMenu:',param:{des:{action:"paste",target:"excerpt"},button:button}},
        {title:"appendTitle",object:this,selector:'customActionByMenu:',param:{des:{action:"paste",target:"appendTitle"},button:button}},
        {title:"appendExcerpt",object:this,selector:'customActionByMenu:',param:{des:{action:"paste",target:"appendExcerpt"},button:button}}
      ]
      let width = 250
      if ((MNUtil.studyView.bounds.width - buttonX) < (width+40)) {
        this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
      }else{
        this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
      }
      return true
    }
    if (des.action === "search" && des.target && des.target === "menu") {
      this.onClick = true
      let names = browserConfig.entrieNames
      let entries = browserConfig.entries
      var commandTable = names.map(name=>{
        let title = entries[name].title
        let engine = entries[name].engine
        return {title:title,object:this,selector:'customActionByMenu:',param:{des:{action:"search",engine:engine},button:button}}
      })
      let width = 250
      if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
        this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
      }else{
        this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
      }
      return true
    }
    if (des.action === "copy" && des.target && des.target === "menu") {
      this.onClick = true
      var commandTable = [
        {title:"selectionText",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"selectionText"},button:button}},
        {title:"selectionImage",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"selectionImage"},button:button}},
        {title:"title",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"title"},button:button}},
        {title:"excerpt",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"excerpt"},button:button}},
        {title:"excerpt (OCR)",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"excerptOCR"},button:button}},
        {title:"notesText",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"notesText"},button:button}},
        {title:"comment",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"comment"},button:button}},
        {title:"noteId",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"noteId"},button:button}},
        {title:"noteURL",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"noteURL"},button:button}},
        {title:"noteMarkdown",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"noteMarkdown"},button:button}},
        {title:"noteMarkdown (OCR)",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"noteMarkdownOCR"},button:button}},
        {title:"noteWithDecendentsMarkdown",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"noteWithDecendentsMarkdown"},button:button}},
      ]
      let width = 250
      if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
        this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
      }else{
        this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
      }
      return true
    }
    if (des.action === "showInFloatWindow" && toolbarUtils.shouldShowMenu(des)) {
      this.onClick = true
      // MNUtil.showHUD("showInFloatWindow")
      var commandTable = [
        {title:"noteInClipboard",object:this,selector:'customActionByMenu:',param:{des:{action:"showInFloatWindow",target:"noteInClipboard"},button:button}},
        {title:"currentNote",object:this,selector:'customActionByMenu:',param:{des:{action:"showInFloatWindow",target:"currentNote"},button:button}},
        {title:"currentChildMap",object:this,selector:'customActionByMenu:',param:{des:{action:"showInFloatWindow",target:"currentChildMap"},button:button}},
        {title:"parentNote",object:this,selector:'customActionByMenu:',param:{des:{action:"showInFloatWindow",target:"parentNote"},button:button}},
        {title:"currentNoteInMindMap",object:this,selector:'customActionByMenu:',param:{des:{action:"showInFloatWindow",target:"currentNoteInMindMap"},button:button}}
      ]
      let width = 250
      if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
        this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
      }else{
        this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
      }
      return true
    }
    if (des.action === "addImageComment" && des.target === "menu") {
      this.onClick = true
      var commandTable = [
        {title:"photo",object:this,selector:'customActionByMenu:',param:{des:{action:"addImageComment",source:"photo"},button:button}},
        {title:"camera",object:this,selector:'customActionByMenu:',param:{des:{action:"addImageComment",source:"camera"},button:button}},
        {title:"file",object:this,selector:'customActionByMenu:',param:{des:{action:"addImageComment",source:"file"},button:button}},
      ]
      let width = 250
      if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
        this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
      }else{
        this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
      }
      return true
    }
    // MNUtil.showHUD("shouldShowMenu: false")
    return false
  } catch (error) {
    // toolbarUtils.addErrorLog(error, "customActionMenu")
    return false
  }
}