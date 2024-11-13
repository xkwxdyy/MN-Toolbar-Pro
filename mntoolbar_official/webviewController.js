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
    self.buttonNumber = 9
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
    self.screenButton.width = 40
    self.screenButton.height = 15
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
    Frame.set(self.screenButton, 0, yBottom-15)
    let initX = 0
    let initY = 0
    for (let index = 0; index < self.maxButtonNumber; index++) {
      initX = 0
      Frame.set(self["ColorButton"+index], xLeft+initX, initY)
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
    MNUtil.showHUD("Action disabled")
    return
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
    MNUtil.currentWindow.becomeFirstResponder()
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
    let selection = MNUtil.currentSelection
    if (selection.onSelection && !selection.isText) {
      let imageData = selection.image
      MNUtil.postNotification("snipasteImage", {imageData:imageData})
    }else{
      let focusNote = MNNote.getFocusNote()
      MNUtil.postNotification("snipasteNote",{noteid:focusNote.noteId})
    }
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
    let foucsNote = MNNote.getFocusNote()
    if (foucsNote) {
      noteId = foucsNote.noteId
    }
    let studyFrame = MNUtil.studyView.bounds
    let beginFrame = self.view.frame
    if (button.menu) {
      beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
    }
    let endFrame
    beginFrame.y = beginFrame.y-10
    if (beginFrame.x+490 > studyFrame.width) {
      endFrame = Frame.gen(beginFrame.x-450, beginFrame.y-10, 450, 500)
      if (beginFrame.y+490 > studyFrame.height) {
        endFrame.y = studyFrame.height-500
      }
    }else{
      endFrame = Frame.gen(beginFrame.x+40, beginFrame.y-10, 450, 500)
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
      let foucsNote = MNNote.getFocusNote()
      if (foucsNote) {
        noteId = foucsNote.noteId
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
      let endFrame = Frame.gen(beginFrame.x-225, beginFrame.y-50, 450, 500)
      endFrame.y = toolbarUtils.constrain(endFrame.y, 0, studyFrame.height-500)
      endFrame.x = toolbarUtils.constrain(endFrame.x, 0, studyFrame.width-500)
      MNUtil.postNotification("openInEditor",{noteId:noteId,beginFrame:beginFrame,endFrame:endFrame})
      return
    }
    let beginFrame = self.view.frame
    beginFrame.y = beginFrame.y-10
    if (beginFrame.x+490 > studyFrame.width) {
      let endFrame = Frame.gen(beginFrame.x-450, beginFrame.y-10, 450, 500)
      if (beginFrame.y+490 > studyFrame.height) {
        endFrame.y = studyFrame.height-500
      }
      MNUtil.postNotification("openInEditor",{noteId:noteId,beginFrame:beginFrame,endFrame:endFrame})
    }else{
      let endFrame = Frame.gen(beginFrame.x+40, beginFrame.y-10, 450, 500)
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
    let des = toolbarConfig.getDescriptionByName("ocr")
    await toolbarUtils.ocr(des)
    if ("onFinish" in des) {
      let finishAction = des.onFinish
      await MNUtil.delay(0.5)
      self.customActionByDes(button, finishAction)
    }
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
    Frame.set(self.view,x,y,40,toolbarUtils.checkHeight(frame.height,self.maxButtonNumber))
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
    Frame.set(self.view,frame.x,frame.y,40,height)
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
  // MNUtil.showHUD("setToolbarButton")
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
    let colorButton
    if (this["ColorButton"+index]) {
      colorButton = this["ColorButton"+index]
    }else{
      this["ColorButton"+index] = UIButton.buttonWithType(0);
      colorButton = this["ColorButton"+index]
      colorButton.height = 40
      colorButton.width = 40
      this["moveGesture"+index] = new UIPanGestureRecognizer(this,"onMoveGesture:")
      colorButton.addGestureRecognizer(this["moveGesture"+index])
      this["moveGesture"+index].view.hidden = false
    }
    colorButton.index = index
    if (actionName.includes("color")) {
      colorButton.color = parseInt(actionName.slice(5))
      this.setColorButtonLayout(colorButton,"setColor:",buttonColor)
    }else if(actionName.includes("custom")){
      this.setColorButtonLayout(colorButton,"customAction:",buttonColor)
    }else{
      this.setColorButtonLayout(colorButton,actionName+":",buttonColor)
    }
    // MNButton.setImage(colorButton, toolbarConfig.imageConfigs[actionName])
    // let image = (actionName in actions)?actions[actionName].image+".png":defaultActions[actionName].image+".png"
    // colorButton.setImageForState(MNUtil.getImage(toolbarConfig.mainPath + `/`+image),0)
    colorButton.setImageForState(toolbarConfig.imageConfigs[actionName],0)
    // self["ColorButton"+index].setTitleForState("",0) 
    // self["ColorButton"+index].contentHorizontalAlignment = 1
  }
  if (this.dynamicToolbar) {
    this.dynamicToolbar.setToolbarButton(actionNames,newActions)
  }
  this.refreshHeight()
  // MNUtil.copy("setToolbarButton")
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
    Frame.set(this.screenButton, 0, yBottom-15)
    this.view.bringSubviewToFront(this.screenButton)

    let initX = 0
    let initY = 0
    for (let index = 0; index < this.buttonNumber; index++) {
      initX = 0
      Frame.set(this["ColorButton"+index], xLeft+initX, initY)
      initY = initY+45
      this["ColorButton"+index].hidden = (initY > yBottom)
    }

}
toolbarController.prototype.checkPopoverController = function () {
  if (this.popoverController) {this.popoverController.dismissPopoverAnimated(true);}
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
    // MNUtil.copyJSON(des)
    if (this.customActionMenu(button,des)) {
      // MNUtil.showHUD("reject")
      //如果返回true则表示菜单弹出已执行，则不再执行下面的代码
      return
    }
    // MNUtil.showHUD("customActionByDes")
    let focusNote = undefined
    let targetNotes = []
    try {
      focusNote = MNNote.getFocusNote()
    } catch (error) {
    }
    // MNUtil.showHUD("message"+(focusNote instanceof MNNote))
    let notebookid = focusNote ? focusNote.notebookId : undefined
    let title,content,color,config
    let targetNoteId
    switch (des.action) {
      case "copy":
        if (des.target || des.content) {
          toolbarUtils.copy(des)
        }else{
          toolbarUtils.smartCopy()
        }
        break;
      case "paste":
        toolbarUtils.paste(des)
        break;
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
      case "ocr":
        await toolbarUtils.ocr(des)
        break;
      case "insertSnippet":
        let textView = toolbarUtils.textView
        if (!textView || textView.hidden) {
          MNUtil.showHUD("No textView")
          break;
        }
        let textContent = toolbarUtils.detectAndReplace(des.content)
        toolbarUtils.insertSnippetToTextView(textContent,textView)
        break;
      case "noteHighlight":
        let newNote = await toolbarUtils.noteHighlight(des)
        newNote.focusInMindMap(0.5)
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
      case "moveNote":
        toolbarUtils.moveNote(des)
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
            case "parent":
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
            case "parent":
              color = focusNote.parentNote.colorIndex
              break;
            case "{{current}}":
            case "current":
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
      case "toggleTextFirst":
        MNUtil.showHUD("toggleTextFirst")
        targetNotes = toolbarUtils.getNotesByRange(des.range ?? "currentNotes")
        MNUtil.undoGrouping(()=>{
          targetNotes.forEach(note=>{
            note.textFirst = !note.textFirst
          })
        })
        break
      case "toggleMarkdown":
        MNUtil.showHUD("toggleMarkdown")
        targetNotes = toolbarUtils.getNotesByRange(des.range ?? "currentNotes")
        MNUtil.undoGrouping(()=>{
          targetNotes.forEach(note=>{
            note.excerptTextMarkdown = !note.excerptTextMarkdown
          })
        })
        break
      case "replace":
        let range = des.range ?? "currentNotes"
        targetNotes = toolbarUtils.getNotesByRange(range)
        if ("steps" in des) {//如果有steps则表示是多步替换,优先执行
          let nSteps = des.steps.length
          MNUtil.undoGrouping(()=>{
            targetNotes.forEach(note=>{
              let content= toolbarUtils._replace_get_content_(note, des)
              for (let i = 0; i < nSteps; i++) {
                let step = des.steps[i]
                let ptt = toolbarUtils._replace_get_ptt_(step)
                content = content.replace(ptt, step.to)
              }
              toolbarUtils._replace_set_content_(note, des, content)
            })
          })
          break;
        }
        //如果没有steps则直接执行
        let ptt = toolbarUtils._replace_get_ptt_(des)
        MNUtil.undoGrouping(()=>{
          targetNotes.forEach(note=>{
            toolbarUtils.replace(note, ptt, des)
          })
        })
        break;
      case "mergeText":
        let noteRange = des.range ?? "currentNotes"
        let targetNotes = toolbarUtils.getNotesByRange(noteRange)
        MNUtil.undoGrouping(()=>{
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
    if (des.action === "insertSnippet" && des.target && des.target === "menu") {
      this.onClick = true
      var commandTable = des.menuItems.map(item => {
        item.action = "insertSnippet"
        return {title:item.menuTitle,object:this,selector:'customActionByMenu:',param:{des:item,button:button}}
      })
      let width = 250
      if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
        this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
      }else{
        this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
      }
      return true
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