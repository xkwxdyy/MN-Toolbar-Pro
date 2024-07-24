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
    self.buttonNumber = 15  // 注意自定义时要改这里的数量！
    if (self.dynamicWindow) {
      self.buttonNumber = 9
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
    MNUtil.showHUD(error)
    // toolbarUtils.copy(error)
  }
  },
  viewWillAppear: function(animated) {
  },
  viewWillDisappear: function(animated) {
  },
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
    for (let index = 0; index < self.buttonNumber; index++) {
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
    // if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
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
    self.view.popoverController = new UIPopoverController(menuController);
    var r = sender.convertRectToView(sender.bounds,studyView);
    self.view.popoverController.presentPopoverFromRect(r, studyView, 1 << 1, true);
  },
  changeOpacityTo:function (opacity) {
    self.view.layer.opacity = opacity
    // self.webAppButton.setTitleForState(`${opacity*100}%`, 0);
  },
  changeScreen: function(sender) {
    let clickDate = Date.now()
    self.checkPopoverController()
    // if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    var commandTable = [
      {title:'🌟 Dynamic',object:self,selector:'toggleDynamic:',param:1.0,checked:toolbarConfig.dynamic},
      {title:'⚙️ Setting',object:self,selector:'setting:',param:1.0}
    ];
    self.view.popoverController = MNUtil.getPopoverAndPresent(sender, commandTable,200)
  },
  toggleDynamic: function () {
try {
  

    // MNUtil.showHUD("message")
    self.onClick = true
    self.checkPopoverController()
    // if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
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
    MNUtil.delay(0.3).then(()=>{
      toolbarUtils.setColor(color)
    })
    if (self.dynamicWindow) {
      self.hideAfterDelay()
    }
  },
  execute: async function (button) {
    let code = toolbarConfig.getExecuteCode()
    toolbarSandbox.execute(code)
  },
  customAction: async function (button) {
    // eval("MNUtil.showHUD('123')")
    // return
    let actionName = toolbarConfig.action[button.index]//这个是key
    let des = toolbarConfig.getDescriptionByName(actionName)

    if (des.action === "menu") {
      self.onClick = true
      if ("autoClose" in des) {
        self.onClick = !des.autoClose
      }
      let menuItems = des.menuItems
      let width = des.menuWidth??200
      if (menuItems.length) {
        var commandTable = menuItems.map(item=>{
          let title = (typeof item === "string")?item:(item.menuTitle ?? item.action)
          return {title:title,object:self,selector:'customActionByMenu:',param:{des:item,button:button}}
        })
        self.commandTables = [commandTable]
        self.view.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
      }
      return
    }
    self.customActionByDes(des)
    // self.customAction(actionName)
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
      if (self.dynamicWindow && (("autoClose" in des) && des.autoClose)) {
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
        self.view.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
      }
      return
    }
    if (self.dynamicWindow && (!("autoClose" in des) || des.autoClose)) {
      self.checkPopoverController()
      self.hideAfterDelay(0.1)
    }
    // MNUtil.copyJSON(des)
    self.commandTables = []
    self.customActionByDes(des)
  },
lastPopover: function (button) {
      self.checkPopoverController()
      self.commandTables.pop()
      let commandTable = self.commandTables.at(-1)
      self.view.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,200,4)
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
    if (button.doubleClick) {
        let focusNote = MNNote.getFocusNote()
        let text = focusNote.noteTitle
        if (text) {
          MNUtil.copy(text)
          MNUtil.showHUD('标题已复制')
        }else{
          MNUtil.showHUD('无标题')
        }
        button.doubleClick = false
      return
    }
    let focusNote = MNNote.getFocusNote()
    if (focusNote.excerptText.trim() || (focusNote.excerptPic && focusNote.excerptPic.paint)) {
      if (focusNote.excerptPic && !focusNote.textFirst && focusNote.excerptPic.paint) {
        MNUtil.copyImage(focusNote.excerptPicData)
        MNUtil.showHUD('摘录图片已复制')
      }else{
        let text = focusNote.excerptText
        MNUtil.copy(text)
        MNUtil.showHUD('摘录文字已复制')
      }
    }else{
      let firstComment = focusNote.comments[0]
      switch (firstComment.type) {
        case "TextNote":
          MNUtil.copy(firstComment.text)
          MNUtil.showHUD('首条评论已复制')
          break;
        case "PaintNote":
          let imageData = MNUtil.getMediaByHash(firstComment.paint)
          MNUtil.copyImage(imageData)
          MNUtil.showHUD('首条评论已复制')
          break;
        case "HtmlNote":
          MNUtil.copy(firstComment.text)
          MNUtil.showHUD('尝试复制该类型评论: '+firstComment.type)
          break;
        case "LinkNote":
          if (firstComment.q_hpic && !focusNote.textFirst && firstComment.q_hpic.paint) {
            MNUtil.copyImage(MNUtil.getMediaByHash(firstComment.q_hpic.paint))
            MNUtil.showHUD('图片已复制')
          }else{
            MNUtil.copy(firstComment.q_htext)
            MNUtil.showHUD('首条评论已复制')
          }
          break;
        default:
          MNUtil.showHUD('暂不支持的评论类型: '+firstComment.type)
          break;
      }
    }
    if (self.dynamicWindow) {
      self.hideAfterDelay()
    }
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
  if (self.dynamicWindow) {
      self.hideAfterDelay()
    }
  },

  searchInEudic:function () {
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
    if (self.dynamicWindow) {
      self.hideAfterDelay()
    }
    
  } catch (error) {
    toolbarUtils.addErrorLog(error, "searchInEudic")
  }
  },
  switchTitleorExcerpt() {
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
    if (self.dynamicWindow) {
      self.hideAfterDelay()
    }
  },
  bigbang: function () {
    self.onClick = true
    let focusNote = MNNote.getFocusNote()
    MNUtil.postNotification("bigbangNote",{noteid:focusNote.noteId})
    if (self.dynamicWindow) {
      self.hideAfterDelay()
    }
  },
  snipaste: function () {
    self.onClick = true
    let focusNote = MNNote.getFocusNote()
    MNUtil.postNotification("snipasteNote",{noteid:focusNote.noteId})
    if (self.dynamicWindow) {
      self.hideAfterDelay()
    }
  },
  chatglm: function () {
    self.onClick = true
    // let focusNote = MNNote.getFocusNote()
    MNUtil.postNotification("customChat",{})
    if (self.dynamicWindow) {
      self.hideAfterDelay()
    }
  },
  search: function () {
    self.onClick = true
    let selectionText = MNUtil.selectionText
    let noteId = undefined
    let focusNote = MNNote.getFocusNote()
    if (focusNote) {
      noteId = focusNote.noteId
    }
    let studyFrame = MNUtil.studyView.bounds
    let beginFrame = self.view.frame
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
      MNUtil.postNotification("searchInBrowser",{text:selectionText,beginFrame:beginFrame,endFrame:endFrame})
    }else{
      MNUtil.postNotification("searchInBrowser",{noteid:noteId,beginFrame:beginFrame,endFrame:endFrame})
    }
    if (self.dynamicWindow) {
      self.hideAfterDelay()
    }
  },
  edit: function (params) {
    let noteId = undefined
    if (self.dynamicWindow && toolbarUtils.currentNoteId) {
      noteId = toolbarUtils.currentNoteId
    }else{
      let focusNote = MNNote.getFocusNote()
      if (focusNote) {
        noteId = focusNote.noteId
      }
    }
    let studyFrame = MNUtil.studyView.bounds
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
  },
  ocr: async function () {
    if (typeof ocrUtils === 'undefined') {
      MNUtil.showHUD("MN Toolbar: Please install 'MN OCR' first!")
      return
    }
    toolbarUtils.ocr()
  },
  setting: function () {
    let self = getToolbarController()
    self.checkPopoverController()
    // if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    try {
    if (!self.settingController) {
      self.settingController = settingController.new();
      self.settingController.toolbarController = self
      self.settingController.mainPath = toolbarConfig.mainPath;
      self.settingController.action = toolbarConfig.action
      // self.settingController.dynamicToolbar = self.dynamicToolbar
      MNUtil.studyView.addSubview(self.settingController.view)
      // toolbarUtils.studyController().view.addSubview(self.settingController.view)
    }
      
    self.settingController.show()
    } catch (error) {
      MNUtil.showHUD(error)
    }
  },
  pasteAsTitle:function (button) {
    self.onClick = true
    let focusNote = MNNote.getFocusNote()
    let text = MNUtil.clipboardText
    MNUtil.undoGrouping(()=>{
      focusNote.noteTitle = text
    })
    if (self.dynamicWindow) {
      self.hideAfterDelay()
    }
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
    if (self.dynamicWindow) {
      self.hideAfterDelay()
    }
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
    if (self.custom) {
      self.customMode = "None"
      self.view.frame = {x:x,y:y,width:40,height:toolbarUtils.checkHeight(self.lastFrame.height,self.buttonNumber)}
      self.currentFrame  = self.view.frame
    }else{
      self.view.frame = {x:x,y:y,width:40,height:toolbarUtils.checkHeight(frame.height,self.buttonNumber)}
      self.currentFrame  = self.view.frame
    }
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
    height = toolbarUtils.checkHeight(height,self.buttonNumber)
    self.view.frame = {x:frame.x,y:frame.y,width:40,height:height}
    self.currentFrame  = self.view.frame
    if (gesture.state === 3) {
      let buttomNumber = Math.floor(height/45)
      // MNUtil.showHUD("message"+buttomNumbers)
      self.view.bringSubviewToFront(self.screenButton)
      let windowState = toolbarConfig.windowState
      if (self.dynamicWindow) {
        windowState.dynamicButton = buttomNumber
        // toolbarConfig.save("MNToolbar_windowState",{open:toolbarConfig.windowState.open,frame:self.view.frame})
      }else{
        windowState.frame = self.view.frame
        windowState.open = true
      }
      toolbarConfig.save("MNToolbar_windowState",windowState)
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
  preFrame.height = toolbarUtils.checkHeight(preFrame.height,this.buttonNumber)
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
    frame.height = toolbarUtils.checkHeight(frame.height,this.buttonNumber)
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
 */
toolbarController.prototype.hideAfterDelay = function (delay = 2) {
  let dynamicController = this
    if (dynamicController.notifyTimer) {
      dynamicController.notifyTimer.invalidate()
    }
    dynamicController.notifyTimer = NSTimer.scheduledTimerWithTimeInterval(delay, false, function () {
      dynamicController.hide()
      // dynamicController.view.hidden = true
      dynamicController.notifyTimer.invalidate()
    })
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
  for (let index = 0; index < this.buttonNumber; index++) {
    let actionName = actionNames[index]
    if (this["ColorButton"+index]) {
    }else{
      this["ColorButton"+index] = UIButton.buttonWithType(0);
      this["moveGesture"+index] = new UIPanGestureRecognizer(this,"onMoveGesture:")
      this["ColorButton"+index].addGestureRecognizer(this["moveGesture"+index])
      this["moveGesture"+index].view.hidden = false
    }
    this["ColorButton"+index].index = index
    if (actionName.includes("color")) {
      this["ColorButton"+index].color = parseInt(actionName.slice(5))
      this.setColorButtonLayout(this["ColorButton"+index],"setColor:",buttonColor)
    }else if(actionName.includes("custom")){
      this.setColorButtonLayout(this["ColorButton"+index],"customAction:",buttonColor)
    }else{
      this.setColorButtonLayout(this["ColorButton"+index],actionName+":",buttonColor)
    }
    // MNButton.setImage(this["ColorButton"+index], toolbarConfig.imageConfigs[actionName])
    // let image = (actionName in actions)?actions[actionName].image+".png":defaultActions[actionName].image+".png"
    // this["ColorButton"+index].setImageForState(MNUtil.getImage(toolbarConfig.mainPath + `/`+image),0)
    this["ColorButton"+index].setImageForState(toolbarConfig.imageConfigs[actionName],0)
    // self["ColorButton"+index].setTitleForState("",0) 
    // self["ColorButton"+index].contentHorizontalAlignment = 1
  }
  if (this.dynamicToolbar) {
    this.dynamicToolbar.setToolbarButton(actionNames,newActions)
  }
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

  let height = 40*this.buttonNumber+40
  let lastFrame = this.view.frame
  if (lastFrame.height > height) {
    lastFrame.height = height
  }
  this.view.frame = lastFrame
  // showHUD("number:"+height)
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
  if (this.view.popoverController) {this.view.popoverController.dismissPopoverAnimated(true);}
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
            toolbarUtils.renewCards(focusNotes)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "changePrefix":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.changePrefix(focusNote)
            focusNote.descendantNodes.descendant.forEach(descendantNote => {
              if ([0, 1, 4].includes(descendantNote.note.colorIndex)) {
                try {
                  // MNUtil.undoGrouping(()=>{
                    toolbarUtils.changePrefix(descendantNote)
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
            focusNotes.forEach(focusNote=>{
              /* 初始化 */
              let ifParentNoteChosen = false

              toolbarUtils.renewCards([focusNote])

              /* 确定卡片类型 */
              switch (focusNoteColorIndex) {
                case 0: // 淡黄色
                  focusNoteType = "outline"
                  break;
                case 2: // 淡蓝色：定义类
                  focusNoteType = "definition"
                  break;
                case 3: // 淡粉色：反例
                  focusNoteType = "antiexample"
                  break;
                case 4: // 黄色
                  focusNoteType = "outline"
                  break;
                case 9: // 深绿色：思想方法
                  focusNoteType = "method"
                  break;
                case 10: // 深蓝色：定理命题
                  focusNoteType = "theorem"
                  break;
                case 15: // 淡紫色：例子
                  focusNoteType = "example"
                  break;
              }

              /* 预处理 */
              /* 只对淡蓝色、淡粉色、深绿色、深蓝色、淡紫色的卡片进行制卡 */
              if ([0, 2, 3, 4, 9, 10, 15].includes(focusNoteColorIndex)) {
                /* 先将卡变成非摘录版本 */
                // 如果是非摘录版本的就不处理，否则已有链接会失效（卡片里的失去箭头，被链接的失效，因为此时的卡片被合并了，id 不是原来的 id 了）
                if (focusNote.excerptText) {
                  toolbarUtils.convertNoteToNonexcerptVersion(focusNote)
                  // 注意此时 focusNote 变成非摘录版本后，下面的代码中 focusNote 就失焦了（因为被合并到其它卡片了）
                  // 所以下面的代码不会执行，这就产生了一个效果：
                  // 点击第一次：将摘录版本变成非摘录版本
                  // 点击第二次：开始制卡
                  // 误打误撞产生最佳效果了属于是
                } else {
                  // 非摘录的话就添加到复习卡组
                  if ([2, 3, 9, 10, 15].includes(focusNoteColorIndex)) {
                    MNUtil.excuteCommand("AddToReview")
                  }
                }

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
                MNUtil.showHUD("不支持对此颜色的卡片进行制卡！")
                return // 使用 return 来提前结束函数, 避免了在内部函数中使用 break 导致的语法错误。
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
              if (focusNoteType !== "definition" && focusNoteType !== "outline") {
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
            })
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
        if (comment) {
          let replacedText = toolbarUtils.detectAndReplace(des.content)
          let focusNotes = MNNote.getFocusNotes()
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(note => {
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
        MNUtil.undoGrouping(()=>{
          let content = des.content ?? "content"
          let replacedText = toolbarUtils.detectAndReplace(content)
          toolbarUtils.setContent(replacedText, des)
        })
        break;
      case "showInFloatWindow":
        let targetNoteid
        switch (des.target) {
          case "{{currentNote}}":
            targetNoteid = MNNote.getFocusNote().noteId
            break;
          case "{{currentChildMap}}":
            targetNoteid = MNUtil.mindmapView.mindmapNodes[0].note.childMindMap.noteId
            break;
          case "{{parentNote}}":
            targetNoteid = MNNote.getFocusNote().parentNote.noteId
            break;
          case "{{currentNoteInMindMap}}":
            let notebookController = MNUtil.notebookController
            let currentNotebookId = notebookController.notebookId
            
            if (!notebookController.view.hidden && notebookController.mindmapView && notebookController.focusNote) {
              targetNoteid = notebookController.focusNote.noteId
            }else{
              let testNote = MNUtil.currentDocController.focusNote
              targetNoteid = testNote.realGroupNoteIdForTopicId(currentNotebookId)
            }
            break;
          default:
            targetNoteid= MNUtil.getNoteIdByURL(des.target)
            break;
        }

        MNNote.focusInFloatMindMap(targetNoteid)
        // toolbarUtils.studyController().focusNoteInFloatMindMapById(targetNoteid)
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
        MNUtil.showHUD("setButtonImage")
        await MNUtil.delay(0.01)
        if ("imageConfig" in des) {
          let config = des.imageConfig
          let keys = Object.keys(config)
          for (let i = 0; i < keys.length; i++) {
            let url = config[keys[i]].url
            let scale = config[keys[i]].scale??3
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
toolbarController.prototype.customActionByDes = async function (des) {//这里actionName指的是key
  try {
    if (!toolbarUtils.checkSubscribe(true)) {
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
      //     "增加期刊",
      //     "",
      //     2,
      //     "取消",
      //     ["确定"],
      //     (alert, buttonIndex) => {
      //       try {
      //         MNUtil.undoGrouping(()=>{
            //     userInput = alert.textFieldAtIndex(0).text;
            //       if (buttonIndex === 1) {
                              
            //       }
            //   })
            // } catch (error) {
            //   MNUtil.showHUD(error);
      //       }
      //     }
      //   )
      //   break;
      case "referenceAuthorInfoFromClipboard":
        MNUtil.undoGrouping(()=>{
          // let infoHtmlCommentIndex = focusNote.getCommentIndex("个人信息：", true)
          let referenceHtmlCommentIndex = focusNote.getCommentIndex("文献：", true)
          focusNote.appendMarkdownComment(
            MNUtil.clipboardText, referenceHtmlCommentIndex
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
            cloneAndMerge(focusNote, "782A91F4-421E-456B-80E6-2B34D402911A")
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
            if (!focusNote.noteTitle.includes("【文献：论文】")) {
              focusNote.noteTitle = "【文献：论文】; " + focusNote.noteTitle
            }
            let referenceInfoHtmlCommentIndex = focusNote.getCommentIndex("文献信息：", true)
            if (referenceInfoHtmlCommentIndex == -1) {
              cloneAndMerge(focusNote, "F09C0EEB-4FB5-476C-8329-8CC5AEFECC43")
            }
            let paperLibraryNote = MNNote.new("785225AC-5A2A-41BA-8760-3FEF10CF4AE0")
            paperLibraryNote.addChild(focusNote.note)
            MNUtil.delay(0.5).then(()=>{
              focusNote.focusInMindMap()
            })
          })
        })
        break;
      case "referenceBookMakeCards":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            if (focusNote.excerptText) {
              toolbarUtils.convertNoteToNonexcerptVersion(focusNote)
            }
            if (!focusNote.noteTitle.includes("【文献：书作】")) {
              focusNote.noteTitle = "【文献：书作】; " + focusNote.noteTitle
            }
            let referenceInfoHtmlCommentIndex = focusNote.getCommentIndex("文献信息：", true)
            if (referenceInfoHtmlCommentIndex == -1) {
              cloneAndMerge(focusNote, "F09C0EEB-4FB5-476C-8329-8CC5AEFECC43")
            }
            let bookLibraryNote = MNNote.new("49102A3D-7C64-42AD-864D-55EDA5EC3097")
            bookLibraryNote.addChild(focusNote.note)
            focusNote.focusInMindMap(0.5)
          })
        })
        break;
      case "referenceSeriesBookMakeCards":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            let seriesNum
            let seriesName
            if (focusNote.excerptText) {
              toolbarUtils.convertNoteToNonexcerptVersion(focusNote)
            } else {
              UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                "系列书作",
                "输入系列名",
                2,
                "取消",
                ["确定"],
                (alert, buttonIndex) => {
                  try {
                    MNUtil.undoGrouping(()=>{
                      seriesName = alert.textFieldAtIndex(0).text;
                      if (buttonIndex === 1) {
                        let seriesLibraryNote = MNNote.new("4DBABA2A-F4EB-4B35-90AB-A192B79411FD")
                        let findSeries = false
                        let targetSeriesNote
                        let focusNoteIndexInTargetSeriesNote
                        for (let i = 0; i <= seriesLibraryNote.childNotes.length-1; i++) {
                          if (seriesLibraryNote.childNotes[i].noteTitle.includes(seriesName)) {
                            targetSeriesNote = seriesLibraryNote.childNotes[i]
                            seriesName = toolbarUtils.getFirstKeywordFromTitle(targetSeriesNote.noteTitle)
                            findSeries = true
                            break;
                          }
                        }
                        if (!findSeries) {
                          targetSeriesNote = MNNote.clone("5CDABCEC-8824-4E9F-93E1-574EA7811FB4")
                          targetSeriesNote.note.noteTitle = "【文献：书作系列】; " + seriesName
                          seriesLibraryNote.addChild(targetSeriesNote.note)
                        }
                        let referenceInfoHtmlCommentIndex = focusNote.getCommentIndex("文献信息：", true)
                        if (referenceInfoHtmlCommentIndex == -1) {
                          cloneAndMerge(focusNote, "F09C0EEB-4FB5-476C-8329-8CC5AEFECC43")
                        }
                        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                          "系列号",
                          "",
                          2,
                          "取消",
                          ["确定"],
                          (alertI, buttonIndex) => {
                            if (buttonIndex == 1) {
                              seriesNum = alertI.textFieldAtIndex(0).text;
                              let seriesTextIndex = focusNote.getIncludingCommentIndex("- 系列", true)
                              let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
                              if (focusNote.noteTitle.includes("【文献：书作】")) {
                                focusNote.noteTitle = focusNote.noteTitle.replace("【文献：书作】", "【文献：书作："+ seriesName + " - Vol. "+ seriesNum + "】")
                              } else {
                                try {
                                  if (focusNote.noteTitle.startsWith("【文献：书作：")) {
                                    // 把  focusNote.noteTitle 开头的【.*】 删掉
                                    let reg = new RegExp("^【.*】")
                                    focusNote.noteTitle = focusNote.noteTitle.replace(reg, "【文献：书作："+seriesName + " - Vol. "+ seriesNum + "】")
                                  } else {
                                    focusNote.noteTitle = "【文献：书作："+seriesName + " - Vol. "+ seriesNum + "】; " + focusNote.noteTitle
                                  }
                                } catch (error) {
                                  MNUtil.showHUD(error);
                                }
                              }
                              if (seriesTextIndex == -1) {
                                focusNote.appendMarkdownComment("- 系列：Vol. " + seriesNum, thoughtHtmlCommentIndex)
                                focusNote.appendNoteLink(targetSeriesNote, "To")
                                focusNote.moveComment(focusNote.comments.length-1,thoughtHtmlCommentIndex+1)
                              } else {
                                // focusNote.appendNoteLink(targetSeriesNote, "To")
                                // focusNote.moveComment(focusNote.comments.length-1,seriesTextIndex + 1)
                                focusNote.removeCommentByIndex(seriesTextIndex)
                                focusNote.appendMarkdownComment("- 系列：Vol. " + seriesNum, seriesTextIndex)
                                if (focusNote.getCommentIndex("marginnote4app://note/" + targetSeriesNote.noteId) == -1) {
                                  focusNote.appendNoteLink(targetSeriesNote, "To")
                                  focusNote.moveComment(focusNote.comments.length-1,seriesTextIndex + 1)
                                } else {
                                  focusNote.moveComment(focusNote.getCommentIndex("marginnote4app://note/" + targetSeriesNote.noteId),seriesTextIndex + 1)
                                }
                              }
                              focusNoteIndexInTargetSeriesNote = targetSeriesNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                              if (focusNoteIndexInTargetSeriesNote == -1){
                                targetSeriesNote.appendNoteLink(focusNote, "To")
                              }
                              toolbarUtils.sortNoteByVolNum(targetSeriesNote, 1)
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
                  } catch (error) {
                    MNUtil.showHUD(error);
                  }
                }
              )
            }
          })
        })
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
            cloneAndMerge(focusNote, "129EB4D6-D57A-4367-8087-5C89864D3595")
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
            cloneAndMerge(focusNote, "1E34F27B-DB2D-40BD-B0A3-9D47159E68E7")
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
            focusNote.removeCommentByIndex(0)
            cloneAndMerge(focusNote, "FAD11540-DF81-4E31-9748-34806CDE1D64")
            focusNote.moveComment(focusNote.comments.length-1,0)
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
          "若多个关键词，用\n- 中文分号；\n- 英文逗号;\n- 中文逗号，\n- 英文逗号,\n之一隔开\n但要保持用一致的分隔符",
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
      case "referenceKeywordsAddRelatedKeywords":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "增加相关关键词",
          "若多个关键词，用\n- 中文分号；\n- 英文逗号;\n- 中文逗号，\n- 英文逗号,\n之一隔开\n但要保持用一致的分隔符",
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
                let relatedReferenceHtmlCommentIndex = focusNote.getCommentIndex("相关文献：", true)
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
          "若多个作者，用\n- 中文分号；\n- 英文逗号;\n- 中文逗号，\n之一隔开\n但要保持用一致的分隔符", // 因为有些作者是缩写，包含西文逗号，所以不适合用西文逗号隔开
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
      case "moveLastCommentToThought":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            toolbarUtils.moveLastCommentToThought(focusNote)
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
      case "clearContentKeepMarkdownText":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.clearContentKeepMarkdownText(focusNote)
          })
        } catch (error) {
          MNUtil.showHUD(error)
        }
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
      case "clearContentKeepExcerpt":
        try {
          MNUtil.undoGrouping(()=>{
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
          })
        } catch (error) {
          MNUtil.showHUD(error)
        }
        break;
      case "clearContentKeepHandwritingAndImage":
        try {
          MNUtil.undoGrouping(()=>{
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
          })
        } catch (error) {
          MNUtil.showHUD(error)
        }
        break;
      case "clearContentKeepHtmlText":
        try {
          MNUtil.undoGrouping(()=>{
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
          })
        } catch (error) {
          MNUtil.showHUD(error)
        }
        break;
      case "clearContentKeepText":
        try {
          MNUtil.undoGrouping(()=>{
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
            toolbarUtils.renewCards(focusNotes)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "changePrefix":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.changePrefix(focusNote)
            focusNote.descendantNodes.descendant.forEach(descendantNote => {
              if ([0, 1, 4].includes(descendantNote.note.colorIndex)) {
                try {
                  // MNUtil.undoGrouping(()=>{
                    toolbarUtils.changePrefix(descendantNote)
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
            focusNotes.forEach(focusNote=>{
              /* 初始化 */
              let ifParentNoteChosen = false

              toolbarUtils.renewCards([focusNote])

              /* 确定卡片类型 */
              switch (focusNoteColorIndex) {
                case 0: // 淡黄色
                  focusNoteType = "outline"
                  break;
                case 2: // 淡蓝色：定义类
                  focusNoteType = "definition"
                  break;
                case 3: // 淡粉色：反例
                  focusNoteType = "antiexample"
                  break;
                case 4: // 黄色
                  focusNoteType = "outline"
                  break;
                case 9: // 深绿色：思想方法
                  focusNoteType = "method"
                  break;
                case 10: // 深蓝色：定理命题
                  focusNoteType = "theorem"
                  break;
                case 15: // 淡紫色：例子
                  focusNoteType = "example"
                  break;
              }

              /* 预处理 */
              /* 只对淡蓝色、淡粉色、深绿色、深蓝色、淡紫色的卡片进行制卡 */
              if ([0, 2, 3, 4, 9, 10, 15].includes(focusNoteColorIndex)) {
                /* 先将卡变成非摘录版本 */
                // 如果是非摘录版本的就不处理，否则已有链接会失效（卡片里的失去箭头，被链接的失效，因为此时的卡片被合并了，id 不是原来的 id 了）
                if (focusNote.excerptText) {
                  toolbarUtils.convertNoteToNonexcerptVersion(focusNote)
                  // 注意此时 focusNote 变成非摘录版本后，下面的代码中 focusNote 就失焦了（因为被合并到其它卡片了）
                  // 所以下面的代码不会执行，这就产生了一个效果：
                  // 点击第一次：将摘录版本变成非摘录版本
                  // 点击第二次：开始制卡
                  // 误打误撞产生最佳效果了属于是
                } else {
                  // 非摘录的话就添加到复习卡组
                  if ([2, 3, 9, 10, 15].includes(focusNoteColorIndex)) {
                    MNUtil.excuteCommand("AddToReview")
                  }
                }

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
                MNUtil.showHUD("不支持对此颜色的卡片进行制卡！")
                return // 使用 return 来提前结束函数, 避免了在内部函数中使用 break 导致的语法错误。
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
              if (focusNoteType !== "definition" && focusNoteType !== "outline") {
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
            })
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
        if (comment) {
          let replacedText = toolbarUtils.detectAndReplace(des.content)
          let focusNotes = MNNote.getFocusNotes()
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(note => {
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
        MNUtil.undoGrouping(()=>{
          let content = des.content ?? "content"
          let replacedText = toolbarUtils.detectAndReplace(content)
          toolbarUtils.setContent(replacedText, des)
        })
        break;
      case "showInFloatWindow":
        let targetNoteid
        switch (des.target) {
          case "{{currentNote}}":
            targetNoteid = MNNote.getFocusNote().noteId
            break;
          case "{{currentChildMap}}":
            targetNoteid = MNUtil.mindmapView.mindmapNodes[0].note.childMindMap.noteId
            break;
          case "{{parentNote}}":
            targetNoteid = MNNote.getFocusNote().parentNote.noteId
            break;
          case "{{currentNoteInMindMap}}":
            let notebookController = MNUtil.notebookController
            let currentNotebookId = notebookController.notebookId
            
            if (!notebookController.view.hidden && notebookController.mindmapView && notebookController.focusNote) {
              targetNoteid = notebookController.focusNote.noteId
            }else{
              let testNote = MNUtil.currentDocController.focusNote
              targetNoteid = testNote.realGroupNoteIdForTopicId(currentNotebookId)
            }
            break;
          default:
            targetNoteid= MNUtil.getNoteIdByURL(des.target)
            break;
        }

        MNNote.focusInFloatMindMap(targetNoteid)
        // toolbarUtils.studyController().focusNoteInFloatMindMapById(targetNoteid)
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
        MNUtil.showHUD("setButtonImage")
        await MNUtil.delay(0.01)
        if ("imageConfig" in des) {
          let config = des.imageConfig
          let keys = Object.keys(config)
          for (let i = 0; i < keys.length; i++) {
            let url = config[keys[i]].url
            let scale = config[keys[i]].scale??3
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