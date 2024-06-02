JSB.require('utils')
JSB.require('settingController');
/** @return {toolbarController} */
const getToolbarController = ()=>self

var toolbarController = JSB.defineClass('toolbarController : UIViewController', {
  viewDidLoad: function() {
    let self = getToolbarController()
    // NSUserDefaults.standardUserDefaults().removeObjectForKey("MNAutoStyle")
    // let config  =  NSUserDefaults.standardUserDefaults().objectForKey("MNAutoStyle")
    self.appInstance = Application.sharedInstance();
    self.homeImage = UIImage.imageWithDataScale(NSData.dataWithContentsOfFile(self.mainPath + `/home.png`), 2)
    self.bothModeImage = UIImage.imageWithDataScale(NSData.dataWithContentsOfFile(self.mainPath + `/bothMode.png`), 2)
    self.goforwardImage = UIImage.imageWithDataScale(NSData.dataWithContentsOfFile(self.mainPath + `/goforward.png`), 2)
    self.screenImage = UIImage.imageWithDataScale(NSData.dataWithContentsOfFile(self.mainPath + `/screen.png`), 2)
    self.snipasteImage = UIImage.imageWithDataScale(NSData.dataWithContentsOfFile(self.mainPath + `/snipaste.png`), 2)
    self.closeImage = UIImage.imageWithDataScale(NSData.dataWithContentsOfFile(self.mainPath + `/stop.png`), 2)
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
    self.highlightColor = UIColor.blendedColor(
      UIColor.colorWithHexString("#2c4d81").colorWithAlphaComponent(0.8),
      Application.sharedInstance().defaultTextColor,
      0.8
    );

    if (!self.action) {
      self.action = getLocalDataByKeyDefault("MNToolbar_action", getDefaultActionKeys())
    }
    if (!self.actions) {
      self.actions = getLocalDataByKeyDefault("MNToolbar_actionConfig", getActions())
    }
    if (self.action.length == 27) {
      self.action = self.action.concat(["custom1","custom2","custom3","custom4","custom5","custom6","custom7","custom8","custom9"])
    }
    self.setToolbarButton(self.action)
// >>> opacity button >>>
    // self.webAppButton.titleLabel.font = UIFont.systemFontOfSize(12);
    // <<< opacity button <<<

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

    // self.setButtonLayout(self.screenButton,"changeScreen:")
    // self.screenButton.setImageForState(self.screenImage,0)
    // <<< screen button <<<
    self.moveGesture = new UIPanGestureRecognizer(self,"onMoveGesture:")
    self.moveButton.addGestureRecognizer(self.moveGesture)
    self.moveGesture.view.hidden = false
    self.moveGesture.addTargetAction(self,"onMoveGesture:")
    // self.moveButton.addGestureRecognizer(self.moveGesture)
    // self.imageModeButton.addGestureRecognizer(self.moveGesture)
    // self.bothModeButton.addGestureRecognizer(self.moveGesture)




    self.resizeGesture = new UIPanGestureRecognizer(self,"onResizeGesture:")
    self.screenButton.addGestureRecognizer(self.resizeGesture)
    self.resizeGesture.view.hidden = false
    self.resizeGesture.addTargetAction(self,"onResizeGesture:")

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
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
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
    var studyController = Application.sharedInstance().studyController(self.view.window);
    self.view.popoverController = new UIPopoverController(menuController);
    var r = sender.convertRectToView(sender.bounds,studyController.view);
    self.view.popoverController.presentPopoverFromRect(r, studyController.view, 1 << 1, true);
  },
  changeOpacityTo:function (opacity) {
    self.view.layer.opacity = opacity
    // self.webAppButton.setTitleForState(`${opacity*100}%`, 0);
  },
  changeScreen: function(sender) {
    self.onClick = true
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    var menuController = MenuController.new();
    // let dynamic = NSUserDefaults.standardUserDefaults().objectForKey("MNToolbar_dynamic")
    
    menuController.commandTable = [
      {title:'🌟 Dynamic',object:self,selector:'toggleDynamic:',param:1.0,checked:self.dynamic},
      {title:'⚙️ Setting',object:self,selector:'setting:',param:1.0}
    ];
    menuController.rowHeight = 35;
    menuController.preferredContentSize = {
      width: 200,
      height: menuController.rowHeight * menuController.commandTable.length
    };
    var studyController = Application.sharedInstance().studyController(self.view.window);
    self.view.popoverController = new UIPopoverController(menuController);
    var r = sender.convertRectToView(sender.bounds,studyController.view);
    self.view.popoverController.presentPopoverFromRect(r, studyController.view, 1 << 1, true);
  },
  toggleDynamic: function () {
    self.onClick = true
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo('toggleDynamic', self.view.window, {test:123})
  },
  setColor: function (button) {
    // showHUD("color:"+button.color)
    let focusNote = getFocusNote()
    undoGroupingWithRefresh(self.notebookid,()=>{
      focusNote.colorIndex = button.color
    })
    if (self.dynamicWindow) {
      self.hideAfterDelay()
    }
  },
  customAction: function (button) {
    let actionName = self.action[button.index]
  try {
    let des = JSON.parse(self.actions[actionName].description)
    let focusNote = getFocusNote()
    let notebookid = focusNote ? focusNote.notebookId : undefined
    // copyJSON(des)
    switch (des.action) {
      case "cloneAndMerge":
        showHUD("cloneAndMerge")
        let targetNoteId= getNoteIdByURL(des.target)
        undoGroupingWithRefresh(notebookid,()=>{
          getFocusNotes().forEach(focusNote=>{
            cloneAndMerge(focusNote, targetNoteId)
          })
        })
        break;
      case "addChildNote":
        showHUD("addChildNote")
        let title = ""
        if (des.title) {
          title = detectAndReplace(des.title)
        }
        let content = undefined
        if (des.content) {
          content = detectAndReplace(des.content)
        }
        // let color = undefined
        // if (des.color) {
        //   switch (des.color) {
        //     case "{{parent}}":
        //       color = focusNote.colorIndex
        //       break;
        //     default:
        //       color = des.color
        //       break;
        //   }
        // }
        createChildNote(focusNote, title, content)
        // copyJSON(des)
        break;
      case "copy":
        showHUD("copy")
        let target = des.target
        let copyContent = des.content
        if (copyContent) {
          let replacedText = detectAndReplace(copyContent)
          copy(replacedText)
          return
        }
        if (target) {
          switch (target) {
            case "title":
              copy(focusNote.noteTitle)
              break;
            case "excerpt":
              copy(focusNote.excerptText)
              break
            case "notesText":
              copy(focusNote.notesText)
              break;
            case "commtent":
              let index = 1
              if (des.index) {
                index = des.index
              }
              let comments = focusNote.comments
              let commentsLength = comments.length
              if (index > commentsLength) {
                index = commentsLength
              }
              copy(comments[index-1].text)
              break;
            case "noteId":
              copy(focusNote.noteId)
              break;
            default:
              break;
          }
        }
        break;
      case "addComment":
        showHUD("addComment")
        let comment = des.content
        if (comment) {
          let replacedText = detectAndReplace(des.content)
          let focusNotes = getFocusNotes()
          undoGroupingWithRefresh(notebookid, ()=>{
            focusNotes.forEach(note => {
              note.appendMarkdownComment(replacedText)
            })
          })
        }
        break;
      case "removeComment":
        showHUD("removeComment")
        let commentIndex = des.index+1
        if (commentIndex) {
          let focusNotes = getFocusNotes()
          undoGroupingWithRefresh(notebookid, ()=>{
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
        undoGroupingWithRefresh(notebookid, ()=>{
          let targetNoteId= getNoteIdByURL(des.target)
          let linkType = des.linkType ?? "Both"
          let targetNote = getNoteById(targetNoteId)
          getFocusNotes().forEach(note=>{
            switch (linkType) {
              case "Both":
                note.appendNoteLink(targetNote)
                targetNote.appendNoteLink(note)
                break;
              case "To":
                note.appendNoteLink(targetNote)
                break;
              case "From":
                targetNote.appendNoteLink(note)
              default:
                break;
            }
          })
        })
        break;
      case "clearContent":
        undoGroupingWithRefresh(notebookid, ()=>{
          getFocusNotes().forEach(note=>{
            let target = des.target ?? "title"
            switch (target) {
              case "title":
                note.noteTitle = ""
                break;
              case "excerptText":
                note.excerptText = ""
              case "comments":
                let commentLength = note.comments.length
                for (let i = commentLength-1; i >= 0; i--) {
                  note.removeCommentByIndex(i)
                }
              default:
                break;
            }
          })
        })
        break;
      case "setContent":
        undoGroupingWithRefresh(notebookid, ()=>{
          let content = des.content ?? "content"
          let replacedText = detectAndReplace(content)
          getFocusNotes().forEach(note=>{
            let target = des.target ?? "title"
            switch (target) {
              case "title":
                note.noteTitle = replacedText
                break;
              case "excerptText":
                note.excerptText = replacedText
              default:
                break;
            }
          })
        })
        break;
      case "showInFloatWindow":
        let targetNoteid
        switch (des.target) {
          case "{{currentNote}}":
            targetNoteid = getFocusNote().noteId
            break;
          case "{{currentChildMap}}":
            targetNoteid = studyController().notebookController.mindmapView.mindmapNodes[0].note.childMindMap.noteId
            // targetNoteid = getFocusNote().childMindMap.noteId
            break;
          case "{{parentNote}}":
            targetNoteid = getFocusNote().parentNote.noteId
            break;
          case "{{currentNoteInMindMap}}":
            let currentNotebookId = studyController().notebookController.notebookId
            
            let notebookController = studyController().notebookController
            if (!notebookController.view.hidden && notebookController.mindmapView && notebookController.focusNote) {
              targetNoteid = notebookController.focusNote.noteId
            }else{
              // showHUD("message")
              let testNote = studyController().readerController.currentDocumentController.focusNote
              targetNoteid = testNote.realGroupNoteIdForTopicId(currentNotebookId)
            }
            break;
          default:
            targetNoteid= getNoteIdByURL(des.target)
            break;
        }
        // showHUD(targetNoteid)
        studyController().focusNoteInFloatMindMapById(targetNoteid)
        break;
      case "openURL":
        // 从剪贴板获取URL并打开
        
        let url = UIPasteboard.generalPasteboard().string;  // 从剪贴板获取字符串并赋值给url
        showHUD(url);  // 调用显示HUD的函数并传入url作为参数
        Application.sharedInstance().openURL(NSURL.URLWithString(url));  // 使用Application实例打开传入的URL
        break;
      default:
        showHUD("Not supported yet...")
        break;
    }
    // if (self.dynamicWindow) {
    //   self.hideAfterDelay()
    // }
    // copyJSON(des)
  } catch (error) {
    showHUD(error)
  }
  },
  copy:function (button) {
    let self = getToolbarController()
    // try {
    //   let focusNote = getFocusNote()
    //   removeTextAndHtmlComments()
    //   let note = creatNote("title","test")
    //   // addChildNote(focusNote, note)
    //   addBrotherNote(focusNote, note,true)
    //   // createChildNote(focusNote)
    //   // focusNote.addChild(note)

    // } catch (error) {
    //   showHUD(error)
    // }
    // return
    self.onClick = true
    if (button.doubleClick) {
        let focusNote = getFocusNote()
        let text = focusNote.noteTitle
        if (text) {
          UIPasteboard.generalPasteboard().string = text
          showHUD('标题已复制')
        }else{
          showHUD('无标题')
        }
        button.doubleClick = false
      return
    }
    let focusNote = getFocusNote()
    if (focusNote.excerptText) {
      if (focusNote.excerptPic) {
        let imageData = Database.sharedInstance().getMediaByHash(focusNote.excerptPic.paint)
        UIPasteboard.generalPasteboard().setDataForPasteboardType(imageData,"public.png")
        showHUD('摘录图片已复制')
      }else{
        let text = focusNote.excerptText
        UIPasteboard.generalPasteboard().string = text
        showHUD('摘录文字已复制')
      }
    }else{
      let firstComment = focusNote.comments[0]
      switch (firstComment.type) {
        case "TextNote":
          UIPasteboard.generalPasteboard().string = firstComment.text
          showHUD('首条评论已复制')
          break;
        case "PaintNote":
          let imageData = Database.sharedInstance().getMediaByHash(firstComment.paint)
          UIPasteboard.generalPasteboard().setDataForPasteboardType(imageData,"public.png")
          showHUD('首条评论已复制')
          break;
        case "HtmlNote":
          UIPasteboard.generalPasteboard().string = firstComment.text
          showHUD('尝试复制该类型评论: '+firstComment.type)
          break;
        default:
          showHUD('暂不支持的评论类型: '+firstComment.type)
          break;
      }
    }
    if (self.dynamicWindow) {
      self.hideAfterDelay()
    }
  },
  copyAsMarkdownLink(button) {
    self.onClick = true
    // profile.click = profile.click+1
    var pasteBoard = UIPasteboard.generalPasteboard()
    // let nodes =self.appInstance.studyController(self.view.window).notebookController.mindmapView.selViewLst.map(item=>item.note.note)
try {
  

    const nodes = getFocusNotes()
    // copyJSON(nodes[0].textHighlight)
    let text = ""
    if (button.doubleClick) {
      button.doubleClick = false
      for (const note of nodes) {
        var noteid = note.noteId
        text = text+getUrlByNoteId(noteid)+'\n'
      }
      showHUD("链接已复制")

    }else{
      for (const note of nodes) {
      var noteid = note.noteId
      let noteTitle = note.noteTitle
      noteTitle = noteTitle?noteTitle:"noTitle"
      text = text+'['+noteTitle+']('+getUrlByNoteId(noteid)+')'+'\n'
      }
      showHUD("Markdown链接已复制")
    }

    pasteBoard.string = text.trim()
    // const success = await delay(0.5)
    // profile.click = 0
} catch (error) {
  showHUD(error)
}
  if (self.dynamicWindow) {
      self.hideAfterDelay()
    }
  },

  searchInEudic:function () {
    self.onClick = true
    let textSelected =self.appInstance.studyController(self.view.window).readerController.currentDocumentController.selectionText
    if (!textSelected) {
      let focusNote = getFocusNote()
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
      Application.sharedInstance().openURL(NSURL.URLWithString(url));
    }else{
      showHUD('未找到有效文字')
    }
    if (self.dynamicWindow) {
      self.hideAfterDelay()
    }
  },
  switchTitleorExcerpt() {
    self.onClick = true
    let nodes =self.appInstance.studyController(self.view.window).notebookController.mindmapView.selViewLst.map(item=>item.note.note)
    for (const note of nodes) {
      let title = note.noteTitle ?? ""
      let text = note.excerptText ?? ""
      // 只允许存在一个
      undoGroupingWithRefresh(self.notebookid,()=>{
        if ((title || text) && !(title && text)) {
          // 去除划重点留下的 ****
          note.noteTitle = text.replace(/\*\*(.*?)\*\*/g, "$1")
          note.excerptText = title
        } else if (title == text) {
          // 如果摘录与标题相同，MN 只显示标题，此时我们必然想切换到摘录
          note.noteTitle = ""
        }
      })
    }
    showHUD("标题转换完成")
    if (self.dynamicWindow) {
      self.hideAfterDelay()
    }
  },
  search: function () {
    self.onClick = true
    let focusNote = getFocusNote()
    postNotification("searchInBrowser",{noteid:focusNote.noteId})
    if (self.dynamicWindow) {
      self.hideAfterDelay()
    }
  },
  bigbang: function () {
    self.onClick = true
    let focusNote = getFocusNote()
    postNotification("bigbangNote",{noteid:focusNote.noteId})
    if (self.dynamicWindow) {
      self.hideAfterDelay()
    }
  },
  snipaste: function () {
    self.onClick = true
    let focusNote = getFocusNote()
    postNotification("snipasteNote",{noteid:focusNote.noteId})
    if (self.dynamicWindow) {
      self.hideAfterDelay()
    }
  },
  chatglm: function () {
    self.onClick = true
    let focusNote = getFocusNote()
    postNotification("chatOnNote",{noteid:focusNote.noteId})
    if (self.dynamicWindow) {
      self.hideAfterDelay()
    }
  },
  setting: function () {
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    try {
    if (!self.settingController) {
      self.settingController = settingController.new();
      if (self.addonController) {
        self.settingController.toolbarController = self.addonController
        self.addonController.settingController = self.settingController
      }else{
        self.settingController.toolbarController = self
      }
      self.settingController.mainPath = self.mainPath;
      self.settingController.action = self.action
      // self.settingController.dynamicToolbar = self.dynamicToolbar
      studyController().view.addSubview(self.settingController.view)
    }
      
    self.settingController.show()
    } catch (error) {
      showHUD(error)
    }
  },
  pasteAsTitle:function (button) {
    self.onClick = true
    let focusNote = getFocusNote()
    let text = UIPasteboard.generalPasteboard().string
    undoGroupingWithRefresh(self.notebookid,()=>{
      focusNote.noteTitle = text
    })
    if (self.dynamicWindow) {
      self.hideAfterDelay()
    }
  },
  clearFormat:function (button) {
    let self = getToolbarController()
    self.onClick = true
    let focusNote = getFocusNote()
    undoGroupingWithRefresh(self.notebookid,()=>{
      focusNote.clearFormat()
    })
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

    let locationToMN = gesture.locationInView(self.appInstance.studyController(self.view.window).view)
    if ( (Date.now() - self.moveDate) > 100) {
      let translation = gesture.translationInView(self.appInstance.studyController(self.view.window).view)
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
    let splitLine = getSplitLine()
    let docMapSplitMode = Application.sharedInstance().studyController(self.view.window).docMapSplitMode
    let location = {x:locationToMN.x - gesture.locationToBrowser.x,y:locationToMN.y -gesture.locationToBrowser.y}
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
    // if (splitLine !== 0) {
      
      // Application.sharedInstance().showHUD("splitLine:"+splitLine, self.view.window, 2);
    // }
    if (self.custom) {
      self.customMode = "None"
      self.view.frame = {x:x,y:y,width:40,height:checkHeight(self.lastFrame.height)}
      self.currentFrame  = self.view.frame
    }else{
      self.view.frame = {x:x,y:y,width:40,height:checkHeight(frame.height)}
      self.currentFrame  = self.view.frame

    }
    self.setToolbarLayout()
    if (self.dynamicWindow) {
      let config =  NSUserDefaults.standardUserDefaults().objectForKey("MNToolbar_windowState")
      NSUserDefaults.standardUserDefaults().setObjectForKey({open:config.open,frame:self.view.frame},"MNToolbar_windowState")
    }else{
      NSUserDefaults.standardUserDefaults().setObjectForKey({open:true,frame:self.view.frame},"MNToolbar_windowState")
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
    height = checkHeight(height)
    //  Application.sharedInstance().showHUD(`{x:${translation.x},y:${translation.y}}`, self.view.window, 2);
    //  self.view.frame = {x:frame.x,y:frame.y,width:frame.width+translationX,height:frame.height+translationY}
    self.view.frame = {x:frame.x,y:frame.y,width:40,height:height}
    self.currentFrame  = self.view.frame
    if (self.dynamicWindow) {
      let config = getLocalDataByKey("MNToolbar_windowState")
      setLocalDataByKey({open:config.open,frame:self.view.frame},"MNToolbar_windowState")
    }else{
      setLocalDataByKey({open:true,frame:self.view.frame},"MNToolbar_windowState")
    }
    // copy(JSON.stringify(self.currentFrame))
  }
});
toolbarController.prototype.setButtonLayout = function (button,targetAction) {
    button.autoresizingMask = (1 << 0 | 1 << 3);
    button.setTitleColorForState(UIColor.whiteColor(),0);
    button.setTitleColorForState(this.highlightColor, 1);
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
    button.setTitleColorForState(this.highlightColor, 1);
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
toolbarController.prototype.show = function (frame) {
  let preFrame = this.view.frame
  preFrame.width = 40
  preFrame.height = checkHeight(preFrame.height)
  this.onAnimate = true
  // preFrame.width = 40
  let yBottom = preFrame.y+preFrame.height
  let preOpacity = this.view.layer.opacity
  this.view.layer.opacity = 0.2
  if (frame) {
    frame.width = 40
    frame.height = checkHeight(frame.height)
    this.view.frame = frame
    this.currentFrame = frame
  }
  this.view.hidden = false
  this.moveButton.hidden = true
  this.screenButton.hidden = true
  for (let index = 0; index < this.buttonNumber; index++) {
    this["ColorButton"+index].hidden = true
  }
  // showHUD(JSON.stringify(preFrame))
  UIView.animateWithDurationAnimationsCompletion(0.2,()=>{
    this.view.layer.opacity = preOpacity
    this.view.frame = preFrame
    this.currentFrame = preFrame
  },
  ()=>{
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
    showHUD(error)
  }
  })
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
        // Application.sharedInstance().showHUD(JSON.stringify(frame),this.view.window,2)
  // this.moveButton.hidden = true
  for (let index = 0; index < this.buttonNumber; index++) {
    this["ColorButton"+index].hidden = true
  }
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
  if (newActions) {
    this.actions = newActions
  }else if (!this.actions) {
    this.actions = getActions()
  }
  if (!actionNames) {
    this.action = getDefaultActionKeys()
    actionNames = this.action
  }else{
    this.action = actionNames
  }
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
    let image = this.actions[actionName].image+".png"
    this["ColorButton"+index].setImageForState(getImage(this.mainPath + `/`+image),0)
    // self["ColorButton"+index].setTitleForState("",0) 
    // self["ColorButton"+index].contentHorizontalAlignment = 1
  }
  if (this.dynamicToolbar) {
    this.dynamicToolbar.setToolbarButton(actionNames,newActions)
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