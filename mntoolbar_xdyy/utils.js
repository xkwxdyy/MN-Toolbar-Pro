function appVersion() {
  let app = Application.sharedInstance()
  let info = {}
  let version = parseFloat(app.appVersion)
  if (version >= 4) {
    info.version = "marginnote4"
  }else{
    info.version = "marginnote3"
  }
  switch (app.osType) {
    case 0:
      info.type = "iPadOS"
      break;
    case 1:
      info.type = "iPhoneOS"
      break;
    case 2:
      info.type = "macOS"
    default:
      break;
  }
  return info
}

function getUrlByNoteId(noteid) {
  let ver = appVersion()
  return ver.version+'app://note/'+noteid
}
function strCode(str) {  //获取字符串的字节数
    var count = 0;  //初始化字节数递加变量并获取字符串参数的字符个数
    var cn = [8211, 8212, 8216, 8217, 8220, 8221, 8230, 12289, 12290, 12296, 12297, 12298, 12299, 12300, 12301, 12302, 12303, 12304, 12305, 12308, 12309, 65281, 65288, 65289, 65292, 65294, 65306, 65307, 65311]
    var half = [32, 33, 34, 35, 36, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 58, 59, 60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96, 123, 124, 125, 126,105,108,8211]
    if (str) {  //如果存在字符串，则执行
        len = str.length; 
        for (var i = 0; i < len; i++) {  //遍历字符串，枚举每个字符
          let charCode = str.charCodeAt(i)
            if (charCode>=65 && charCode<=90) {
              count += 1.5;  //大写
            } else if (half.includes(charCode)) {
              count +=0.45
            } else if (cn.includes(charCode)) {
              count +=0.8
            }else if (charCode > 255) {  //字符编码大于255，说明是双字节字符(即是中文)
                count += 2;  //则累加2个
            }else{
                count++;  //否则递加一次
            }
        }
        return count;  //返回字节数
    } else {
        return 0;  //如果参数为空，则返回0个
    }
}

function getClipboardText() {
  return UIPasteboard.generalPasteboard().string
}
function copy(text) {
  UIPasteboard.generalPasteboard().string = text
}

function copyJSON(object) {
  UIPasteboard.generalPasteboard().string = JSON.stringify(object,null,2)
}

function studyController() {
  let focusWindow = Application.sharedInstance().focusWindow
  return Application.sharedInstance().studyController(focusWindow)
}

function currentDocController() {
  let focusWindow = Application.sharedInstance().focusWindow
  return Application.sharedInstance().studyController(focusWindow).readerController.currentDocumentController
}

function currentNotebook() {
  let focusWindow = Application.sharedInstance().focusWindow
  let notebookId = Application.sharedInstance().studyController(focusWindow).notebookController.notebookId
  return getNoteBookById(notebookId)
}

function createNote(title="",content=undefined,color = undefined) {
  try {
  let notebook = currentNotebook()
  let note = Note.createWithTitleNotebookDocument(title, notebook,currentDocController().document)
  if (content) {
    // try {
    //   note.appendMarkdownComment(content)
    // } catch (error) {
      note.appendTextComment(content)
    // }
  }
  if (color !== undefined) {
    note.colorIndex = color
  }
  return note
  } catch (error) {
    showHUD(error)
  }
}
/**
 * 
 * @param {MbBookNote} parent 
 * @param {MbBookNote} targetNote 
 */
function addChildNote(parent, targetNote, colorInheritance=false) {
  undoGroupingWithRefresh(parent.notebookId, ()=>{
    if (colorInheritance) {
      targetNote.colorIndex = parent.colorIndex
    }
    parent.addChild(targetNote)
  })
}
/**
 * 
 * @param {MbBookNote} brother 
 * @param {MbBookNote} targetNote 
 */
function addBrotherNote(brother,targetNote,colorInheritance=false) {
  if (!brother.parentNote) {
    showHUD("No parent note!")
    return
  }
  let parent = brother.parentNote
  undoGroupingWithRefresh(parent.notebookId, ()=>{
    if (colorInheritance) {
      targetNote.colorIndex = brother.colorIndex
    }
    parent.addChild(targetNote)
  })
}
/**
 * 
 * @param {MbBookNote} parent 
 * @param {String} title 
 * @param {String} content
 * @param {Number} colorIndex
 */
function createChildNote(parent, title="", content=undefined) {
  let child
  undoGroupingWithRefresh(parent.notebookId, ()=>{
    child = createNote(title, content, parent.colorIndex)
    parent.addChild(child)
  })
  return child
}
/**
 * 
 * @param {MbBookNote} brother 
 * @param {String} title 
 */
function createBrotherNote(brother,title="",content=undefined,colorInheritance=false) {
  if (!brother.parentNote) {
    showHUD("No parent note!")
    return
  }
  let parent = brother.parentNote
  undoGroupingWithRefresh(parent.notebookId, ()=>{
    let child = createNote(title,content)
    if (colorInheritance) {
      child.colorIndex = brother.colorIndex
    }
    parent.addChild(child)
  })
}
/**
 * 
 * @param {MbBookNote} note
 */
function expandesConfig(note,config,orderedKeys=undefined,exclude=undefined) {
  let keys
  if (orderedKeys) {
    keys = orderedKeys
  }else{
    keys = Object.keys(config)
  }
  keys.forEach((key)=>{
    let subConfig = config[key]
    if (typeof subConfig === "object") {
      let child = createChildNote(note,key)
      expandesConfig(child, subConfig,undefined,exclude)
    }else{
      if (exclude) {
        if (key !== exclude) {
          createChildNote(note,key,config[key])
        }
      }else{
        createChildNote(note,key,config[key])
      }
    }
  })
}
function getSplitLine() {
  let study = studyController()
  let studyFrame = study.view.bounds
  let readerFrame = study.readerController.view.frame
  let hidden = study.readerController.view.hidden//true代表脑图全屏
  let rightMode = study.rightMapMode
  let fullWindow = readerFrame.width == studyFrame.width
  if (hidden || fullWindow) {
    return undefined
  }
  if (rightMode) {
    let splitLine = readerFrame.x+readerFrame.width
    return splitLine
  }else{
    let splitLine = readerFrame.x
    return splitLine
  }
}

function undoGroupingWithRefresh(notebookid,f){
  UndoManager.sharedInstance().undoGrouping(
    String(Date.now()),
    notebookid,
    f
  )
  Application.sharedInstance().refreshAfterDBChanged(notebookid)
}

function removeTextAndHtmlComments() {
  let focusNotes = getFocusNotes()
  let notbookId = focusNotes[0].notebookId
    // showHUD("type:"+(typeof focusNotes))
    // copyJSON(focusNotes)
  focusNotes.forEach(note=>{
    let textNoteIndex = []
    note.comments.map((comment,index)=>{
      if(comment.type === "TextNote" || comment.type === "HtmlNote"){
        textNoteIndex.unshift(index)
      }
    })
    UndoManager.sharedInstance().undoGrouping(
      String(Date.now()),
      notbookId,
      ()=>{
        note.noteTitle = ""
        textNoteIndex.forEach(index=>{
          note.removeCommentByIndex(index)
        })
      }
    )
  })
  Application.sharedInstance().refreshAfterDBChanged(notbookId)
}

function getNoteIdByURL(url) {
  let targetNoteId = url.trim()
  if (/^marginnote\dapp:\/\/note\//.test(targetNoteId)) {
    targetNoteId = targetNoteId.slice(22)
  }
  return targetNoteId
}
function actionTemplate(action) {
  let config = {action:action}
  switch (action) {
    case "cloneAndMerge":
      config.target = appVersion().version+"app://note/xxxx"
      break
    case "link":
      config.target = appVersion().version+"app://note/xxxx"
      config.type = "Both"
      break
    case "clearContent":
      config.target = "title"
      break
    case "setContent":
      config.target = "title"//excerptText,comment
      config.content = "test"
      break
    case "addComment":
      config.content = "test"
      break
    case "removeComment":
      config.index = 1//0表示全部，设一个特别大的值表示最后一个
      break
    case "copy":
      config.target = "title"
      break
    case "showInFloatWindow":
      config.target = appVersion().version+"app://note/xxxx"
      break
    case "addChildNote":
      config.title = "title"
      config.content = "{{clipboardText}}"
    default:
      break;
  }
  return JSON.stringify(config,null,2)
}
function getActions() {
  return {
    "copy":{name:"Copy",image:"copyExcerptPic",description:"Copy"},
    "searchInEudic":{name:"Search in Eudic",image:"searchInEudic",description:"Search in Eudic"},
    "switchTitleorExcerpt":{name:"Switch title",image:"switchTitleorExcerpt",description:"Switch title"},
    "copyAsMarkdownLink":{name:"Copy md link",image:"copyAsMarkdownLink",description:"Copy md link"},
    "search":{name:"Search",image:"search",description:"Search"},
    "bigbang":{name:"Bigbang",image:"bigbang",description:"Bigbang"},
    "snipaste":{name:"Snipaste",image:"snipaste",description:"Snipaste"},
    "chatglm":{name:"ChatAI",image:"ai",description:"ChatAI"},
    "setting":{name:"Setting",image:"setting",description:"Setting"},
    "pasteAsTitle":{name:"Paste As Title",image:"pasteAsTitle",description:"Paste As Title"},
    "clearFormat":{name:"Clear Format",image:"clearFormat",description:"Clear Format"},
    "color0":{name:"Set Color 1",image:"color0",description:"Set Color 1"},
    "color1":{name:"Set Color 2",image:"color1",description:"Set Color 2"},
    "color2":{name:"Set Color 3",image:"color2",description:"Set Color 3"},
    "color3":{name:"Set Color 4",image:"color3",description:"Set Color 4"},
    "color4":{name:"Set Color 5",image:"color4",description:"Set Color 5"},
    "color5":{name:"Set Color 6",image:"color5",description:"Set Color 6"},
    "color6":{name:"Set Color 7",image:"color6",description:"Set Color 7"},
    "color7":{name:"Set Color 8",image:"color7",description:"Set Color 8"},
    "color8":{name:"Set Color 9",image:"color8",description:"Set Color 9"},
    "color9":{name:"Set Color 10",image:"color9",description:"Set Color 10"},
    "color10":{name:"Set Color 11",image:"color10",description:"Set Color 11"},
    "color11":{name:"Set Color 12",image:"color11",description:"Set Color 12"},
    "color12":{name:"Set Color 13",image:"color12",description:"Set Color 13"},
    "color13":{name:"Set Color 14",image:"color13",description:"Set Color 14"},
    "color14":{name:"Set Color 15",image:"color14",description:"Set Color 15"},
    "color15":{name:"Set Color 16",image:"color15",description:"Set Color 16"},
    "custom1":{name:"Custom 1",image:"custom1",description: actionTemplate("cloneAndMerge")},
    "custom2":{name:"Custom 2",image:"custom2",description: actionTemplate("link")},
    "custom3":{name:"Custom 3",image:"custom3",description: actionTemplate("clearContent")},
    "custom4":{name:"Custom 4",image:"custom4",description: actionTemplate("copy")},
    "custom5":{name:"Custom 5",image:"custom5",description: actionTemplate("addChildNote")},
    "custom6":{name:"Custom 6",image:"custom6",description: actionTemplate("showInFloatWindow")},
    "custom7":{name:"Custom 7",image:"custom7",description: actionTemplate("setContent")},
    "custom8":{name:"Custom 8",image:"custom8",description: actionTemplate("addComment")},
    "custom9":{name:"Custom 9",image:"custom9",description: actionTemplate("removeComment")}
  }
}

function getDefaultActionKeys() {
  let actions = getActions()
  return Object.keys(actions)
}

function  getNoteColors() {
  return ["#ffffb4","#ccfdc4","#b4d1fb","#f3aebe","#ffff54","#75fb4c","#55bbf9","#ea3323","#ef8733","#377e47","#173dac","#be3223","#ffffff","#dadada","#b4b4b4","#bd9fdc"]
}
function hexColorAlpha(hex,alpha) {
  let color = UIColor.colorWithHexString(hex)
  return alpha!==undefined?color.colorWithAlphaComponent(alpha):color
}

function genFrame(x,y,width,height) {
  return {x:x,y:y,width:width,height:height}
}

function getImage(path,scale=2) {
  return UIImage.imageWithDataScale(NSData.dataWithContentsOfFile(path), scale)
}

function setLocalDataByKey(value,key) {
  NSUserDefaults.standardUserDefaults().setObjectForKey(value,key)
  NSUserDefaults.standardUserDefaults().synchronize()
}

function getLocalDataByKey(key) {
  return NSUserDefaults.standardUserDefaults().objectForKey(key)
}

function getLocalDataByKeyDefault(key,defaultValue) {
  let value = NSUserDefaults.standardUserDefaults().objectForKey(key)
  if (value === undefined) {
    NSUserDefaults.standardUserDefaults().setObjectForKey(defaultValue,key)
    return defaultValue
  }
  return value
}

function removeDataByKey(key) {
  NSUserDefaults.standardUserDefaults().removeObjectForKey(key)
}
function shouldPrevent(currentURL,requestURL,type) {
  let firstCheck = Application.sharedInstance().osType === 0 && (type===0 || /^https:\/\/m.inftab.com/.test(currentURL))
  if (firstCheck) {
    let blacklist = ["^https?://www.bilibili.com","^https?://m.bilibili.com","^https?://space.bilibili.com","^https?://t.bilibili.com","^https?://www.wolai.com","^https?://flowus.com","^https?://www.notion.so"]
    if (blacklist.some(url=>RegExp(url).test(requestURL))) {
      return true
    }
  }
  return false
}

function showHUD(message,duration=2) {
  let focusWindow = Application.sharedInstance().focusWindow
  Application.sharedInstance().showHUD(message,focusWindow,2)
}

function refreshAfterDBChanged(notebookid) {
  Application.sharedInstance().refreshAfterDBChanged(notebookid)
  
}
/**
 * 
 * @returns {MbBookNote[]}
 */
function getSelectNotes() {
  let notes =studyController().notebookController.mindmapView.selViewLst.map(item=>item.note.note)
  return notes
}
function getFocusNote() {
  let notebookController = studyController().notebookController
  // copy("text:"+!notebookController.view.hidden)
  if (!notebookController.view.hidden && notebookController.mindmapView && notebookController.focusNote) {
    return notebookController.focusNote
  }else{
    // showHUD("message")
    return studyController().readerController.currentDocumentController.focusNote
  }
}

function getFocusNotes() {
  let notebookController = studyController().notebookController
  // copy("test:"+(!notebookController.view.hidden && notebookController.mindmapView.selViewLst.length))
  if (!notebookController.view.hidden && notebookController.mindmapView && notebookController.mindmapView.selViewLst.length) {
    let selViewLst = notebookController.mindmapView.selViewLst
    // let focusNotes = 
    return selViewLst.map(tem=>{
      return tem.note.note
    })
  }else{
    return [studyController().readerController.currentDocumentController.focusNote]
  }
}

function getNoteById(noteid) {
  let note = Database.sharedInstance().getNoteById(noteid)
  return note
}
function getNoteBookById(notebookId) {
  let note = Database.sharedInstance().getNotebookById(notebookId)
  return note
}
function cloneNote(noteid) {
  let targetNote = getNoteById(noteid)
  if (!targetNote) {
    showHUD("Note not exists!")
    return undefined
  }
  let note = Database.sharedInstance().cloneNotesToTopic([targetNote], targetNote.notebookId)
  return note[0]
}

function postNotification(name,userInfo) {
  let focusWindow = Application.sharedInstance().focusWindow
  NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo(name, focusWindow, userInfo)
  
}

function moveElement(arr, element, direction) {
    // 获取元素的索引
    var index = arr.indexOf(element);
    if (index === -1) {
        console.log('Element not found in array');
        return;
    }
    switch (direction) {
        case 'up':
            if (index === 0) {
                console.log('Element is already at the top');
                return;
            }
            // 交换元素位置
            [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
            break;
        case 'down':
            if (index === arr.length - 1) {
                console.log('Element is already at the bottom');
                return;
            }
            // 交换元素位置
            [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
            break;
        case 'top':
            // 移除元素
            arr.splice(index, 1);
            // 添加到顶部
            arr.unshift(element);
            break;
        default:
            console.log('Invalid direction');
    }
}

function cloneAndMerge(currentNote,targetNoteId) {
  let clonedNoteId = cloneNote(targetNoteId)
  currentNote.merge(getNoteById(clonedNoteId))
}

function cloneAndMergeDifferentForSpecialColor(currentNote, colorIndex,commonColorTargetNoteId,specialColorTargetNoteId) {
  let commonColorClonedNoteId = cloneNote(commonColorTargetNoteId)
  let specialColorClonedNoteId = cloneNote(specialColorTargetNoteId)
  if (currentNote.colorIndex === colorIndex) {
    currentNote.merge(getNoteById(specialColorClonedNoteId))
  } else {
    currentNote.merge(getNoteById(commonColorClonedNoteId))
  }
}

function getVarInfo(text) {
  let config = {}
  let hasClipboardText = text.includes("{{clipboardText}}")
  let hasSelectionText = text.includes("{{selectionText}}")
  if (hasClipboardText) {
    config.clipboardText = getClipboardText()
  }
  if (hasSelectionText) {
    config.selectionText = currentDocController().selectionText
  }
  return config
}

function replacVar(text,varInfo) {
  let vars = Object.keys(varInfo)
  let original = text
  for (let i = 0; i < vars.length; i++) {
    const variable = vars[i];
    const variableText = varInfo[variable]
    original = original.replace(`{{${variable}}}`,variableText)
  }
  // copy(original)
  return original
}

function detectAndReplace(text) {
  let config = getVarInfo(text)
  return replacVar(text,config)
}

function checkHeight(height){
  if (height > 400) {
    return 400
  }else if(height < 80){
    return 80
  }else{
    return height
  }
}