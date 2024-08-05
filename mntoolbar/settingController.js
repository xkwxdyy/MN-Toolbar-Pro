// JSB.require('utils');
// JSB.require('base64')
/** @return {settingController} */
const getSettingController = ()=>self
var settingController = JSB.defineClass('settingController : UIViewController <NSURLConnectionDelegate>', {
  viewDidLoad: function() {
    let self = getSettingController()
try {
    self.init()
    self.view.frame = {x:50,y:50,width:355,height:475}
    self.lastFrame = self.view.frame;
    self.currentFrame = self.view.frame
    self.isMainWindow = true
    self.title = "main"
    self.test = [0]
    self.moveDate = Date.now()
    self.color = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true]
    self.view.layer.shadowOffset = {width: 0, height: 0};
    self.view.layer.shadowRadius = 15;
    self.view.layer.shadowOpacity = 0.5;
    self.view.layer.shadowColor = UIColor.colorWithWhiteAlpha(0.5, 1);
    self.view.layer.cornerRadius = 11
    self.view.layer.opacity = 1.0
    self.view.layer.borderColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
    self.view.layer.borderWidth = 0
    // self.view.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
    self.config = {}
    if (!self.config.delay) {
      self.config.delay = 0
    }
    if (!self.settingView) {
      self.createSettingView()
    }
    
} catch (error) {
  MNUtil.showHUD(error)
}
    self.selectedItem = toolbarConfig.action[0]
    let allActions = toolbarConfig.action.concat(toolbarConfig.getDefaultActionKeys().slice(toolbarConfig.action.length))

    try {
      self.setButtonText(allActions,self.selectedItem)
      self.setTextview(self.selectedItem)
      self.settingView.hidden = false
    } catch (error) {
    MNUtil.showHUD(error)
      
    }


    self.createButton("maxButton","maxButtonTapped:")
    self.maxButton.setTitleForState('➕', 0);
    self.maxButton.titleLabel.font = UIFont.systemFontOfSize(10);
    MNButton.setColor(self.maxButton, "#3a81fb",0.5)

    self.createButton("moveButton")
    MNButton.setColor(self.moveButton, "#3a81fb",0.5)
    try {
    self.settingViewLayout()
      
    } catch (error) {
      MNUtil.showHUD(error)
    }

    self.moveGesture = new UIPanGestureRecognizer(self,"onMoveGesture:")
    self.moveButton.addGestureRecognizer(self.moveGesture)
    self.moveGesture.view.hidden = false
    self.moveGesture.addTargetAction(self,"onMoveGesture:")

    self.resizeGesture = new UIPanGestureRecognizer(self,"onResizeGesture:")
    self.saveButton.addGestureRecognizer(self.resizeGesture)
    self.resizeGesture.view.hidden = false
    self.resizeGesture.addTargetAction(self,"onResizeGesture:")
    // self.settingController.view.hidden = false
  },
  viewWillAppear: function(animated) {
  },
  viewWillDisappear: function(animated) {
  },
viewWillLayoutSubviews: function() {
    let buttonHeight = 25
    // self.view.frame = self.currentFrame
    var viewFrame = self.view.bounds;
    var width    = viewFrame.width
    var height   = viewFrame.height

    height = height-36
    self.settingViewLayout()
    self.refreshLayout()

  },
  changeOpacityTo:function (opacity) {
    self.view.layer.opacity = opacity
  },
  moveTopTapped :function () {
    let self = getSettingController()
    let allActions = toolbarConfig.action.concat(toolbarConfig.getDefaultActionKeys().slice(toolbarConfig.action.length))
    toolbarUtils.moveElement(allActions, self.selectedItem, "top")
    self.setButtonText(allActions,self.selectedItem)
    // MNUtil.postNotification("MNToolbarRefreshLayout",{})
    // NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo("MNToolbarRefreshLayout", self.window, {})
    self.toolbarController.setToolbarButton(allActions)
    toolbarConfig.save("MNToolbar_action")
  },
  moveForwardTapped :function () {
    let self = getSettingController()
    let allActions = toolbarConfig.action.concat(toolbarConfig.getDefaultActionKeys().slice(toolbarConfig.action.length))
    toolbarUtils.moveElement(allActions, self.selectedItem, "up")
    self.setButtonText(allActions,self.selectedItem)
    self.toolbarController.setToolbarButton(allActions)
    toolbarConfig.save("MNToolbar_action")
  },
  moveBackwardTapped :function () {
    let allActions = toolbarConfig.action.concat(toolbarConfig.getDefaultActionKeys().slice(toolbarConfig.action.length))
    toolbarUtils.moveElement(allActions, self.selectedItem, "down")
    self.setButtonText(allActions,self.selectedItem)
    self.toolbarController.setToolbarButton(allActions)
    toolbarConfig.save("MNToolbar_action")

  },
  resetConfig: async function (button) {
  try {
    let confirm = await MNUtil.confirm("Clear all config?", "清除所有配置？")
    if (confirm) {
    
      let self = getSettingController()
      toolbarConfig.reset()
      self.toolbarController.setToolbarButton(toolbarConfig.action,toolbarConfig.actions)
      // self.toolbarController.actions = actions
      self.setButtonText(toolbarConfig.action,toolbarConfig.action[0])
      self.setTextview(toolbarConfig.action[0])
    }
  } catch (error) {
    MNUtil.showHUD("Error in resetConfig: "+error)
  }
  },
  closeButtonTapped: async function() {
    self.getWebviewContent()
    if (self.addonBar) {
      self.hide(self.addonBar.frame)
    }else{
      self.hide()
    }
    self.searchedText = ""
  },
  maxButtonTapped: function() {
    if (self.customMode === "full") {
      self.customMode = "none"
      self.custom = false;
      // self.hideAllButton()
      self.onAnimate = true
      MNUtil.animate(()=>{
        self.view.frame = self.lastFrame
        self.currentFrame = self.lastFrame
        self.settingViewLayout()
      },0.3).then(()=>{
        self.onAnimate = false
        // self.showAllButton()
        self.settingViewLayout()
      })
      return
    }
    const frame = MNUtil.studyView.bounds
    self.lastFrame = self.view.frame
    self.customMode = "full"
    self.custom = true;
    self.dynamic = false;
    self.onAnimate = true
    // self.hideAllButton()
    MNUtil.animate(()=>{
      self.currentFrame = {x:40,y:0,width:frame.width-80,height:frame.height}
      self.view.frame = {x:40,y:0,width:frame.width-80,height:frame.height}
      self.settingViewLayout()
    },0.3).then(()=>{
      self.onAnimate = false
      // self.showAllButton()
      self.settingViewLayout()
    })
  },
  onMoveGesture:function (gesture) {
    self.dynamic = false;
    let locationToMN = gesture.locationInView(toolbarUtils.studyController().view)
    if (!self.locationToButton || !self.miniMode && (Date.now() - self.moveDate) > 100) {
      let translation = gesture.translationInView(toolbarUtils.studyController().view)
      let locationToBrowser = gesture.locationInView(self.view)
      let locationToButton = gesture.locationInView(gesture.view)
      let buttonFrame = self.moveButton.frame
      let newY = locationToButton.y-translation.y 
      let newX = locationToButton.x-translation.x
      if (gesture.state === 1) {
        self.locationToBrowser = {x:locationToBrowser.x-translation.x,y:locationToBrowser.y-translation.y}
        self.locationToButton = {x:newX,y:newY}
      }
      // if ((newY<buttonFrame.height && newY>0 && newX<buttonFrame.width && newX>0 && Math.abs(translation.y)<20 && Math.abs(translation.x)<20) || !self.locationToBrowser) {

      // }
    }
    self.moveDate = Date.now()
    // let location = {x:locationToMN.x - self.locationToBrowser.x,y:locationToMN.y -self.locationToBrowser.y}
    let location = {x:locationToMN.x - self.locationToButton.x-gesture.view.frame.x,y:locationToMN.y -self.locationToButton.y-gesture.view.frame.y}

    let frame = self.view.frame
    var viewFrame = self.view.bounds;
    let studyFrame = toolbarUtils.studyController().view.bounds
    let y = location.y
    if (y<=0) {
      y = 0
    }
    if (y>=studyFrame.height-15) {
      y = studyFrame.height-15
    }
    let x = location.x
    
    if (self.custom) {
      // Application.sharedInstance().showHUD(self.custom, self.view.window, 2);
      self.customMode = "None"
      MNUtil.animate(()=>{
        self.view.frame = MNUtil.genFrame(x,y,self.lastFrame.width,self.lastFrame.height)
        self.currentFrame  = self.view.frame
        self.settingViewLayout()
      },0.1)
    }else{
      self.view.frame = MNUtil.genFrame(x,y,frame.width,frame.height)
      self.currentFrame  = self.view.frame
    }
    self.custom = false;
  },
  onResizeGesture:function (gesture) {
    self.custom = false;
    self.dynamic = false;
    self.customMode = "none"
    let baseframe = gesture.view.frame
    let locationToBrowser = gesture.locationInView(self.view)
    let frame = self.view.frame
    let width = locationToBrowser.x+baseframe.width*0.5
    let height = locationToBrowser.y+baseframe.height*0.5
    if (width <= 355) {
      width = 355
    }
    if (height <= 475) {
      height = 475
    }
    //  Application.sharedInstance().showHUD(`{x:${translation.x},y:${translation.y}}`, self.view.window, 2);
    //  self.view.frame = {x:frame.x,y:frame.y,width:frame.width+translationX,height:frame.height+translationY}
    self.view.frame = {x:frame.x,y:frame.y,width:width,height:height}
    self.currentFrame  = self.view.frame
  },
  advancedButtonTapped: function (params) {
    self.advanceView.hidden = false
    self.configView.hidden = true
    MNButton.setColor(self.configButton, "#9bb2d6", 0.8)
    MNButton.setColor(self.advancedButton, "#457bd3", 0.8)
  },
  configButtonTapped: function (params) {
    self.configView.hidden = false
    self.advanceView.hidden = true
    MNButton.setColor(self.configButton, "#457bd3", 0.8)
    MNButton.setColor(self.advancedButton, "#9bb2d6", 0.8)
  },
  configCopyTapped: async function (params) {
    // MNUtil.copy(self.selectedItem)
    let selected = self.selectedItem
    if (!toolbarConfig.checkCouldSave(selected)) {
      return
    }
    try {
    let input = await self.getWebviewContent()
    MNUtil.copy(input)
    } catch (error) {
      toolbarUtils.addErrorLog(error, "configCopyTapped", info)
    }
  },
  configPasteTapped: async function (params) {
    // MNUtil.copy(self.selectedItem)
    let selected = self.selectedItem
    if (!toolbarConfig.checkCouldSave(selected)) {
      return
    }
    try {
    let input = MNUtil.clipboardText
    if (selected === "execute" || MNUtil.isValidJSON(input)) {
      if (!toolbarConfig.actions[selected]) {
        toolbarConfig.actions[selected] = toolbarConfig.getAction(selected)
      }
      toolbarConfig.actions[selected].description = input
      toolbarConfig.actions[selected].name = self.titleInput.text
      self.toolbarController.actions = toolbarConfig.actions
      if (self.toolbarController.dynamicToolbar) {
        self.toolbarController.dynamicToolbar.actions = toolbarConfig.actions
      }
      toolbarConfig.save("MNToolbar_actionConfig")
      if (!selected.includes("custom")) {
        MNUtil.showHUD("Save Action: "+self.titleInput.text)
      }else{
        MNUtil.showHUD("Save Custom Action: "+self.titleInput.text)
      }
      if (selected === "edit") {
        let config = JSON.parse(input)
        if ("showOnNoteEdit" in config) {
          toolbarConfig.showEditorOnNoteEdit = config.showOnNoteEdit
        }
      }
      if (selected === "execute") {
        self.setJSContent(input)
      }else{
        self.setWebviewContent(input)
      }
    }else{
      MNUtil.showHUD("Invalid JSON format: "+input)
      MNUtil.copy("Invalid JSON format: "+input)
    }
    } catch (error) {
      toolbarUtils.addErrorLog(error, "configSaveTapped", info)
    }
  },
  configSaveTapped: async function (params) {
    // MNUtil.copy(self.selectedItem)
    let selected = self.selectedItem
    if (!toolbarConfig.checkCouldSave(selected)) {
      return
    }
    try {
    let input = await self.getWebviewContent()
    if (selected === "execute" || MNUtil.isValidJSON(input)) {
      if (!toolbarConfig.actions[selected]) {
        toolbarConfig.actions[selected] = toolbarConfig.getAction(selected)
      }
      toolbarConfig.actions[selected].description = input
      toolbarConfig.actions[selected].name = self.titleInput.text
      self.toolbarController.actions = toolbarConfig.actions
      if (self.toolbarController.dynamicToolbar) {
        self.toolbarController.dynamicToolbar.actions = toolbarConfig.actions
      }
      toolbarConfig.save("MNToolbar_actionConfig")
      if (!selected.includes("custom")) {
        MNUtil.showHUD("Save Action: "+self.titleInput.text)
      }else{
        MNUtil.showHUD("Save Custom Action: "+self.titleInput.text)
      }
      if (selected === "edit") {
        let config = JSON.parse(input)
        if ("showOnNoteEdit" in config) {
          toolbarConfig.showEditorOnNoteEdit = config.showOnNoteEdit
        }
      }
      // if (selected === "excute") {
      //   // self.setJSContent(selected)
      //   self.runJavaScript(`document.getElementById('editor').innerHTML = document.body.innerText`)
      // }
    }else{
      MNUtil.showHUD("Invalid JSON format!")
    }
    } catch (error) {
      toolbarUtils.addErrorLog(error, "configSaveTapped", info)
    }
  },
  configRunTapped: async function (params) {
  try {
    let selected = self.selectedItem
    if (!toolbarConfig.checkCouldSave(selected)) {
      return
    }
    let input = await self.getWebviewContent()
    // toolbarUtils.copy(selected)
    if (self.selectedItem === "execute" || MNUtil.isValidJSON(input)) {
      if (!toolbarConfig.actions[selected]) {
        toolbarConfig.actions[selected] = toolbarConfig.getAction(selected)
      }
      toolbarConfig.actions[selected].description = input
      toolbarConfig.actions[selected].name = self.titleInput.text
      self.toolbarController.actions = toolbarConfig.actions
      if (self.toolbarController.dynamicToolbar) {
        self.toolbarController.dynamicToolbar.actions = toolbarConfig.actions
      }
      toolbarConfig.save("MNToolbar_actionConfig")
    }else{
      MNUtil.showHUD("Invalid JSON format!")
      return
    }
    if (selected.includes("custom")) {
      let des = toolbarConfig.getDescriptionByName(selected)
      self.toolbarController.customActionByDes(des)
      return
    }
    if (selected.includes("color")) {
      let colorIndex = parseInt(selected.split("color")[1])
      toolbarUtils.setColor(colorIndex)
      return
    }
    if (selected === "ocr") {
      toolbarUtils.ocr()
      return
    }
    if (selected === "execute") {
      // self.runJavaScript(`document.getElementById('editor').innerHTML = document.body.innerText`)
      let code = toolbarConfig.getExecuteCode()
      toolbarSandbox.execute(code)
      return
    }
    if (selected === "chatglm") {
      toolbarUtils.chatAI()
      return
    }
    MNUtil.showHUD("Not supported")
  } catch (error) {
    toolbarUtils.addErrorLog(error, "configRunTapped", info)

  }
  },
  toggleSelected:function (sender) {
    if (self.selectedItem === sender.id) {
      return
    }
    sender.isSelected = !sender.isSelected
    let title = sender.id
    self.selectedItem = title
    self.words.forEach((entryName,index)=>{
      if (entryName !== title) {
        self["nameButton"+index].isSelected = false
        MNButton.setColor(self["nameButton"+index], "#ffffff", 0.8)
      }
    })
    if (sender.isSelected) {
      self.setTextview(title)
      MNButton.setColor(sender, "#9bb2d6", 0.8)
    }else{
      MNButton.setColor(sender, "#ffffff", 0.8)
    }
  },
  toggleAddonLogo:function (button) {
    if (toolbarUtils.checkSubscribe(true)) {
      let addonName = button.addon
      toolbarConfig.addonLogos[addonName] = !toolbarConfig.checkLogoStatus(addonName)
      button.setTitleForState(addonName+": "+(toolbarConfig.checkLogoStatus(addonName)?"✅":"❌"),0)
      MNButton.setColor(button, toolbarConfig.checkLogoStatus(addonName)?"#457bd3":"#9bb2d6",0.8)
      toolbarConfig.save("MNToolbar_addonLogos")
      MNUtil.refreshAddonCommands()
    }
  },
  saveButtonColor:function (button) {
    if (!toolbarUtils.checkSubscribe(true)) {
      return
    }
    let color = self.hexInput.text
    let varColors = ["defaultBookPageColor","defaultHighlightBlendColor","defaultDisableColor","defaultTextColor","defaultNotebookColor","defaultTintColor","defaultTintColorForSelected","defaultTintColorForDarkBackground"]
    if (varColors.includes(color) || toolbarUtils.isHexColor(color)) {
      toolbarConfig.buttonConfig.color = color
      toolbarConfig.save("MNToolbar_buttonConfig")
      self.toolbarController.setToolbarButton()
      MNUtil.showHUD("Save color: "+color)
    }else{
      MNUtil.showHUD("Invalid hex color")
    }
  }
  
});
settingController.prototype.init = function () {
  this.custom = false;
  this.customMode = "None"
  this.dynamic = true;
  this.selectedText = '';
  this.searchedText = '';
}


settingController.prototype.changeButtonOpacity = function(opacity) {
    this.moveButton.layer.opacity = opacity
    this.maxButton.layer.opacity = opacity
    // this.closeButton.layer.opacity = opacity
}
settingController.prototype.setButtonLayout = function (button,targetAction) {
    button.autoresizingMask = (1 << 0 | 1 << 3);
    button.setTitleColorForState(UIColor.whiteColor(),0);
    button.setTitleColorForState(toolbarConfig.highlightColor, 1);
    MNButton.setColor(button, "#9bb2d6", 0.8)
    button.layer.cornerRadius = 8;
    button.layer.masksToBounds = true;
    if (targetAction) {
      button.addTargetActionForControlEvents(this, targetAction, 1 << 6);
    }
    this.view.addSubview(button);
}


settingController.prototype.createButton = function (buttonName,targetAction,superview) {
    this[buttonName] = UIButton.buttonWithType(0);
    this[buttonName].autoresizingMask = (1 << 0 | 1 << 3);
    this[buttonName].setTitleColorForState(UIColor.whiteColor(),0);
    this[buttonName].setTitleColorForState(toolbarConfig.highlightColor, 1);
    MNButton.setColor(this[buttonName], "#9bb2d6", 0.8)
    this[buttonName].layer.cornerRadius = 8;
    this[buttonName].layer.masksToBounds = true;
    this[buttonName].titleLabel.font = UIFont.systemFontOfSize(16);

    if (targetAction) {
      this[buttonName].addTargetActionForControlEvents(this, targetAction, 1 << 6);
    }
    if (superview) {
      this[superview].addSubview(this[buttonName])
    }else{
      this.view.addSubview(this[buttonName]);
    }
}

settingController.prototype.settingViewLayout = function (){
    let viewFrame = this.view.bounds
    let width = viewFrame.width
    let height = viewFrame.height
    this.maxButton.frame = MNUtil.genFrame(width*0.5+80,0,18,18)
    this.moveButton.frame = MNUtil.genFrame(width*0.5-75, 0, 150, 17)
    this.settingView.frame = {x:0,y:55,width:width,height:height-55}
    this.configView.frame = MNUtil.genFrame(0,0,width-2,height-60)
    this.advanceView.frame = MNUtil.genFrame(0,0,width-2,height-60)
    if (width < 650) {
      this.webviewInput.frame = {x:5,y:205,width:width-10,height:height-300}
      this.titleInput.frame = {x:5,y:165,width:width-50,height:35}
      this.runButton.frame = {x:width-40,y:165,width:35,height:35}
      this.copyButton.frame = {x:5,y:height-90,width:60,height:30}
      this.pasteButton.frame = {x:70,y:height-90,width:60,height:30}

      this.saveButton.frame = {x:width-75,y:height-90,width:70,height:30}
      this.scrollview.frame = {x:5,y:5,width:width-10,height:155}
      this.scrollview.contentSize = {width:width-20,height:height};
      this.moveTopButton.frame = {x:width-40,y:15,width:30,height:30}
      this.moveUpButton.frame = {x:width-40,y:50,width:30,height:30}
      this.moveDownButton.frame = {x:width-40,y:85,width:30,height:30}
      this.configReset.frame = {x:width-40,y:120,width:30,height:30}
    }else{
      this.webviewInput.frame = {x:355,y:45,width:width-360,height:height-140}
      this.titleInput.frame = {x:355,y:5,width:width-400,height:35}
      this.runButton.frame = {x:width-40,y:5,width:35,height:35}
      this.copyButton.frame = {x:355,y:height-90,width:60,height:30}
      this.pasteButton.frame = {x:420,y:height-90,width:60,height:30}

      this.saveButton.frame = {x:width-75,y:height-90,width:70,height:30}
      this.scrollview.frame = {x:5,y:5,width:345,height:height-65}
      this.scrollview.contentSize = {width:345,height:height};
      this.moveTopButton.frame = {x:315,y:15,width:30,height:30}
      this.moveUpButton.frame = {x:315,y:50,width:30,height:30}
      this.moveDownButton.frame = {x:315,y:85,width:30,height:30}
      this.configReset.frame = {x:315,y:120,width:30,height:30}
    }


    let settingFrame = this.settingView.bounds
    settingFrame.x = 0
    settingFrame.y = 15
    settingFrame.height = 40
    settingFrame.width = settingFrame.width
    this.tabView.frame = settingFrame
    settingFrame.width = 85
    settingFrame.y = 5
    settingFrame.x = 5
    settingFrame.height = 30
    this.configButton.frame = settingFrame
    settingFrame.x = 95
    settingFrame.width = 100
    this.advancedButton.frame = settingFrame
    settingFrame.x = width-35
    settingFrame.width = 30
    this.closeButton.frame = settingFrame

    this.editorButton.frame = MNUtil.genFrame(10, 15, (width-25)/2, 35)
    this.chatAIButton.frame = MNUtil.genFrame(15+(width-25)/2, 15, (width-25)/2, 35)
    this.snipasteButton.frame = MNUtil.genFrame(10, 55, (width-25)/2, 35)
    this.autoStyleButton.frame = MNUtil.genFrame(15+(width-25)/2, 55, (width-25)/2, 35)
    this.browserButton.frame = MNUtil.genFrame(10, 95, (width-25)/2, 35)
    this.OCRButton.frame = MNUtil.genFrame(15+(width-25)/2, 95, (width-25)/2, 35)
    this.hexInput.frame = MNUtil.genFrame(10, 150, width-135, 35)
    this.hexButton.frame = MNUtil.genFrame(width-120, 150, 110, 35)
}


/**
 * @this {settingController}
 */
settingController.prototype.createSettingView = function (){
try {
  

  this.creatView("settingView","view","#ffffff",0.8)
  this.settingView.hidden = true
  // this.settingView.layer.opacity = 0.8
  this.creatView("tabView","view","#9bb2d6",0.0)
  this.creatView("configView","settingView","#9bb2d6",0.0)

  this.creatView("advanceView","settingView","#9bb2d6",0.0)
  this.advanceView.hidden = true


  this.createButton("configButton","configButtonTapped:","tabView")
  MNButton.setConfig(this.configButton, {color:"#457bd3",alpha:0.9,opacity:1.0,title:"Buttons",font:17,radius:10,bold:true})


  this.createButton("advancedButton","advancedButtonTapped:","tabView")
  MNButton.setConfig(this.advancedButton, {alpha:0.9,opacity:1.0,title:"Advanced",font:17,radius:10,bold:true})

  this.createButton("closeButton","closeButtonTapped:","tabView")
  MNButton.setConfig(this.closeButton, {color:"#e06c75",alpha:0.9,opacity:1.0,radius:10,bold:true})
  MNButton.setImage(this.closeButton, MNUtil.getImage(toolbarConfig.mainPath+"/stop.png"))

  this.createButton("editorButton","toggleAddonLogo:","advanceView")
  this.editorButton.layer.opacity = 1.0
  this.editorButton.addon = "MNEditor"
  this.editorButton.setTitleForState("MNEditor: "+(toolbarConfig.checkLogoStatus("MNEditor")?"✅":"❌"),0)
  this.editorButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  MNButton.setColor(this.editorButton, toolbarConfig.checkLogoStatus("MNEditor")?"#457bd3":"#9bb2d6",0.8)

  this.createButton("chatAIButton","toggleAddonLogo:","advanceView")
  this.chatAIButton.layer.opacity = 1.0
  this.chatAIButton.addon = "MNChatAI"
  this.chatAIButton.setTitleForState("MNChatAI: "+(toolbarConfig.checkLogoStatus("MNChatAI")?"✅":"❌"),0)
  this.chatAIButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  MNButton.setColor(this.chatAIButton, toolbarConfig.checkLogoStatus("MNChatAI")?"#457bd3":"#9bb2d6",0.8)

  this.createButton("snipasteButton","toggleAddonLogo:","advanceView")
  this.snipasteButton.layer.opacity = 1.0
  this.snipasteButton.addon = "MNSnipaste"
  this.snipasteButton.setTitleForState("MNSnipaste: "+(toolbarConfig.checkLogoStatus("MNSnipaste")?"✅":"❌"),0)
  this.snipasteButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  MNButton.setColor(this.snipasteButton, toolbarConfig.checkLogoStatus("MNSnipaste")?"#457bd3":"#9bb2d6",0.8)

  this.createButton("autoStyleButton","toggleAddonLogo:","advanceView")
  this.autoStyleButton.layer.opacity = 1.0
  this.autoStyleButton.addon = "MNAutoStyle"
  this.autoStyleButton.setTitleForState("MNAutoStyle: "+(toolbarConfig.checkLogoStatus("MNAutoStyle")?"✅":"❌"),0)
  this.autoStyleButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  MNButton.setColor(this.autoStyleButton, toolbarConfig.checkLogoStatus("MNAutoStyle")?"#457bd3":"#9bb2d6",0.8)
  
  this.createButton("browserButton","toggleAddonLogo:","advanceView")
  this.browserButton.layer.opacity = 1.0
  this.browserButton.addon = "MNBrowser"
  this.browserButton.setTitleForState("MNBrowser: "+(toolbarConfig.checkLogoStatus("MNBrowser")?"✅":"❌"),0)
  this.browserButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  MNButton.setColor(this.browserButton, toolbarConfig.checkLogoStatus("MNBrowser")?"#457bd3":"#9bb2d6",0.8)

  this.createButton("OCRButton","toggleAddonLogo:","advanceView")
  this.OCRButton.layer.opacity = 1.0
  this.OCRButton.addon = "MNOCR"
  this.OCRButton.setTitleForState("MNOCR: "+(toolbarConfig.checkLogoStatus("MNOCR")?"✅":"❌"),0)
  this.OCRButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  MNButton.setColor(this.OCRButton, toolbarConfig.checkLogoStatus("MNOCR")?"#457bd3":"#9bb2d6",0.8)

  this.creatTextView("hexInput","advanceView","#9bb2d6")
  this.createButton("hexButton","saveButtonColor:","advanceView")
  this.hexButton.layer.opacity = 1.0
  this.hexButton.addon = "MNOCR"
  this.hexButton.setTitleForState("Save Color",0)
  this.hexButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  this.hexInput.text = toolbarConfig.buttonConfig.color
  MNButton.setColor(this.hexButton, toolbarConfig.checkLogoStatus("MNOCR")?"#457bd3":"#9bb2d6",0.8)


  this.scrollview = UIScrollView.new()
  this.configView.addSubview(this.scrollview)
  this.scrollview.hidden = false
  this.scrollview.delegate = this
  this.scrollview.bounces = true
  this.scrollview.alwaysBounceVertical = true
  this.scrollview.layer.cornerRadius = 8
  this.scrollview.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.8)

  this.createWebviewInput("configView")
  this.creatTextView("systemInput","configView")
  this.systemInput.hidden = true

  this.creatTextView("titleInput","configView","#9bb2d6")

  let text  = "123"
  this.setWebviewContent(text)

  this.titleInput.text = text.title
  this.titleInput.contentInset = {top: 0,left: 0,bottom: 0,right: 0}
  this.titleInput.textContainerInset = {top: 0,left: 0,bottom: 0,right: 0}
  this.createButton("configReset","resetConfig:","configView")
  this.configReset.layer.opacity = 1.0
  this.configReset.setTitleForState("🔄",0)

  this.createButton("moveUpButton","moveForwardTapped:","configView")
  this.moveUpButton.layer.opacity = 1.0
  this.moveUpButton.setTitleForState("🔼",0)
  this.createButton("moveDownButton","moveBackwardTapped:","configView")
  this.moveDownButton.layer.opacity = 1.0
  this.moveDownButton.setTitleForState("🔽",0)
  this.createButton("moveTopButton","moveTopTapped:","configView")
  this.moveTopButton.layer.opacity = 1.0
  this.moveTopButton.setTitleForState("🔝",0)

  this.createButton("copyButton","configCopyTapped:","configView")
  this.copyButton.layer.opacity = 1.0
  this.copyButton.setTitleForState("Copy",0)

  this.createButton("pasteButton","configPasteTapped:","configView")
  this.pasteButton.layer.opacity = 1.0
  this.pasteButton.setTitleForState("Paste",0)

  this.createButton("saveButton","configSaveTapped:","configView")
  // this.saveButton.layer.opacity = 1.0
  // this.saveButton.setTitleForState("Save",0)
  MNButton.setConfig(this.saveButton, {opacity:0.8,color:"#e06c75",title:"Save",bold:true})

  this.createButton("runButton","configRunTapped:","configView")
  MNButton.setConfig(this.runButton, {opacity:0.8,title:"▶️",font:22})
  
  let color = ["#ffffb4","#ccfdc4","#b4d1fb","#f3aebe","#ffff54","#75fb4c","#55bbf9","#ea3323","#ef8733","#377e47","#173dac","#be3223","#ffffff","#dadada","#b4b4b4","#bd9fdc"]
} catch (error) {
  toolbarUtils.addErrorLog(error, "createSettingView")
}
}
/**
 * @this {settingController}
 */
settingController.prototype.setButtonText = function (names=toolbarConfig.getAllActions(),highlight=self.selectedItem) {
    this.words = names
    let actions = toolbarConfig.actions
    let defaultActions = toolbarConfig.getActions()
    names.map((word,index)=>{
      let buttonName = "nameButton"+index
      if (!this[buttonName]) {
        this.createButton(buttonName,"toggleSelected:","scrollview")
        // this[buttonName].index = index
        this[buttonName].titleLabel.font = UIFont.systemFontOfSize(16);
      }
      this[buttonName].hidden = false
      this[buttonName].id = word
      this[buttonName].isSelected = (word === highlight)
      MNButton.setColor(this[buttonName], (word === highlight)?"#9bb2d6":"#ffffff", 0.8)
      MNButton.setImage(this[buttonName], toolbarConfig.imageConfigs[word])

      // if (word in actions) {
      //   MNButton.setImage(this[buttonName], this.mainPath+`/${actions[word].image}.png`)
      // }else{
      //   MNButton.setImage(this[buttonName], this.mainPath+`/${defaultActions[word].image}.png`)
      // }
      // this[buttonName].titleEdgeInsets = {top:0,left:-100,bottom:0,right:-50}
      // this[buttonName].setTitleForState(this.imagePattern[index]===this.textPattern[index]?` ${this.imagePattern[index]} `:"-1",0) 
    })
    this.refreshLayout()
}
/**
 * @this {settingController}
 */
settingController.prototype.setTextview = function (name) {
      // let entries           =  NSUserDefaults.standardUserDefaults().objectForKey('MNBrowser_entries');
      let actions = toolbarConfig.actions
      let defaultActions = toolbarConfig.getActions()
      let action = (name in actions)?actions[name]:defaultActions[name]
      let text  = action.name
      let description = action.description
      this.titleInput.text= text
      if (MNUtil.isValidJSON(description)) {
        this.setWebviewContent(description)
      }else{
        actions = toolbarConfig.getActions()
        description = action.description
        if (name === "execute") {
          this.setJSContent(description)
        }else{
          this.setWebviewContent(description)
        }
      }
      // if (!text.system) {
      //   text.system = ""
      // }
      // this.systemInput.text = text.system
      // try {
      //   let normalAttString = NSAttributedString.new()
      //   normalAttString.string = text.system
      //   // normalAttString.attributesAtIndexEffectiveRange
      //   // showHUD(Object.keys(normalAttString))
      //   let combined = NSMutableAttributedString.new("这是一个示例文本，其中一些文字将会被加粗显示。")
      //   combined.mutableString = "这是一个示例文本，其中一些文字将会被加粗显示。"
      //   combined.string = "这是一个示例文本，其中一些文字将会被加粗显示。"
      //   combined.setAttributedString(normalAttString)
      //   combined.addAttributeValueRange("NSAttributedString.Key.font",UIFont.systemFontOfSize(15),{location:0,length:2})
      //   // combined.addAttributeValueRange("NSAttributedString.Key.foregroundColor",UIColor.blackColor(),{location:0,length:2})
      //   // combined.appendAttributedString(normalAttString)
      //   this.systemInput.allowsEditingTextAttributes = true
      //   this.systemInput.attributedText = combined
      // } catch (error) {
      //   showHUD(error)
      // }

}
/**
 * @this {settingController}
 */
settingController.prototype.refreshLayout = function () {
  if (!this.settingView) {return}
  if (!this.configView.hidden) {
    var viewFrame = this.scrollview.bounds;
    var xLeft     = 0
    let initX = 10
    let initY = 10
    let initL = 0
    let buttonWidth = 40
    let buttonHeight = 40
    this.locs = [];
    this.words.map((word,index)=>{
      // let title = word
      if (xLeft+initX+buttonWidth > viewFrame.width-10) {
        initX = 10
        initY = initY+50
        initL = initL+1
      }
      this["nameButton"+index].frame = {  x: xLeft+initX,  y: initY,  width: buttonWidth,  height: buttonHeight,};
      this.locs.push({
        x:xLeft+initX,
        y:initY,
        l:initL,
        i:index
      })
      initX = initX+buttonWidth+10
    })
    if (this.lastLength && this.lastLength>this.words.length) {
      for (let index = this.words.length; index < this.lastLength; index++) {
        this["nameButton"+index].hidden = true
      }
    }
    this.lastLength = this.words.length
    this.scrollview.contentSize= {width:viewFrame.width,height:initY+50}
  
  }
}

settingController.prototype.hideAllButton = function (frame) {
  this.moveButton.hidden = true
  // this.closeButton.hidden = true
  this.maxButton.hidden = true
}
settingController.prototype.showAllButton = function (frame) {
  this.moveButton.hidden = false
  // this.closeButton.hidden = false
  this.maxButton.hidden = false
}
/**
 * @this {settingController}
 */
settingController.prototype.show = function (frame) {
    try {
  MNUtil.studyView.bringSubviewToFront(this.view)
  MNUtil.studyView.bringSubviewToFront(this.addonBar)
  let preFrame = this.currentFrame
  let preOpacity = this.view.layer.opacity
  this.view.layer.opacity = 0.2
  this.view.hidden = false
  this.miniMode = false
  // MNUtil.showHUD("message")
  let allActions = toolbarConfig.action.concat(toolbarConfig.getDefaultActionKeys().slice(toolbarConfig.action.length))
  this.setButtonText(allActions,this.selectedItem)
  this.toolbarController.setToolbarButton(toolbarConfig.action)
  this.hideAllButton()
  MNUtil.animate(()=>{
    this.view.layer.opacity = 1.0
  },0.2).then(()=>{
      this.view.layer.borderWidth = 0
      this.view.layer.opacity = 1.0
      this.showAllButton()
      this.settingView.hidden = false

  })
    } catch (error) {
      MNUtil.showHUD(error)
    }
  // UIView.animateWithDurationAnimationsCompletion(0.2,()=>{
  //   this.view.layer.opacity = 1.0
  //   // this.view.frame = preFrame
  //   // this.currentFrame = preFrame
  // },
  // ()=>{
  //   this.view.layer.borderWidth = 0
  //   this.showAllButton()
  //   try {
      
  //   this.settingView.hidden = false
  //   } catch (error) {
  //     MNUtil.showHUD(error)
  //   }
  // })
}
settingController.prototype.hide = function (frame) {
  toolbarUtils.studyController().view.bringSubviewToFront(this.addonBar)
  let preFrame = this.view.frame
  let preOpacity = this.view.layer.opacity
  let preCustom = this.custom
  this.hideAllButton()
  this.custom = false
  UIView.animateWithDurationAnimationsCompletion(0.25,()=>{
    this.view.layer.opacity = 0.2
    // if (frame) {
    //   this.view.frame = frame
    //   this.currentFrame = frame
    // }
    // this.view.frame = {x:preFrame.x+preFrame.width*0.1,y:preFrame.y+preFrame.height*0.1,width:preFrame.width*0.8,height:preFrame.height*0.8}
    // this.currentFrame = {x:preFrame.x+preFrame.width*0.1,y:preFrame.y+preFrame.height*0.1,width:preFrame.width*0.8,height:preFrame.height*0.8}
  },
  ()=>{
    this.view.hidden = true;
    this.view.layer.opacity = preOpacity      
    this.view.frame = preFrame
    this.currentFrame = preFrame
    this.custom = preCustom
    // this.view.frame = preFrame
    // this.currentFrame = preFrame
  })
}

settingController.prototype.creatView = function (viewName,superview="view",color="#9bb2d6",alpha=0.8) {
  this[viewName] = UIView.new()
  MNButton.setColor(this[viewName], color, alpha)
  this[viewName].layer.cornerRadius = 12
  this[superview].addSubview(this[viewName])
}

settingController.prototype.creatTextView = function (viewName,superview="view",color="#c0bfbf",alpha=0.8) {
  this[viewName] = UITextView.new()
  this[viewName].font = UIFont.systemFontOfSize(15);
  this[viewName].layer.cornerRadius = 8
  MNButton.setColor(this[viewName], color, alpha)
  this[viewName].textColor = UIColor.blackColor()
  this[viewName].delegate = this
  this[viewName].bounces = true
  // this[viewName].smartQuotesType = 2
  this[superview].addSubview(this[viewName])
}

/**
 * @this {settingController}
 */
settingController.prototype.fetch = async function (url,options = {}){
  return new Promise((resolve, reject) => {
    // UIApplication.sharedApplication().networkActivityIndicatorVisible = true
    const queue = NSOperationQueue.mainQueue()
    const request = this.initRequest(url, options)
    NSURLConnection.sendAsynchronousRequestQueueCompletionHandler(
      request,
      queue,
      (res, data, err) => {
        if (err.localizedDescription) reject(err.localizedDescription)
        // if (data.length() === 0) resolve({})
        const result = NSJSONSerialization.JSONObjectWithDataOptions(
          data,
          1<<0
        )
        if (NSJSONSerialization.isValidJSONObject(result)) resolve(result)
        resolve(result)
      }
    )
  })
}

settingController.prototype.initRequest = function (url,options) {
  const request = NSMutableURLRequest.requestWithURL(genNSURL(url))
  request.setHTTPMethod(options.method ?? "GET")
  request.setTimeoutInterval(options.timeout ?? 10)
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15",
    "Content-Type": "application/json",
    Accept: "application/json"
  }
  request.setAllHTTPHeaderFields({
    ...headers,
    ...(options.headers ?? {})
  })
  if (options.search) {
    request.setURL(
      genNSURL(
        `${url.trim()}?${Object.entries(options.search).reduce((acc, cur) => {
          const [key, value] = cur
          return `${acc ? acc + "&" : ""}${key}=${encodeURIComponent(value)}`
        }, "")}`
      )
    )
  } else if (options.body) {
    request.setHTTPBody(NSData.dataWithStringEncoding(options.body, 4))
  } else if (options.form) {
    request.setHTTPBody(
      NSData.dataWithStringEncoding(
        Object.entries(options.form).reduce((acc, cur) => {
          const [key, value] = cur
          return `${acc ? acc + "&" : ""}${key}=${encodeURIComponent(value)}`
        }, ""),
        4
      )
    )
  } else if (options.json) {
    request.setHTTPBody(
      NSJSONSerialization.dataWithJSONObjectOptions(
        options.json,
        1
      )
    )
  }
  return request
}
/**
 * @this {settingController}
 */
settingController.prototype.createWebviewInput = function (superView) {
  try {
    
  this.webviewInput = new UIWebView(this.view.bounds);
  this.webviewInput.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.8)
  this.webviewInput.scalesPageToFit = false;
  this.webviewInput.autoresizingMask = (1 << 1 | 1 << 4);
  this.webviewInput.delegate = this;
  // this.webviewInput.setValueForKey("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15","User-Agent")
  this.webviewInput.scrollView.delegate = this;
  this.webviewInput.layer.cornerRadius = 8;
  this.webviewInput.layer.masksToBounds = true;
  this.webviewInput.layer.borderColor = MNUtil.hexColorAlpha("#9bb2d6",0.8);
  this.webviewInput.layer.borderWidth = 0
  this.webviewInput.layer.opacity = 0.9
  // this.webviewInput.loadFileURLAllowingReadAccessToURL(
  //   NSURL.fileURLWithPath(this.mainPath + '/test.html'),
  //   NSURL.fileURLWithPath(this.mainPath + '/')
  // );
  this.webviewInput.loadHTMLStringBaseURL(toolbarUtils.html(`Loading...`))
    } catch (error) {
    MNUtil.showHUD(error)
  }
  if (superView) {
    this[superView].addSubview(this.webviewInput)
  }
}
/**
 * @this {settingController}
 */
settingController.prototype.setWebviewContent = function (content) {
  // toolbarUtils.copy(content)
  this.webviewInput.loadHTMLStringBaseURL(toolbarUtils.html(content))
}

/**
 * @this {settingController}
 */
settingController.prototype.setJSContent = function (content) {
  // toolbarUtils.copy(content)
  this.webviewInput.loadHTMLStringBaseURL(toolbarUtils.JShtml(content))
}

/**
 * @this {settingController}
 */
settingController.prototype.getWebviewContent = async function () {
  let content = await this.runJavaScript(`updateContent(); document.body.innerText`)
  this.webviewInput.endEditing(true)
  return content
}

/** @this {settingController} */
settingController.prototype.runJavaScript = async function(script) {
  // if(!this.webviewResponse || !this.webviewResponse.window)return;
  return new Promise((resolve, reject) => {
      this.webviewInput.evaluateJavaScript(script,(result) => {resolve(result)});
  })
};
/**
 * 
 * @type {toolbarController}
 */
settingController.prototype.toolbarController