// JSB.require('utils');
// JSB.require('base64')
/** @return {settingController} */
const getSettingController = ()=>self
var settingController = JSB.defineClass('settingController : UIViewController <NSURLConnectionDelegate>', {
  viewDidLoad: function() {
    let self = getSettingController()
try {
    self.init()
    self.view.frame = {x:50,y:50,width:365,height:450}
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
    self.view.layer.opacity = 0.5
    self.view.layer.borderColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
    self.view.layer.borderWidth = 0
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
    self.createButton("closeButton","closeButtonTapped:")
    self.closeButton.setTitleForState('✖️', 0);
    self.closeButton.titleLabel.font = UIFont.systemFontOfSize(10);

    self.createButton("maxButton","maxButtonTapped:")
    self.maxButton.setTitleForState('➕', 0);
    self.maxButton.titleLabel.font = UIFont.systemFontOfSize(10);

    self.createButton("moveButton")
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
    self.closeButton.frame = MNUtil.genFrame(width-18,0,18,18)
    self.maxButton.frame = MNUtil.genFrame(width-43,0,18,18)
    self.moveButton.frame = MNUtil.genFrame(width*0.5-75, 0, 150, 15)
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
  resetConfig: function (button) {
  try {
    let clickDate = Date.now()
    if (button.clickDate && clickDate-button.clickDate<300) {
    
      let self = getSettingController()
      toolbarConfig.reset()
      self.toolbarController.setToolbarButton(toolbarConfig.action,toolbarConfig.actions)
      // self.toolbarController.actions = actions
      self.setButtonText(toolbarConfig.action,toolbarConfig.action[0])
      self.setTextview(toolbarConfig.action[0])
    }else{
      button.clickDate = clickDate
      MNUtil.showHUD("Double click to reset actions!")
    }
  } catch (error) {
    MNUtil.showHUD("Error in resetConfig: "+error)
  }
  },
  closeButtonTapped: function() {
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
      self.hideAllButton()
      UIView.animateWithDurationAnimationsCompletion(0.3,()=>{
        self.view.frame = self.lastFrame
        self.currentFrame = self.lastFrame
      },
      ()=>{
        self.showAllButton()
      
      })
      return
    }
    const frame = toolbarUtils.studyController().view.bounds
    self.lastFrame = self.view.frame
    self.customMode = "full"
    self.custom = true;
    self.dynamic = false;
    self.hideAllButton()


    UIView.animateWithDurationAnimationsCompletion(0.3,()=>{
      self.view.frame = {x:40,y:50,width:frame.width-80,height:frame.height-70}
      self.currentFrame = {x:40,y:50,width:frame.width-80,height:frame.height-70}
    },
    ()=>{
      self.showAllButton()
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
      if (gesture.state !== 3 && (newY<buttonFrame.height+5 && newY>-5 && newX<buttonFrame.width+5 && newX>-5 && Math.abs(translation.y)<20 && Math.abs(translation.x)<20)) {
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
      UIView.animateWithDurationAnimations(0.2,()=>{
        self.view.frame = MNUtil.genFrame(x,y,self.lastFrame.width,self.lastFrame.height)
        self.currentFrame  = self.view.frame
      })
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
    if (width <= 330) {
      width = 330
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
  configSaveTapped: async function (params) {
    // MNUtil.copy(self.selectedItem)
    if (!self.selectedItem.includes("custom") && !self.selectedItem.includes("color") && self.selectedItem !== "ocr") {
      MNUtil.showHUD("Only available for Custom Action!")
      return
    }
    try {
    let selected = self.selectedItem
    let input = await self.getWebviewContent()
    // toolbarUtils.copy(selected)
    if (MNUtil.isValidJSON(input)) {
      toolbarConfig.actions[selected].description = input
      toolbarConfig.actions[selected].name = self.titleInput.text
      self.toolbarController.actions = toolbarConfig.actions
      if (self.toolbarController.dynamicToolbar) {
        self.toolbarController.dynamicToolbar.actions = toolbarConfig.actions
      }
      toolbarConfig.save("MNToolbar_actionConfig")
      MNUtil.showHUD("Save Custom Action: "+self.titleInput.text)
    }else{
      MNUtil.showHUD("Invalid JSON format!")
    }
    } catch (error) {
      MNUtil.showHUD(error)
    }
  },
  configRunTapped: async function (params) {
  try {
    let selected = self.selectedItem
    if (selected.includes("custom")  || selected.includes("color") || selected === "ocr") {
      let input = await self.getWebviewContent()
      // toolbarUtils.copy(selected)
      if (MNUtil.isValidJSON(input)) {
        toolbarConfig.actions[selected].description = input
        toolbarConfig.actions[selected].name = self.titleInput.text
        self.toolbarController.actions = toolbarConfig.actions
        if (self.toolbarController.dynamicToolbar) {
          self.toolbarController.dynamicToolbar.actions = toolbarConfig.actions
        }
        toolbarConfig.save("MNToolbar_actionConfig")
        MNUtil.showHUD("Save & Run Custom Action: "+self.titleInput.text)
      }else{
        MNUtil.showHUD("Invalid JSON format!")
        return
      }
    }
    if (selected.includes("custom")) {
      self.toolbarController.customAction(selected)
      return
    }
    if (selected.includes("color")) {
      let colorIndex = parseInt(selected.split("color")[1])
      toolbarUtils.setColor(colorIndex)
      return
    }
    MNUtil.showHUD("Not supported")
  } catch (error) {
    MNUtil.showHUD(error)
  }
  },
  toggleSelected:function (sender) {
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
      toolbarConfig.save("MNToolbar_addonLogos")
      MNUtil.refreshAddonCommands()
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
    this.closeButton.layer.opacity = opacity
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
    this.settingView.frame = {x:0,y:20,width:width,height:height-20}
    this.configView.frame = MNUtil.genFrame(0,40,width-2,height-60)
    this.advanceView.frame = MNUtil.genFrame(0,40,width-2,height-60)
    this.webviewInput.frame = {x:10,y:215,width:width-20,height:height-320}
    this.titleInput.frame = {x:10,y:175,width:width-20,height:35}
    this.saveButton.frame = {x:width-80,y:height-100,width:70,height:30}
    this.runButton.frame = {x:width-155,y:height-100,width:70,height:30}
    this.scrollview.frame = {x:10,y:15,width:width-20,height:150}
    this.scrollview.contentSize = {width:width-20,height:height};
    this.configReset.frame = {x:width-75,y:130,width:60,height:30}
    this.moveTopButton.frame = {x:width-210,y:130,width:40,height:30}
    this.moveUpButton.frame = {x:width-165,y:130,width:40,height:30}
    this.moveDownButton.frame = {x:width-120,y:130,width:40,height:30}


    let settingFrame = this.settingView.bounds
    settingFrame.x = 5
    settingFrame.y = 5
    settingFrame.height = 40
    settingFrame.width = settingFrame.width-10
    this.tabView.frame = settingFrame
    settingFrame.width = 85
    settingFrame.y = 10
    settingFrame.x = 10
    settingFrame.height = 30
    this.configButton.frame = settingFrame
    settingFrame.x = 100
    settingFrame.width = 90
    this.advancedButton.frame = settingFrame
    this.editorButton.frame = MNUtil.genFrame(10, 10, width-20, 35)
    this.chatAIButton.frame = MNUtil.genFrame(10, 50, width-20, 35)
    this.snipasteButton.frame = MNUtil.genFrame(10, 90, width-20, 35)
    this.autoStyleButton.frame = MNUtil.genFrame(10, 130, width-20, 35)
    this.browserButton.frame = MNUtil.genFrame(10, 170, width-20, 35)
}


/**
 * @this {settingController}
 */
settingController.prototype.createSettingView = function (){
try {
  

  this.creatView("settingView","view","#ffffff",1.0)
  this.settingView.hidden = true
  this.creatView("tabView","settingView")
  this.creatView("configView","settingView","#9bb2d6",0.0)

  this.creatView("advanceView","settingView","#9bb2d6",0.0)
  this.advanceView.hidden = true


  this.createButton("configButton","configButtonTapped:","settingView")
  MNButton.setColor(this.configButton, "#457bd3", 0.8)

  this.configButton.layer.opacity = 1.0
  this.configButton.setTitleForState("Buttons",0)
  this.configButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)


  this.createButton("advancedButton","advancedButtonTapped:","settingView")
  this.advancedButton.layer.opacity = 1.0
  this.advancedButton.setTitleForState("Advanced",0)
  this.advancedButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  
  this.createButton("editorButton","toggleAddonLogo:","advanceView")
  this.editorButton.layer.opacity = 1.0
  this.editorButton.addon = "MNEditor"
  this.editorButton.setTitleForState("MNEditor: "+(toolbarConfig.checkLogoStatus("MNEditor")?"✅":"❌"),0)
  this.editorButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)

  this.createButton("chatAIButton","toggleAddonLogo:","advanceView")
  this.chatAIButton.layer.opacity = 1.0
  this.chatAIButton.addon = "MNChatAI"
  this.chatAIButton.setTitleForState("MNChatAI: "+(toolbarConfig.checkLogoStatus("MNChatAI")?"✅":"❌"),0)
  this.chatAIButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)

  this.createButton("snipasteButton","toggleAddonLogo:","advanceView")
  this.snipasteButton.layer.opacity = 1.0
  this.snipasteButton.addon = "MNSnipaste"
  this.snipasteButton.setTitleForState("MNSnipaste: "+(toolbarConfig.checkLogoStatus("MNSnipaste")?"✅":"❌"),0)
  this.snipasteButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)

  this.createButton("autoStyleButton","toggleAddonLogo:","advanceView")
  this.autoStyleButton.layer.opacity = 1.0
  this.autoStyleButton.addon = "MNAutoStyle"
  this.autoStyleButton.setTitleForState("MNAutoStyle: "+(toolbarConfig.checkLogoStatus("MNAutoStyle")?"✅":"❌"),0)
  this.autoStyleButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  
  this.createButton("browserButton","toggleAddonLogo:","advanceView")
  this.browserButton.layer.opacity = 1.0
  this.browserButton.addon = "MNBrowser"
  this.browserButton.setTitleForState("MNBrowser: "+(toolbarConfig.checkLogoStatus("MNBrowser")?"✅":"❌"),0)
  this.browserButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)

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
  this.configReset.setTitleForState("Reset",0)

  this.createButton("moveUpButton","moveForwardTapped:","configView")
  this.moveUpButton.layer.opacity = 1.0
  this.moveUpButton.setTitleForState("⬆",0)
  this.createButton("moveDownButton","moveBackwardTapped:","configView")
  this.moveDownButton.layer.opacity = 1.0
  this.moveDownButton.setTitleForState("⬇",0)
  this.createButton("moveTopButton","moveTopTapped:","configView")
  this.moveTopButton.layer.opacity = 1.0
  this.moveTopButton.setTitleForState("🔝",0)

  this.createButton("saveButton","configSaveTapped:","configView")
  this.saveButton.layer.opacity = 1.0
  this.saveButton.setTitleForState("Save",0)

  this.createButton("runButton","configRunTapped:","configView")
  this.runButton.layer.opacity = 1.0
  this.runButton.setTitleForState("Run",0)
  
  let color = ["#ffffb4","#ccfdc4","#b4d1fb","#f3aebe","#ffff54","#75fb4c","#55bbf9","#ea3323","#ef8733","#377e47","#173dac","#be3223","#ffffff","#dadada","#b4b4b4","#bd9fdc"]
} catch (error) {
  toolbarUtils.addErrorLog(error, "createSettingView")
}
}
/**
 * @this {settingController}
 */
settingController.prototype.setButtonText = function (names,highlight) {
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
      if (word in actions) {
        MNButton.setImage(this[buttonName], this.mainPath+`/${actions[word].image}.png`)
      }else{
        MNButton.setImage(this[buttonName], this.mainPath+`/${defaultActions[word].image}.png`)
      }
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
        this.setWebviewContent(description)
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
  this.closeButton.hidden = true
  this.maxButton.hidden = true
}
settingController.prototype.showAllButton = function (frame) {
  this.moveButton.hidden = false
  this.closeButton.hidden = false
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
settingController.prototype.getWebviewContent = async function () {
  return await this.runJavaScript(`updateContent(); document.body.innerText`)
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