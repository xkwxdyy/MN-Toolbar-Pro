// 定义一个类
class toolbarUtils {
  // 构造器方法，用于初始化新创建的对象
  constructor(name) {
    this.name = name;
  }
  static version
  static currentNoteId
  static currentSelection

  static init(){
    this.app = Application.sharedInstance()
    this.data = Database.sharedInstance()
    this.focusWindow = this.app.focusWindow
    this.version = this.appVersion()
  }
  static showHUD(message,duration=2) {
    this.app.showHUD(message,this.focusWindow,2)
  }

  static appVersion() {
    let info = {}
    let version = parseFloat(this,this.app.appVersion)
    if (version >= 4) {
      info.version = "marginnote4"
    }else{
      info.version = "marginnote3"
    }
    switch (this.app.osType) {
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
  static  getNoteColors() {
    return ["#ffffb4","#ccfdc4","#b4d1fb","#f3aebe","#ffff54","#75fb4c","#55bbf9","#ea3323","#ef8733","#377e47","#173dac","#be3223","#ffffff","#dadada","#b4b4b4","#bd9fdc"]
  }
  static getNoteById(noteid) {
    let note = this.data.getNoteById(noteid)
    return note
  }
  static getNoteBookById(notebookId) {
    let notebook = this.data.getNotebookById(notebookId)
    return notebook
  }
  static getUrlByNoteId(noteid) {
    let ver = this.appVersion()
    return ver.version+'app://note/'+noteid
  }
  /**
   * 
   * @param {String} url 
   * @returns {String}
   */
  static getNoteIdByURL(url) {
    let targetNoteId = url.trim()
    if (/^marginnote\dapp:\/\/note\//.test(targetNoteId)) {
      targetNoteId = targetNoteId.slice(22)
    }
    return targetNoteId
  }
  static clipboardText() {
    return UIPasteboard.generalPasteboard().string
  }
  static copy(text) {
    UIPasteboard.generalPasteboard().string = text
  }
  static copyJSON(object) {
    UIPasteboard.generalPasteboard().string = JSON.stringify(object,null,2)
  }
  /**
   * 
   * @param {NSData} imageData 
   */
  static copyImage(imageData) {
    UIPasteboard.generalPasteboard().setDataForPasteboardType(imageData,"public.png")
  }
  static studyController() {
    return this.app.studyController(this.focusWindow)
  }
  static studyView() {
    return this.app.studyController(this.focusWindow).view
  }
  static currentDocController() {
    return this.studyController().readerController.currentDocumentController
  }
  static get currentNotebookId() {
    return this.studyController().notebookController.notebookId
  }
  static currentNotebook() {
    return this.getNoteBookById(this.currentNotebookId)
  }
  static undoGrouping(f,notebookId = this.currentNotebookId){
    UndoManager.sharedInstance().undoGrouping(
      String(Date.now()),
      notebookId,
      f
    )
    this.app.refreshAfterDBChanged(notebookId)
  }
  /**
   * 
   * @param {MbBookNote|MNNote} currentNote 
   * @param {string} targetNoteId 
   */
  static cloneAndMerge(currentNote,targetNoteId) {
    let cloneNote = MNNote.clone(targetNoteId)
    currentNote.merge(cloneNote.note)
  }
  /**
   * 
   * @param {MbBookNote|MNNote} currentNote 
   * @param {string} targetNoteId 
   */
  static cloneAsChildNote(currentNote,targetNoteId) {
    let cloneNote = MNNote.clone(targetNoteId)
    currentNote.addChild(cloneNote.note)
  }
  static postNotification(name,userInfo) {
    NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo(name, this.focusWindow, userInfo)
  }

  static moveElement(arr, element, direction) {
      // 获取元素的索引
      var index = arr.indexOf(element);
      if (index === -1) {
          this.showHUD('Element not found in array');
          return;
      }
      switch (direction) {
          case 'up':
              if (index === 0) {
                  this.showHUD('Element is already at the top');
                  return;
              }
              // 交换元素位置
              [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
              break;
          case 'down':
              if (index === arr.length - 1) {
                  this.showHUD('Element is already at the bottom');
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
              this.showHUD('Invalid direction');
      }
  }
  static getVarInfo(text) {
    let config = {}
    let hasClipboardText = text.includes("{{clipboardText}}")
    let hasSelectionText = text.includes("{{selectionText}}")
    let hasDocName = text.includes("{{currentDocName}}")
    if (hasClipboardText) {
      config.clipboardText = MNUtil.clipboardText
    }
    if (hasSelectionText) {
      config.selectionText = MNUtil.selectionText
    }
    if (hasDocName) {
      config.currentDocName = MNUtil.getFileName(MNUtil.currentDocController.document.pathFile)
    }
    return config
  }
  /**
   * 
   * @param {string} text 
   * @param {MbBookNote|MNNote} note 
   * @returns 
   */
  static getVarInfoWithNote(text,note) {
    let config = {}
    let hasClipboardText = text.includes("{{clipboardText}}")
    let hasSelectionText = text.includes("{{selectionText}}")
    let hasDocName = text.includes("{{currentDocName}}")
    let hasTitle = text.includes("{{title}}")
    let hasNoteId = text.includes("{{noteId}}")
    if (hasTitle) {
      config.title = note.noteTitle
    }
    if (hasClipboardText) {
      config.clipboardText = MNUtil.clipboardText
    }
    if (hasSelectionText) {
      config.selectionText = MNUtil.selectionText
    }
    if (hasDocName) {
      config.currentDocName = MNUtil.getFileName(MNUtil.currentDocController.document.pathFile)
    }
    if (hasNoteId) {
      config.noteId = note.noteId
    }
    return config
  }
  static escapeStringRegexp(str) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d")
  }
  static string2Reg(str) {
    str = str.trim()
    if (!str.startsWith("/")) return new RegExp(toolbarUtils.escapeStringRegexp(str))
    const regParts = str.match(/^\/(.+?)\/([gimsuy]*)$/)
    if (!regParts) throw ""
    return new RegExp(regParts[1], regParts[2])
  }
  static getNotesByRange(range){
    if (range === undefined) {
      return [MNNote.getFocusNote()]
    }
    switch (range) {
      case "currentNotes":
        return MNNote.getFocusNotes()
      case "childNotes":
        let childNotes = []
        MNNote.getFocusNotes().map(note=>{
          childNotes = childNotes.concat(note.childNotes)
        })
        return childNotes
      case "descendants":
        let descendantNotes = []
        MNNote.getFocusNotes().map(note=>{
          descendantNotes = descendantNotes.concat(note.descendantNodes.descendant)
        })
        return descendantNotes
      default:
        return [MNNote.getFocusNote()]
    }
  }
  /**
   * 
   * @param {MNNote|MbBookNote} note 
   * @param {{target:string,type:string,index:number}} des 
   */
  static clearNoteContent(note,des){
    let target = des.target ?? "title"
    switch (target) {
      case "title":
        note.noteTitle = ""
        break;
      case "excerptText":
        note.excerptText = ""
      case "comments":
        let commentLength = note.comments.length
        let comment
        for (let i = commentLength-1; i >= 0; i--) {
          if (des.type) {
            switch (des.type) {
              case "text":
                comment = note.comments[i]
                if (comment.type === "TextNote") {
                  note.removeCommentByIndex(i)
                }
                break;
              case "link":
                comment = note.comments[i]
                if (comment.type === "LinkNote") {
                  note.removeCommentByIndex(i)
                }
                break;
              case "mergedNote":
                comment = note.comments[i]
                if (comment.type === "TextNote") {
                  note.removeCommentByIndex(i)
                }
                break;
              case "image":
                comment = note.comments[i]
                if (comment.type === "PaintNote") {
                  note.removeCommentByIndex(i)
                }
                break;
              case "html":
                comment = note.comments[i]
                if (comment.type === "HtmlNote") {
                  note.removeCommentByIndex(i)
                }
                break;
              default:
                break;
            }
          }else{
            note.removeCommentByIndex(i)
          }
        }
      default:
        break;
    }
  }
  /**
   * 
   * @param {MNNote|MbBookNote} note 
   * @param {{target:string,type:string,index:number}} des 
   */
  static setNoteContent(note,content,des){
    let target = des.target ?? "title"
    switch (target) {
      case "title":
        note.noteTitle = content
        break;
      case "excerptText":
        note.excerptText = content
      default:
        break;
    }
  }
  static clearContent(des){
    let range = des.range ?? "currentNotes"
    let targetNotes = this.getNotesByRange(range)
    MNUtil.undoGrouping(()=>{
      targetNotes.forEach(note=>{
        toolbarUtils.clearNoteContent(note, des)
      })
    })
  }
  static setContent(content,des){
    let range = des.range ?? "currentNote"
    let targetNotes = this.getNotesByRange(range)
    MNUtil.undoGrouping(()=>{
      targetNotes.forEach(note=>{
        toolbarUtils.setNoteContent(note, content,des)
      })
    })
  }
  static replace(note,ptt,des){
    let content
    switch (des.target) {
      case "title":
        content = note.noteTitle
        note.noteTitle = content.replace(ptt, des.to)
        break;
      case "excerpt":
        content = note.excerptText
        note.excerptText = content.replace(ptt, des.to)
        break;
      default:
        break;
    }
  }
  static getMergedText(note,des){
    let textList = []
    des.source.map(text=>{
      if (text.includes("{{tags}}")) {
        note.tags.map(tag=>{
          textList.push(text.replace('{{tags}}',tag))
        })
        return
      }
      if (text.includes("{{textComments}}")) {
        note.comments.map(comment=>{
          if (comment.type === "TextNote" && !/^marginnote\dapp:\/\/note\//.test(comment.text) && !comment.text.startsWith("#") ) {
            textList.push(text.replace('{{textComments}}',comment.text))
          }
        })
        return
      }
      if (text.includes("{{htmlComments}}")) {
        note.comments.map(comment=>{
          if (comment.type === "HtmlNote") {
            textList.push(text.replace('{{htmlComments}}',comment.text))
          }
        })
        return
      }
      if (text.includes("{{excerptTexts}}")) {
        // MNUtil.undoGrouping(()=>{
          note.notes.map(note=>{
            if (note.excerptText) {
              let targetText = note.excerptText
              if (des.trim) {
                targetText = targetText.trim()
              }
              textList.push(text.replace('{{excerptTexts}}',targetText))
              if (des.removeSource && note.noteId !== note.noteId) {
                  note.excerptText = ""
              }
            }
          })
        // })
        return
      }
      textList.push(toolbarUtils.detectAndReplaceWithNote(text,note)) 
    })
    let join = des.join ?? ""
    let mergedText = textList.join(join)
    return mergedText
  }
  static replacVar(text,varInfo) {
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

  static detectAndReplace(text,element=undefined) {
    let config = this.getVarInfo(text)
    if (element !== undefined) {
      config.element = element
    }
    return this.replacVar(text,config)
  }
  /**
   * 
   * @param {string} text 
   * @param {MbBookNote|MNNote} note 
   * @returns 
   */
  static detectAndReplaceWithNote(text,note) {
    let config = this.getVarInfoWithNote(text,note)
    return this.replacVar(text,config)
  }
  static checkHeight(height){
    if (height > 400) {
      return 400
    }else if(height < 80){
      return 80
    }else{
      return height
    }
  }
  static html(content){
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>JSON Editor with Highlighting</title>
    <style>
        body{
            background-color: lightgray;
        }
        .editor {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            font-family: monospace;
            white-space: pre-wrap;
            overflow: auto;
            outline: none; /* Removes the default focus outline */
        }
        .key {
            color: red;
        }
        .string {
            color: green;
        }
        .number {
            color: blue;
        }
        .boolean {
            color: magenta;
        }
        .null {
            color: gray;
        }
    </style>
</head>
<body>

<div id="editor" class="editor" contenteditable>${content}</div>

<script>
    function updateContent() {
        const editor = document.getElementById('editor');
        const json = editor.innerText;
        try {
            const parsedJson = JSON.parse(json);
            editor.innerHTML = syntaxHighlight(JSON.stringify(parsedJson, null, 4));
        } catch (e) {
            console.error("Invalid JSON:", e.message);
        }
    }

    function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        json = json.replace(/("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*")|(\b-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?\b)|(\btrue\b|\bfalse\b|\bnull\b)/g, function (match) {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
        return json;
    }

    // const editor = document.getElementById('editor');
    // editor.addEventListener('input', updateContent);

    // Set initial content and format it
    // editor.textContent = '{"name": "John", "age": 30, "city": "New York", "isEmployed": true, "projects": ["alpha", "beta"], "salary": null}';
    updateContent();
</script>

</body>
</html>
`
  }
  /**
   * 
   * @returns {Boolean}
   */
  static checkSubscribe(count = true){
    // return true
    if (typeof subscriptionConfig !== 'undefined') {
      let res = subscriptionConfig.checkSubscribed(count)
      return res
    }else{
      this.showHUD("Please install 'MN Subscription' first!")
      return false
    }
  }
  /**
   * 
   * @param {string} fullPath 
   * @returns {string}
   */
  static getExtensionFolder(fullPath) {
      // 找到最后一个'/'的位置
      let lastSlashIndex = fullPath.lastIndexOf('/');
      // 从最后一个'/'之后截取字符串，得到文件名
      let fileName = fullPath.substring(0,lastSlashIndex);
      return fileName;
  }
  static checkMNUtilsFolder(fullPath){
    let extensionFolder = this.getExtensionFolder(fullPath)
    return NSFileManager.defaultManager().fileExistsAtPath(extensionFolder+"/marginnote.extension.mnutils/main.js")
  }
}

class toolbarConfig {
  // 构造器方法，用于初始化新创建的对象
  constructor(name) {
    this.name = name;
  }
  // static defaultAction
  static isFirst = true
  static mainPath
  static action = []
  static init(){
    this.dynamic = this.getByDefault("MNToolbar_dynamic",false)
    this.windowState = this.getByDefault("MNToolbar_windowState",{})
    this.action = this.getByDefault("MNToolbar_action", this.getDefaultActionKeys())
    this.actions = this.getByDefault("MNToolbar_actionConfig", this.getActions())
    this.highlightColor = UIColor.blendedColor(
      UIColor.colorWithHexString("#2c4d81").colorWithAlphaComponent(0.8),
      toolbarUtils.app.defaultTextColor,
      0.8
    );
  }
  /**
   * 
   * @param {MbBookNote} note
   */
  static expandesConfig(note,config,orderedKeys=undefined,exclude=undefined) {
    let mnnote = MNNote.new(note)
    let keys
    if (orderedKeys) {
      keys = orderedKeys
    }else{
      keys = Object.keys(config)
    }
    keys.forEach((key)=>{
      let subConfig = config[key]
      if (typeof subConfig === "object") {
        let child = toolbarUtils.createChildNote(note,key)
        this.expandesConfig(child, subConfig,undefined,exclude)
      }else{
        if (exclude) {
          if (key !== exclude) {
            toolbarUtils.createChildNote(note,key,config[key])
          }
        }else{
          toolbarUtils.createChildNote(note,key,config[key])
        }
      }
    })
  }
static template(action) {
  let config = {action:action}
  switch (action) {
    case "cloneAndMerge":
      config.target = toolbarUtils.version.version+"app://note/xxxx"
      break
    case "link":
      config.target = toolbarUtils.version.version+"app://note/xxxx"
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
      config.target = toolbarUtils.version+"app://note/xxxx"
      break
    case "addChildNote":
      config.title = "title"
      config.content = "{{clipboardText}}"
    default:
      break;
  }
  return JSON.stringify(config,null,2)
}
static getActions() {
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
    "color0":{name:"Set Color 1",image:"color0",description:JSON.stringify({fillPattern:-1},null,2)},
    "color1":{name:"Set Color 2",image:"color1",description:JSON.stringify({fillPattern:-1},null,2)},
    "color2":{name:"Set Color 3",image:"color2",description:JSON.stringify({fillPattern:-1},null,2)},
    "color3":{name:"Set Color 4",image:"color3",description:JSON.stringify({fillPattern:-1},null,2)},
    "color4":{name:"Set Color 5",image:"color4",description:JSON.stringify({fillPattern:-1},null,2)},
    "color5":{name:"Set Color 6",image:"color5",description:JSON.stringify({fillPattern:-1},null,2)},
    "color6":{name:"Set Color 7",image:"color6",description:JSON.stringify({fillPattern:-1},null,2)},
    "color7":{name:"Set Color 8",image:"color7",description:JSON.stringify({fillPattern:-1},null,2)},
    "color8":{name:"Set Color 9",image:"color8",description:JSON.stringify({fillPattern:-1},null,2)},
    "color9":{name:"Set Color 10",image:"color9",description:JSON.stringify({fillPattern:-1},null,2)},
    "color10":{name:"Set Color 11",image:"color10",description:JSON.stringify({fillPattern:-1},null,2)},
    "color11":{name:"Set Color 12",image:"color11",description:JSON.stringify({fillPattern:-1},null,2)},
    "color12":{name:"Set Color 13",image:"color12",description:JSON.stringify({fillPattern:-1},null,2)},
    "color13":{name:"Set Color 14",image:"color13",description:JSON.stringify({fillPattern:-1},null,2)},
    "color14":{name:"Set Color 15",image:"color14",description:JSON.stringify({fillPattern:-1},null,2)},
    "color15":{name:"Set Color 16",image:"color15",description:JSON.stringify({fillPattern:-1},null,2)},
    "custom1":{name:"Custom 1",image:"custom1",description: this.template("cloneAndMerge")},
    "custom2":{name:"Custom 2",image:"custom2",description: this.template("link")},
    "custom3":{name:"Custom 3",image:"custom3",description: this.template("clearContent")},
    "custom4":{name:"Custom 4",image:"custom4",description: this.template("copy")},
    "custom5":{name:"Custom 5",image:"custom5",description: this.template("addChildNote")},
    "custom6":{name:"Custom 6",image:"custom6",description: this.template("showInFloatWindow")},
    "custom7":{name:"Custom 7",image:"custom7",description: this.template("setContent")},
    "custom8":{name:"Custom 8",image:"custom8",description: this.template("addComment")},
    "custom9":{name:"Custom 9",image:"custom9",description: this.template("removeComment")}
  }
}
static getDefaultActionKeys() {
  let actions = this.getActions()
  return Object.keys(actions)
}
static save(key,value = undefined) {
  if (value) {
    NSUserDefaults.standardUserDefaults().setObjectForKey(value,key)
  }else{
    // showHUD(key)
    switch (key) {
      case "MNToolbar_windowState":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.windowState,key)
        break;
      case "MNToolbar_dynamic":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.dynamic,key)
        break;
      case "MNToolbar_action":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.action,key)
        break;
      case "MNToolbar_actionConfig":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.actions,key)
        break;
      default:
        toolbarUtils.showHUD("Not supported")
        break;
    }
  }
  NSUserDefaults.standardUserDefaults().synchronize()
}

static get(key) {
  return NSUserDefaults.standardUserDefaults().objectForKey(key)
}

static getByDefault(key,defaultValue) {
  let value = NSUserDefaults.standardUserDefaults().objectForKey(key)
  if (value === undefined) {
    NSUserDefaults.standardUserDefaults().setObjectForKey(defaultValue,key)
    return defaultValue
  }
  return value
}

static remove(key) {
  NSUserDefaults.standardUserDefaults().removeObjectForKey(key)
}
static reset(){
  this.action = this.getDefaultActionKeys()
  this.actions = this.getActions()
  this.save("MNToolbar_action")
  this.save("MNToolbar_actionConfig")
}
}