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
    self.buttonNumber = 9
    self.mode = 0
    self.moveDate = Date.now()
    self.settingMode = false
    self.view.layer.shadowOffset = {width: 0, height: 0};
    self.view.layer.shadowRadius = 15;
    self.view.layer.shadowOpacity = 0.5;
    self.view.layer.shadowColor = UIColor.colorWithWhiteAlpha(0.5, 1);
    self.view.layer.opacity = 1.0
    self.view.layer.cornerRadius = 5
    self.view.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0.8)
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
    self.moveButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.moveButton)
    // <<< move button <<<
    // self.imageModeButton.setTitleForState('🔍', 0);
    // self.tabButton      = UIButton.buttonWithType(0);
        // >>> screen button >>>
    self.screenButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.screenButton,"changeScreen:")
    // let command = self.keyCommandWithInputModifierFlagsAction('d',1 << 0,'test:')
    // let command = UIKeyCommand.keyCommandWithInputModifierFlagsAction('d',1 << 0,'test:')
    // <<< screen button <<<
    self.moveGesture = new UIPanGestureRecognizer(self,"onMoveGesture:")
    self.moveButton.addGestureRecognizer(self.moveGesture)
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
    self.moveButton.frame = {x: 0 ,y: 0,width: 40,height: 15};
    self.screenButton.frame = {x: 0 ,y: yBottom-15,width: 40,height: 15};

    let initX = 0
    let initY = 20
    for (let index = 0; index < self.buttonNumber; index++) {
      initX = 0
      self["ColorButton"+index].frame = {  x: xLeft+initX,  y: initY,  width: 40,  height: 40,};
      initY = initY+40
      self["ColorButton"+index].hidden = (initY > yBottom)
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
    toolbarUtils.setColor(color)
    if (self.dynamicWindow) {
      self.hideAfterDelay()
    }
  },
  customAction: async function (button) {
    let actionName = toolbarConfig.action[button.index]
    self.customAction(actionName)
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
    if (focusNote.excerptText) {
      if (focusNote.excerptPic) {
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
    self.onClick = true
    let textSelected = MNUtil.selectionText
    if (!textSelected) {
      let focusNote = MNNote.getFocusNote()
      if (focusNote.excerptText && !focusNote.excerptPic) {
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
    if (textSelected) {
      let url = "eudic://dict/"+encodeURIComponent(textSelected)
      // showHUD(url)
      MNUtil.openURL(url)
    }else{
      MNUtil.showHUD('未找到有效文字')
    }
    if (self.dynamicWindow) {
      self.hideAfterDelay()
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
        } else if (title == text) {
          // 如果摘录与标题相同，MN 只显示标题，此时我们必然想切换到摘录
          note.noteTitle = ""
        }
      })
    }
    MNUtil.showHUD("标题转换完成")
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
    let foucsNote = MNNote.getFocusNote()
    if (foucsNote) {
      noteId = foucsNote.noteId
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
    let foucsNote = MNNote.getFocusNote()
    if (foucsNote) {
      noteId = foucsNote.noteId
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

    // MNUtil.showHUD("Unavailable")
  },
  ocr: async function (button) {
    if (typeof ocrUtils === 'undefined') {
      MNUtil.showHUD("MN Toolbar: Please install 'MN OCR' first!")
      return
    }
    let des = toolbarConfig.getDescription(button.index)
try {
    let foucsNote = MNNote.getFocusNote()
    let imageData = MNUtil.getDocImage(true,true)
    if (!imageData) {
      imageData = MNNote.getImageFromNote(foucsNote)
    }
    if (!imageData) {
      MNUtil.showHUD("No image found")
      return
    }
    if (!imageData) {
      return
    }
    self.currentTime = Date.now()
    let res
    switch (des.source) {
      case "doc2x":
        res = await ocrNetwork.doc2xOCR(imageData)
        break
      case "simpletex":
        res = await ocrNetwork.simpleTexOCR(imageData)
        break
      default:
        res = await ocrNetwork.OCR(imageData)
        break
    }
    // MNUtil.copyJSON(res)
    if (res) {
      MNUtil.showHUD("Time usage: "+(Date.now()-self.currentTime)+" ms")
      switch (des.target) {
        case "comment":
          if (foucsNote) {
            MNUtil.undoGrouping(()=>{
              foucsNote.appendMarkdownComment(res)
              MNUtil.showHUD("Append to comment")
            })
          }else{
            MNUtil.copy(res)
          }
          break;
        case "clipboard":
          MNUtil.copy(res)
          MNUtil.showHUD("Save to clipboard")
          break;
        case "excerpt":
          if (foucsNote) {
            MNUtil.undoGrouping(()=>{
              foucsNote.excerptText =  res
              MNUtil.showHUD("Set to excerpt")
            })
            if (foucsNote.excerptPic && !foucsNote.textFirst) {
              MNUtil.delay(0.5).then(()=>{
                MNUtil.excuteCommand("EditTextMode")
              })
            }
          }else{
            MNUtil.copy(res)
          }
          break;
        default:
          break;
      }
    }
      
    } catch (error) {
      MNUtil.showHUD(error)
      MNUtil.copy(error)
    }
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
    let self = getToolbarController()
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
      let locationToButton = gesture.locationInView(gesture.view)
      let buttonFrame = self.moveButton.frame
      let newY = locationToButton.y-translation.y 
      let newX = locationToButton.x-translation.x
      if (gesture.state !== 3 && (newY<buttonFrame.height+5 && newY>-5 && newX<buttonFrame.width+5 && newX>-5 && Math.abs(translation.y)<20 && Math.abs(translation.x)<20)) {
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
    if (x<20) {
      x = 0
    }
    if (x>studyFrame.width-60) {
      x = studyFrame.width-40
    }
    if (splitLine && docMapSplitMode===1) {
      if (x<splitLine && x>splitLine-40) {
        x = splitLine-20
        self.splitMode = true
      }else{
        self.splitMode = false
      }
    }else{
      self.splitMode = false
    }
    if (self.custom) {
      self.customMode = "None"
      self.view.frame = {x:x,y:y,width:40,height:toolbarUtils.checkHeight(self.lastFrame.height)}
      self.currentFrame  = self.view.frame
    }else{
      self.view.frame = {x:x,y:y,width:40,height:toolbarUtils.checkHeight(frame.height)}
      self.currentFrame  = self.view.frame

    }
    if (gesture.state === 3) {
      toolbarConfig.save("MNToolbar_windowState",{open:true,frame:self.view.frame})
      self.setToolbarLayout()
    }
    self.custom = false;
  },
  onResizeGesture:function (gesture) {
    self.onClick = true
    self.custom = false;
    let baseframe = gesture.view.frame
    let locationInView = gesture.locationInView(gesture.view)
    let frame = self.view.frame
    let height = locationInView.y+baseframe.y+baseframe.height*0.5
    height = toolbarUtils.checkHeight(height)
    self.view.frame = {x:frame.x,y:frame.y,width:40,height:height}
    self.currentFrame  = self.view.frame
    if (self.dynamicWindow) {
      toolbarConfig.save("MNToolbar_windowState",{open:toolbarConfig.windowState.open,frame:self.view.frame})
    }else{
      toolbarConfig.save("MNToolbar_windowState",{open:true,frame:self.view.frame})
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
    button.backgroundColor = UIColor.colorWithHexString(color).colorWithAlphaComponent(0.8);
    // button.layer.cornerRadius = 5;
    button.layer.masksToBounds = true;
    if (targetAction) {
      button.removeTargetActionForControlEvents(this, targetAction, 1 << 6)
      button.addTargetActionForControlEvents(this, targetAction, 1 << 6);
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
  preFrame.height = toolbarUtils.checkHeight(preFrame.height)
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
    frame.height = toolbarUtils.checkHeight(frame.height)
    this.view.frame = frame
    this.currentFrame = frame
  }
  this.view.hidden = false
  this.moveButton.hidden = true
  this.screenButton.hidden = true
  for (let index = 0; index < this.buttonNumber; index++) {
    this["ColorButton"+index].hidden = true
  }
  this.setToolbarButton(toolbarConfig.action)

  // showHUD(JSON.stringify(preFrame))
  MNUtil.animate(()=>{
    this.view.layer.opacity = preOpacity
    this.view.frame = preFrame
    this.currentFrame = preFrame
  }).then(()=>{
    try {
      this.view.layer.borderWidth = 0
      this.moveButton.hidden = false
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
  for (let index = 0; index < this.buttonNumber; index++) {
    this["ColorButton"+index].hidden = true
  }
  this.moveButton.hidden = true
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
toolbarController.prototype.hideAfterDelay = function (frame) {
  let dynamicController = this
    if (dynamicController.notifyTimer) {
      dynamicController.notifyTimer.invalidate()
    }
    dynamicController.notifyTimer = NSTimer.scheduledTimerWithTimeInterval(2, false, function () {
      dynamicController.hide()
      // dynamicController.view.hidden = true
      dynamicController.notifyTimer.invalidate()
    })
}

/**
 * @this {toolbarController}
 */
toolbarController.prototype.setToolbarButton = function (actionNames,newActions=undefined) {
try {
  
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
  // let activeActionNumbers = actionNames.length
  for (let index = 0; index < this.buttonNumber; index++) {
    let actionName = actionNames[index]
    if (this["ColorButton"+index]) {
    }else{
      this["ColorButton"+index] = UIButton.buttonWithType(0);
    }
    this["ColorButton"+index].index = index
    if (actionName.includes("color")) {
      this["ColorButton"+index].color = parseInt(actionName.slice(5))
      this.setColorButtonLayout(this["ColorButton"+index],"setColor:","#ffffff")
    }else if(actionName.includes("custom")){
      this.setColorButtonLayout(this["ColorButton"+index],"customAction:","#ffffff")
    }else{
      this.setColorButtonLayout(this["ColorButton"+index],actionName+":","#ffffff")
    }
    let image = (actionName in actions)?actions[actionName].image+".png":defaultActions[actionName].image+".png"
    this["ColorButton"+index].setImageForState(MNUtil.getImage(toolbarConfig.mainPath + `/`+image),0)
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
    this.moveButton.frame = {x: 0 ,y: 0,width: 40,height: 15};
    this.screenButton.frame = {x: 0 ,y: yBottom-15,width: 40,height: 15};

    let initX = 0
    let initY = 20
    for (let index = 0; index < this.buttonNumber; index++) {
      initX = 0
      this["ColorButton"+index].frame = {  x: xLeft+initX,  y: initY,  width: 40,  height: 40,};
      initY = initY+40
      this["ColorButton"+index].hidden = (initY > yBottom)
    }
}
toolbarController.prototype.checkPopoverController = function () {
  if (this.view.popoverController) {this.view.popoverController.dismissPopoverAnimated(true);}
}
toolbarController.prototype.customAction = async function (actionName) {
  try {
    if (!toolbarUtils.checkSubscribe(true)) {
      return
    }
    let des = JSON.parse(toolbarConfig.actions[actionName].description)
    let focusNote = MNNote.getFocusNote()
    // MNUtil.showHUD("message"+(focusNote instanceof MNNote))
    let notebookid = focusNote ? focusNote.notebookId : undefined
    let title,content,color,config
    let targetNoteId
    switch (des.action) {
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
        let commentIndex = des.index+1
        if (commentIndex) {
          let focusNotes = MNNote.getFocusNotes()
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(note => {
              let commentLength = note.comments.length
              if (commentIndex > commentLength) {
                commentIndex = commentLength
              }
              note.removeCommentByIndex(commentIndex-1)
            })
          })
        }
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
          targetNotes.forEach(note=>{
            let mergedText = toolbarUtils.getMergedText(note, des)
            switch (des.target) {
              case "excerptText":
                note.excerptText = mergedText
                break;
              case "title":
                note.noteTitle = mergedText
                break;
              case "newComment":
                note.appendMarkdownComment(mergedText)
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
      default:
        MNUtil.showHUD("Not supported yet...")
        break;
    }
    // if (this.dynamicWindow) {
    //   this.hideAfterDelay()
    // }
    // copyJSON(des)
  } catch (error) {
    MNUtil.showHUD(error)
  }
}