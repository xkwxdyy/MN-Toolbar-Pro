JSB.require('utils');
// JSB.require('base64')
/** @return {settingController} */
const getSettingController = ()=>self
var settingController = JSB.defineClass('settingController : UIViewController <NSURLConnectionDelegate>', {
  viewDidLoad: function() {
    let self = getSettingController()
    self.init()
try {

    self.view.frame = {x:50,y:50,width:(self.appInstance.osType !== 1) ? 419 : 365,height:450}
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
    self.view.layer.borderColor = hexColorAlpha("#9bb2d6",0.8)
    self.view.layer.borderWidth = 0
    // self.autoAction = self.config.autoAction
    // self.onSelection = self.config.onSelection
    // self.onNote = self.config.onNote
    // self.onNewExcerpt = self.config.onNewExcerpt
    // self.notifyLoc = self.config.notifyLoc
    self.highlightColor = UIColor.blendedColor( hexColorAlpha("#2c4d81",0.8),
      self.appInstance.defaultTextColor,
      0.8
    );
    self.config = {}
    if (!self.config.delay) {
      self.config.delay = 0
    }
    if (self.config.ignoreShortText == undefined) {
      self.config.ignoreShortText = false
    }
    self.responseView = UIView.new()
    self.responseView.backgroundColor = hexColorAlpha("#f3f3f3")
    self.responseView.layer.cornerRadius = 13
    self.responseView.hidden = true
    self.view.addSubview(self.responseView)

    self.textviewResponse = UITextView.new()
    self.textviewResponse.font = UIFont.systemFontOfSize(16);
    self.textviewResponse.layer.cornerRadius = 8
    self.textviewResponse.backgroundColor = hexColorAlpha("#ffffff",0.8)
    self.textviewResponse.textColor = UIColor.blackColor()
    self.responseView.addSubview(self.textviewResponse)
    self.textviewResponse.text = `Loading...`
    self.textviewResponse.bounces = true

    self.textviewAsk = UITextView.new()
    self.textviewAsk.font = UIFont.systemFontOfSize(16);
    self.textviewAsk.layer.cornerRadius = 8
    self.textviewAsk.backgroundColor = hexColorAlpha("#a9ea7a",0.8)
    self.textviewAsk.textColor = UIColor.blackColor()
    self.responseView.addSubview(self.textviewAsk)
    self.textviewAsk.text = `Input here`
    self.textviewAsk.bounces = true

  
    if (!self.settingView) {
      self.createSettingView()
    }
    
} catch (error) {
  showHUD(error)
}
  self.actions = getLocalDataByKeyDefault("MNToolbar_actionConfig", getActions())
  // self.actions = getActions()
  if (!self.action) {
    self.action = getDefaultActionKeys()
  }
    self.selectedItem = self.action[0]
    try {
    // copy(self.action)
      self.setButtonText(self.action,self.selectedItem)
      self.setTextview(self.selectedItem)
      self.settingView.hidden = false
    } catch (error) {
    showHUD(error)
      
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
      showHUD(error)
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
    // Application.sharedInstance().showHUD("test", self.view.window, 2);
    // Application.sharedInstance().showHUD("process:5",Application.sharedInstance().focusWindow,5)
    let buttonHeight = 25
    // self.view.frame = self.currentFrame
    var viewFrame = self.view.bounds;
    var width    = viewFrame.width
    var height   = viewFrame.height
    self.closeButton.frame = genFrame(width-18,0,18,18)
    self.maxButton.frame = genFrame(width-43,0,18,18)
    self.moveButton.frame = {  x: width*0.5-75,  y: 0,  width: 150,  height: 15,};
    self.responseView.frame = {x:1,y:6,width:width-2,height:height-36}
    height = height-36
    self.textviewAsk.frame = {x:100,y:10,width:width-110,height:height*0.5-20}
    self.textviewResponse.frame = {x:10,y:height*0.5,width:width-110,height:height*0.5-10}
    self.settingViewLayout()
    self.refreshLayout()

  },
  changeOpacityTo:function (opacity) {
    self.view.layer.opacity = opacity
  },
  openSettingView:function () {
    let self = getSettingController()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    // self.settingController.view.hidden = false
    if (!self.settingView) {
      self.createSettingView()
    }else{
    }
    self.settingViewLayout()
    
    try {
      self.setButtonText(self.config.promptNames,self.config.currentPrompt)
      self.setTextview(self.config.currentPrompt)
      self.settingView.hidden = false
    } catch (error) {
    self.appInstance.showHUD(error,self.view.window,2)
      
    }

    // self.view.addSubview(self.tabView)
  },
  moveTopTapped :function () {
    let self = getSettingController()
    moveElement(self.action, self.selectedItem, "top")
    self.setButtonText(self.action,self.selectedItem)
    self.toolbarController.setToolbarButton(self.action)
    // self.dynamicToolbar.setToolbarButton(self.action)
    setLocalDataByKey(self.action, "MNToolbar_action")
  },
  moveForwardTapped :function () {
    let self = getSettingController()
    moveElement(self.action, self.selectedItem, "up")
    self.setButtonText(self.action,self.selectedItem)
    self.toolbarController.setToolbarButton(self.action)
    // self.dynamicToolbar.setToolbarButton(self.action)
    setLocalDataByKey(self.action, "MNToolbar_action")
  },
  moveBackwardTapped :function () {
    moveElement(self.action, self.selectedItem, "down")
    self.setButtonText(self.action,self.selectedItem)
    self.toolbarController.setToolbarButton(self.action)
    setLocalDataByKey(self.action, "MNToolbar_action")
    // self.dynamicToolbar.setToolbarButton(self.action)

  },
  resetConfig: function () {
    let self = getSettingController()
    self.action = getDefaultActionKeys()
    self.actions = getActions()
    self.toolbarController.setToolbarButton(self.action,self.actions)
    // self.toolbarController.actions = actions
    self.setButtonText(self.action,self.selectedItem)
    self.setTextview(self.selectedItem)
    setLocalDataByKey(self.action, "MNToolbar_action")
    setLocalDataByKey(self.actions, "MNToolbar_actionConfig")
  },
  closeButtonTapped: function() {
    // self.view.hidden = true;
    // self.custom = false;
    // self.dynamic = true;
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
    const frame = Application.sharedInstance().studyController(self.view.window).view.bounds
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
    let locationToMN = gesture.locationInView(self.appInstance.studyController(self.view.window).view)
    if (!self.locationToButton || !self.miniMode && (Date.now() - self.moveDate) > 100) {
      // self.appInstance.showHUD("state:"+gesture.state, self.view.window, 2);
      let translation = gesture.translationInView(self.appInstance.studyController(self.view.window).view)
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

    // showHUD("test")
    let frame = self.view.frame
    var viewFrame = self.view.bounds;
    let studyFrame = self.appInstance.studyController(self.view.window).view.bounds
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
        self.view.frame = genFrame(x,y,self.lastFrame.width,self.lastFrame.height)
        self.currentFrame  = self.view.frame
      })
    }else{
      self.view.frame = genFrame(x,y,frame.width,frame.height)
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
    return;
    copy(Object.keys(self.actions))
    let config = {}
    self.action.forEach((key)=>{
      if (key.includes("custom")) {
        config[key] = self.actions[key]
      }else{
        config[key] = ""
      }
    })
    // copyJSON(config)
    let focusNote = getFocusNote()
    if (focusNote) {
      undoGroupingWithRefresh(focusNote.notebookId, ()=>{
        focusNote.noteTitle = "MN Toolbar Config"
        expandesConfig(focusNote, config,self.action,"image")

      })
    }
    // self.configView.hidden = true
    // self.advanceView.hidden = false
    // self.autoActionView.hidden = true

    // self.configButton.backgroundColor = hexColorAlpha("#9bb2d6",0.8)
    // self.advancedButton.backgroundColor = hexColorAlpha("#457bd3",0.8)
  },
  configButtonTapped: function (params) {
    self.configView.hidden = false
    self.advanceView.hidden = true
    self.configButton.backgroundColor = hexColorAlpha("#457bd3",0.8)
    self.advancedButton.backgroundColor = hexColorAlpha("#9bb2d6",0.8)

  },
  configSaveTapped: function (params) {
    // let actionName = self.actions[self.ac]
    // self.selectedItem = title
    if (!self.selectedItem.includes("custom")) {
      showHUD("Only available for Custom Action!")
      return
    }
    try {
    let input = self.contextInput.text.replace(/“/g,`"`).replace(/”/g,`"`)
    let config = JSON.parse(input)
      
    self.actions[self.selectedItem].name = self.titleInput.text
    self.contextInput.text = input
    self.actions[self.selectedItem].description = input
    self.toolbarController.actions = self.actions
    if (self.toolbarController.dynamicToolbar) {
      self.toolbarController.dynamicToolbar.actions = self.actions
    }
    setLocalDataByKey(self.actions, "MNToolbar_actionConfig")
    showHUD("Save Custom Action: "+self.titleInput.text)
    } catch (error) {
      showHUD(error)
    }
  },
  toggleSelected:function (sender) {
    sender.isSelected = !sender.isSelected
    // self.appInstance.showHUD(text,self.view.window,2)
    let title = sender.id
    self.selectedItem = title
    // showHUD(self.words)
    self.words.forEach((entryName,index)=>{
      if (entryName !== title) {
        self["nameButton"+index].isSelected = false
        self["nameButton"+index].backgroundColor = hexColorAlpha("#ffffff",0.8);
      }
    })
    if (sender.isSelected) {
      self.setTextview(title)
    // showHUD("to dark:"+title)
      sender.backgroundColor = hexColorAlpha("#9bb2d6",0.8)
    }else{
    // showHUD("to light:"+title)

      sender.backgroundColor = hexColorAlpha("#ffffff",0.8);
    }
  },
});
settingController.prototype.init = function () {
  // /**
  //  * @type {settingController}
  //  */
  // let ctr = this
  this.homeImage = getImage(this.mainPath + `/home.png`)
  this.gobackImage = getImage(this.mainPath + `/goback.png`)
  this.goforwardImage = getImage(this.mainPath + `/goforward.png`)
  this.reloadImage = getImage(this.mainPath + `/reload.png`)
  this.stopImage = getImage(this.mainPath + `/stop.png`)
  this.settingImage = getImage(this.mainPath + `/setting.png`)
  this.appInstance = Application.sharedInstance();
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
    button.setTitleColorForState(this.highlightColor, 1);
    button.backgroundColor = hexColorAlpha("#9bb2d6",0.8);
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
    this[buttonName].setTitleColorForState(this.highlightColor, 1);
    this[buttonName].backgroundColor = hexColorAlpha("#9bb2d6",0.8)
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
    this.configView.frame = genFrame(0,40,width-2,height-60)
    this.advanceView.frame = genFrame(0,40,width-2,height-60)


    this.contextInput.frame = {x:10,y:215,width:width-20,height:height-320}
    this.titleInput.frame = {x:10,y:175,width:width-20,height:35}
    this.saveButton.frame = {x:width-80,y:height-100,width:70,height:30}
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
  this.configButton.backgroundColor = hexColorAlpha("#457bd3",0.8)
  this.configButton.layer.opacity = 1.0
  this.configButton.setTitleForState("Buttons",0)
  this.configButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)


  this.createButton("advancedButton","advancedButtonTapped:","settingView")
  // this.advancedButton.backgroundColor = hexColorAlpha("#457bd3",0.8)
  this.advancedButton.layer.opacity = 1.0
  this.advancedButton.setTitleForState("Advanced",0)
  this.advancedButton.titleLabel.font = UIFont.boldSystemFontOfSize(16)
  

  this.scrollview = UIScrollView.new()
  this.configView.addSubview(this.scrollview)
  this.scrollview.hidden = false
  this.scrollview.delegate = this
  this.scrollview.bounces = true
  this.scrollview.alwaysBounceVertical = true
  this.scrollview.layer.cornerRadius = 8
  this.scrollview.backgroundColor = hexColorAlpha("#c0bfbf",0.8)

  this.creatTextView("contextInput","configView")
  this.creatTextView("systemInput","configView")
  this.systemInput.hidden = true

  this.creatTextView("titleInput","configView","#9bb2d6")

  let text  = "123"
  this.contextInput.text = text.context
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

  let color = ["#ffffb4","#ccfdc4","#b4d1fb","#f3aebe","#ffff54","#75fb4c","#55bbf9","#ea3323","#ef8733","#377e47","#173dac","#be3223","#ffffff","#dadada","#b4b4b4","#bd9fdc"]
} catch (error) {
  showHUD(error)
}
}

settingController.prototype.setButtonText = function (names,highlight) {
    this.words = names


    // this.appInstance.showHUD(names,this.view.window,5)
    // UIPasteboard.generalPasteboard().string = this.configMode

    names.map((word,index)=>{
      if (!this["nameButton"+index]) {
        this.createButton("nameButton"+index,"toggleSelected:","scrollview")
        // this["nameButton"+index].index = index
        this["nameButton"+index].titleLabel.font = UIFont.systemFontOfSize(16);
      }
      this["nameButton"+index].hidden = false
      // this["nameButton"+index].tag = 
      // if (!this.entries[word]) {
        
      // }
      // showHUD(this.prompts[word].title)
      this["nameButton"+index].setImageForState(getImage(this.mainPath+`/${self.actions[word].image}.png`),0)
      // this["nameButton"+index].setTitleForState(word,0) 
      this["nameButton"+index].id = word

      if (word === highlight) {
        this["nameButton"+index].backgroundColor = hexColorAlpha("#9bb2d6",0.8)
        this["nameButton"+index].isSelected = true
      }else{
        this["nameButton"+index].backgroundColor = hexColorAlpha("#ffffff",0.8);
        this["nameButton"+index].isSelected = false
      }
      // this["nameButton"+index].titleEdgeInsets = {top:0,left:-100,bottom:0,right:-50}
      // this["nameButton"+index].setTitleForState(this.imagePattern[index]===this.textPattern[index]?` ${this.imagePattern[index]} `:"-1",0) 
    })
    this.refreshLayout()
}
/**
 * @this {settingController}
 */
settingController.prototype.setTextview = function (name) {
      // let entries           =  NSUserDefaults.standardUserDefaults().objectForKey('MNBrowser_entries');
      let text  = this.actions[name].name
      this.titleInput.text= text
      this.contextInput.text = this.actions[name].description
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
    // showHUD("refresh")
    // copy(this.words)
    this.words.map((word,index)=>{
      // let title = word
      // let width = strCode(title.replaceAll(" ",""))*9+15
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
      // Application.sharedInstance().showHUD("should clear", this.view.window, 2);
      for (let index = this.words.length; index < this.lastLength; index++) {
        this["nameButton"+index].hidden = true
      }
    }
    this.lastLength = this.words.length
    // Application.sharedInstance().showHUD(initY, this.view.window, 2);
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
  studyController().view.bringSubviewToFront(this.view)
  studyController().view.bringSubviewToFront(this.addonBar)
  let preFrame = this.currentFrame
  let preOpacity = this.view.layer.opacity
  this.view.layer.opacity = 0.2
  // this.settingView.hidden = true
  // if (frame) {
  //   this.view.frame = frame
  //   this.currentFrame = frame
  // }
  this.view.hidden = false
  this.miniMode = false
  this.hideAllButton()

  UIView.animateWithDurationAnimationsCompletion(0.2,()=>{
    this.view.layer.opacity = 1.0
    // this.view.frame = preFrame
    // this.currentFrame = preFrame
  },
  ()=>{
    this.view.layer.borderWidth = 0
    this.showAllButton()
    try {
      
    this.settingView.hidden = false
    } catch (error) {
      showHUD(error)
    }
  })
}
settingController.prototype.hide = function (frame) {
  studyController().view.bringSubviewToFront(this.addonBar)
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
  this[viewName].backgroundColor = hexColorAlpha(color,alpha)
  this[viewName].layer.cornerRadius = 12
  this[superview].addSubview(this[viewName])
}

settingController.prototype.creatTextView = function (viewName,superview="view",color="#c0bfbf",alpha=0.8) {
  this[viewName] = UITextView.new()
  this[viewName].font = UIFont.systemFontOfSize(15);
  this[viewName].layer.cornerRadius = 8
  this[viewName].backgroundColor = hexColorAlpha(color,alpha)
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
 * 
 * @type {toolbarController}
 */
settingController.prototype.toolbarController