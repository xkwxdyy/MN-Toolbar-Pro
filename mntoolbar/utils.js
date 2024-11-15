class Frame{
  static gen(x,y,width,height){
    return MNUtil.genFrame(x, y, width, height)
  }
  /**
   * 
   * @param {UIView} view 
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number} height 
   */
  static set(view,x,y,width,height){
    let oldFrame = view.frame
    let frame = view.frame
    if (x !== undefined) {
      frame.x = x
    }else if (view.x !== undefined) {
      frame.x = view.x
    }
    if (y !== undefined) {
      frame.y = y
    }else if (view.y !== undefined) {
      frame.y = view.y
    }
    if (width !== undefined) {
      frame.width = width
    }else if (view.width !== undefined) {
      frame.width = view.width
    }
    if (height !== undefined) {
      frame.height = height
    }else if (view.height !== undefined) {
      frame.height = view.height
    }
    if (!this.sameFrame(oldFrame,frame)) {
      view.frame = frame
    }
  }
  static sameFrame(frame1,frame2){
    if (frame1.x === frame2.x && frame1.y === frame2.y && frame1.width === frame2.width && frame1.height === frame2.height) {
      return true
    }
    return false
  }
  /**
   * 
   * @param {UIView} view 
   * @param {number} x
   */
  static setX(view,x){
    let frame = view.frame
    frame.x = x
    view.frame = frame
  }
  /**
   * 
   * @param {UIView} view 
   * @param {number} y
   */
  static setY(view,y){
    let frame = view.frame
    frame.y = y
    view.frame = frame
  }
  /**
   * 
   * @param {UIView} view
   * @param {number} x 
   * @param {number} y 
   */
  static setLoc(view,x,y){
    let frame = view.frame
    frame.x = x
    frame.y = y
    if (view.width) {
      frame.width = view.width
    }
    if (view.height) {
      frame.height = view.height
    }
    view.frame = frame
  }
  /**
   * 
   * @param {UIView} view 
   * @param {number} width 
   * @param {number} height 
   */
  static setSize(view,width,height){
    let frame = view.frame
    frame.width = width
    frame.height = height
    view.frame = frame
  }
  /**
   * 
   * @param {UIView} view 
   * @param {number} width
   */
  static setWidth(view,width){
    let frame = view.frame
    frame.width = width
    view.frame = frame
  }
  /**
   * 
   * @param {UIView} view 
   * @param {number} height
   */
  static setHeight(view,height){
    let frame = view.frame
    frame.height = height
    view.frame = frame
  }
  /**
   * 
   * @param {UIView} view 
   * @param {number} xDiff
   */
  static moveX(view,xDiff){
    let frame = view.frame
    frame.x = frame.x+xDiff
    view.frame = frame
  }
  /**
   * 
   * @param {UIView} view 
   * @param {number} yDiff
   */
  static moveY(view,yDiff){
    let frame = view.frame
    frame.y = frame.y+yDiff
    view.frame = frame
  }
}



// 获取UITextView实例的所有属性
function getAllProperties(obj) {
    var props = [];
    var proto = obj;
    while (proto) {
        props = props.concat(Object.getOwnPropertyNames(proto));
        proto = Object.getPrototypeOf(proto);
    }
    return props;
}
// 定义一个类
class toolbarUtils {
  // 构造器方法，用于初始化新创建的对象
  constructor(name) {
    this.name = name;
  }
  static errorLog = []
  static version
  static currentNoteId
  static currentSelection
  static isSubscribe = false
  /**
   * @type {MNNote[]}
   * @static
   */
  static sourceToRemove = []
  static commentToRemove = {}
  /**
   * @type {UITextView}
   * @static
   */
  static textView
  static template = {
      "🔨 empty action":{
          "description": "空白动作",
          "action": "xxx",
      },
      "🔨 empty action with double click":{
        "description": "空白动作 带双击动作",
        "action": "xxx",
        "doubleClick": {
          "action": "xxx"
        }
      },
      "🔨 empty action with finish action":{
        "description": "空白动作 带结束动作",
        "action": "xxx",
        "onFinish": {
          "action": "xxx"
        }
      },
      "🔨 setColor default":{},
      "🔨 with fillpattern: both":{
        "fillPattern":-1
      },
      "🔨 with fillpattern: fill":{
        "fillPattern":-1
      },
      "🔨 with fillpattern: border":{
        "fillPattern":-1
      },
      "🔨 with followAutoStyle":{
        "followAutoStyle":true
      },
      "🔨 insert snippet":{
        "description": "在输入框中插入文本片段",
        "action": "insertSnippet",
        "content": "test"
      },
      "🔨 insert snippet with menu":{
        "description": "弹出菜单,选择要在输入框中插入的文本片段",
        "action": "insertSnippet",
        "target": "menu",
        "menuItems": [
          {
            "menuTitle": "插入序号1️⃣",
            "content": "1️⃣ "
          },
          {
            "menuTitle": "插入序号2️⃣",
            "content": "2️⃣ "
          },
          {
            "menuTitle": "插入序号3️⃣",
            "content": "3️⃣ "
          },
          {
            "menuTitle": "插入序号4️⃣",
            "content": "4️⃣ "
          },
          {
            "menuTitle": "插入序号5️⃣",
            "content": "5️⃣ "
          },
          {
            "menuTitle": "插入序号6️⃣",
            "content": "6️⃣ "
          },
          {
            "menuTitle": "插入序号7️⃣",
            "content": "7️⃣ "
          },
          {
            "menuTitle": "插入序号8️⃣",
            "content": "8️⃣ "
          },
          {
            "menuTitle": "插入序号9️⃣",
            "content": "9️⃣ "
          }
        ]
      },
      "🔨 add note index":{
          "description": "多选状态下,给选中的卡片标题加序号",
          "action": "mergeText",
          "target": "title",
          "source": [
              "{{noteIndex}}、{{title}}"
          ]
      },
      "🔨 toggle mindmap":{
          "description": "开关脑图界面",
          "action": "command",
          "command": "ToggleMindMap"
      },
      "🔨 smart copy":{
        "description": "智能复制",
        "action": "copy",
        "target": "auto"
      },
      "🔨 copy with menu":{
          "description": "弹出菜单以选择需要复制的内容",
          "action": "copy",
          "target": "menu"
      },
      "🔨 copy markdown link":{
        "description": "复制markdown链接, 以卡片内容为标题,卡片url为链接",
        "action": "copy",
        "content": "[{{note.allText}}]({{{note.url}}})"
      },
      "🔨 toggle markdown":{
        "description": "切换摘录markdown渲染",
        "action": "toggleMarkdown"
      },
      "🔨 toggle textFirst":{
        "description": "切换摘录文本优先",
        "action": "toggleTextFirst"
      },
      "🔨 chatAI with menu":{
        "description": "弹出菜单选择需要执行的prompt",
        "action": "chatAI",
        "target": "menu"
      },
      "🔨 chatAI in prompt":{
        "description": "执行预定好的prompt",
        "action": "chatAI",
        "target": "翻译"
      },
      "🔨 chatAI in custom prompt":{
        "description": "指定user和system",
        "action": "chatAI",
        "user": "test",
        "system": "test"
      },
      "🔨 search with menu":{
        "description": "弹出菜单选择需要在Browser中搜索的内容",
        "action": "search",
        "target": "menu"
      },
      "🔨 search in Baidu":{
        "description": "弹出菜单选择搜索的目的",
        "action": "search",
        "target": "Baidu"
      },
      "🔨 OCR with menu":{
        "description": "弹出菜单选择OCR的目的",
        "action": "ocr",
        "target": "menu"
      },
      "🔨 OCR as chat mode reference":{
        "description": "OCR 结果作为聊天模式引用",
        "action": "ocr",
        "target": "chatModeReference"
      },
      "🔨 OCR to clipboard":{
        "description": "OCR 到剪贴板",
        "action": "ocr",
        "target": "clipboard"
      },
      "🔨 OCR with onFinish":{
        "description": "OCR结束后执行特定动作",
        "action": "ocr",
        "target": "excerpt",
        "onFinish":{
          "action": "xxx"
        }
      },
      "🔨 toggle full doc and tab bar":{
          "description": "开关文档全屏和标签页",
          "action": "command",
          "commands": [
              "ToggleFullDoc",
              "ToggleTabsBar"
          ]
      },
      "🔨 merge text of merged notes":{
          "description": "把合并的卡片的文本合并到主卡片的摘录中",
          "action": "mergeText",
          "target": "excerptText",
          "source": [
              "{{excerptTexts}},"
          ],
          "removeSource": true
      },
      "🔨 create & move to main mindmap":{
        "description": "创建摘录并移动到主脑图",
        "action": "noteHighlight",
        "mainMindMap": true
      },
      "🔨 create & move as child note":{
        "description": "创建摘录并移动到指定卡片下",
        "action": "noteHighlight",
        "parentNote": "marginnote4app://note/xxx"
      },
      "🔨 move note to main mindmap":{
        "description": "将当前笔记移动到主脑图中",
        "action": "moveNote",
        "target": "mainMindMap"
      },
    	"🔨 menu with actions":{
        "description": "弹出菜单以选择要执行的动作",
        "action": "menu",
        "menuItems": [
            "🔽 我是标题",
            {
                "action": "copy",
                "menuTitle": "123",
                "content": "test"
            },
            {
                "action": "toggleView",
                "targets": [
                    "mindmapToolbar",
                    "addonBar"
                ],
                "autoClose": false,
                "menuTitle": "toggle"
            }
        ]
      },
      "🔨 focus in float window":{
        "description": "在浮动窗口中显示当前笔记",
        "action": "showInFloatWindow",
        "target": "currentNoteInMindMap"
      }
    }
  static init(){
  try {
    this.app = Application.sharedInstance()
    this.data = Database.sharedInstance()
    this.focusWindow = this.app.focusWindow
    this.version = this.appVersion()
      } catch (error) {
    this.addErrorLog(error, "init")
  }
  }
  static showHUD(message,duration=2) {
    this.app.showHUD(message,this.focusWindow,2)
  }
  static refreshSubscriptionStatus(){
    this.isSubscribe = this.checkSubscribe(false,false,true)
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
        break;
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
  static mergeWhitespace(str) {
      if (!str) {
        return ""
      }
      // 先将多个连续的换行符替换为双换行符
      var tempStr = str.replace(/\n+/g, '\n\n');
      // 再将其它的空白符（除了换行符）替换为单个空格
      return tempStr.replace(/[\r\t\f\v ]+/g, ' ').trim();
  }
static replaceAction(des){
try {

  let range = des.range ?? "currentNotes"
  let targetNotes = toolbarUtils.getNotesByRange(range)
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
    return;
  }
  //如果没有steps则直接执行
  let ptt = toolbarUtils._replace_get_ptt_(des)
  MNUtil.undoGrouping(()=>{
    targetNotes.forEach(note=>{
      toolbarUtils.replace(note, ptt, des)
    })
  })
  } catch (error) {
  this.addErrorLog(error, "replace")
}
}
static isPureMNImages(markdown) {
  try {
    // 匹配 base64 图片链接的正则表达式
    const MNImagePattern = /!\[.*?\]\((marginnote4app\:\/\/markdownimg\/png\/.*?)(\))/g;
    let res = markdown.match(MNImagePattern)
    if (res) {
      return markdown === res[0]
    }else{
      return false
    }
  } catch (error) {
    editorUtils.addErrorLog(error, "isPureMNImages")
    return false
  }
}
static hasMNImages(markdown) {
  try {
    // 匹配 base64 图片链接的正则表达式
    const MNImagePattern = /!\[.*?\]\((marginnote4app\:\/\/markdownimg\/png\/.*?)(\))/g;
    let link = markdown.match(MNImagePattern)[0]
    // MNUtil.copyJSON({"a":link,"b":markdown})
    return markdown.match(MNImagePattern)?true:false
  } catch (error) {
    editorUtils.addErrorLog(error, "hasMNImages")
    return false
  }
}
  /**
   * 
   * @param {string} markdown 
   * @returns {NSData}
   */
static getMNImagesFromMarkdown(markdown) {
  try {
    const MNImagePattern = /!\[.*?\]\((marginnote4app\:\/\/markdownimg\/png\/.*?)(\))/g;
    let link = markdown.match(MNImagePattern)[0]
    // MNUtil.copyJSON(link)
    let hash = link.split("markdownimg/png/")[1].slice(0,-1)
    let imageData = MNUtil.getMediaByHash(hash)
    return imageData
    // let images = []
    // 处理 Markdown 字符串，替换每个 base64 图片链接
    // const result = markdown.replace(MNImagePattern, (match, MNImageURL,p2) => {
    //   // 你可以在这里对 base64Str 进行替换或处理
    //   // shouldOverWritten = true
    //   let hash = MNImageURL.split("markdownimg/png/")[1]
    //   let base64 = MNUtil.getMediaByHash(hash).base64Encoding()
    //   return match.replace(MNImageURL, `test`);
    // });
    // MNUtil.copy(result)
    // return result;
  } catch (error) {
    editorUtils.addErrorLog(error, "replaceBase64ImagesWithR2")
    return undefined
  }
}
/**
 * 
 * @param {string} text 
 * @param {UITextView} textView
 */
static insertSnippetToTextView(text, textView) {

  let textLength = text.length
  let cursorLocation = textLength
  if (/{{cursor}}/.test(text)) {
    cursorLocation = text.indexOf("{{cursor}}")
    text = text.replace(/{{cursor}}/g, "")
    textLength = text.length
  }
  let selectedRange = textView.selectedRange
  let pre = textView.text.slice(0,selectedRange.location)
  let post = textView.text.slice(selectedRange.location+selectedRange.length)
  textView.text = pre+text+post
  textView.selectedRange = {location:selectedRange.location+cursorLocation,length:0}
}
  static smartCopy(){
    MNUtil.showHUD("smartcopy")
    let selection = MNUtil.currentSelection
    if (selection.onSelection) {
      if (selection.isText) {
        MNUtil.copy(selection.text)
        MNUtil.showHUD('复制选中文本')
      }else{
        MNUtil.copyImage(selection.image)
        MNUtil.showHUD('复制框选图片')
      }
      return
    }
    let focusNote = MNNote.getFocusNote()
    if (!focusNote) {
      MNUtil.showHUD("No note found")
      return
    }
    if (focusNote.excerptPic && !focusNote.textFirst && focusNote.excerptPic.paint) {
      MNUtil.copyImage(focusNote.excerptPicData)
      MNUtil.showHUD('摘录图片已复制')
      return
    }
    if ((focusNote.excerptText && focusNote.excerptText.trim())){
      let text = focusNote.excerptText
      if (focusNote.excerptTextMarkdown) {
        if (this.isPureMNImages(text.trim())) {
          let imageData = this.getMNImagesFromMarkdown(text)
          MNUtil.copyImage(imageData)
          MNUtil.showHUD('摘录图片已复制')
          return
        }
      }

      MNUtil.copy(text)
      MNUtil.showHUD('摘录文字已复制')
      return
    }
    if (focusNote.comments.length) {
      let firstComment = focusNote.comments[0]
      switch (firstComment.type) {
        case "TextNote":
          MNUtil.copy(firstComment.text)
          MNUtil.showHUD('首条评论已复制')
          return
        case "PaintNote":
          let imageData = MNUtil.getMediaByHash(firstComment.paint)
          MNUtil.copyImage(imageData)
          MNUtil.showHUD('首条评论已复制')
          return
        case "HtmlNote":
          MNUtil.copy(firstComment.text)
          MNUtil.showHUD('尝试复制该类型评论: '+firstComment.type)
          return
        case "LinkNote":
          if (firstComment.q_hpic && !focusNote.textFirst && firstComment.q_hpic.paint) {
            MNUtil.copyImage(MNUtil.getMediaByHash(firstComment.q_hpic.paint))
            MNUtil.showHUD('图片已复制')
          }else{
            MNUtil.copy(firstComment.q_htext)
            MNUtil.showHUD('首条评论已复制')
          }
          return
        default:
          MNUtil.showHUD('暂不支持的评论类型: '+firstComment.type)
          break;
      }
    }
    MNUtil.copy(focusNote.noteTitle)
    MNUtil.showHUD('标题已复制')
  }
  static async copy(des) {
    let focusNote = MNNote.getFocusNote()
    let target = des.target
    let element = undefined
    if (target) {
      switch (target) {
        case "auto":
          toolbarUtils.smartCopy()
          return
          break;
        case "selectionText":
          if (MNUtil.currentSelection.onSelection) {
            element = MNUtil.selectionText
          }else{
            if (this.textView && this.textView.text) {
              let selectedRange = this.textView.selectedRange
              if (selectedRange.length) {
                element = this.textView.text.slice(selectedRange.location,selectedRange.location+selectedRange.length)
              }else{
                element = this.textView.text
              }
            }
          }
          break;
        case "selectionImage":
          MNUtil.copyImage(MNUtil.getDocImage(true))
          return;
        case "title":
          if (focusNote) {
            element = focusNote.noteTitle
          }
          break;
        case "excerpt":
          if (focusNote) {
            if (focusNote.excerptPic && !focusNote.textFirst && focusNote.excerptPic.paint) {
              MNUtil.copyImage(MNUtil.getMediaByHash(focusNote.excerptPic.paint))
              MNUtil.showHUD("摘录图片已复制")
              return
            }
            let text = focusNote.excerptText.trim()
            if (focusNote.excerptTextMarkdown && this.isPureMNImages(text)) {
              let imageData = this.getMNImagesFromMarkdown(text)
              MNUtil.copyImage(imageData)
              MNUtil.showHUD('摘录图片已复制')
              return
            }
            element = text
          }
          break
        case "excerptOCR":
          if (focusNote) {
            if (focusNote.excerptPic && !focusNote.textFirst && focusNote.excerptPic.paint) {
              // MNUtil.copyImage(MNUtil.getMediaByHash(focusNote.excerptPic.paint))
              // MNUtil.showHUD("图片已复制")

              element = await this.getTextOCR(MNUtil.getMediaByHash(focusNote.excerptPic.paint))
            }else{
              let text = focusNote.excerptText.trim()
              if (focusNote.excerptTextMarkdown && this.isPureMNImages(text)) {
                  let imageData = this.getMNImagesFromMarkdown(text)
                  element = await this.getTextOCR(imageData)
              }else{
                element = focusNote.excerptText
              }
            }
          }
          break
        case "notesText":
          if (focusNote) {
            element = focusNote.allNoteText()
          }
          break;
        case "comment":
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
        case "noteURL":
          if (focusNote) {
            element = focusNote.noteURL
          }
          break;
        case "noteMarkdown":
          if (focusNote) {
            element = this.mergeWhitespace(await this.getMDFromNote(focusNote))
          }
          break;
        case "noteMarkdownOCR":
          if (focusNote) {
            element = this.mergeWhitespace(await this.getMDFromNote(focusNote,0,true))
          }
          break;
        case "noteWithDecendentsMarkdown":
          if (focusNote) {
            element = await this.getMDFromNote(focusNote)
            // MNUtil.copyJSON(focusNote.descendantNodes.treeIndex)
            let levels = focusNote.descendantNodes.treeIndex.map(ind=>ind.length)
            let descendantNotes = focusNote.descendantNodes.descendant
            let descendantsMarkdowns = await Promise.all(descendantNotes.map(async (note,index)=>{
                return this.getMDFromNote(note,levels[index])
              })
            )
            element = this.mergeWhitespace(element+"\n"+descendantsMarkdowns.join("\n\n"))
          }
          break;
        default:
          MNUtil.showHUD("Invalid target")
          break;
      }
    }
    let copyContent = des.content
    if (copyContent) {
      let replacedText = this.detectAndReplace(copyContent,element)
      MNUtil.copy(replacedText)
    }else{//没有提供content参数则直接复制目标内容
      MNUtil.copy(element)
    }
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
  static async checkMNUtil(alert = false,delay = 0.01){
    if (typeof MNUtil === 'undefined') {//如果MNUtil未被加载，则执行一次延时，然后再检测一次
      //仅在MNUtil未被完全加载时执行delay
      await toolbarUtils.delay(delay)
      if (typeof MNUtil === 'undefined') {
        if (alert) {
          toolbarUtils.showHUD("MN ChatAI: Please install 'MN Utils' first!",5)
        }
        return false
      }
    }
    return true
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
  // 夏大鱼羊自定义函数 - begin
  /**
   * 批量获取卡片 ID 存到 Arr 里
   */
  static getNoteIdArr(notes) {
    let idsArr = []
    notes.forEach(note => {
      idsArr.push(note.noteId)
    })
    return idsArr
  }

  static TemplateMakeNote(note) {
    /**
     * 场景：
     * 1. Inbox 阶段
     *   - 没有父卡片也能制卡
     *   - 根据颜色制卡
     *   - 归类卡片支持单独制卡
     * 2. 归类卡片阶段
     *   - 移动知识点卡片归类制卡完成链接操作
     *   - 移动归类卡片也可完成归类操作
     */
    /** 
     * 【Done】处理旧卡片
     */
    note.renew()

    if (!note.excerptText) {
      /**
       * 【Done】合并模板卡片
       */
      note.mergeTemplate()

      /**
       * 【Done】根据卡片类型修改卡片颜色
       */
      note.changeColorByType()

      /**
       * 【Done】处理标题
       * - 知识类卡片增加标题前缀
       * - 黄色归类卡片：“”：“”相关 xx
       * - 绿色归类卡片：“”相关 xx
       * - 处理卡片标题空格
       * 
       * 需要放在修改链接前，因为可能需要获取到旧归类卡片的标题来对标题修改进行处理
       */

      note.changeTitle()

      /**
       * 【Done】与父卡片进行链接
       */
      note.linkParentNote()

      /**
       * 【Done】移动新内容
       */
      note.moveNewContent()

      /**
       * 【Done】加入复习
       * 
       * 什么时候需要加入复习
       * - 制卡的那次需要加入
       * - 后续点击制卡都不需要加入
       */
      // note.addToReview()
    }
    /**
     * 【Done】聚焦
     */
    note.focusInMindMap(0.2)

    /**
     * 刷新
     */
    note.refresh()
    note.refreshAll()
  }

  // TODO:
  // - 判断链接是否存在

  static isValidNoteId(noteId) {
    const regex = /^[0-9A-Z]{8}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{12}$/;
    return regex.test(noteId);
  }

  static getNoteIdFromClipboard(){
    let noteId = MNUtil.clipboardText
    if (/^marginnote\dapp:\/\/note\//.test(noteId)) {
      noteId = noteId.slice(22)
      return noteId
    } else if (
      this.isValidNoteId(noteId)
    ) {
      return noteId
    } else {
      MNUtil.showHUD("剪切板中不是有效的卡片 ID 或 URL")
      return undefined
    }
  }

  static isCommentLink(comment) {
    return comment.type === "TextNote" && comment.text.includes("marginnote4app://note/");
  }

  static getNoteURLById(noteId) {
    noteId = noteId.trim()
    let noteURL
    if (/^marginnote\dapp:\/\/note\//.test(noteId)) {
      noteURL = noteId
    } else {
      noteURL = "marginnote4app://note/" + noteId
    }
    return noteURL
  }

  static getLinkType(note, link){
    link = this.getNoteURLById(link)
    let linkedNoteId = MNUtil.getNoteIdByURL(link)
    let linkedNote = MNNote.new(linkedNoteId)
    if (note.hasComment(link)) {
      if (linkedNote.getCommentIndex(note.noteURL) !== -1) {
        return "Double"
      } else {
        return "Single"
      }
    } else {
      MNUtil.showHUD("卡片「" + note.title + "」中不包含到「" + linkedNote.title + "」的链接")
    }
  }

  static isLinkDouble(note, link) {
    return this.getLinkType(note, link) === "Double";
  }

  static isLinkSingle(note, link) {
    return this.getLinkType(note, link) === "Single";
  }

  static pasteNoteAsChildNote(targetNote){
    // 不足：跨学习集的时候必须要进入到目标学习集里面
    let cutNoteId = this.getNoteIdFromClipboard()
    let cutNoteLinksInfoArr = []
    let handledLinksSet = new Set()  // 防止 cutNote 里面有多个相同链接，造成对 linkedNote 的多次相同处理
    if (cutNoteId !== undefined){
      let cutNote = MNNote.new(cutNoteId)
      if (cutNote) {
        this.linksConvertToMN4Type(cutNote)
        cutNote.comments.forEach(
          (comment, index) => {
            if (this.isCommentLink(comment)) {
              if (this.isLinkDouble(cutNote, comment.text)) {
                // 双向链接
                cutNoteLinksInfoArr.push(
                  {
                    linkedNoteId: MNUtil.getNoteIdByURL(comment.text),
                    indexInCutNote: index,
                    indexArrInLinkedNote: MNNote.new(MNUtil.getNoteIdByURL(comment.text)).getCommentIndexArray(cutNote.noteId)
                  }
                )
              } else {
                // 单向链接
                cutNoteLinksInfoArr.push(
                  {
                    linkedNoteId: MNUtil.getNoteIdByURL(comment.text),
                    indexInCutNote: index
                  }
                )
              }
            }
          }
        )
        // 去掉被剪切卡片里的所有链接
        cutNote.clearAllLinks()
        // 在目标卡片下新建一个卡片
        let config = {
          title: cutNote.title,
          content: "",
          markdown: true,
          color: cutNote.colorIndex,
        }
        let newNote = targetNote.createChildNote(config)
        cutNote.title = ""
        // 合并之前要把双向链接的卡片里的旧链接删掉
        cutNoteLinksInfoArr.forEach(
          cutNoteLinkInfo => {
            if (!handledLinksSet.has(cutNoteLinkInfo.linkedNoteId)) {
              let linkedNote = MNNote.new(cutNoteLinkInfo.linkedNoteId)
              if (linkedNote) {
                if (cutNoteLinkInfo.indexArrInLinkedNote !== undefined) {
                  // 双向链接
                  linkedNote.removeCommentsByIndices(cutNoteLinkInfo.indexArrInLinkedNote)
                }
              }
            }
            handledLinksSet.add(cutNoteLinkInfo.linkedNoteId)
          }
        )
        // 将被剪切的卡片合并到新卡片中
        newNote.merge(cutNote)

        try {
          handledLinksSet.clear()
          // 重新链接
          cutNoteLinksInfoArr.forEach(
            cutNoteLinkInfo => {
              let linkedNote = MNNote.new(cutNoteLinkInfo.linkedNoteId)
              newNote.appendNoteLink(linkedNote, "To")
              newNote.moveComment(newNote.comments.length-1, cutNoteLinkInfo.indexInCutNote)
              if (!handledLinksSet.has(cutNoteLinkInfo.linkedNoteId)) {
                if (cutNoteLinkInfo.indexArrInLinkedNote !== undefined) {
                  // 双向链接
                  cutNoteLinkInfo.indexArrInLinkedNote.forEach(
                    index => {
                      linkedNote.appendNoteLink(newNote, "To")
                      linkedNote.moveComment(linkedNote.comments.length-1, index)
                    }
                  )
                }
              }
              handledLinksSet.add(cutNoteLinkInfo.linkedNoteId)
              this.clearAllFailedLinks(linkedNote)
            }
          )
        } catch (error) {
          MNUtil.showHUD(error);
        }
      }
    }
  }

  static getProofHtmlCommentIndex(focusNote, includeMethod = false, methodNum = 0) {
    let focusNoteType = this.getKnowledgeNoteTypeByColorIndex(focusNote.colorIndex)
    let proofHtmlCommentIndex
    switch (focusNoteType) {
      case "method":
        proofHtmlCommentIndex = focusNote.getCommentIndex("原理：", true)
        break;
      case "antiexample":
        proofHtmlCommentIndex = focusNote.getCommentIndex("反例及证明：", true)
        break;
      default:
        if (includeMethod) {
          proofHtmlCommentIndex = (focusNote.getIncludingCommentIndex('方法'+ this.numberToChinese(methodNum) +'：', true) == -1)?focusNote.getCommentIndex("证明：", true):focusNote.getIncludingCommentIndex('方法'+ this.numberToChinese(methodNum) +'：', true)
        } else {
          proofHtmlCommentIndex = focusNote.getCommentIndex("证明：", true)
        }
        break;
    }
    return proofHtmlCommentIndex
  }

  // 将证明移动到某个 index
  static moveProofToIndex(focusNote, targetIndex, includeMethod = false , methodNum = 0) {
    let focusNoteComments = focusNote.note.comments
    let focusNoteCommentLength = focusNoteComments.length
    let nonLinkNoteCommentsIndex = []
    let focusNoteType
    switch (focusNote.colorIndex) {
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
    let proofHtmlCommentIndex
    switch (focusNoteType) {
      case "method":
        proofHtmlCommentIndex = focusNote.getCommentIndex("原理：", true)
        break;
      case "antiexample":
        proofHtmlCommentIndex = focusNote.getCommentIndex("反例及证明：", true)
        break;
      default:
        if (includeMethod) {
          proofHtmlCommentIndex = (focusNote.getIncludingCommentIndex('方法'+ this.numberToChinese(methodNum) +'：', true) == -1)?focusNote.getCommentIndex("证明：", true):focusNote.getIncludingCommentIndex('方法'+ this.numberToChinese(methodNum) +'：', true)
        } else {
          proofHtmlCommentIndex = focusNote.getCommentIndex("证明：", true)
        }
        break;
    }
    let applicationHtmlCommentIndex = focusNote.getCommentIndex("应用：", true)
    let applicationHtmlCommentIndexArr = []
    if (applicationHtmlCommentIndex !== -1) {
      focusNote.comments.forEach((comment, index) => {
        if (
          comment.text &&
          (
            comment.text.includes("应用：") ||
            comment.text.includes("的应用")
          )
        ) {
          applicationHtmlCommentIndexArr.push(index)
        }
      })
      applicationHtmlCommentIndex = applicationHtmlCommentIndexArr[applicationHtmlCommentIndexArr.length-1]
    }
    focusNoteComments.forEach((comment, index) => {
      if (index > applicationHtmlCommentIndex) {
        if (
          comment.type == "PaintNote" || comment.type == "LinkNote" ||
          (
            comment.text &&
            !comment.text.includes("marginnote4app") && !comment.text.includes("marginnote3app") 
          )
        ) {
          nonLinkNoteCommentsIndex.push(index)
        }
      }
    })

    for (let i = focusNoteCommentLength-1; i >= nonLinkNoteCommentsIndex[0]; i--) {
      focusNote.moveComment(focusNoteCommentLength-1, targetIndex);
    }
  }

  // 从 startIndex 下一个 comment 开始，删除重复的链接
  static linkRemoveDuplicatesAfterIndex(note, startIndex){
    let links = new Set()
    if (startIndex < note.comments.length-1) {
      // 下面先有内容才处理
      for (let i = note.comments.length-1; i > startIndex; i--){
        let comment = note.comments[i]
        if (
          comment.type = "TextNote" &&
          comment.text.includes("marginnote4app://note/")
        ) {
          if (links.has(comment.text)) {
            note.removeCommentByIndex(i)
          } else {
            links.add(comment.text)
          }
        }
      }
    }
  }

  static removeDuplicateKeywordsInTitle(note){
    // 获取关键词数组，如果noteTitle的格式为【xxxx】yyyyy，则默认返回一个空数组
    let keywordsArray = note.noteTitle.match(/【.*】(.*)/) && note.noteTitle.match(/【.*】(.*)/)[1].split("; ");
    if (!keywordsArray || keywordsArray.length === 0) return; // 如果无关键词或关键词数组为空，则直接返回不做处理
    
    // 将关键词数组转化为集合以去除重复项，然后转回数组
    let uniqueKeywords = Array.from(new Set(keywordsArray));
    
    // 构建新的标题字符串，保留前缀和去重后的关键词列表
    let newTitle = `【${note.noteTitle.match(/【(.*)】.*/)[1]}】${uniqueKeywords.join("; ")}`;
    
    // 更新note对象的noteTitle属性
    note.noteTitle = newTitle;
  }

  static mergeInParentAndReappendAllLinks(focusNote) {
    let parentNote = focusNote.parentNote

    for (let i = focusNote.comments.length-1; i >= 0; i--) {
      let comment = focusNote.comments[i]
      if (
        comment.type == "TextNote" &&
        comment.text.includes("marginnote4app://note/")
      ) {
        let targetNoteId = comment.text.match(/marginnote4app:\/\/note\/(.*)/)[1]
        let targetNote = MNNote.new(targetNoteId)
        if (targetNote) {
          let focusNoteIndexInTargetNote = targetNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
          if (focusNoteIndexInTargetNote !== -1) {
            // 加个判断，防止是单向链接
            targetNote.removeCommentByIndex(focusNoteIndexInTargetNote)
            targetNote.appendNoteLink(parentNote, "To")
            targetNote.moveComment(targetNote.comments.length-1, focusNoteIndexInTargetNote)
          }
        }
      }
    }
    // 合并到父卡片
    parentNote.merge(focusNote.note)

    // 最后更新父卡片（也就是合并后的卡片）里的链接
    this.reappendAllLinksInNote(parentNote)

    // 处理合并到概要卡片的情形
    if (parentNote.title.startsWith("Summary")) {
      parentNote.title = parentNote.title.replace(/(Summary; )(.*)/, "$2")
    }
  }


  static reappendAllLinksInNote(focusNote) {
    this.clearAllFailedLinks(focusNote)
    for (let i = focusNote.comments.length-1; i >= 0; i--) {
      let comment = focusNote.comments[i]
      if (
        comment.type == "TextNote" &&
        comment.text.includes("marginnote4app://note/")
      ) {
        let targetNoteId = comment.text.match(/marginnote4app:\/\/note\/(.*)/)[1]
        if (!targetNoteId.includes("/summary/")) {  // 防止把概要的链接处理了
          let targetNote = MNNote.new(targetNoteId)
          focusNote.removeCommentByIndex(i)
          focusNote.appendNoteLink(targetNote, "To")
          focusNote.moveComment(focusNote.comments.length-1,i)
        }
      }
    }
  }
  static clearAllFailedLinks(focusNote) {
    this.linksConvertToMN4Type(focusNote)
    // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
    for (let i = focusNote.comments.length-1; i >= 0; i--) {
      let comment = focusNote.comments[i]
      if (
        comment.type == "TextNote" &&
        comment.text.includes("marginnote3app://note/")
      ) {
        focusNote.removeCommentByIndex(i)
      } else if (
        comment.type == "TextNote" &&
        comment.text.includes("marginnote4app://note/")
      ) {
        let targetNoteId = comment.text.match(/marginnote4app:\/\/note\/(.*)/)[1]
        if (!targetNoteId.includes("/summary/")) {  // 防止把概要的链接处理了
          let targetNote = MNNote.new(targetNoteId)
          if (!targetNote) {
            focusNote.removeCommentByIndex(i)
          }
        }
      }
    }
  }

  static linksConvertToMN4Type(focusNote) {
    for (let i = focusNote.comments.length-1; i >= 0; i--) {
      let comment = focusNote.comments[i]
      if (
        comment.type == "TextNote" &&
        comment.text.startsWith("marginnote3app://note/")
      ) {
        let targetNoteId = comment.text.match(/marginnote3app:\/\/note\/(.*)/)[1]
        let targetNote = MNNote.new(targetNoteId)
        if (targetNote) {
          focusNote.removeCommentByIndex(i)
          focusNote.appendNoteLink(targetNote, "To")
          focusNote.moveComment(focusNote.comments.length-1, i)
        } else {
          focusNote.removeCommentByIndex(i)
        }
      }
    }
  }
  static generateArrayCombinations(Arr, joinLabel) {
    const combinations = [];
    const permute = (result, used) => {
      if (result.length === Arr.length) {
        combinations.push(result.join(joinLabel)); // 保存当前组合
        return;
      }
      for (let i = 0; i < Arr.length; i++) {
        if (!used[i]) { // 检查当前元素是否已使用
          used[i] = true; // 标记为已使用
          permute(result.concat(Arr[i]), used); // 递归
          used[i] = false; // 回溯，标记为未使用
        }
      }
    };
    permute([], Array(Arr.length).fill(false)); // 初始调用
    return combinations;
  }

  static findCommonComments(arr, startText) {
    let result = null;

    arr.forEach((note, index) => {
      const fromIndex = note.getCommentIndex(startText, true) + 1;
      const subArray = note.comments.slice(fromIndex);
      const texts = subArray.map(comment => comment.text); // 提取 text
  
      if (result === null) {
        result = new Set(texts);
      } else {
        result = new Set([...result].filter(comment => texts.includes(comment)));
      }
  
      if (result.size === 0) return; // 提前退出
    });
  
    return result ? Array.from(result) : [];
  }

  // 检测 str 是不是一个 4 位的数字
  static isFourDigitNumber(str) {
    // 使用正则表达式检查
    const regex = /^\d{4}$/;
    return regex.test(str);
  }

  static referenceInfoYear(focusNote, year) {
    let findYear = false
    let targetYearNote
    let yearLibraryNote = MNNote.new("F251AFCC-AA8E-4A1C-A489-7EA4E4B58A02")
    let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
    for (let i = 0; i <= yearLibraryNote.childNotes.length-1; i++) {
      if (
        this.getFirstKeywordFromTitle(yearLibraryNote.childNotes[i].noteTitle) == year
      ) {
        targetYearNote = yearLibraryNote.childNotes[i]
        findYear = true
        break;
      }
    }
    if (!findYear) {
      // 若不存在，则添加年份卡片
      targetYearNote = MNNote.clone("16454AD3-C1F2-4BC4-8006-721F84999BEA")
      targetYearNote.note.noteTitle += "; " + year
      yearLibraryNote.addChild(targetYearNote.note)
    }
    let yearTextIndex = focusNote.getIncludingCommentIndex("- 年份", true)
    if (yearTextIndex == -1) {
      focusNote.appendMarkdownComment("- 年份（Year）：", thoughtHtmlCommentIndex)
      focusNote.appendNoteLink(targetYearNote, "To")
      focusNote.moveComment(focusNote.comments.length-1,thoughtHtmlCommentIndex+1)
    } else {
      if (focusNote.getCommentIndex("marginnote4app://note/" + targetYearNote.noteId) == -1) {
        focusNote.appendNoteLink(targetYearNote, "To")
        focusNote.moveComment(focusNote.comments.length-1,yearTextIndex + 1)
      } else {
        focusNote.moveComment(focusNote.getCommentIndex("marginnote4app://note/" + targetYearNote.noteId),yearTextIndex + 1)
      }
    }
  
    // 处理年份卡片
    // focusNoteIndexInTargetYearNote = targetYearNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
    // if (focusNoteIndexInTargetYearNote == -1){
    //   targetYearNote.appendNoteLink(focusNote, "To")
    // }
    // 处理年份卡片
    let focusNoteIndexInTargetYearNote = targetYearNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
    let paperInfoIndexInTargetYearNote = targetYearNote.getIncludingCommentIndex("**论文**")
    // let bookInfoIndexIntargetYearNote = targetYearNote.getIncludingCommentIndex("**书作**")
    if (focusNoteIndexInTargetYearNote == -1){
      targetYearNote.appendNoteLink(focusNote, "To")
      if (toolbarUtils.getReferenceNoteType(focusNote) == "book") {
        targetYearNote.moveComment(targetYearNote.comments.length-1, paperInfoIndexInTargetYearNote)
      }
    } else {
      if (toolbarUtils.getReferenceNoteType(focusNote) == "book") {
        if (focusNoteIndexInTargetYearNote > paperInfoIndexInTargetYearNote) {
          targetYearNote.moveComment(focusNoteIndexInTargetYearNote, paperInfoIndexInTargetYearNote)
        }
      }
    }

    targetYearNote.refresh()
    focusNote.refresh()
    // 年份库的卡片按照时间重新排序
    this.sortNoteByYear()
  }


  static moveLastCommentAboveComment(note, commentText){
    let commentIndex = note.getCommentIndex(commentText, true)
    if (commentIndex != -1) {
      note.moveComment(
        note.comments.length - 1,
        commentIndex
      )
    }
    return commentIndex
  }

  static numberToChinese(num) {
    const chineseNumbers = '零一二三四五六七八九';
    const units = ['', '十', '百', '千', '万', '亿'];
    
    if (num === 0) return chineseNumbers[0];

    let result = '';
    let unitIndex = 0;

    while (num > 0) {
        const digit = num % 10;
        if (digit !== 0) {
            result = chineseNumbers[digit] + units[unitIndex] + result;
        } else if (result && result[0] !== chineseNumbers[0]) {
            result = chineseNumbers[0] + result; // 在需要时添加"零"
        }
        num = Math.floor(num / 10);
        unitIndex++;
    }

    // 去除前面的零
    return result.replace(/零+/, '零').replace(/零+$/, '').trim();
}

  // 获得淡绿色、淡黄色、黄色卡片的类型
  static getClassificationNoteTypeByTitle(title) {
    let match = title.match(/.*相关(.*)/)
    if (match) {
      return match[1]
    } else {
      return ""
    }
  }

  static referenceSeriesBookMakeCard(focusNote, seriesName, seriesNum) {
    if (focusNote.excerptText) {
      this.convertNoteToNonexcerptVersion(focusNote)
    } else {
      MNUtil.undoGrouping(()=>{
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
          toolbarUtils.cloneAndMerge(focusNote, "F09C0EEB-4FB5-476C-8329-8CC5AEFECC43")
        }
        let seriesTextIndex = focusNote.getIncludingCommentIndex("- 系列", true)
        let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
        MNUtil.undoGrouping(()=>{
          if (seriesNum !== "0") {
            focusNote.noteTitle = toolbarUtils.replaceStringStartWithSquarebracketContent(focusNote.noteTitle, "【文献：书作："+ seriesName + " - Vol. "+ seriesNum + "】")
          } else {
            focusNote.noteTitle = toolbarUtils.replaceStringStartWithSquarebracketContent(focusNote.noteTitle, "【文献：书作："+ seriesName + "】")
          }
        })
        if (seriesTextIndex == -1) {
          MNUtil.undoGrouping(()=>{
            if (seriesNum !== "0") {
              focusNote.appendMarkdownComment("- 系列：Vol. " + seriesNum, thoughtHtmlCommentIndex)
            } else {
              focusNote.appendMarkdownComment("- 系列：", thoughtHtmlCommentIndex)
            }
          })
          focusNote.appendNoteLink(targetSeriesNote, "To")
          focusNote.moveComment(focusNote.comments.length-1,thoughtHtmlCommentIndex+1)
        } else {
          // 删掉重新添加
          focusNote.removeCommentByIndex(seriesTextIndex)
          MNUtil.undoGrouping(()=>{
            if (seriesNum !== "0") {
              focusNote.appendMarkdownComment("- 系列：Vol. " + seriesNum, seriesTextIndex)
            } else {
              focusNote.appendMarkdownComment("- 系列：", seriesTextIndex)
            }
          })
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
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.sortNoteByVolNum(targetSeriesNote, 1)
            let bookLibraryNote = MNNote.new("49102A3D-7C64-42AD-864D-55EDA5EC3097")
            bookLibraryNote.addChild(focusNote.note)
            // focusNote.focusInMindMap(0.5)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
      })
      return focusNote
    }
  }

  static replaceStringStartWithSquarebracketContent(string, afterContent) {
    if (string.startsWith("【")) {
      string = string.replace(/^【.*?】/, afterContent)
    } else {
      string = afterContent + string
    }
    return string
  }

  static referenceRefByRefNum(focusNote, refNum) {
    if (focusNote.excerptText) {
      this.convertNoteToNonexcerptVersion(focusNote)
    } else {
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

            /* 处理引用内容 */

            // 标题
            // focusNote.noteTitle = "【「" + refSourceNoteTitle + " - " + refSourceNoteAuthor +"」引用" + "「[" + refNum + "] " + refedNoteTitle + " - " + refedNoteAuthor + "」情况】"
            focusNote.noteTitle = this.replaceStringStartWithSquarebracketContent(
              focusNote.noteTitle,
              "【「" + refSourceNoteTitle + " - " + refSourceNoteAuthor +"」引用" + "「[" + refNum + "] " + refedNoteTitle + " - " + refedNoteAuthor + "」情况】"
            )
            
            
            focusNote.noteTitle = focusNote.noteTitle.replace(/\s*{{refedNoteTitle}}\s*/, "「"+refedNoteTitle+"」")

            // 合并模板：
            let linkHtmlCommentIndex = focusNote.getCommentIndex("相关链接：", true)
            if (linkHtmlCommentIndex == -1) {
              this.cloneAndMerge(focusNote, "FFF70A03-D44F-4201-BD69-9B4BD3E96279")
            }

            // 链接到引用卡片
            linkHtmlCommentIndex = focusNote.getCommentIndex("相关链接：", true)
            // 先确保已经链接了
            let classificationNoteLinkIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + classificationNote.noteId)
            if (classificationNoteLinkIndexInFocusNote == -1){
              focusNote.appendNoteLink(classificationNote, "To")
            }
            let refedNoteLinkIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + refedNoteId)
            if (refedNoteLinkIndexInFocusNote == -1){
              focusNote.appendNoteLink(refedNote, "To")
            }
            let refSourceNoteLinkIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + refSourceNoteId)
            if (refSourceNoteLinkIndexInFocusNote == -1){
              focusNote.appendNoteLink(refSourceNote, "To")
            }

            refSourceNoteLinkIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + refSourceNoteId)
            focusNote.moveComment(refSourceNoteLinkIndexInFocusNote, linkHtmlCommentIndex+1)

            refedNoteLinkIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + refedNoteId)
            focusNote.moveComment(refedNoteLinkIndexInFocusNote, linkHtmlCommentIndex+2)

            classificationNoteLinkIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + classificationNote.noteId)
            focusNote.moveComment(classificationNoteLinkIndexInFocusNote, linkHtmlCommentIndex+3)


            // 链接到归类卡片
            let focusNoteLinkIndexInClassificationNote = classificationNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
            if (focusNoteLinkIndexInClassificationNote == -1){
              classificationNote.appendNoteLink(focusNote, "To")
            }

            return [focusNote, classificationNote]
          }
        } else {
          MNUtil.showHUD("["+refNum+"] 未进行 ID 绑定")
        }
      } else {
        MNUtil.showHUD("当前文档并未开始绑定 ID")
      }
    }
  }

  // 获取文献卡片的第一个作者名
  static getFirstAuthorFromReferenceById(id) {
    let note = MNNote.new(id)
    let authorTextIndex = note.getIncludingCommentIndex("- 作者", true)
    if (
      note.comments[authorTextIndex + 1].text &&
      note.comments[authorTextIndex + 1].text.includes("marginnote")
    ) {
      let authorId = MNUtil.getNoteIdByURL(note.comments[authorTextIndex + 1].text)
      let authorNote = MNNote.new(authorId)
      let authorTitle = authorNote.noteTitle
      return this.getFirstKeywordFromTitle(authorTitle)
    } else {
      return "No author!"
    }
  }
  // 替换英文标点
  static formatPunctuationToEnglish(string) {
    // 将中文括号替换为西文括号
    string = string.replace(/–/g, '-');
    string = string.replace(/，/g, ',');
    string = string.replace(/。/g, '.');
    string = string.replace(/？/g, '?');
    string = string.replace(/（/g, '(');
    string = string.replace(/）/g, ')');
    string = string.replace(/【/g, '[');
    string = string.replace(/】/g, ']');
    string = string.replace(/「/g, '[');
    string = string.replace(/」/g, ']');
    
    return string;
  }

  // 规范化字符串中的英文标点的前后空格
  static formatEnglishStringPunctuationSpace(string) {
    // 将中文括号替换为西文括号
    string = this.formatPunctuationToEnglish(string)

    // 去掉换行符
    string = string.replace(/\n/g, ' ');
    
    // 处理常见标点符号前后的空格
    string = string.replace(/ *, */g, ', ');
    string = string.replace(/ *\. */g, '. ');
    string = string.replace(/ *\? */g, '? ');
    string = string.replace(/ *\- */g, '-');
    string = string.replace(/ *\) */g, ') ');
    string = string.replace(/ *\] */g, '] ');
    
    // 如果标点符号在句末，则去掉后面的空格
    string = string.replace(/, $/g, ',');
    string = string.replace(/\. $/g, '.');
    string = string.replace(/\? $/g, '?');
    string = string.replace(/\) $/g, ')');
    string = string.replace(/\] $/g, ']');
    
    // 处理左括号类标点符号
    string = string.replace(/ *\( */g, ' (');
    string = string.replace(/ *\[ */g, ' [');

    // 处理一些特殊情况
    string = string.replace(/\. ,/g, '.,');  // 名字缩写的.和后面的,
    
    
    return string;
  }

  // [1] xx => 1
  static extractRefNumFromReference(text) {
    text = this.formatPunctuationToEnglish(text)
    text = text.replace(/\n/g, ' ');
    // const regex = /^\s*\[\s*(\d{1,3})\s*\]\s*.+$/; 
    const regex = /^\s*\[\s*(.*?)\s*\]\s*.+$/; 
    const match = text.trim().match(regex); // 使用正则表达式进行匹配
    if (match) {
      return match[1].trim(); // 返回匹配到的文本，并去除前后的空格
    } else {
      return 0; // 如果没有找到匹配项，则返回原文本
    }
  }
  // [1] xxx => xxx
  static extractRefContentFromReference(text) {
    text = this.formatPunctuationToEnglish(text)
    text = text.replace(/\n/g, ' ');
    const regex = /^\s*\[[^\]]*\]\s*(.+)$/;
    const match = text.trim().match(regex); // 使用正则表达式进行匹配
    if (match) {
      return match[1].trim(); // 返回匹配到的文本，并去除前后的空格
    } else {
      return text; // 如果没有找到匹配项，则返回原文本
    }
  }

  static referenceStoreOneIdForCurrentDoc(input){
    let refNum = input.split('@')[0]
    let refId = input.split('@')[1]
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

  static getRefIdByNum(num) {
    let currentDocmd5 = MNUtil.currentDocmd5
    if (referenceIds[currentDocmd5].hasOwnProperty(num)) {
      return referenceIds[currentDocmd5][num]
    } else {
      MNUtil.showHUD("当前文档没有文献 [" + num + "] 的卡片 ID")
      return ""
    }
  }
  static getVolNumFromTitle(title) {
    let match = title.match(/【.*?Vol.\s(\d+)】/)[1]
    return match? parseInt(match) : 0
  }

  static getVolNumFromLink(link) {
    let note = MNNote.new(link)
    let title = note.noteTitle
    return this.getVolNumFromTitle(title)
  }

  // 卡片按照标题的年份进行排序
  static sortNoteByYear() {
    let yearLibraryNote = MNNote.new("F251AFCC-AA8E-4A1C-A489-7EA4E4B58A02")
    let indexArr = Array.from({ length: yearLibraryNote.childNotes.length }, (_, i) => i);
    let idIndexArr = indexArr.map(index => ({
      id: yearLibraryNote.childNotes[index].noteId,
      year: parseInt(toolbarUtils.getFirstKeywordFromTitle(yearLibraryNote.childNotes[index].noteTitle))
    }));
    let sortedArr = idIndexArr.sort((a, b) => a.year - b.year)
    // MNUtil.showHUD(sortedArr[1].year)

    MNUtil.undoGrouping(()=>{
      sortedArr.forEach(
        (item, index) => {
          let yearNote = MNNote.new(item.id)
          yearLibraryNote.addChild(yearNote.note)
        }
      )
    })
  }

  // 链接按照 vol 的数值排序
  // startIndex 表示开始排序的评论索引
  static sortNoteByVolNum(note, startIndex) {
    let commentsLength = note.comments.length;
    let initialIndexArr = Array.from({ length: commentsLength }, (_, i) => i);
    let initialSliceArr = initialIndexArr.slice(startIndex)
    let initialSliceVolnumArrAux = initialSliceArr.map(
      index => this.getVolNumFromLink(note.comments[index].text)
    )
    // MNUtil.showHUD(initialSliceVolnumArr)
    let initialSliceVolnumArr = [...initialSliceVolnumArrAux]
    let sortedVolnumArr = initialSliceVolnumArrAux.sort((a, b) => a - b)
    // MNUtil.showHUD(sortedVolnumArr)
    let targetSliceArr = []
    initialSliceVolnumArr.forEach(
      volnum => {
        targetSliceArr.push(sortedVolnumArr.indexOf(volnum) + startIndex)
      }
    )
    // MNUtil.showHUD(targetSliceArr)
    let targetArr = [
      ...initialIndexArr.slice(0, startIndex),
      ...targetSliceArr
    ]
    note.sortCommentsByNewIndices(targetArr)
    // MNUtil.showHUD(targetArr)
  }



    // MNUtil.showHUD(sortArr)
    // let sortedSliceArr = initialSliceArr.sort((a, b) => { a-b })
    // let sortedIndexArr = [...initialIndexArr.slice(0, startIndex), ...sortedSliceArr]
    // let targerArr = [...initialIndexArr.slice(0, startIndex)]
    // sortedSliceArr.forEach(
    //   (num, index) => {

    //   }
    // )
    // let indexedCommentsArr = []
    // beginSortArr.forEach(index => {
    //   indexedCommentsArr.push({
    //     volnum: this.getVolNumFromLink(note.comments[index].text),
    //     index: index
    //   })
    // })
    // // 删掉 indexedCommentsArr 的第一个元素（因为 note 的第一个评论是 html 评论）
    // indexedCommentsArr.sort(
    //   (a, b) => a.volnum - b.volnum
    // )
    // MNUtil.showHUD(indexedCommentsArr.map(item => item.volnum))
    // let sortIndexArr = indexedCommentsArr.map(item => item.index)
    // MNUtil.showHUD(sortIndexArr)
    // let EndSortArr = [...indexArr.slice(0, startIndex), ...sortIndexArr]
    // MNUtil.showHUD(EndSortArr)


  // 【xxx】yyy; zzz; => yyy || 【xxx】; zzz => zzz
  static getFirstKeywordFromTitle(title) {
    // const regex = /【.*?】(.*?); (.*?)(;.*)?/;
    const regex = /【.*】(.*?);\s*([^;]*?)(?:;|$)/;
    const matches = title.match(regex);
  
    if (matches) {
      const firstPart = matches[1].trim(); // 提取分号前的内容
      const secondPart = matches[2].trim(); // 提取第一个分号后的内容
  
      // 根据第一部分是否为空选择返回内容
      return firstPart === '' ? secondPart : firstPart;
    }
  
    // 如果没有匹配，返回 null 或者空字符串
    return "";
  }

  static getSecondKeywordFromTitle(title) {
    // const regex = /【.*?】(.*?); (.*?)(;.*)?/;
    const regex = /【.*】(.*?);\s*([^;]*?)(?:;|$)/;
    const matches = title.match(regex);
    let targetText = title
  
    if (matches) {
      const firstPart = matches[1].trim(); // 提取分号前的内容
      const secondPart = matches[2].trim(); // 提取第一个分号后的内容
  
      // 根据第一部分是否为空选择返回内容
      if (firstPart !== '') {
        targetText = targetText.replace(firstPart, "")
        return this.getFirstKeywordFromTitle(targetText)
      } else {
        targetText = targetText.replace("; " + secondPart, "")
        return this.getFirstKeywordFromTitle(targetText)
      }
    }
  
    // 如果没有匹配，返回 null 或者空字符串
    return "";
  }

  static languageOfString(input) {
    const chineseRegex = /[\u4e00-\u9fa5]/; // 匹配中文字符的范围
    const englishRegex = /^[A-Za-z0-9\s,.!?]+$/; // 匹配英文字符和常见标点
  
    if (chineseRegex.test(input)) {
      return 'Chinese';
    } else if (englishRegex.test(input)) {
      return 'English';
    } else {
      return ;
    }
  }

  // 人名的缩写版本

  // static getPinyin(chineseString) {
  //   return pinyin(chineseString, {
  //     style: pinyin.STYLE_NORMAL, // 普通拼音
  //     heteronym: false // 不考虑多音字
  //   });
  // }

  static camelizeString(string) {
    return string[0].toUpperCase() + string.slice(1)
  }

  static moveStringPropertyToSecondPosition(obj, stringProp) {
    // 检查对象是否含有指定的属性
    if (!obj || !obj.hasOwnProperty(stringProp)) {
      return "对象中没有名为 '" + stringProp + "' 的属性";
    }
  
    // 获取对象的所有属性键
    const keys = Object.keys(obj);
    
    // 确保键的数量足够进行移动
    if (keys.length < 2) {
      return "对象中属性数量不足，无法进行移动操作";
    }
    
    // 先保存关联值
    const stringValue = obj[stringProp];
  
    // 创建一个新的对象来重新排序属性
    const newObj = {};
    
    // 将第一个属性放入新对象
    newObj[keys[0]] = obj[keys[0]];
    
    // 将目标属性放到第二个位置
    newObj[stringProp] = stringValue;
  
    // 将剩余的属性放入新对象
    for (let i = 1; i < keys.length; i++) {
      if (keys[i] !== stringProp) {
        newObj[keys[i]] = obj[keys[i]];
      }
    }
  
    return newObj;
  }

  static getAbbreviationsOfEnglishName(name) {
    let languageOfName = this.languageOfString(name)
    let Name = {}
    if (languageOfName == "English") {
      let namePartsArr = name.split(" ")
      let namePartsNum = namePartsArr.length
      let firstPart = namePartsArr[0]
      let lastPart = namePartsArr[namePartsNum - 1]
      let middlePart = namePartsArr.slice(1, namePartsNum - 1).join(" ")
      switch (namePartsNum) {
        case 1:
          // Name.language = "English"
          Name.original = name
          break;
        case 2:
          // 以 Kangwei Xia 为例
          // Name.language = "English"
          Name.original = name
          Name.reverse = lastPart + ", " + firstPart // Xia, Kangwei
          Name.abbreviateFirstpart = firstPart[0] + ". " + lastPart // K. Xia
          Name.abbreviateFirstpartAndReverseAddCommaAndDot =  lastPart + ", " + firstPart[0] + "." // Xia, K.
          Name.abbreviateFirstpartAndReverseAddDot =  lastPart + " " + firstPart[0] + "." // Xia K.
          Name.abbreviateFirstpartAndReverse =  lastPart + ", " + firstPart[0] // Xia, K
          break;
        case 3:
          // 以 Louis de Branges 为例
          // Name.language = "English"
          Name.original = name
          Name.removeFirstpart = middlePart + " " + lastPart // de Branges
          Name.removeMiddlepart = firstPart + " " + lastPart // Louis Branges
          Name.abbreviateFirstpart = firstPart[0] + ". " + middlePart + " " + lastPart // L. de Branges
          Name.abbreviateFirstpartAndReverseAddComma = middlePart + " " + lastPart + ", " + firstPart[0]// de Branges, L
          Name.abbreviateFirstpartAndReverseAddCommaAndDot = middlePart + " " + lastPart + ", " + firstPart[0] + "." // de Branges, L.
          Name.abbreviateFirstpartAndLastpartAddDots = firstPart[0] + ". " + middlePart + " " + lastPart[0] + "." // L. de B.
          Name.abbreviateFirstpartAndMiddlepartAddDots = firstPart[0] + ". " + middlePart[0] + ". " + lastPart // L. d. Branges
          Name.abbreviateFirstpartAddDotAndRemoveMiddlepart = firstPart[0] + ". " + lastPart // L. Branges
          Name.abbreviateFirstpartRemoveMiddlepartAndReverseAddCommaAndDot = lastPart + ", " + firstPart[0] + "." // Branges, L.
          Name.abbreviateFirstpartAndMiddlepartAndReverseAddDots = lastPart + " " + middlePart[0] + ". " + firstPart[0] + "." // Branges d. L.
          break;
        default:
          // Name.language = "English"
          Name.original = name
          break;
      }
      return Name
    }
  }

  static getAbbreviationsOfName(name) {
    let languageOfName = this.languageOfString(name)
    let Name = {}
    let pinyinStandard
    if (languageOfName == "Chinese") {
      let namePinyinArr = pinyin.pinyin(
        name, 
        {
          style: "normal",
          mode: "surname"
        }
      )
      let firstPart = namePinyinArr[0].toString()
      let lastPart = namePinyinArr[namePinyinArr.length - 1].toString()
      let middlePart = namePinyinArr[1].toString()
      if (namePinyinArr.length == 2) {
        // 以 lu xun 为例

        // Xun Lu
        pinyinStandard = this.camelizeString(lastPart) + " " + this.camelizeString(firstPart) 
        // MNUtil.showHUD(pinyinStandard)
        Name = this.getAbbreviationsOfEnglishName(pinyinStandard)
        Name.originalChineseName = name
        // Name.language = "Chinese"
        // Lu Xun
        Name.pinyinStandardAndReverse =  this.camelizeString(firstPart) + " " + this.camelizeString(lastPart)

        Name = this.moveStringPropertyToSecondPosition(Name, "originalChineseName")

        
        // // Lu Xun
        // Name.pinyinStandardAndReverse = this.camelizeString(firstPart) + " " + this.camelizeString(lastPart)
        // // luxun
        // Name.pinyinNoSpace = firstPart + lastPart
        // // lu xun
        // Name.pinyinWithSpace = firstPart + " " + lastPart
        // // Lu xun
        // Name.pinyinCamelizeFirstpartWithSpace = this.camelizeString(firstPart) + " " + lastPart 
        // // Luxun
        // Name.pinyinCamelizeFirstpartNoSpace = this.camelizeString(firstPart) + lastPart 
        // // xun, Lu
        // Name.pinyinCamelizeFirstpartAndReverseWithComma = lastPart + ", " + this.camelizeString(firstPart)
        // // LuXun
        // Name.pinyinCamelizeNoSpace = this.camelizeString(firstPart) +  this.camelizeString(lastPart)
        // // xun Lu
        // Name.pinyinCamelizeFirstpartAndReverseWithSpace = lastPart + " " + this.camelizeString(firstPart)
        // // xunLu
        // Name.pinyinCamelizeFirstpartAndReverseNoSpace = lastPart  + this.camelizeString(firstPart)
        // // Xun, Lu
        // Name.pinyinStandardWithComma = this.camelizeString(lastPart) + " " + this.camelizeString(firstPart) 
      } else {
        if (namePinyinArr.length == 3) {
          // 以 xia kang wei 为例

          // Kangwei Xia
          pinyinStandard = this.camelizeString(middlePart) + lastPart + " " + this.camelizeString(firstPart)
          Name = this.getAbbreviationsOfEnglishName(pinyinStandard)
          Name.originalChineseName = name
          // Name.language = "Chinese"
          // Xia Kangwei
          Name.pinyinStandardAndReverse =  this.camelizeString(firstPart) + " " + this.camelizeString(middlePart) + lastPart
          Name = this.moveStringPropertyToSecondPosition(Name, "originalChineseName")
        }
      }
      return Name
    } else {
        return this.getAbbreviationsOfEnglishName(name)
    }
  }

  // 提取文献卡片中的 bib 条目

  static extractBibFromReferenceNote (focusNote) {
    let findBibContent = false
    let bibContent
    for (let i = 0; i <= focusNote.comments.length-1; i++) {
      if (
        focusNote.comments[i].text &&
        focusNote.comments[i].text.includes("- `.bib`")
      ) {
        bibContent = focusNote.comments[i].text
        findBibContent = true
        break;
      }
    }
    if (findBibContent) {
      // 定义匹配bib内容的正则表达式，调整换行符处理
      const bibPattern = /```bib\s*\n([\s\S]*?)\n\s*```/;
      // 使用正则表达式提取bib内容
      let bibContentMatch = bibPattern.exec(bibContent);

      // 检查是否匹配到内容
      if (bibContentMatch) {
        // MNUtil.copy(
        return bibContentMatch[1].split('\n').map(line => line.startsWith('  ') ? line.slice(2) : line).join('\n')
        // )
      } else {
        MNUtil.showHUD("No bib content found"); // 如果未找到匹配内容，则抛出错误
      }
    } else {
      MNUtil.showHUD("No '- `bib`' found")
    }
  }

  // 将字符串分割为数组

  static splitStringByThreeSeparators(string) {
    // 正则表达式匹配中文逗号、中文分号和西文分号
    const separatorRegex = /，\s*|；\s*|;\s*/g;
    
    // 使用split方法按分隔符分割字符串
    const arr = string.split(separatorRegex);
    
    // 去除可能的空字符串元素（如果输入字符串的前后或连续分隔符间有空白）
    return arr.filter(Boolean);
  }

  static splitStringByFourSeparators(string) {
    // 正则表达式匹配中文逗号、中文分号和西文分号
    const separatorRegex = /，\s*|；\s*|;\s*|,\s*/g;
    
    // 使用split方法按分隔符分割字符串
    const arr = string.split(separatorRegex);
    
    // 去除可能的空字符串元素（如果输入字符串的前后或连续分隔符间有空白）
    return arr.filter(Boolean);
  }


  // 获取数组中从 startNum 作为元素开始的连续序列数组片段
  static getContinuousSequenceFromNum(arr, startNum) {
    let sequence = []; // 存储连续序列的数组
    let i = arr.indexOf(startNum); // 找到startNum在数组中的索引位置

    // 检查是否找到startNum或者它是否合法
    if (i === -1 || startNum !== arr[i]) {
      return [];
    }
  
    let currentNum = startNum; // 当前处理的数字
  
    // 向后遍历数组寻找连续序列
    while (i < arr.length && arr[i] === currentNum) {
      sequence.push(arr[i]); // 将连续的数字添加到序列中
      currentNum++; // 移动到下一个数字
      i++; // 更新索引位置
    }
  
    return sequence; // 返回找到的连续序列数组
  }

  // 判断文献卡片类型
  static getReferenceNoteType(note) {
    if (note.noteTitle.includes("论文")) {
      return "paper"
    } else {
      return "book"
    }
  }

  // 寻找子卡片中重复的 "; xxx" 的 xxx
  static findDuplicateTitles(childNotes) {
    const seen = new Set();
    const duplicates = [];
  
    childNotes.forEach(note => {
      const parts = note.noteTitle.split(';').slice(1);
      parts.forEach(part => {
        const fragment = part.trim();
        if (seen.has(fragment)) {
          duplicates.push(fragment);
        } else {
          seen.add(fragment);
        }
      });
    });

    return duplicates;
  }

  // 将卡片变成非摘录版本
  // 需求：https://github.com/xkwxdyy/mnTextHandler/discussions/3
  /**
    * 1. 复制卡片标题到剪切板
    * 2. 去掉卡片标题
    * 3. 生成卡片的兄弟卡片，标题为复制的内容
    * 4. 将旧卡片合并到新的兄弟卡片中
    */
  /**
    *
    * @param {MbBookNote} parent
    * @param {String} title
    * @param {Number} colorIndex
    */
  static convertNoteToNonexcerptVersion(note) {
    let config = {}
    let newNote
    let parent
    // let newNoteList = []
    MNUtil.undoGrouping(()=>{
      // focusNotes.forEach(
        // note=>{
          config.title = note.noteTitle
          config.content = ""
          config.markdown = true
          config.color = note.colorIndex
          // 获取旧卡片的父卡片
          parent = note.parentNote
          // 创建新兄弟卡片，标题为旧卡片的标题
          newNote = parent.createChildNote(config)
          // parent.addChild(newnote)
          // 清除旧卡片的标题
          note.noteTitle = ""
          // 将旧卡片合并到新卡片中
          newNote.merge(note)
          newNote.focusInMindMap(0.2)
          // newNoteList.push(newNote)
        // }
      // )
    })
    // return newNoteList
  }

  /* makeCards 的 aux 函数 */
  // 合并第一层模板
  static makeCardsAuxFirstLayerTemplate(focusNote, focusNoteType) {
    let templateNoteId
    let testIndex = Math.max(focusNote.getCommentIndex("相关链接：", true), focusNote.getCommentIndex("所属：", true))
    // MNUtil.showHUD(testIndex)
    if (testIndex == -1) { // 每种模板卡里都有“相关链接：”
      switch (focusNoteType) {
        case "definition":
          templateNoteId = "C1052FDA-3343-45C6-93F6-61DCECF31A6D"
          toolbarUtils.cloneAndMerge(focusNote, templateNoteId)
          break;
        case "theorem":
          templateNoteId = "C4B464CD-B8C6-42DE-B459-55B48EB31AD8"
          toolbarUtils.cloneAndMerge(focusNote, templateNoteId)
          break;
        case "example":
          templateNoteId = "C4B464CD-B8C6-42DE-B459-55B48EB31AD8"
          toolbarUtils.cloneAndMerge(focusNote, templateNoteId)
          break;
        case "antiexample":
          templateNoteId = "E64BDC36-DD8D-416D-88F5-0B3FCBE5D151"
          toolbarUtils.cloneAndMerge(focusNote, templateNoteId)
          break;
        case "method":
          templateNoteId = "EC68EDFE-580E-4E53-BA1B-875F3BEEFE62"
          toolbarUtils.cloneAndMerge(focusNote, templateNoteId)
          break;
        case "question":
          templateNoteId = "C4B464CD-B8C6-42DE-B459-55B48EB31AD8"
          toolbarUtils.cloneAndMerge(focusNote, templateNoteId)
          break;
        case "application":
          templateNoteId = "C4B464CD-B8C6-42DE-B459-55B48EB31AD8"
          toolbarUtils.cloneAndMerge(focusNote, templateNoteId)
          break;
      }
    }
  }
  static makeCardsAuxSecondLayerTemplate(focusNote, focusNoteType) {
    let templateNoteId
    let focusNoteColorIndex = focusNote.note.colorIndex
    let testIndexI = focusNote.getCommentIndex("相关概念：", true)
    let testIndexII = focusNote.getCommentIndex("应用：", true)
    let testIndex = Math.max(testIndexI, testIndexII)
    if ([2, 3, 9, 10, 15].includes(focusNoteColorIndex)) {
      if (testIndex == -1){
        if (focusNoteType === "definition") {
          templateNoteId = "9129B736-DBA1-441B-A111-EC0655B6120D"
          toolbarUtils.cloneAndMerge(focusNote, templateNoteId)
        } else {
          templateNoteId = "3D07C54E-9DF3-4EC9-9122-871760709EB9"
          toolbarUtils.cloneAndMerge(focusNote, templateNoteId)
        }
      }
    }
  }
  // 修改卡片前缀
  static makeCardsAuxChangefocusNotePrefix(focusNote, parentNote) {
    let newTitle
    let focusNoteColorIndex = focusNote.note.colorIndex
    let parentNoteTitle = parentNote.noteTitle
    let parentNoteColorIndex = parentNote.note.colorIndex
    // 有淡黄色的父卡片时，parentNoteTitle 非空（只考虑父卡片都有标题的情况）
    if (parentNoteTitle) {
      if (parentNoteColorIndex == 1) {
        if (focusNoteColorIndex == 0 || focusNoteColorIndex == 4) {
          // MNUtil.showHUD(parentNoteTitle)
          let focusNoteTitle = focusNote.noteTitle
          let prefix = parentNoteTitle.match(/“(.+)”相关.*/)[1]
          focusNote.noteTitle = focusNoteTitle.replace(/“(.*)”(：“.*”相关.*)/, "“" + prefix + "”" + "$2")
        } else {
          // MNUtil.showHUD(parentNoteTitle)
          let focusNoteTitle = focusNote.noteTitle
          let matchContentFromParentNoteTitle = parentNoteTitle.replace(/“(.*)”相关(.*)/g, "$2：$1")
          // 检查【xxx】格式，并捕获xxx内容
          let matchResult = focusNoteTitle.match(/^【([^】]*)/);
          // MNUtil.showHUD(matchResult)
          if (matchResult) { // 如果有匹配结果
            // MNUtil.showHUD("匹配！")
            let capturedText = matchResult[1];
            // 检查是否包含 capturedText 并且是否需要补上】
            if (capturedText.includes(matchContentFromParentNoteTitle) && !focusNoteTitle.includes("】")) {
              focusNote.noteTitle = focusNoteTitle + "】";
            } else if (!capturedText.includes(matchContentFromParentNoteTitle)) {
              // 如果不包含 capturedText，替换原有【】内容
              if (focusNoteColorIndex == 2) {
                // 淡蓝色（定义类）的要在【】后加 “; ”
                newTitle = focusNoteTitle.replace(/^【.*?】/, "【" + matchContentFromParentNoteTitle + "】; ");
              } else {
                newTitle = focusNoteTitle.replace(/^【.*?】/, "【" + matchContentFromParentNoteTitle + "】");
              }
              focusNote.noteTitle = newTitle;
            }
          } else { // 如果标题不是以【xxx开头
            // MNUtil.showHUD("不匹配！")
            if (focusNoteColorIndex == 2) {
              // 淡蓝色（定义类）的要在【】后加 “; ”
              newTitle = "【" + matchContentFromParentNoteTitle + "】; " + focusNoteTitle;
            } else {
              newTitle = "【" + matchContentFromParentNoteTitle + "】" + focusNoteTitle;
            }
            focusNote.noteTitle = newTitle;
          }
        }
      } else {
        if (parentNoteColorIndex == 0 || parentNoteColorIndex == 4) {
          if (focusNoteColorIndex == 0 || focusNoteColorIndex == 4) {
            // MNUtil.showHUD(parentNoteTitle)
            let focusNoteTitle = focusNote.noteTitle
            let prefix = parentNoteTitle.match(/“(.*)”：“(.*)”相关.*/)[2]
            focusNote.noteTitle = focusNoteTitle.replace(/“(.*)”(：“.*”相关.*)/, "“" + prefix + "”" + "$2")
          } else {
            // MNUtil.showHUD(parentNoteTitle)
            let focusNoteTitle = focusNote.noteTitle
            let matchContentFromParentNoteTitle = parentNoteTitle.replace(/“(.+)”：“(.+)”\s*相关(.+)/g, "$3：$2")
            // 检查【xxx】格式，并捕获xxx内容
            let matchResult = focusNoteTitle.match(/^【([^】]*)/);
            // MNUtil.showHUD(matchResult)
            if (matchResult) { // 如果有匹配结果
              // MNUtil.showHUD("匹配！")
              let capturedText = matchResult[1];
              // 检查是否包含 capturedText 并且是否需要补上】
              if (capturedText.includes(matchContentFromParentNoteTitle) && !focusNoteTitle.includes("】")) {
                focusNote.noteTitle = focusNoteTitle + "】";
              } else if (!capturedText.includes(matchContentFromParentNoteTitle)) {
                // 如果不包含 capturedText，替换原有【】内容
                if (focusNoteColorIndex == 2) {
                  // 淡蓝色（定义类）的要在【】后加 “; ”
                  newTitle = focusNoteTitle.replace(/^【.*?】/, "【" + matchContentFromParentNoteTitle + "】; ");
                } else {
                  newTitle = focusNoteTitle.replace(/^【.*?】/, "【" + matchContentFromParentNoteTitle + "】");
                }
                focusNote.noteTitle = newTitle;
              }
            } else { // 如果标题不是以【xxx开头
              // MNUtil.showHUD("不匹配！")
              if (focusNoteColorIndex == 2) {
                // 淡蓝色（定义类）的要在【】后加 “; ”
                newTitle = "【" + matchContentFromParentNoteTitle + "】; " + focusNoteTitle;
              } else {
                newTitle = "【" + matchContentFromParentNoteTitle + "】" + focusNoteTitle;
              }
              focusNote.noteTitle = newTitle;
            }
          }
        }
      }
      focusNote.parentNote.refresh()
      if (focusNote.descendantNodes.descendant.length > 0) {
        focusNote.descendantNodes.descendant.forEach(descendantNote => {
          descendantNote.refresh()
        })
      }
    }
  }
  static makeCardsAuxLinkToParentNote(focusNote, focusNoteType, parentNote) {
    /*
      【focusNote 为非黄色卡片时】
        父卡片为：
          归类型的淡黄色卡片：双向链接
          非归类型的淡黄色卡片：单向链接
          其它卡片：不链接
      【focusNote 为淡黄色或黄色卡片时】
        父卡片为：
          淡绿色、黄色或者淡黄色卡片：双向链接
      要注意防止第二次链接
    */
    let focusNoteOldLinkIndexInParentNote,focusNoteNewLinkIndexInParentNote,focusNoteLinkIndexInParentNote
    let parentNoteOldLinkIndexInFocusNote,parentNoteNewLinkIndexInFocusNote,parentNoteLinkIndexInFocusNote
    let linkHtmlCommentIndex
    let parentNoteTitle = parentNote.noteTitle
    let parentNoteId = parentNote.noteId
    if (!focusNote.excerptText) { // 非摘录版本才开始链接
      if (parentNoteTitle !== undefined) {
          if (focusNoteType == "classification") {
            // 归类类型的卡片
            let parentNoteColorIndex = parentNote.note.colorIndex
            if (parentNoteColorIndex == 1) {
              // 父卡片是淡绿色
              // MNUtil.undoGrouping(()=>{
                try {
                  // 把选中的变成黄色
                  focusNote.note.colorIndex = 4
                  let focusNoteIdIndexInParentNote = parentNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                  if (focusNoteIdIndexInParentNote == -1) {
                    // 增加新的链接
                    parentNote.appendNoteLink(focusNote, "To")
                  }
                  let parentNoteIdIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + parentNote.noteId)
                  if (parentNoteIdIndexInFocusNote == -1) {
                    // 删除原来的链接
                    if (focusNote.comments[1] && focusNote.comments[1].type !== "HtmlNote") {
                      // 去掉原来被链接的卡片里的链接
                      let oldLinkedNoteId = focusNote.comments[1].text.match(/marginnote4app:\/\/note\/(.*)/)[1]
                      let oldLinkedNote = MNNote.new(oldLinkedNoteId)
                      let oldIndexInOldLinkedNote = oldLinkedNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                      // MNUtil.showHUD(oldIndexInOldLinkedNote)
                      if (oldIndexInOldLinkedNote !== -1) {
                        oldLinkedNote.removeCommentByIndex(oldIndexInOldLinkedNote)
                      }
                      focusNote.removeCommentByIndex(1)
                    }
                    // 增加新的链接
                    focusNote.appendNoteLink(parentNote, "To")
                    focusNote.moveComment(focusNote.note.comments.length-1, 1)
                  }
                } catch (error) {
                  MNUtil.showHUD(error);
                }
              // })
            } else {
              if (parentNoteColorIndex == 0 || parentNoteColorIndex == 4) {
                // 父卡片是淡黄色 or 黄色
                MNUtil.undoGrouping(()=>{
                  // 把选中的变成黄色
                  focusNote.note.colorIndex = 0
                  let focusNoteIdIndexInParentNote = parentNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                  if (focusNoteIdIndexInParentNote == -1) {
                    // 增加新的链接
                    parentNote.appendNoteLink(focusNote, "To")
                  }
                  let parentNoteIdIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + parentNote.noteId)
                  if (parentNoteIdIndexInFocusNote == -1) {
                    // 删除原来的链接
                    if (focusNote.comments[1] && focusNote.comments[1].type !== "HtmlNote") {
                      // 去掉原来被链接的卡片里的链接
                      let oldLinkedNoteId = focusNote.comments[1].text.match(/marginnote4app:\/\/note\/(.*)/)[1]
                      let oldLinkedNote = MNNote.new(oldLinkedNoteId)
                      let oldIndexInOldLinkedNote = oldLinkedNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                      // MNUtil.showHUD(oldIndexInOldLinkedNote)
                      if (oldIndexInOldLinkedNote !== -1) {
                        oldLinkedNote.removeCommentByIndex(oldIndexInOldLinkedNote)
                      }
                      focusNote.removeCommentByIndex(1)
                    }
                    // 增加新的链接
                    focusNote.appendNoteLink(parentNote, "To")
                    focusNote.moveComment(focusNote.note.comments.length-1, 1)
                  }
                })
              }
            }
          } else {
            // let matchResultFromParentNoteTitle = parentNoteTitle.match(/“(.*)”：“(.*)”相关(.*)/)
            // if (matchResultFromParentNoteTitle && matchResultFromParentNoteTitle.length > 0) {
            // 父卡片是归类型的淡黄色卡片
            let parentNoteOldUrl = "marginnote3app://note/" + parentNoteId
            let parentNoteNewUrl = "marginnote4app://note/" + parentNoteId
            parentNoteOldLinkIndexInFocusNote = focusNote.getCommentIndex(parentNoteOldUrl)
            parentNoteNewLinkIndexInFocusNote = focusNote.getCommentIndex(parentNoteNewUrl)
            parentNoteLinkIndexInFocusNote = Math.max(parentNoteOldLinkIndexInFocusNote, parentNoteNewLinkIndexInFocusNote)
            linkHtmlCommentIndex = Math.max(focusNote.getCommentIndex("相关链接：",true), focusNote.getCommentIndex("所属：",true))
            if (parentNoteLinkIndexInFocusNote == -1) { // 防止第二次链接
              // parentNote.appendNoteLink(focusNote, "Both")
              if (
                focusNote.comments[linkHtmlCommentIndex+1] &&
                focusNote.comments[linkHtmlCommentIndex+1].type !== "HtmlNote"
              ) {
                // 去掉原来被链接的卡片里的链接
                // let oldLinkedNoteId = focusNote.comments[linkHtmlCommentIndex+1].text.match(/marginnote4app:\/\/note\/(.*)/)[1]
                let oldLinkedNoteId = null; // 初始化旧链接笔记ID变量为null或默认值
                let commentText = focusNote.comments[linkHtmlCommentIndex + 1].text; // 获取评论文本
                let matchResult = commentText.match(/marginnote4app:\/\/note\/(.*)/); // 尝试匹配 marginnote4 的格式
                if (!matchResult) { // 如果未匹配到，尝试匹配 marginnote3 的格式
                  matchResult = commentText.match(/marginnote3app:\/\/note\/(.*)/);
                }
                if (matchResult && matchResult.length > 1) { // 确保匹配成功且匹配数组有第二个元素（即捕获到的内容）
                  oldLinkedNoteId = matchResult[1]; // 获取旧链接笔记ID
                  let oldLinkedNote = MNNote.new(oldLinkedNoteId)
                  let oldIndexInOldLinkedNote = oldLinkedNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                  // MNUtil.showHUD(oldIndexInOldLinkedNote)
                  if (oldIndexInOldLinkedNote !== -1) {
                    oldLinkedNote.removeCommentByIndex(oldIndexInOldLinkedNote)
                  }
                }
                focusNote.removeCommentByIndex(linkHtmlCommentIndex+1)
              }
              focusNote.appendNoteLink(parentNote, "To")
              focusNote.moveComment(focusNote.comments.length-1, linkHtmlCommentIndex+1)  // 放在“相关链接：”下面
            } else {
              focusNote.moveComment(parentNoteLinkIndexInFocusNote, linkHtmlCommentIndex+1)
            }
            focusNoteOldLinkIndexInParentNote = parentNote.getCommentIndex("marginnote3app://note/" + focusNote.noteId)
            focusNoteNewLinkIndexInParentNote = parentNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
            focusNoteLinkIndexInParentNote = Math.max(focusNoteOldLinkIndexInParentNote, focusNoteNewLinkIndexInParentNote)
            if (focusNoteLinkIndexInParentNote == -1) { // 防止第二次链接
              parentNote.appendNoteLink(focusNote, "To")
            }
          }
        } else {
          // 父卡片是非归类型的淡黄色卡片
          focusNoteOldLinkIndexInParentNote = parentNote.getCommentIndex("marginnote3app://note/" + focusNote.noteId)
          focusNoteNewLinkIndexInParentNote = parentNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
          if ((focusNoteOldLinkIndexInParentNote == -1) && (focusNoteNewLinkIndexInParentNote == -1)) { // 防止第二次链接
            parentNote.appendNoteLink(focusNote, "To")
          }
        }
    }
  }

  // 将“相关概念：”移动到下方
  static makeCardsAuxMoveDownDefinitionsComments(focusNote) {
    let definitionHtmlCommentIndex = focusNote.getCommentIndex("相关概念：", true)
    let linkHtmlCommentIndex = focusNote.getCommentIndex("相关链接：", true)
    if (definitionHtmlCommentIndex !== -1) {
      if (definitionHtmlCommentIndex < linkHtmlCommentIndex) {
        for (let i = linkHtmlCommentIndex-1; i >=definitionHtmlCommentIndex; i-- ) {
          // 注意这里不是 focusNote.moveComment(i, focusNote.comments.length-1)
          focusNote.moveComment(definitionHtmlCommentIndex, focusNote.comments.length-1)
        }
      }
    }
  }

  static makeCardsAuxMoveDownApplicationsComments(focusNote) {
    let applicationHtmlCommentIndex = focusNote.getCommentIndex("应用：",true)
    let proofHtmlCommentIndex = focusNote.getCommentIndex("证明：", true)
    let linkHtmlCommentIndex = focusNote.getCommentIndex("相关链接：", true)
    if (applicationHtmlCommentIndex !== -1) { // 存在“应用：”时进行处理
      let focusNoteComments = focusNote.note.comments
      let focusNoteCommentLength = focusNote.note.comments.length
      let applicationsContentsIndex = []
      applicationsContentsIndex.push(applicationHtmlCommentIndex)
      let continuousLink = true
      if (applicationHtmlCommentIndex !== focusNoteComments.length-1) { // “应用：”不是最后一个评论时进行处理
        focusNoteComments.forEach((comment, index) => {
          if (index > applicationHtmlCommentIndex) {
            if (continuousLink) {
              if (comment.type == "PaintNote") {  //  PaintNote 的 text 是 undefined，必须加判断，否则报错
                continuousLink = false
              } else {
                if (
                  comment.text &&
                  (
                    comment.text.includes("marginnote4app") || comment.text.includes("marginnote3app")
                  )
                ) {
                  // MNUtil.showHUD("有链接！")
                  applicationsContentsIndex.push(index)
                } else {
                  // MNUtil.showHUD("没有链接！")
                  continuousLink = false
                }
              }
            }
          }
        })
      }
      // MNUtil.showHUD(applicationsContentsIndex)
      // if (focusNoteComments[proofHtmlCommentIndex+1].type !== "HtmlNote" || (applicationHtmlCommentIndex < proofHtmlCommentIndex)) {  // 有证明内容，或者是“应用：”在“证明：”前面的，才移动“应用：”
      if ((applicationHtmlCommentIndex < proofHtmlCommentIndex) || (applicationHtmlCommentIndex < linkHtmlCommentIndex)) {  // “应用：”在“证明：”前面或在 “相关链接：”前面，才移动“应用：”
        applicationsContentsIndex.forEach(
          index => {
            // 注意！用一次 moveComment 之后，原来的 index 就会减一
            // 所以不能写成 focusNote.moveComment(index, focusNoteCommentLength-1)
            focusNote.moveComment(applicationHtmlCommentIndex, focusNoteCommentLength-1)
          }
        )
      }
    }
  }

  static moveProofToMethod(focusNote,methodNum) {
    let focusNoteComments = focusNote.note.comments
    let focusNoteCommentLength = focusNoteComments.length
    let nonLinkNoteCommentsIndex = []
    let proofHtmlCommentIndex
    let focusNoteType
    switch (focusNote.colorIndex) {
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
    // let afterApplicationHtmlContinuousLink = true
    switch (focusNoteType) {
      case "method":
        proofHtmlCommentIndex = focusNote.getCommentIndex("原理：", true)
        break;
      case "antiexample":
        proofHtmlCommentIndex = focusNote.getCommentIndex("反例及证明：", true)
        break;
      default:
        proofHtmlCommentIndex = focusNote.getIncludingCommentIndex('方法'+ this.numberToChinese(methodNum) +'：', true)
        break;
    }
    let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
    let applicationHtmlCommentIndex = focusNote.getCommentIndex("应用：", true)
    let applicationHtmlCommentIndexArr = []
    if (applicationHtmlCommentIndex !== -1) {
      focusNote.comments.forEach((comment, index) => {
        if (
          comment.text &&
          (
            comment.text.includes("应用：") ||
            comment.text.includes("的应用")
          )
        ) {
          applicationHtmlCommentIndexArr.push(index)
        }
      })
      applicationHtmlCommentIndex = applicationHtmlCommentIndexArr[applicationHtmlCommentIndexArr.length-1]
    }
      focusNoteComments.forEach((comment, index) => {
        if (index > applicationHtmlCommentIndex) {
          if (
            comment.type == "PaintNote" || comment.type == "LinkNote" ||
            (
              comment.text &&
              !comment.text.includes("marginnote4app") && !comment.text.includes("marginnote3app") 
            )
          ) {
            nonLinkNoteCommentsIndex.push(index)
          }
        }
      })

      // bug：手写无法移动
      // for (let i = nonLinkNoteCommentsIndex[0]; i < focusNoteCommentLength; i++, targetCommentIndex++) {
      //   focusNote.moveComment(i, targetCommentIndex);
      // }
      let targetCommentIndex
      let nextMethodCommentIndex = focusNote.getIncludingCommentIndex('方法'+ this.numberToChinese(parseInt(methodNum)+1) +'：')
      targetCommentIndex = (nextMethodCommentIndex == -1)? thoughtHtmlCommentIndex: nextMethodCommentIndex
      // MNUtil.showHUD("next"+ nextMethodCommentIndex + " target"+ targetCommentIndex)

      for (let i = focusNoteCommentLength-1; i >= nonLinkNoteCommentsIndex[0]; i--) {
        focusNote.moveComment(focusNoteCommentLength-1, targetCommentIndex);
      }
  }

  static makeCardsAuxMoveProofHtmlComment(focusNote,focusNoteType) {
    let focusNoteComments = focusNote.note.comments
    let focusNoteCommentLength = focusNoteComments.length
    let nonLinkNoteCommentsIndex = []
    let proofHtmlCommentIndex
    // let afterApplicationHtmlContinuousLink = true
    switch (focusNoteType) {
      case "method":
        proofHtmlCommentIndex= focusNote.getCommentIndex("原理：", true)
        break;
      case "antiexample":
        proofHtmlCommentIndex= focusNote.getCommentIndex("反例及证明：", true)
        break;
      default:
        proofHtmlCommentIndex = focusNote.getCommentIndex("证明：", true)
        break;
    }
    let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
    let applicationHtmlCommentIndex = focusNote.getCommentIndex("应用：", true)
    let applicationHtmlCommentIndexArr = []
    if (applicationHtmlCommentIndex !== -1) {
      focusNote.comments.forEach((comment, index) => {
        if (
          comment.text &&
          (
            comment.text.includes("应用：") ||
            comment.text.includes("的应用")
          )
        ) {
          applicationHtmlCommentIndexArr.push(index)
        }
      })
      applicationHtmlCommentIndex = applicationHtmlCommentIndexArr[applicationHtmlCommentIndexArr.length-1]
    }
    // let linkHtmlCommentIndex = focusNote.getCommentIndex("相关链接：", true)
    // if (focusNoteComments[proofHtmlCommentIndex+1].type == "HtmlNote") { // 若“证明：”下面是 HtmlNote，则说明没有证明内容，就需要移动“证明：”
      // 证明内容要么在最上方，要么在最下方，判断标准为“应用：”及链接后面有没有内容
      // 要注意的是链接的判断要和证明内容的链接判断区分开，不能被证明内容的链接判断干扰
      focusNoteComments.forEach((comment, index) => {
        // if (comment.type == "PaintNote") {
        //   MNUtil.showHUD("手写！")
        // } else {
        //   MNUtil.showHUD("不是手写！")
        // }
        if (index > applicationHtmlCommentIndex) {
          // MNUtil.showHUD(index + ">" + applicationHtmlCommentIndex)
          // if (comment.text.includes("marginnote4app")) {
          //   afterApplicationHtmlContinuousLink = false
          //   nonLinkNoteCommentsIndex.push(index)
          // }

          // [fixed] 无法移动手写的问题出在 PaintNote 的 text 是 undefined
          if (comment.type == "PaintNote" || comment.type == "LinkNote") {
            nonLinkNoteCommentsIndex.push(index)
          } else {
            if (
              comment.text &&
              !comment.text.includes("marginnote4app") && !comment.text.includes("marginnote3app") 
            ) {
              nonLinkNoteCommentsIndex.push(index)
            }
          }
        }
      })
      // MNUtil.showHUD(nonLinkNoteCommentsIndex)
      if (nonLinkNoteCommentsIndex.length == 0) { // 说明“应用：”和链接下面没有证明内容，那就去最上方找，即先证明再制卡
        focusNoteComments.forEach((comment, index) => {
          if (comment.type !== "LinkNote") {
            nonLinkNoteCommentsIndex.push(index)
          }
        })
        focusNote.moveComment(proofHtmlCommentIndex, nonLinkNoteCommentsIndex[0])
      } else {
        // MNUtil.showHUD("在下方")
        if (focusNoteComments[proofHtmlCommentIndex+1].type == "HtmlNote") {
          // 此时没证明内容，将上面的内容移动下去
          for (let i = proofHtmlCommentIndex+1; i < nonLinkNoteCommentsIndex[0]; i++) {
            focusNote.moveComment(proofHtmlCommentIndex+1, focusNoteCommentLength-1);
          }
        } else {
          // 证明在最下方，此时不移动“证明：”，而是把证明的内容移动上去
          // bug：手写无法移动
          for (let i = nonLinkNoteCommentsIndex[0]; i < focusNoteCommentLength; i++, thoughtHtmlCommentIndex++) {
            focusNote.moveComment(i, thoughtHtmlCommentIndex);
          }
        }
      }
  }

  // 根据颜色 index 确认卡片类型
  static getKnowledgeNoteTypeByColorIndex(colorIndex) {
    let focusNoteType
    switch (colorIndex) {
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
    return focusNoteType
  }
  static referenceMoveLastCommentToThought(focusNote){
    let refedHtmlCommentIndex = focusNote.getCommentIndex("被引用情况：", true)
    focusNote.moveComment(focusNote.comments.length-1, refedHtmlCommentIndex)
  }

  static moveLastCommentToThought(focusNote){
    let linkHtmlCommentIndex = focusNote.getCommentIndex("相关链接：", true)
    let keywordsHtmlCommentIndex = focusNote.getIncludingCommentIndex("关键词：", true)
    let finalIndex = (keywordsHtmlCommentIndex == -1)? linkHtmlCommentIndex : keywordsHtmlCommentIndex
    focusNote.moveComment(focusNote.comments.length-1, finalIndex)
  }

  static moveLastCommentToProof(focusNote){
    let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
    let finalIndex = thoughtHtmlCommentIndex
    focusNote.moveComment(focusNote.comments.length-1, finalIndex)
  }

  static moveLastTwoCommentsToThought(focusNote){
    let linkHtmlCommentIndex = focusNote.getCommentIndex("相关链接：", true)
    let keywordsHtmlCommentIndex = focusNote.getIncludingCommentIndex("关键词：", true)
    let finalIndex = (keywordsHtmlCommentIndex == -1)? linkHtmlCommentIndex : keywordsHtmlCommentIndex
    focusNote.moveComment(focusNote.comments.length-1, finalIndex)
    focusNote.moveComment(focusNote.comments.length-1, finalIndex)
  }

  static moveLastTwoCommentsInBiLinkNotesToThought(focusNote){
    let keywordsHtmlCommentIndexInFocusNote = focusNote.getIncludingCommentIndex("关键词：", true)
    let targetNoteId = focusNote.comments[focusNote.comments.length-1].text.match(/marginnote4app:\/\/note\/(.*)/)[1]
    let targetNote = MNNote.new(targetNoteId)
    let keywordsHtmlCommentIndexInTargetNote = targetNote.getIncludingCommentIndex("关键词：", true)
    focusNote.moveComment(focusNote.comments.length-1, keywordsHtmlCommentIndexInFocusNote)
    focusNote.moveComment(focusNote.comments.length-1, keywordsHtmlCommentIndexInFocusNote)
    targetNote.moveComment(targetNote.comments.length-1, keywordsHtmlCommentIndexInTargetNote)
    targetNote.moveComment(targetNote.comments.length-1, keywordsHtmlCommentIndexInTargetNote)
  }

  static moveLastTwoCommentsToProof(focusNote){
    let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
    let finalIndex = thoughtHtmlCommentIndex
    focusNote.moveComment(focusNote.comments.length-1, finalIndex)
    focusNote.moveComment(focusNote.comments.length-1, finalIndex)
  }

  static referenceMoveLastTwoCommentsToThought(focusNote){
    let refedHtmlCommentIndex = focusNote.getCommentIndex("被引用情况：", true)
    focusNote.moveComment(focusNote.comments.length-1, refedHtmlCommentIndex)
    focusNote.moveComment(focusNote.comments.length-1, refedHtmlCommentIndex)
  }
  // 增加思考
  static addThought(focusNotes) {
    focusNotes.forEach(focusNote => {
      let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
      if (thoughtHtmlCommentIndex !== -1) {
        // let keywordsIHtmlCommentIndex = focusNote.getCommentIndex("关键词： ", true)
        // let keywordsIIHtmlCommentIndex = focusNote.getCommentIndex("关键词：", true)
        // let keywordsHtmlCommentIndex = Math.max(keywordsIHtmlCommentIndex, keywordsIIHtmlCommentIndex)  // 兼容两种“关键词：”
        let keywordsHtmlCommentIndex = focusNote.getIncludingCommentIndex("关键词：", true)
        let linkHtmlCommentIndex = focusNote.getCommentIndex("相关链接：", true)
        let applicationHtmlCommentIndex = focusNote.getCommentIndex("应用：", true)
        let focusNoteComments = focusNote.note.comments
        let focusNoteCommentLength = focusNoteComments.length
        let nonLinkNoteCommentsIndex = []
        let focusNoteColorIndex = focusNote.note.colorIndex
        let focusNoteType
        /* 确定卡片类型 */
        switch (focusNoteColorIndex) {
          case 2: // 淡蓝色：定义类
            focusNoteType = "definition"
            break;
          case 3: // 淡粉色：反例
            focusNoteType = "antiexample"
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
        // let afterApplicationHtmlContinuousLink = true
        // switch (focusNoteType) {
        //   case "method":
        //     proofHtmlCommentIndex= focusNote.getCommentIndex("原理：", true)
        //     break;
        //   case "antiexample":
        //     proofHtmlCommentIndex= focusNote.getCommentIndex("反例及证明：", true)
        //     break;
        //   default:
        //     proofHtmlCommentIndex = focusNote.getCommentIndex("证明：", true)
        //     break;
        // }
        // if (focusNoteComments[proofHtmlCommentIndex+1].type == "HtmlNote") { // 若“证明：”下面是 HtmlNote，则说明没有证明内容，就需要移动“证明：”
          // 证明内容要么在最上方，要么在最下方，判断标准为“应用：”及链接后面有没有内容
          // 要注意的是链接的判断要和证明内容的链接判断区分开，不能被证明内容的链接判断干扰
        if (focusNoteType == "definition") {
          // 最后为“相关概念：”
          // focusNoteComments.forEach((comment, index) => {
          //   if (index > definitionHtmlCommentIndex) {
          //     if (comment.type == "PaintNote") {
          //       nonLinkNoteCommentsIndex.push(index)
          //     } else {
          //       if (!comment.text.includes("marginnote4app") && !comment.text.includes("marginnote3app") ) {
          //         nonLinkNoteCommentsIndex.push(index)
          //       }
          //     }
          //   }
          // })
  
          // 由于定义类卡片的“相关概念：”下方不是只有链接，所以不能用链接判断，否则会把相关概念的部分也移动上去，所以就改成了直接增加
          focusNote.appendMarkdownComment("- ", linkHtmlCommentIndex)
        } else {
          // 最后为“应用：”
          focusNoteComments.forEach((comment, index) => {
            if (index > applicationHtmlCommentIndex) {
              if (comment.type == "PaintNote" || comment.type == "LinkNote") {
                nonLinkNoteCommentsIndex.push(index)
              } else {
                if (
                  comment.text &&
                  !comment.text.includes("marginnote4app") && !comment.text.includes("marginnote3app")
                ) {
                  nonLinkNoteCommentsIndex.push(index)
                }
              }
            }
          })
  
          if (nonLinkNoteCommentsIndex.length !== 0) {
            for (let i = nonLinkNoteCommentsIndex[0]; i < focusNoteCommentLength; i++, keywordsHtmlCommentIndex++) {
              focusNote.moveComment(i, keywordsHtmlCommentIndex);
            }
          } else {
            focusNote.appendMarkdownComment("- ", keywordsHtmlCommentIndex)
          }
        }
      }
    })
  }

  static addThoughtPoint(focusNote) {
    let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
    if (thoughtHtmlCommentIndex !== -1) {
      let keywordsHtmlCommentIndex = focusNote.getIncludingCommentIndex("关键词：", true)
      let linkHtmlCommentIndex = focusNote.getCommentIndex("相关链接：", true)
      if (this.getKnowledgeNoteTypeByColorIndex(focusNote.note.colorIndex) == "definition") {
        focusNote.appendMarkdownComment("- ", linkHtmlCommentIndex)
      } else {
        let targetIndex = (keywordsHtmlCommentIndex == -1)? linkHtmlCommentIndex : keywordsHtmlCommentIndex
        focusNote.appendMarkdownComment("- ", targetIndex)
      }
    }
  }

  static referenceAddThoughtPoint(focusNote) {
    let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
    if (thoughtHtmlCommentIndex !== -1) {
      let refedHtmlCommentIndex = focusNote.getCommentIndex("被引用情况：", true)
      focusNote.appendMarkdownComment("- ", refedHtmlCommentIndex)
    }
  }

  static moveUpThoughtPoints(focusNote) {
    let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
    if (thoughtHtmlCommentIndex !== -1) {
      let keywordsHtmlCommentIndex = focusNote.getIncludingCommentIndex("关键词：", true)
      let linkHtmlCommentIndex = focusNote.getCommentIndex("相关链接：", true)
      let applicationHtmlCommentIndex = focusNote.getIncludingCommentIndex("应用：", true)
      let applicationHtmlCommentIndexArr = []
      if (applicationHtmlCommentIndex !== -1) {
        focusNote.comments.forEach((comment, index) => {
          if (
            comment.text &&
            (
              comment.text.includes("应用：") ||
              comment.text.includes("的应用")
            )
          ) {
            applicationHtmlCommentIndexArr.push(index)
          }
        })
        applicationHtmlCommentIndex = applicationHtmlCommentIndexArr[applicationHtmlCommentIndexArr.length-1]
      }

      let focusNoteComments = focusNote.note.comments
      let focusNoteCommentLength = focusNoteComments.length
      let nonLinkNoteCommentsIndex = []
      let focusNoteColorIndex = focusNote.note.colorIndex
      let focusNoteType
      /* 确定卡片类型 */
      switch (focusNoteColorIndex) {
        case 2: // 淡蓝色：定义类
          focusNoteType = "definition"
          break;
        case 3: // 淡粉色：反例
          focusNoteType = "antiexample"
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
      // if (focusNoteComments[proofHtmlCommentIndex+1].type == "HtmlNote") { // 若“证明：”下面是 HtmlNote，则说明没有证明内容，就需要移动“证明：”
        // 证明内容要么在最上方，要么在最下方，判断标准为“应用：”及链接后面有没有内容
        // 要注意的是链接的判断要和证明内容的链接判断区分开，不能被证明内容的链接判断干扰
      if (focusNoteType == "definition") {
        // 最后为“相关概念：”
        // 由于定义类卡片的“相关概念：”下方不是只有链接，所以不能用链接判断，否则会把相关概念的部分也移动上去，所以就改成了直接增加
        focusNote.appendMarkdownComment("- ", linkHtmlCommentIndex)
      } else {
        // 最后为“应用：”
        focusNoteComments.forEach((comment, index) => {
          if (index > applicationHtmlCommentIndex) {
            if (comment.type == "PaintNote" || comment.type == "LinkNote") {
              nonLinkNoteCommentsIndex.push(index)
            } else {
              if (
                comment.text &&
                !comment.text.includes("marginnote4app") && !comment.text.includes("marginnote3app")
              ) {
                nonLinkNoteCommentsIndex.push(index)
              }
            }
          }
        })

        let targetIndex = (keywordsHtmlCommentIndex == -1)? linkHtmlCommentIndex : keywordsHtmlCommentIndex
        if (nonLinkNoteCommentsIndex.length !== 0) {
          for (let i = nonLinkNoteCommentsIndex[0]; i < focusNoteCommentLength; i++, targetIndex++) {
            focusNote.moveComment(i, targetIndex);
          }
        } else {
          focusNote.appendMarkdownComment("- ", targetIndex)
        }
      }
    }
  }

  static referenceMoveUpThoughtPoints(focusNote) {
    let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
    if (thoughtHtmlCommentIndex !== -1) {
      let referenceHtmlCommentIndex = focusNote.getCommentIndex("参考文献：", true)
      let refedHtmlCommentIndex = focusNote.getCommentIndex("被引用情况：", true)
      let linksArr = []
      try {
        MNUtil.undoGrouping(()=>{
          focusNote.comments.forEach((comment, index) => {
            if (
              comment.type == "TextNote" &&
              (
                comment.text.includes("marginnote4app") || comment.text.includes("marginnote3app")
              )
            ) {
              linksArr.push(index)
            }
          })
          let startIndex
          if (referenceHtmlCommentIndex < focusNote.comments.length-1) {
            let referenceContinuousLinksArr = this.getContinuousSequenceFromNum(linksArr, referenceHtmlCommentIndex+1)
            if (referenceContinuousLinksArr.length == 0) {
              // “参考文献：”下方没有紧跟链接
              startIndex = referenceHtmlCommentIndex
            } else {
              // “参考文献：”下方有紧跟链接
              startIndex = referenceContinuousLinksArr[referenceContinuousLinksArr.length-1]
            }
            if (startIndex < focusNote.comments.length-1) {
              for (let i = focusNote.comments.length-1; i > startIndex; i--) {
                focusNote.moveComment(focusNote.comments.length-1, refedHtmlCommentIndex)
              }
            }
          }
        })
      } catch (error) {
        MNUtil.showHUD(error);
      }
    }
  }
  // 消除卡片内容，保留文字评论
  static clearContentKeepMarkdownText(focusNote) {
    let focusNoteComments = focusNote.note.comments
    let focusNoteCommentLength = focusNoteComments.length
    let comment
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "请确认",
      "只保留 Markdown 文字吗？\n注意 Html 评论也会被清除",
      0,
      "点错了",
      ["确定"],
      (alert, buttonIndex) => {
        if (buttonIndex == 1) {
          MNUtil.undoGrouping(()=>{
            MNUtil.copy(focusNote.noteTitle)
            focusNote.noteTitle = ""
            // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
            for (let i = focusNoteCommentLength-1; i >= 0; i--) {
              comment = focusNoteComments[i]
              if (
                (comment.type !== "TextNote") || 
                (
                  (comment.type !== "PaintNote") && 
                  (
                    (comment.text.includes("marginnote4app")) 
                    || 
                    (comment.text.includes("marginnote3app"))
                  )
                ) 
              ) {
                focusNote.removeCommentByIndex(i)
              }
            }
          })
        }
      }
    )
  }


  // 把卡片中的 HtmlNote 的内容转化为 Markdown 语

  static convetHtmlToMarkdown(focusNote){
    let focusNoteComments = focusNote.note.comments
    focusNoteComments.forEach((comment, index) => {
      if (comment.type == "HtmlNote") {
        let content = comment.text
        let markdownContent = '<span style="font-weight: bold; color: white; background-color: #0096ff; font-size: 1.15em; padding-top: 5px; padding-bottom: 5px">' + content + '</span>'
        focusNote.removeCommentByIndex(index)
        focusNote.appendMarkdownComment(markdownContent, index)
      }
    })
  }

  
  // static changeLevelsInTemplateNoteComments(focusNotes) {
  //   const levelMap = {
  //       "两层": "一层",
  //       "三层": "两层",
  //       "四层": "三层",
  //       "五层": "四层",
  //       // 如果有更多层级需要替换，可以在这里继续扩展映射关系
  //   };

  //   focusNotes.forEach(focusNote => {
  //     let replaceFlag = true;  // 标记是否需要进行替换
  //     focusNote.note.comments.forEach((comment, index) => {
  //       if (comment.text && comment.text.includes("- ") && replaceFlag) {
  //         for (const [currentLevel, nextLevel] of Object.entries(levelMap)) {
  //           if (comment.text.includes(currentLevel)) {
  //             if (currentLevel === "一层") {
  //               replaceFlag = false;  // 如果出现 "- 一层"，设置标记为 false，不再替换
  //             }
  //             const newCommentText = comment.text.replace(currentLevel, nextLevel);
  //             focusNote.removeCommentByIndex(index);
  //             focusNote.appendMarkdownComment(newCommentText, index);
  //           }
  //         }
  //       }
  //     });
  //   });
  // }

  static addTopic(focusNote) {
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "新的专题",
      "输入标题",
      2,
      "取消",
      ["确定"],
      (alert, buttonIndex) => {
        let userInputTitle = alert.textFieldAtIndex(0).text;
        if (buttonIndex === 1) {
          let topicParentNote = MNNote.clone("35256174-9EDD-416F-9699-B6D5C1E1F0E6")
          topicParentNote.note.noteTitle = userInputTitle
          MNUtil.undoGrouping(()=>{
            focusNote.addChild(topicParentNote.note)
            // MNUtil.showHUD(topicParentNote.childNotes.length);
            topicParentNote.descendantNodes.descendant.forEach(
              // 把每个子卡片标题中的 “标题” 替换为 userInputTitle
              childNote => {
                childNote.noteTitle = childNote.noteTitle.replace(/标题/g, userInputTitle)
              }
            )
            topicParentNote.childNotes[0].focusInMindMap()
          })
        }
      }
    )
  }

  static addTemplateAuxGetNoteIdByType(type) {
    switch (type) {
      case "定义":
        return "A9607770-48A3-4722-A399-A33E2BD55CCB"
      case "命题":
        return "35A16F68-E35F-42DB-BC83-BFCF10C4ED6D"
      case "例子":
        return "CC353F22-B9A6-457A-8EBD-E25786609D48"
      case "反例":
        return "97C53969-F206-4FD1-A041-1B37A16516B8"
      case "问题":
        return "1DA52F05-6742-471E-A665-0DAC2E72AAE2"
      case "应用":
        return "368F2283-FA0C-46AC-816B-1B7BA99B2455"
      case "思想方法":
        return "D1B864F5-DD3A-435E-8D15-49DA219D3895"
    }
  }

  static addTemplate(focusNote,focusNoteColorIndex) {
    let templateNote
    let type
    let contentInTitle
    if (focusNoteColorIndex == 1) {
      const matchResult = focusNote.noteTitle.match(/“(.+)”相关(.+)/);
      if (matchResult) {
        contentInTitle = matchResult[1];
      } else {
        // 处理没有匹配到的情况，例如设置默认值或抛出错误
        contentInTitle = ''; // 或者抛出错误：console.error('未匹配到预期格式');
      }
    } else if (focusNoteColorIndex == 0 || focusNoteColorIndex == 4) {
      const matchResult = focusNote.noteTitle.match(/“(.+)”：“(.+)”相关(.+)/);
      if (matchResult) {
        contentInTitle = matchResult[2]; // 获取第二个匹配组
      } else {
        // 处理没有匹配到的情况
        contentInTitle = ''; // 或者抛出错误
      }
    } else {
      const matchResult = focusNote.noteTitle.match(/【(.*?)：(.*)】(.*)/);
      if (matchResult) {
        contentInTitle = matchResult[2]; // 获取第二个匹配组，即括号内的内容
      } else {
        // 处理没有匹配到的情况
        contentInTitle = ''; // 或者抛出错误
      }
    }
    MNUtil.copy(contentInTitle)
    try {
      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
        "增加模板",
        // "请输入标题并选择类型\n注意向上下层添加模板时\n标题是「增量」输入",
        "请输入标题并选择类型",
        2,
        "取消",
        ["向下层增加模板", "增加概念衍生层级","增加兄弟层级模板","向上层增加模板", "最顶层（淡绿色）", "专题"],
        (alert, buttonIndex) => {
          let userInputTitle = alert.textFieldAtIndex(0).text;
          switch (buttonIndex) {
            case  6:
              /* 专题 */
              // 因为专题模板卡片比较多，所以增加一个确认界面
              UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                "请确认",
                "确定标题是：「" + userInputTitle + "」吗？",
                0,
                "写错了",
                ["确定"],
                (alert, buttonIndex) => {
                  if (buttonIndex == 1) {
                    let topicParentNote = MNNote.clone("35256174-9EDD-416F-9699-B6D5C1E1F0E6")
                    topicParentNote.note.noteTitle = userInputTitle
                    MNUtil.undoGrouping(()=>{
                      focusNote.addChild(topicParentNote.note)
                      // MNUtil.showHUD(topicParentNote.childNotes.length);
                      topicParentNote.descendantNodes.descendant.forEach(
                        // 把每个子卡片标题中的 “标题” 替换为 userInputTitle
                        childNote => {
                          childNote.noteTitle = childNote.noteTitle.replace(/标题/g, userInputTitle)
                        }
                      )
                      topicParentNote.childNotes[0].focusInMindMap()
                    })
                  }
                }
              )
              break;
            case 5: 
            /* 增加最顶层的淡绿色模板 */
            try {
              let parentNote
              // 先选到第一个白色的父卡片
              if (focusNoteColorIndex == 12) {
                // 如果选中的就是白色的（比如刚建立专题的时候）
                parentNote = focusNote
              } else {
                parentNote = focusNote.parentNote
                while (parentNote.colorIndex !== 12) {
                  parentNote = parentNote.parentNote
                }
              }
              // MNUtil.showHUD(parentNote.noteTitle)
                if (parentNote) {
                  const typeRegex = /^(.*)（/; // 匹配以字母或数字开头的字符直到左括号 '('
    
                  const match = parentNote.noteTitle.match(typeRegex);
                  if (match) {
                    type = match[1]; // 提取第一个捕获组的内容
                    // MNUtil.showHUD(type);
                    templateNote = MNNote.clone("121387A2-740E-4BC6-A184-E4115AFA90C3")
                    templateNote.note.colorIndex = 1  // 颜色为淡绿色
                    templateNote.note.noteTitle = "“" + userInputTitle + "”相关" + type
                    MNUtil.undoGrouping(()=>{
                      parentNote.addChild(templateNote.note)
                      parentNote.parentNote.appendNoteLink(templateNote, "Both")
                      templateNote.moveComment(templateNote.note.comments.length-1, 1)
                    })
                    // 林立飞：可能是 MN 底层的原因，数据库还没处理完，所以需要加一个延时
                    MNUtil.delay(0.5).then(()=>{
                      templateNote.focusInMindMap()
                    })
                  } else {
                    MNUtil.showHUD("匹配失败，匹配到的标题为" +  parentNote.noteTitle);
                  }
                } else {
                  MNUtil.showHUD("无父卡片");
                }
              } catch (error) {
                MNUtil.showHUD(error);
              }
              
              break;
            case 4:
              try {
                /* 向上增加模板 */
                let parentNote = focusNote.parentNote
                let parentNoteColorIndex = parentNote.note.colorIndex
                let linkHtmlCommentIndex = Math.max(focusNote.getCommentIndex("相关链接：",true), focusNote.getCommentIndex("所属：",true))
                let preContent, postContent
                if (parentNoteColorIndex == 1) {
                  // 父卡片是淡绿色
                  MNUtil.undoGrouping(()=>{
                    if (focusNoteColorIndex == 4) {
                      // 把选中的变成淡黄色
                      focusNote.note.colorIndex = 0
                    }
                    type = parentNote.noteTitle.match(/“.+”相关(.*)/)[1]
                    // MNUtil.showHUD(type);
                    templateNote = MNNote.clone(this.addTemplateAuxGetNoteIdByType(type))
                    templateNote.note.colorIndex = 4  // 颜色为黄色
                    // templateNote.note.noteTitle = "“" + parentNote.noteTitle.match(/“(.*)”相关.*/)[1] + "”：“" + parentNote.noteTitle.match(/“(.*)”相关.*/)[1] + userInputTitle + "”相关" + type
                    templateNote.note.noteTitle = "“" + parentNote.noteTitle.match(/“(.*)”相关.*/)[1] + "”：“" +  userInputTitle + "”相关" + type
                    parentNote.addChild(templateNote.note)
                    parentNote.appendNoteLink(templateNote, "Both")
                    templateNote.moveComment(templateNote.note.comments.length-1, 1)
                    // 将选中的卡片剪切过去
                    templateNote.addChild(focusNote.note)
                    // 修改标题
                    if (focusNoteColorIndex == 0 || focusNoteColorIndex == 4) {
                      preContent = templateNote.noteTitle.match(/“(.*)”：“(.*)”相关.*/)[2]
                      postContent = focusNote.noteTitle.match(/“(.*)”：“(.*)”相关.*/)[2]
                      let preContentBefore = focusNote.noteTitle.match(/“(.*)”：“(.*)”相关.*/)[1]
                      // 检查 postContent 是否以 preContentBefore 开头
                      let isStartWithPreContentBefore = postContent.startsWith(preContentBefore);
                      if (isStartWithPreContentBefore) {
                        // 如果是的话，替换 postContent 中的 preContentBefore 部分为 preContent
                        let replacedContent = postContent.replace(preContentBefore, preContent);
                        postContent = replacedContent;
                      }
                      focusNote.note.noteTitle = "“" + preContent + "”：“" + postContent + "”相关" + type
                      // 去掉原来被链接的卡片里的链接
                      // let oldLinkedNoteId = focusNote.comments[linkHtmlCommentIndex+1].text.match(/marginnote4app:\/\/note\/(.*)/)[1]
                      let oldLinkedNoteId
                      let commentText = focusNote.comments[linkHtmlCommentIndex + 1].text; // 获取评论文本
                      let matchResult = commentText.match(/marginnote4app:\/\/note\/(.*)/); // 尝试匹配 marginnote4 的格式
                      if (!matchResult) { // 如果未匹配到，尝试匹配 marginnote3 的格式
                        matchResult = commentText.match(/marginnote3app:\/\/note\/(.*)/);
                      }
                      if (matchResult) { // 确保匹配成功且匹配数组有第二个元素（即捕获到的内容）
                        oldLinkedNoteId = matchResult[1]; // 获取旧链接笔记ID
                        let oldLinkedNote = MNNote.new(oldLinkedNoteId)
                        let oldIndexInOldLinkedNote = oldLinkedNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                        // MNUtil.showHUD(oldIndexInOldLinkedNote)
                        if (oldIndexInOldLinkedNote !== -1) {
                          oldLinkedNote.removeCommentByIndex(oldIndexInOldLinkedNote)
                        }
                      }
                      focusNote.removeCommentByIndex(linkHtmlCommentIndex+1)
                      // 增加新的链接
                      templateNote.appendNoteLink(focusNote, "Both")
                      focusNote.moveComment(focusNote.note.comments.length-1, linkHtmlCommentIndex+1)
                      focusNote.childNotes.forEach(childNote => {
                        childNote.refresh()
                      })
                    } else {
                      // 知识点卡片
                      if (
                        focusNote.comments[linkHtmlCommentIndex+1] &&
                        focusNote.comments[linkHtmlCommentIndex+1].type !== "HtmlNote"
                      ) {
                        // 去掉原来被链接的卡片里的链接
                        // let oldLinkedNoteId = focusNote.comments[linkHtmlCommentIndex+1].text.match(/marginnote4app:\/\/note\/(.*)/)[1]
                        let oldLinkedNoteId = null; // 初始化旧链接笔记ID变量为null或默认值
                        let commentText = focusNote.comments[linkHtmlCommentIndex + 1].text; // 获取评论文本
                        let matchResult = commentText.match(/marginnote4app:\/\/note\/(.*)/); // 尝试匹配 marginnote4 的格式
                        if (!matchResult) { // 如果未匹配到，尝试匹配 marginnote3 的格式
                          matchResult = commentText.match(/marginnote3app:\/\/note\/(.*)/);
                        }
                        if (matchResult && matchResult.length > 1) { // 确保匹配成功且匹配数组有第二个元素（即捕获到的内容）
                          oldLinkedNoteId = matchResult[1]; // 获取旧链接笔记ID
                          let oldLinkedNote = MNNote.new(oldLinkedNoteId)
                          let oldIndexInOldLinkedNote = oldLinkedNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                          // MNUtil.showHUD(oldIndexInOldLinkedNote)
                          if (oldIndexInOldLinkedNote !== -1) {
                            oldLinkedNote.removeCommentByIndex(oldIndexInOldLinkedNote)
                          }
                        }
                        focusNote.removeCommentByIndex(linkHtmlCommentIndex+1)
                      }
                      // 增加新的链接
                      templateNote.appendNoteLink(focusNote, "Both")
                      focusNote.moveComment(focusNote.note.comments.length-1, linkHtmlCommentIndex+1)
                      this.makeCardsAuxChangefocusNotePrefix(focusNote, templateNote)
                    }
                    
                    // 林立飞：可能是 MN 底层的原因，数据库还没处理完，所以需要加一个延时
                    MNUtil.delay(0.8).then(()=>{
                      templateNote.focusInMindMap()
                    })
                  })
                } else {
                  if (parentNoteColorIndex == 0 || parentNoteColorIndex == 4) {
                    // 父卡片为黄色
                    MNUtil.undoGrouping(()=>{
                      if (focusNoteColorIndex == 4) {
                        // 把选中的变成淡黄色
                        focusNote.note.colorIndex = 0
                      }
                      // parentNote 向下增加一个层级
                      type = parentNote.noteTitle.match(/“(.*)”：“(.*)”相关(.*)/)[3]
                      // MNUtil.showHUD(type);
                      templateNote = MNNote.clone(this.addTemplateAuxGetNoteIdByType(type))
                      templateNote.note.colorIndex = 0  // 颜色为淡黄色
                      // templateNote.note.noteTitle = "“" + parentNote.noteTitle.match(/“(.*)”：“(.*)”相关(.*)/)[2] + "”：“" + parentNote.noteTitle.match(/“(.*)”：“(.*)”相关(.*)/)[2] + userInputTitle + "”相关" + type
                      templateNote.note.noteTitle = "“" + parentNote.noteTitle.match(/“(.*)”：“(.*)”相关(.*)/)[2] + "”：“"  + userInputTitle + "”相关" + type
                      parentNote.addChild(templateNote.note)
                      parentNote.appendNoteLink(templateNote, "Both")
                      templateNote.moveComment(templateNote.note.comments.length-1, 1)
                      // 将选中的卡片剪切过去
                      templateNote.addChild(focusNote.note)
                      // 删除原来的链接
                      if (focusNoteColorIndex == 0 || focusNoteColorIndex == 4) {
                        if (focusNote.comments[1] && focusNote.comments[1].type !== "HtmlNote") {
                          // 去掉原来被链接的卡片里的链接
                          // let oldLinkedNoteId = focusNote.comments[linkHtmlCommentIndex+1].text.match(/marginnote4app:\/\/note\/(.*)/)[1]
                          let oldLinkedNoteId = null; // 初始化旧链接笔记ID变量为null或默认值
                          let commentText = focusNote.comments[linkHtmlCommentIndex + 1].text; // 获取评论文本
                          let matchResult = commentText.match(/marginnote4app:\/\/note\/(.*)/); // 尝试匹配 marginnote4 的格式
                          if (!matchResult) { // 如果未匹配到，尝试匹配 marginnote3 的格式
                            matchResult = commentText.match(/marginnote3app:\/\/note\/(.*)/);
                          }
                          if (matchResult) { // 确保匹配成功且匹配数组有第二个元素（即捕获到的内容）
                            oldLinkedNoteId = matchResult[1]; // 获取旧链接笔记ID
                            let oldLinkedNote = MNNote.new(oldLinkedNoteId)
                            let oldIndexInOldLinkedNote = oldLinkedNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                            // MNUtil.showHUD(oldIndexInOldLinkedNote)
                            if (oldIndexInOldLinkedNote !== -1) {
                              oldLinkedNote.removeCommentByIndex(oldIndexInOldLinkedNote)
                            }
                          }
                          focusNote.removeCommentByIndex(1)
                        }
                        // 增加新的链接
                        templateNote.appendNoteLink(focusNote, "Both")
                        focusNote.moveComment(focusNote.note.comments.length-1, 1)
                        // 修改标题
                        // focusNote.note.noteTitle = "“" + templateNote.noteTitle.match(/“(.*)”：“(.*)”相关.*/)[2] + "”：“" + focusNote.noteTitle.match(/“(.*)”：“(.*)”相关.*/)[2] + "”相关" + type
                        preContent = templateNote.noteTitle.match(/“(.*)”：“(.*)”相关.*/)[2]
                        postContent = focusNote.noteTitle.match(/“(.*)”：“(.*)”相关.*/)[2]
                        let preContentBefore = focusNote.noteTitle.match(/“(.*)”：“(.*)”相关.*/)[1]
                        // 检查 postContent 是否以 preContentBefore 开头
                        let isStartWithPreContentBefore = postContent.startsWith(preContentBefore);
                        if (isStartWithPreContentBefore) {
                          // 如果是的话，替换 postContent 中的 preContentBefore 部分为 preContent
                          let replacedContent = postContent.replace(preContentBefore, preContent);
                          postContent = replacedContent;
                        }
                        focusNote.note.noteTitle = "“" + preContent + "”：“" + postContent + "”相关" + type
                        focusNote.childNotes.forEach(childNote => {
                          childNote.refresh()
                        })
                        this.changeChildNotesPrefix(focusNote)
                      } else {
                        // focusNote 是知识点卡片
                        if (
                          focusNote.comments[linkHtmlCommentIndex+1] &&
                          focusNote.comments[linkHtmlCommentIndex+1].type !== "HtmlNote"
                        ) {
                          // 去掉原来被链接的卡片里的链接
                          // let oldLinkedNoteId = focusNote.comments[linkHtmlCommentIndex+1].text.match(/marginnote4app:\/\/note\/(.*)/)[1]
                          let oldLinkedNoteId = null; // 初始化旧链接笔记ID变量为null或默认值
                          let commentText = focusNote.comments[linkHtmlCommentIndex + 1].text; // 获取评论文本
                          let matchResult = commentText.match(/marginnote4app:\/\/note\/(.*)/); // 尝试匹配 marginnote4 的格式
                          if (!matchResult) { // 如果未匹配到，尝试匹配 marginnote3 的格式
                            matchResult = commentText.match(/marginnote3app:\/\/note\/(.*)/);
                          }
                          if (matchResult) { // 确保匹配成功且匹配数组有第二个元素（即捕获到的内容）
                            oldLinkedNoteId = matchResult[1]; // 获取旧链接笔记ID
                            let oldLinkedNote = MNNote.new(oldLinkedNoteId)
                            let oldIndexInOldLinkedNote = oldLinkedNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                            // MNUtil.showHUD(oldIndexInOldLinkedNote)
                            if (oldIndexInOldLinkedNote !== -1) {
                              oldLinkedNote.removeCommentByIndex(oldIndexInOldLinkedNote)
                            }
                          }
                          focusNote.removeCommentByIndex(linkHtmlCommentIndex+1)
                        }
                        // 增加新的链接
                        templateNote.appendNoteLink(focusNote, "Both")
                        focusNote.moveComment(focusNote.note.comments.length-1, linkHtmlCommentIndex+1)
                        this.makeCardsAuxChangefocusNotePrefix(focusNote, templateNote)
                      }
                      // let focusNoteIdIndexInParentNote = parentNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                      // parentNote.removeCommentByIndex(focusNoteIdIndexInParentNote)
                      // 林立飞：可能是 MN 底层的原因，数据库还没处理完，所以需要加一个延时
                      MNUtil.delay(0.8).then(()=>{
                        templateNote.focusInMindMap()
                      })
                    })
                  }
                }
              } catch (error) {
                MNUtil.showHUD(error);
              }
              break;
            case 3:
              // 增加兄弟层级模板
              type = focusNote.noteTitle.match(/“.+”相关(.*)/)[1]
              if (type) {
                // MNUtil.showHUD(type);
                templateNote = MNNote.clone(this.addTemplateAuxGetNoteIdByType(type))
                templateNote.note.colorIndex = focusNote.note.colorIndex 
                templateNote.note.noteTitle = "“" + focusNote.noteTitle.match(/“(.*)”：“(.*)”相关.*/)[1] + "”：“" +  userInputTitle + "”相关" + type
                MNUtil.undoGrouping(()=>{
                  focusNote.parentNote.addChild(templateNote.note)
                  focusNote.parentNote.appendNoteLink(templateNote, "Both")
                  templateNote.moveComment(templateNote.note.comments.length-1, 1)
                })
                templateNote.focusInMindMap(0.5)
              }
              break
            case 2:
              try {
                let targetType
                let targetTopParentNote
                let targetParentNote
                let findTargetParentNote = false
                let parentNote = focusNote.parentNote
                let previousParentNote = null; // 初始化为null，以便在没有父节点时保持不变
                let finalParentNote = null; // 设置一个变量来保存符合条件的最终父节点
  
                while (parentNote && !finalParentNote) { // 在找到最终的父节点之前继续循环
                  if (parentNote.noteTitle && parentNote.noteTitle.includes("- 定义")) { // 检查标题是否包含"- 定义"
                    finalParentNote = parentNote.parentNote; // 找到符合条件的父节点，将其赋值给finalParentNote变量
                    break; // 结束循环，因为我们找到了所需的父节点
                  }
                  previousParentNote = parentNote; // 保存当前父节点为上一个父节点
                  parentNote = parentNote.parentNote; // 继续向上查找父节点
                }
  
                let concept
                if (userInputTitle) {
                  concept = userInputTitle
                } else {
                  concept = focusNote.noteTitle.match(/【.*】;\s*([^;]*?)(?:;|$)/)[1]
                }
  
                const locationRegexI = /(“.*”：“.*”相关)定义/;
                const locationRegexII = /“(.*)”：“(.*)”相关定义/;
                const locationRegexIII = /“(.*)”相关定义/;
                let locationTextI = "“" + concept + "”相关"
                let locationTextII = focusNote.parentNote.noteTitle.match(locationRegexI)[1]
                let locationTextIII = "“" + focusNote.parentNote.noteTitle.match(locationRegexII)[2] + "”相关"
                let locationTextIV = "：“" + focusNote.parentNote.noteTitle.match(locationRegexII)[1] + "”相关"
                let locationTextV = "“" + focusNote.parentNote.noteTitle.match(locationRegexII)[1] + "”相关"
                // let locationTextV = "“" + focusNote.parentNote.noteTitle.match(locationRegexIII)[1] + "”相关"
                // MNUtil.showHUD(finalParentNote.noteTitle)
                // bug: 不知道为啥父卡片是淡绿色时，无法弹出这个框
                UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                  "请确认增加的类型",
                  "",
                  0,
                  "写错了",
                  ["命题","例子","反例","问题"],
                  (alert, buttonIndex) => {
                    if (buttonIndex == 0) { return }
                    switch (buttonIndex) {
                      case 1:
                        targetType = "命题"
                        targetTopParentNote = finalParentNote.childNotes[1]
                        break;
                      case 2:
                        targetType = "例子"
                        targetTopParentNote = finalParentNote.childNotes[2]
                        break;
                      case 3:
                        targetType = "反例"
                        targetTopParentNote = finalParentNote.childNotes[3]
                        break;
                      case 4:
                        targetType = "问题"
                        targetTopParentNote = finalParentNote.childNotes[4]
                        break;
                    }
                    // try {
                      // if (focusNote.parentNote.colorIndex !== 1) {
                        // 优先用 locationTextI 来检测
                        for (const descendantNote of targetTopParentNote.childNotes[0].descendantNodes.descendant) {
                          let descendantNoteColorIndex = descendantNote.note.colorIndex;
                          if (descendantNoteColorIndex === 0 || descendantNoteColorIndex === 1 || descendantNoteColorIndex === 4) {
                            if (descendantNote.noteTitle.includes(locationTextI)) {
                              targetParentNote = descendantNote;
                              findTargetParentNote = true;
                              break;  // 找到目标后退出循环
                            }
                          }
                        }
                        
                        if (findTargetParentNote) {
                          // 如果已经有了就直接链接
                          targetParentNote.appendNoteLink(focusNote, "Both")
                          targetParentNote.moveComment(targetParentNote.note.comments.length-1, targetParentNote.getCommentIndex("相关"+ targetType +"：", true))
                          focusNote.moveComment(focusNote.note.comments.length-1, focusNote.getCommentIndex("相关概念：", true))
                        } else {
                          // 找不到的话就换一个 locationText
                          for (const descendantNote of targetTopParentNote.childNotes[0].descendantNodes.descendant) {
                            let descendantNoteColorIndex = descendantNote.note.colorIndex;
                            if (descendantNoteColorIndex === 0 || descendantNoteColorIndex === 1 || descendantNoteColorIndex === 4) {
                              if (descendantNote.noteTitle.includes(locationTextII)) {
                                targetParentNote = descendantNote;
                                findTargetParentNote = true;
                                break;  // 找到目标后退出循环
                              }
                            }
                          }
          
                          if (!findTargetParentNote) {
                            for (const descendantNote of targetTopParentNote.childNotes[0].descendantNodes.descendant) {
                              let descendantNoteColorIndex = descendantNote.note.colorIndex;
                              if (descendantNoteColorIndex === 0 || descendantNoteColorIndex === 1 || descendantNoteColorIndex === 4) {
                                if (descendantNote.noteTitle.includes(locationTextIII)) {
                                  targetParentNote = descendantNote;
                                  findTargetParentNote = true;
                                  break;  // 找到目标后退出循环
                                }
                              }
                            }
          
          
                            if (!findTargetParentNote) {
                              for (const descendantNote of targetTopParentNote.childNotes[0].descendantNodes.descendant) {
                                let descendantNoteColorIndex = descendantNote.note.colorIndex;
                                if (descendantNoteColorIndex === 0 || descendantNoteColorIndex === 1 || descendantNoteColorIndex === 4) {
                                  if (descendantNote.noteTitle.includes(locationTextIV)) {
                                    targetParentNote = descendantNote;
                                    findTargetParentNote = true;
                                    break;  // 找到目标后退出循环
                                  }
                                }
                              }
          
                              if (!findTargetParentNote) {
                                // 如果最后找不到
                                targetParentNote = targetTopParentNote.childNotes[0]
                              }
                            }
                          }
                        
                      // } else {
                      //   for (const descendantNote of targetTopParentNote.childNotes[0].descendantNodes.descendant) {
                      //     let descendantNoteColorIndex = descendantNote.note.colorIndex;
                      //     if (descendantNoteColorIndex === 0 || descendantNoteColorIndex === 1 || descendantNoteColorIndex === 4) {
                      //       if (descendantNote.noteTitle.includes(locationTextV)) {
                      //         targetParentNote = descendantNote;
                      //         findTargetParentNote = true;
                      //         break;  // 找到目标后退出循环
                      //       }
                      //     }
                      //   }
                      // }
        
                      // MNUtil.showHUD(targetParentNote.noteTitle)
  
  
                      // MNUtil.showHUD(concept)
                      templateNote = MNNote.clone(this.addTemplateAuxGetNoteIdByType(targetType))
                      templateNote.note.colorIndex = 0  // 颜色为淡黄色
                      // templateNote.note.noteTitle = "“" + focusNote.noteTitle.match(/“(.*)”：“(.*)”相关.*/)[2] + "”：“" + focusNote.noteTitle.match(/“(.*)”：“(.*)”相关.*/)[2] +  userInputTitle + "”相关" + type
                      // let prefix = targetParentNote.noteTitle.match(/“(.*)”：“(.*)”相关.*/)[2]? targetParentNote.noteTitle.match(/“(.*)”：“(.*)”相关.*/)[2] : (targetParentNote.noteTitle.match(/“(.*)”相关.*/)[1]? targetParentNote.noteTitle.match(/“(.*)”相关.*/)[1] : "")
                      let match1 = targetParentNote.noteTitle.match(/“(.*)”：“(.*)”相关.*/);
                      let match2 = targetParentNote.noteTitle.match(/“(.*)”相关.*/);
                      let prefix = match1 ? match1[2] : (match2 ? match2[1] : "");
                      // MNUtil.showHUD(prefix)
                      templateNote.note.noteTitle = "“" + prefix + "”：“" + concept + "”相关" + targetType
                      MNUtil.undoGrouping(()=>{
                        if (match1) {
                          // 找到黄色的卡片
                          targetParentNote.addChild(templateNote.note)
                          targetParentNote.appendNoteLink(templateNote, "Both")
                          templateNote.moveComment(templateNote.note.comments.length-1, 1)
                          templateNote.appendNoteLink(focusNote, "Both")
                          templateNote.moveComment(templateNote.note.comments.length-1, 2)
                          focusNote.moveComment(focusNote.note.comments.length-1, focusNote.getCommentIndex("相关概念：", true))
                        } else {
                          if (match2) {
                            // 找到绿色卡片
                            targetParentNote.addChild(templateNote.note)
                            targetParentNote.appendNoteLink(templateNote, "Both")
                            templateNote.moveComment(templateNote.note.comments.length-1, 1)
                            templateNote.appendNoteLink(focusNote, "Both")
                            templateNote.moveComment(templateNote.note.comments.length-1, 2)
                            focusNote.moveComment(focusNote.note.comments.length-1, focusNote.getCommentIndex("相关概念：", true))
                          } else {
                            // 黄绿色都没有
                            targetParentNote.addChild(templateNote.note)
                            templateNote.appendNoteLink(targetParentNote, "To")
                            templateNote.moveComment(templateNote.note.comments.length-1, 1)
                            templateNote.appendNoteLink(focusNote, "Both")
                            templateNote.moveComment(templateNote.note.comments.length-1, templateNote.getCommentIndex("相关"+ targetType +"：", true))
                            focusNote.moveComment(focusNote.note.comments.length-1, focusNote.getCommentIndex("相关概念：", true))
                          }
                        }
                      })
                      MNUtil.delay(0.8).then(()=>{
                        templateNote.focusInMindMap()
                      })
                    // } catch (error) {
                    //   MNUtil.showHUD(error);
                    // }
                    }
                  }
                )
              } catch (error) {
                MNUtil.showHUD(error);
              }
              break;
            case 1:
              /* 往下增加模板 */
              // 需要看选中的卡片的颜色
              switch (focusNoteColorIndex) {
                case 1:
                  /* 淡绿色 */
                  type = focusNote.noteTitle.match(/“.+”相关(.*)/)[1]
                  // MNUtil.showHUD(type);
                  templateNote = MNNote.clone(this.addTemplateAuxGetNoteIdByType(type))
                  templateNote.note.colorIndex = 4  // 颜色为黄色
                  // templateNote.note.noteTitle = "“" + focusNote.noteTitle.match(/“(.*)”相关.*/)[1] + "”：“" + focusNote.noteTitle.match(/“(.*)”相关.*/)[1] + userInputTitle + "”相关" + type
                  templateNote.note.noteTitle = "“" + focusNote.noteTitle.match(/“(.*)”相关.*/)[1] + "”：“" +  userInputTitle + "”相关" + type
                  MNUtil.undoGrouping(()=>{
                    focusNote.addChild(templateNote.note)
                    focusNote.appendNoteLink(templateNote, "Both")
                    templateNote.moveComment(templateNote.note.comments.length-1, 1)
                  })
                  // 林立飞：可能是 MN 底层的原因，数据库还没处理完，所以需要加一个延时
                  MNUtil.delay(0.8).then(()=>{
                    templateNote.focusInMindMap()
                  })
                  break;
                case 12:
                  /* 白色的：淡绿色的父卡片，此时和增加淡绿色卡片相同 */
                  const typeRegex = /^(.*)（/; // 匹配以字母或数字开头的字符直到左括号 '('
    
                  const match = focusNote.noteTitle.match(typeRegex);
                  if (match) {
                    type = match[1]; // 提取第一个捕获组的内容
                    // MNUtil.showHUD(type);
                    templateNote = MNNote.clone("121387A2-740E-4BC6-A184-E4115AFA90C3")
                    templateNote.note.colorIndex = 1  // 颜色为淡绿色
                    templateNote.note.noteTitle = "“" + userInputTitle + "”相关" + type
                    MNUtil.undoGrouping(()=>{
                      focusNote.addChild(templateNote.note)
                      focusNote.parentNote.appendNoteLink(templateNote, "Both")
                      templateNote.moveComment(templateNote.note.comments.length-1, 1)
                    })
                    // 林立飞：可能是 MN 底层的原因，数据库还没处理完，所以需要加一个延时
                    MNUtil.delay(0.5).then(()=>{
                      templateNote.focusInMindMap()
                    })
                  } else {
                    MNUtil.showHUD("匹配失败，匹配到的标题为" +  parentNote.noteTitle);
                  }
                  break;
                default:
                  /* 淡黄色、黄色 */
                  type = focusNote.noteTitle.match(/“.+”相关(.*)/)[1]
                  if (type) {
                    // MNUtil.showHUD(type);
                    templateNote = MNNote.clone(this.addTemplateAuxGetNoteIdByType(type))
                    templateNote.note.colorIndex = 0  // 颜色为淡黄色
                    // templateNote.note.noteTitle = "“" + focusNote.noteTitle.match(/“(.*)”：“(.*)”相关.*/)[2] + "”：“" + focusNote.noteTitle.match(/“(.*)”：“(.*)”相关.*/)[2] +  userInputTitle + "”相关" + type
                    templateNote.note.noteTitle = "“" + focusNote.noteTitle.match(/“(.*)”：“(.*)”相关.*/)[2] + "”：“" +  userInputTitle + "”相关" + type
                    MNUtil.undoGrouping(()=>{
                      focusNote.addChild(templateNote.note)
                      focusNote.appendNoteLink(templateNote, "Both")
                      templateNote.moveComment(templateNote.note.comments.length-1, 1)
                    })
                    // 林立飞：可能是 MN 底层的原因，数据库还没处理完，所以需要加一个延时
                    MNUtil.delay(0.8).then(()=>{
                      templateNote.focusInMindMap()
                    })
                  }
                  break;
              }
              break;
          }
        }
      )
    } catch (error) {
      MNUtil.showHUD(error);
    }
  }


  /* 
    处理旧卡片 
    1. 去掉“模板：”或者“模版：”及下面的内容
    2. 去掉“两层”到“五层”
    3. 去掉“- ”
  */
  
  static renewCards(focusNote) {
    let focusNoteComments = focusNote.note.comments
    let focusNoteCommentLength = focusNoteComments.length
    let comment
    let htmlCommentsIndexArr = []

    let layerStartIndex, layerEndIndex
    // layerEndIndex = focusNoteCommentLength - 1 - (templateHtmlCommentEndIndex - templateHtmlCommentStartIndex)
    // layerStartIndex = htmlCommentsIndexArr[htmlCommentsIndexArr.length - 1]
    layerStartIndex = 0
    layerEndIndex = focusNoteCommentLength - 1
    // if (focusNoteColorIndex == 0 || focusNoteColorIndex == 1 || focusNoteColorIndex == 4) {
      // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
      for (let i = layerEndIndex; i >= layerStartIndex; i--) {
        comment = focusNoteComments[i]
        if (
          comment.text && 
          (
            comment.text.includes("零层") || 
            comment.text.includes("一层") || 
            comment.text.includes("两层") || 
            comment.text.includes("三层") || 
            comment.text.includes("四层") || 
            comment.text.includes("五层") ||
            comment.text.trim() == "-" ||
            comment.text.includes("由来/背景：")
          )
        ) {
          try {
            MNUtil.undoGrouping(()=>{
              focusNote.removeCommentByIndex(i)
            })
          } catch (error) {
            MNUtil.showHUD(error);
          }
        }
      }
    // }
    
    focusNoteComments.forEach((comment, index) => {
      if (comment.type == "HtmlNote") {
        htmlCommentsIndexArr.push(index)
      }
    })

    // MNUtil.showHUD(htmlCommentsIndex);

    // 重新更新 focusNoteComments 和 focusNoteCommentLength
    focusNoteComments = focusNote.note.comments
    focusNoteCommentLength = focusNoteComments.length

    let templateHtmlCommentStartIndexI = focusNote.getCommentIndex("模版：", true)
    let templateHtmlCommentStartIndexII = focusNote.getCommentIndex("模板：", true)
    let templateHtmlCommentStartIndex = Math.max(templateHtmlCommentStartIndexI, templateHtmlCommentStartIndexII)
    // let templateHtmlCommentIndex = htmlCommentsIndexArr.indexOf(templateHtmlCommentStartIndex)
    let templateHtmlCommentEndIndex
    // let templateHtmlCommentEndIndex = htmlCommentsIndexArr[templateHtmlCommentIndex+1]
    let templateHtmlCommentEndIndexI = focusNote.getCommentIndex("包含：", true)
    let templateHtmlCommentEndIndexII = Math.max(
      focusNote.getCommentIndex("相关概念：", true),
      focusNote.getCommentIndex("相关命题：", true),
      focusNote.getCommentIndex("相关反例：", true),
      focusNote.getCommentIndex("相关例子：", true),
      focusNote.getCommentIndex("相关应用：", true),
      focusNote.getCommentIndex("相关问题：", true),
      focusNote.getCommentIndex("相关思想方法：", true)
    )
    if (templateHtmlCommentEndIndexII !== -1) {
      templateHtmlCommentEndIndex = templateHtmlCommentEndIndexII
    } else {
      templateHtmlCommentEndIndex = templateHtmlCommentEndIndexI
    }
    // MNUtil.showHUD(templateHtmlCommentStartIndex + " " + templateHtmlCommentEndIndex);
    if (templateHtmlCommentStartIndex !== -1) {
      for (let i = templateHtmlCommentEndIndex-1; i >= templateHtmlCommentStartIndex; i--) {
        focusNote.removeCommentByIndex(i)
      }
    }

    try {
      MNUtil.undoGrouping(()=>{
        this.makeCardsAuxMoveDownApplicationsComments(focusNote)
        this.makeCardsAuxMoveDownDefinitionsComments(focusNote)
      })
    } catch (error) {
      MNUtil.showHUD(error);
    }

    // 更新“关键词：”
    let keywordsHtmlCommentIndex = focusNote.getCommentIndex("关键词：", true)
    if (keywordsHtmlCommentIndex !== -1){
      focusNote.removeCommentByIndex(keywordsHtmlCommentIndex)
      this.cloneAndMerge(focusNote,"13D040DD-A662-4EFF-A751-217EE9AB7D2E")
      focusNote.moveComment(focusNote.comments.length-1, keywordsHtmlCommentIndex)
    }

    // 更新“相关定义：”→“相关概念：”
    let definitionHtmlCommentOldIndex = focusNote.getCommentIndex("相关定义：", true)
    if (definitionHtmlCommentOldIndex !== -1){
      focusNote.removeCommentByIndex(definitionHtmlCommentOldIndex)
      this.cloneAndMerge(focusNote,"9129B736-DBA1-441B-A111-EC0655B6120D")
      focusNote.moveComment(focusNote.comments.length-1, definitionHtmlCommentOldIndex)
    }

    this.clearAllFailedLinks(focusNote)
    focusNote.refresh()
  }

  static changeChildNotesPrefix(focusNote) {
    let focusNoteColorIndex = focusNote.note.colorIndex
    let prefix, type
    const contentCardRegex = /【(.*?)：(.*?)(：.*)?】(.*)/;  // 注意前面的两个要加 ? 变成非贪婪模式
    if (focusNote.note.colorIndex == 1) {
      // 淡绿色卡片
      prefix = focusNote.noteTitle.match(/“(.*)”相关.*/)[1]
      type = focusNote.noteTitle.match(/“.*”相关(.*)/)[1]
      focusNote.childNotes.forEach(childNote => {
        if (childNote.getCommentIndex("相关思考：",true) !== -1 || childNote.getCommentIndex("包含：",true) !== -1) {
          if (childNote.note.colorIndex == 0 || childNote.note.colorIndex == 4) {
            // childNote.noteTitle = childNote.noteTitle.replace(/“(.*)”(：“.*”相关.*)/, "“" + prefix + "”" + "$2")
            childNote.noteTitle = childNote.noteTitle.replace(/“(.*?)”：“(.*?)”相关(.*)/, function(match, p1, p2, p3) {
              // 替换 yyy 中的 xxx 为 prefix
              let newP2 = p2.replace(new RegExp(p1, "g"), prefix);
              // 返回替换后的结果
              return `“${prefix}”：“${newP2}”相关${p3}`;
            });
  
            // 确保有双向链接了
            let childNoteIdIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + childNote.noteId)
            if (childNoteIdIndexInFocusNote == -1) {
              focusNote.appendNoteLink(childNote, "To")
            }
            let focusNoteIdIndexInChildNote = childNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
            if (focusNoteIdIndexInChildNote == -1) {
              childNote.removeCommentByIndex(1)
              childNote.appendNoteLink(focusNote, "To")
              childNote.moveComment(childNote.note.comments.length-1, 1)
            }
          } else {
            // childNote.noteTitle = childNote.noteTitle.replace(contentCardRegex, `【$1：${prefix}$3】$4`)
            this.makeCardsAuxChangefocusNotePrefix(childNote, focusNote)
            // 确保有双向链接了
            let childNoteIdIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + childNote.noteId)
            if (childNoteIdIndexInFocusNote == -1) {
              focusNote.appendNoteLink(childNote, "To")
            }
            let focusNoteIdIndexInChildNote = childNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
            if (focusNoteIdIndexInChildNote == -1) {
              // let linkHtmlCommentIndex = childNote.getCommentIndex("相关链接：", true)
              let linkHtmlCommentIndex = Math.max(childNote.getCommentIndex("相关链接：",true), childNote.getCommentIndex("所属：",true))
              if (childNote.comments[linkHtmlCommentIndex+1] && childNote.comments[linkHtmlCommentIndex+1].type !== "HtmlNote") {
                childNote.removeCommentByIndex(linkHtmlCommentIndex+1)
              }
              childNote.appendNoteLink(focusNote, "To")
              childNote.moveComment(childNote.comments.length-1, linkHtmlCommentIndex+1)
            }
          }
        }
      })
      focusNote.refreshAll()
    } else {
      if (focusNoteColorIndex == 0 || focusNoteColorIndex == 4) {
        // 淡黄色或黄色
        prefix = focusNote.noteTitle.match(/“(.*)”：“(.*)”相关.*/)[2]
        focusNote.childNotes.forEach(childNote => {
          if (childNote.getCommentIndex("相关思考：",true) !== -1 || childNote.getCommentIndex("包含：",true) !== -1) {
            if (childNote.colorIndex == 0 || childNote.colorIndex == 4) {
              childNote.noteTitle = childNote.noteTitle.replace(/“(.*?)”：“(.*?)”相关(.*)/, function(match, p1, p2, p3) {
                // 替换 yyy 中的 xxx 为 prefix
                let newP2 = p2.replace(new RegExp(p1, "g"), prefix);
                // 返回替换后的结果
                return `“${prefix}”：“${newP2}”相关${p3}`;
              });
              // 确保有双向链接了
              let childNoteIdIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + childNote.noteId)
              if (childNoteIdIndexInFocusNote == -1) {
                focusNote.appendNoteLink(childNote, "To")
              }
              let focusNoteIdIndexInChildNote = childNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
              if (focusNoteIdIndexInChildNote == -1) {
                childNote.removeCommentByIndex(1)
                childNote.appendNoteLink(focusNote, "To")
                childNote.moveComment(childNote.comments.length-1, 1)
              }
            } else {
              // 其余颜色的内容卡片
              try {
                // childNote.noteTitle = childNote.noteTitle.replace(contentCardRegex, `【$1：${prefix}$3】$4`);
                this.makeCardsAuxChangefocusNotePrefix(childNote,focusNote)
                let focusNoteIdIndexInChildNote = childNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                if (focusNoteIdIndexInChildNote == -1) {
                  // let linkHtmlCommentIndex = childNote.getCommentIndex("相关链接：", true)
                  let linkHtmlCommentIndex = Math.max(childNote.getCommentIndex("相关链接：",true), childNote.getCommentIndex("所属：",true))
                  if (childNote.comments[linkHtmlCommentIndex+1] && childNote.comments[linkHtmlCommentIndex+1].type !== "HtmlNote") {
                    childNote.removeCommentByIndex(linkHtmlCommentIndex+1)
                  }
                  childNote.appendNoteLink(focusNote, "To")
                  childNote.moveComment(childNote.comments.length-1, linkHtmlCommentIndex+1)
                }
                let childNoteIdIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + childNote.noteId)
                if (childNoteIdIndexInFocusNote == -1) {
                  focusNote.appendNoteLink(childNote, "To")
                }
  
  
                if (childNote.descendantNodes.descendant.length > 0) {
                  childNote.descendantNodes.descendant.forEach(descendantNote => {
                    descendantNote.noteTitle = descendantNote.noteTitle.replace(contentCardRegex, `【$1：${prefix}$3】$4`);
                    let focusNoteIdIndexInDescendantNote = descendantNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                    if (focusNoteIdIndexInDescendantNote == -1) {
                      // let linkHtmlCommentIndex = descendantNote.getCommentIndex("相关链接：", true)
                      let linkHtmlCommentIndex = Math.max(descendantNote.getCommentIndex("相关链接：",true), descendantNote.getCommentIndex("所属：",true))
                      // MNUtil.showHUD("linkHtmlCommentIndex: " + linkHtmlCommentIndex)
                      if (descendantNote.comments[linkHtmlCommentIndex+1] && descendantNote.comments[linkHtmlCommentIndex+1].type !== "HtmlNote") {
                        descendantNote.removeCommentByIndex(linkHtmlCommentIndex+1)
                      }
                      descendantNote.appendNoteLink(focusNote, "To")
                      descendantNote.moveComment(descendantNote.comments.length-1, linkHtmlCommentIndex+1)
                    }
                    let descendantNoteIdIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + descendantNote.noteId)
                    if (descendantNoteIdIndexInFocusNote == -1) {
                      focusNote.appendNoteLink(descendantNote, "To")
                    }
                  })
                }
              } catch (error) {
                MNUtil.showHUD(error);
              }
            }
          }
        })
        focusNote.refreshAll()
      }
    }
  }

  static renewChildNotesPrefix(focusNote) {
    focusNote.childNotes.forEach(
      childNote => {
        childNote.noteTitle = childNote.noteTitle.replace(/(^【.*】)/g,"")
      }
    )
    this.changeChildNotesPrefix(focusNote)
  }


  static achieveCards(focusNote) {
    if (!focusNote.noteTitle.includes("存档")) {
      focusNote.noteTitle += "（存档）"
    }
    focusNote.childNotes[0].childNotes.forEach(childNote => {
      if (!childNote.noteTitle.includes("存档")) {
        childNote.noteTitle += "（存档）"
      }
      childNote.childNotes[0].childNotes.forEach(grandChildNote => {
        if (!grandChildNote.noteTitle.includes("存档")) {
          grandChildNote.noteTitle += "（存档）"
        }
      })
    })
  }

  static moveUpLinkNotes(focusNotes) {
    focusNotes.forEach(focusNote => {
      let htmlCommentsIndexArr = []
      let linkNoteCommentsIndexArr = []
      focusNote.comments.forEach((comment, index) => {
        if (comment.type == "HtmlNote") {
          htmlCommentsIndexArr.push(index)
        } else if (comment.type == "LinkNote") {
          linkNoteCommentsIndexArr.push(index)
        }
      })
      // MNUtil.showHUD("原：" + linkNoteCommentsIndexArr + "处理后" + this.findContinuousSectionFromEnd(linkNoteCommentsIndexArr))
      if (focusNote.comments[focusNote.comments.length-1].type == "LinkNote") {
        try {
          MNUtil.undoGrouping(()=>{
            // this.findContinuousSectionFromEnd(linkNoteCommentsIndexArr).forEach(linkNoteIndex => {
            //   focusNote.moveComment(focusNote.comments.length-1, htmlCommentsIndexArr[0])
            // })
            for (let i = 1; i <= this.findContinuousSectionFromEnd(linkNoteCommentsIndexArr).length; i++) {
              focusNote.moveComment(focusNote.comments.length-1, htmlCommentsIndexArr[0])
            }
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
      }
    })
  }

  static findContinuousSectionFromEnd(arr) {
    // 如果数组长度为1或更短，直接返回数组本身
    if (arr.length <= 1) {
      return arr;
    }
  
    // 如果数组长度为2，检查两个元素是否连续
    if (arr.length === 2) {
      // 如果两个元素是连续的，则返回整个数组；否则返回数组的最后一个元素
      return arr[1] === arr[0] + 1 ? arr : [arr[1]];
    }
  
    // 初始化当前连续子数组和最大连续子数组，初始值为数组最后一个元素
    let continuousSection = [arr[arr.length - 1]];
    let maxContinuous = [arr[arr.length - 1]];
  
    // 从倒数第二个元素开始向前遍历数组
    for (let i = arr.length - 2; i >= 0; i--) {
      // 如果当前元素和当前连续子数组的第一个元素连续
      if (arr[i] === continuousSection[0] - 1) {
        // 将当前元素添加到当前连续子数组的开头
        continuousSection.unshift(arr[i]);
      } else {
        // 如果当前元素不连续，停止构建当前连续子数组
        break;
      }
    }
  
    // 返回从后向前最长的连续子数组
    return continuousSection.length > maxContinuous.length ? continuousSection : maxContinuous;
  }

  static renewProof(focusNotes){
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "请确认",
      "确定要更新证明吗（会删除原来的证明）？",
      0,
      "点错了",
      ["确定"],
      (alert, buttonIndex) => {
        if (buttonIndex == 1) {
          focusNotes.forEach(focusNote => {
            let proofHtmlCommentIndex = focusNote.getCommentIndex("证明：", true)
            let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
            if (Math.min(proofHtmlCommentIndex, thoughtHtmlCommentIndex) !== -1) {
              if (thoughtHtmlCommentIndex - proofHtmlCommentIndex > 1) {
                MNUtil.undoGrouping(()=>{
                  for (let i = thoughtHtmlCommentIndex - 1; i > proofHtmlCommentIndex; i--) {
                    focusNote.removeCommentByIndex(i)
                  }
                })
              }
            }
            let focusNoteColorIndex = focusNote.note.colorIndex
            let focusNoteType
            /* 确定卡片类型 */
            switch (focusNoteColorIndex) {
              case 2: // 淡蓝色：定义类
                focusNoteType = "definition"
                break;
              case 3: // 淡粉色：反例
                focusNoteType = "antiexample"
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
            this.makeCardsAuxMoveProofHtmlComment(focusNote, focusNoteType)
          })
        }
      }
    )
  }
  /**
   * 夏大鱼羊 - end
  */
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
              break;
      }
  }
/**
 * 
 * @param {string} text 
 * @param {MNNote|MbBookNote|undefined} note 
 * @returns 
 */
  static getVarInfo(text) {//对通用的部分先写好对应的值
    let config = {}
    let hasClipboardText = text.includes("{{clipboardText}}")
    let hasSelectionText = text.includes("{{selectionText}}")
    let hasCurrentDocName = text.includes("{{currentDocName}}")
    let hasCurrentDocAttach = text.includes("{{currentDocAttach}}")
    if (hasClipboardText) {
      config.clipboardText = MNUtil.clipboardText
    }
    if (hasSelectionText) {
      config.selectionText = MNUtil.selectionText
    }
    if (hasCurrentDocName) {
      config.currentDocName = MNUtil.getFileName(MNUtil.currentDocController.document.pathFile)
    }
    if (hasCurrentDocAttach && editorUtils) {
      config.currentDocAttach = editorUtils.getAttachContentByMD5(MNUtil.currentDocmd5)
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
  /**
   * 
   * @param {*} range 
   * @returns {MNNote[]}
   */
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
        break;
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
          break;
        }
        break;
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
      case "excerpt":
      case "excerptText":
        note.excerptText = content
        break;
      default:
        break;
    }
  }
  static clearContent(des){
    let range = des.range ?? "currentNotes"
    let targetNotes = this.getNotesByRange(range)
    MNUtil.undoGrouping(()=>{
      targetNotes.forEach(note=>{
        this.clearNoteContent(note, des)
      })
    })
  }
  static setContent(content,des){
    try {
      

    let range = des.range ?? "currentNote"
    let targetNotes = this.getNotesByRange(range)
    MNUtil.undoGrouping(()=>{
      targetNotes.forEach(note=>{
        this.setNoteContent(note, content,des)
      })
    })
    } catch (error) {
      toolbarUtils.addErrorLog(error, "setContent")
    }
  }
  static replace(note,ptt,des){
    let content
    switch (des.target) {
      case "title":
        content = note.noteTitle
        note.noteTitle = content.replace(ptt, des.to)
        break;
      case "excerpt":
        content = note.excerptText ?? ""
        note.excerptText = content.replace(ptt, des.to)
        break;
      default:
        break;
    }
  }
  static _replace_get_ptt_(des) {
    let mod= des.mod ?? "g"
    let ptt
    if ("reg" in des) {
      ptt = new RegExp(des.reg,mod)
    }else{
      ptt = new RegExp(this.escapeStringRegexp(des.from),mod)
    }
    return ptt
  }
  static _replace_get_content_(note,des) {
    let content = ""
    switch (des.target) {
      case "title":
        content = note.noteTitle
        break;
      case "excerpt":
        content = note.excerptText ?? ""
        break;
      default:
        break;
    }
    return content
  }
  static _replace_set_content_(note,des,content) {
    switch (des.target) {
      case "title":
        note.noteTitle = content
        break;
      case "excerpt":
        note.excerptText = content
        break;
      default:
        break;
    }
  }
  /**
   * 关闭弹出菜单,如果delay为true则延迟0.5秒后关闭
   * @param {PopupMenu} menu 
   * @param {boolean} delay 
   * @returns 
   */
  static dismissPopupMenu(menu,delay = false){
    if (!menu) {
      return
    }
    if (delay) {
      MNUtil.delay(0.5).then(()=>{
        if (!menu.stopHide) {
          menu.dismissAnimated(true)
        }
      })
      return
    }
    menu.dismissAnimated(true)
  }
  static shouldShowMenu(des){
    if ( des && "target" in des) {
      //des里提供了target参数的时候，如果target为menu则显示menu
      if (des.target === "menu") {
        return true
      }
      return false
    }
    //des里不提供target参数的时候默认为menu
    return true
  }
  static paste(des){
    MNUtil.showHUD("paste")
    let focusNote = MNNote.getFocusNote()
    let text = MNUtil.clipboardText
    let target = des.target ?? "default"
    switch (target) {
      case "default":
        focusNote.paste()
        break;
      case "title":
        MNUtil.undoGrouping(()=>{
          focusNote.noteTitle = text
        })
        break;
      case "excerpt":
        MNUtil.undoGrouping(()=>{
          focusNote.excerptText = text
          if (des.markdown) {
            focusNote.excerptTextMarkdown = true
          }
        })
        break;
      case "appendTitle":
        MNUtil.undoGrouping(()=>{
          focusNote.noteTitle = focusNote.noteTitle+";"+text
        })
        break;
      case "appendExcerpt":
        MNUtil.undoGrouping(()=>{
          focusNote.excerptText = focusNote.excerptText+"\n"+text
          if (des.markdown) {
            focusNote.excerptTextMarkdown = true
          }
        })
        break;
      default:
        break;
    }
  }
  static showInFloatWindow(des){
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
        if (MNUtil.mindmapView && MNUtil.mindmapView.mindmapNodes[0].note.childMindMap) {
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
  }
  static async delay (seconds) {
    return new Promise((resolve, reject) => {
      NSTimer.scheduledTimerWithTimeInterval(seconds, false, function () {
        resolve()
      })
    })
  }
  static replaceNoteIndex(text,index,des){ 
    let noteIndices = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'] 
    if (des.noteIndices && des.noteIndices.length) {
      noteIndices = des.noteIndices
    }
    let tem = text.replace("{{noteIndex}}",noteIndices[index])
    return tem
  
  }
  static replaceIndex(text,index,des){
    let circleIndices = ["①","②","③","④","⑤","⑥","⑦","⑧","⑨","⑩","⑪","⑫","⑬","⑭","⑮","⑯","⑰","⑱","⑲","⑳","㉑","㉒","㉓","㉔","㉕","㉖","㉗","㉘","㉙","㉚","㉛","㉜","㉝","㉞","㉟","㊱","㊲","㊳"]
    let emojiIndices = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"]
    let indices = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'] 
    let alphabetIndices = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    if (des.customIndices && des.customIndices.length) {
      indices = des.customIndices
    }
    let tem = text.replace("{{index}}",indices[index])
                  .replace("{{circleIndex}}",circleIndices[index])
                  .replace("{{emojiIndex}}",emojiIndices[index])
                  .replace("{{alphabetIndex}}",alphabetIndices[index])
    return tem
  }
  static emojiNumber(index){
    let emojiIndices = ["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"]
    return emojiIndices[index]
  }

  /**
   * 
   * @param {MNNote} note 
   * @param {*} des 
   * @returns 
   */
  static getMergedText(note,des,noteIndex){
  try {
    let textList = []
    des.source.map(text=>{
      if (text.includes("{{title}}") && des.removeSource) {
        if (note.noteId in toolbarUtils.commentToRemove) {
          toolbarUtils.commentToRemove[note.noteId].push(-1)
        }else{
          toolbarUtils.commentToRemove[note.noteId] = [-1]
        }
      }
      if (text.includes("{{tags}}")) {
        note.tags.map(tag=>{
          textList.push(text.replace('{{tags}}',tag))
        })
        return
      }
      if (text.includes("{{textComments}}")) {
        let elementIndex = 0
        note.comments.map((comment,index)=>{
          if (comment.type === "TextNote" && !/^marginnote\dapp:\/\/note\//.test(comment.text) && !comment.text.startsWith("#") ) {
            let tem = text.replace('{{textComments}}',(des.trim ? comment.text.trim(): comment.text))
            tem = this.replaceIndex(tem, elementIndex, des)
            tem = this.replaceNoteIndex(tem, noteIndex, des)
            textList.push(tem)
            elementIndex = elementIndex+1
            if (des.removeSource) {
              if (note.noteId in toolbarUtils.commentToRemove) {
                toolbarUtils.commentToRemove[note.noteId].push(index)
              }else{
                toolbarUtils.commentToRemove[note.noteId] = [index]
              }
            }
          }
        })
        return
      }
      if (text.includes("{{htmlComments}}")) {
        let elementIndex = 0
        note.comments.map((comment,index)=>{
          if (comment.type === "HtmlNote") {
            let tem = text.replace('{{htmlComments}}',(des.trim ? comment.text.trim(): comment.text))
            tem = this.replaceIndex(tem, index, des)
            tem = this.replaceNoteIndex(tem, noteIndex, des)
            textList.push(tem)
            elementIndex = elementIndex+1
            if (des.removeSource) {
              if (note.noteId in toolbarUtils.commentToRemove) {
                toolbarUtils.commentToRemove[note.noteId].push(index)
              }else{
                toolbarUtils.commentToRemove[note.noteId] = [index]
              }
            }
          }
        })
        return
      }
      if (text.includes("{{excerptText}}")) {
        let targetText = note.excerptText ?? ""
        if (des.trim) {
          targetText = targetText.trim()
        }
        let tem = text.replace('{{excerptText}}',targetText)
        tem = this.replaceNoteIndex(tem, noteIndex, des)
        textList.push(tem)
        return
      }
      if (text.includes("{{excerptTexts}}")) {
        let index = 0
        note.notes.map(n=>{
          if (n.excerptText) {
            let targetText = n.excerptText ?? ""
            if (des.trim) {
              targetText = targetText.trim()
            }
            let tem = text.replace('{{excerptTexts}}',targetText)
            tem = this.replaceIndex(tem, index, des)
            tem = this.replaceNoteIndex(tem, noteIndex, des)
            textList.push(tem)
            index = index+1
            if (des.removeSource && n.noteId !== note.noteId) {
              this.sourceToRemove.push(n)
            }
          }
        })
        return
      }
      let tem = this.detectAndReplaceWithNote(text,note)
      tem = this.replaceNoteIndex(tem, noteIndex, des)
      textList.push(tem) 
    })
    if (des.format) {
      textList = textList.map((text,index)=>{
        let tem = des.format.replace("{{element}}",text)
        tem = this.replaceIndex(tem, index, des)
        tem = this.replaceNoteIndex(tem, index, des)
        return tem
      })
    }
    let join = des.join ?? ""
    let mergedText = textList.join(join)
    if (des.replace) {
      let ptt = new RegExp(des.replace[0], "g")
      mergedText = mergedText.replace(ptt,des.replace[1])
    }
    return mergedText
  } catch (error) {
    return undefined
  }
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
    let noteConfig = this.getNoteObject(MNNote.getFocusNote(),{},{parent:true,child:true})
    let config = {note:noteConfig,date:this.getDateObject()}
    if (element !== undefined) {
      config.element = element
    }
    let hasClipboardText = text.includes("{{clipboardText}}")
    let hasSelectionText = text.includes("{{selectionText}}")
    let hasCurrentDocName = text.includes("{{currentDocName}}")
    let hasCurrentDocAttach = text.includes("{{currentDocAttach}}")
    if (hasClipboardText) {
      config.clipboardText = MNUtil.clipboardText
    }
    if (hasSelectionText) {
      config.selectionText = MNUtil.selectionText
    }
    if (hasCurrentDocName) {
      config.currentDocName = MNUtil.getFileName(MNUtil.currentDocController.document.pathFile)
    }
    if (hasCurrentDocAttach && editorUtils) {
      config.currentDocAttach = editorUtils.getAttachContentByMD5(MNUtil.currentDocmd5)
    }
    let output = MNUtil.render(text, config)
    return output
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
  static checkHeight(height,maxButtons = 20){
    if (height > 420 && !this.isSubscribed(false)) {
      return 420
    }
    // let maxNumber = this.isSubscribe?maxButtons:9
    let maxHeights = 45*maxButtons+15
    if (height > maxHeights) {
      return maxHeights
    }else if(height < 60){
      return 60
    }else{
      let newHeight = 45*(Math.floor(height/45))+15
      return newHeight
    }
  }
  static addErrorLog(error,source,info){
    // MNUtil.showHUD("MN Toolbar Error ("+source+"): "+error)
    let log = {
      error:error.toString(),
      source:source,
      time:(new Date(Date.now())).toString(),
      mnaddon:"MNToolbar"
    }
    if (info) {
      log.info = info
    }
    this.errorLog.push(log)
    MNUtil.copyJSON(this.errorLog)
  }
  static removeComment(des){
    let focusNotes = MNNote.getFocusNotes()
    if (des.find) {
      let condition  = des.find
      MNUtil.undoGrouping(()=>{
        focusNotes.forEach(note=>{
          if (note.comments.length) {
            let indices = note.getCommentIndicesByCondition(condition)
            if (!indices.length) {
              MNUtil.showHUD("No match")
              return
            }
            if (des.multi) {
              note.removeCommentsByIndices(indices)
            }else{
              indices = MNUtil.sort(indices,"increment")
              note.removeCommentByIndex(indices[0])
            }
          }
        })
      })
      return
    }
    if (des.type) {
      let type = Array.isArray(des.type) ? des.type : [des.type]
      MNUtil.undoGrouping(()=>{
        focusNotes.forEach(note=>{
          if (note.comments.length) {
            if (des.multi) {
              let commentsToRemove = []
              note.comments.forEach((comment,index)=>{
                if (type.includes(comment.type)) {
                  commentsToRemove.push(index)
                }
              })
              if (!commentsToRemove.length) {
                MNUtil.showHUD("No match")
                return
              }
              note.removeCommentsByIndices(commentsToRemove)
            }else{
              let index = note.comments.findIndex(comment=>type.includes(comment.type))
              if (index < 0) {
                MNUtil.showHUD("No match")
                return
              }
              note.removeCommentByIndex(index)
            }
          }
        })
      })
      return
    }
    if (des.multi) {
      let commentIndices = Array.isArray(des.index)? des.index : [des.index]
      commentIndices = MNUtil.sort(commentIndices,"decrement")
      // MNUtil.copyJSON(commentIndices)
      if (!commentIndices.length) {
        MNUtil.showHUD("No match")
        return
      }
      MNUtil.undoGrouping(()=>{
        focusNotes.forEach(note => {
          if (note.comments.length) {
            note.removeCommentsByIndices(commentIndices)
          }
        })
      })
    }else{
      let commentIndex = des.index+1
      if (commentIndex) {
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(note => {
            if (note.comments.length) {
              let commentLength = note.comments.length
              if (commentIndex > commentLength) {
                commentIndex = commentLength
              }
              note.removeCommentByIndex(commentIndex-1)
            }
          })
        })
      }
    }
  
  }
  static async chatAI(des){
    if (!des || !Object.keys(des).length) {
      MNUtil.postNotification("customChat",{})
      return
    }

    if (des.prompt) {
      MNUtil.postNotification("customChat",{prompt:des.prompt})
      return
    }
    if(des.user){
      let question = {user:des.user}
      if (des.system) {
        question.system = des.system
      }
      MNUtil.postNotification("customChat",question)
      // MNUtil.showHUD("Not supported yet...")
      return;
    }
    MNUtil.postNotification("customChat",{})
    // MNUtil.showHUD("No valid argument!")
  }
  static search(des,button){
    // MNUtil.copyJSON(des)
    // MNUtil.showHUD("Search")
    let selectionText = MNUtil.selectionText
    let noteId = undefined
    let focusNote = MNNote.getFocusNote()
    if (focusNote) {
      noteId = focusNote.noteId
    }
    let studyFrame = MNUtil.studyView.bounds
    let beginFrame = button.frame
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
    if (des.engine) {
      if (selectionText) {
        // MNUtil.showHUD("Text:"+selectionText)
        MNUtil.postNotification("searchInBrowser",{text:selectionText,engine:des.engine,beginFrame:beginFrame,endFrame:endFrame})
      }else{
        // MNUtil.showHUD("NoteId:"+noteId)
        MNUtil.postNotification("searchInBrowser",{noteid:noteId,engine:des.engine,beginFrame:beginFrame,endFrame:endFrame})
      }
      return
    }
    if (selectionText) {
      // MNUtil.showHUD("Text:"+selectionText)
      MNUtil.postNotification("searchInBrowser",{text:selectionText,beginFrame:beginFrame,endFrame:endFrame})
    }else{
      // MNUtil.showHUD("NoteId:"+noteId)
      MNUtil.postNotification("searchInBrowser",{noteid:noteId,beginFrame:beginFrame,endFrame:endFrame})
    }
  }
  /**
   * @param {NSData} image 
   * @returns 
   */
  static async getTextOCR (image) {
    if (typeof ocrNetwork === 'undefined') {
      MNUtil.showHUD("Install 'MN OCR' first")
      return undefined
    }
    try {
      let res = await ocrNetwork.OCR(image)
      // MNUtil.copy(res)
      return res
    } catch (error) {
      chatAIUtils.addErrorLog(error, "getTextOCR",)
      return undefined
    }
  }
  /**
   * 
   * @param {{buffer:boolean,target:string,method:string}} des 
   * @returns 
   */
  static async ocr(des){
    if (typeof ocrUtils === 'undefined') {
      MNUtil.showHUD("MN Toolbar: Please install 'MN OCR' first!")
      return
    }
try {
    let focusNote = MNNote.getFocusNote()
    let imageData = MNUtil.getDocImage(true,true)
    if (!imageData && focusNote) {
      imageData = MNNote.getImageFromNote(focusNote)
    }
    if (!imageData) {
      MNUtil.showHUD("No image found")
      return
    }
    let buffer = des.buffer ?? true
    // let res
    let res = await ocrNetwork.OCR(imageData,des.source,buffer)
    // switch (des.source) {
    //   case "doc2x":
    //     res = await ocrNetwork.doc2xOCR(imageData)
    //     break
    //   case "simpletex":
    //     res = await ocrNetwork.simpleTexOCR(imageData)
    //     break
    //   default:
    //     res = await ocrNetwork.OCR(imageData)
    //     break
    // }
    let noteTargets = ["comment","excerpt"]
    if (!focusNote && noteTargets.includes(des.target)) {
      let selection = MNUtil.currentSelection
      if (selection.onSelection) {
        focusNote = MNNote.fromSelection()
      }
    }
    if (res) {
      switch (des.target) {
        case "comment":
          if (focusNote) {
            MNUtil.undoGrouping(()=>{
              focusNote.appendMarkdownComment(res)
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
          if (focusNote) {
            MNUtil.undoGrouping(()=>{
              focusNote.excerptText =  res
              focusNote.excerptTextMarkdown = true
              MNUtil.showHUD("Set to excerpt")
            })
          }else{
            MNUtil.copy(res)
          }
          break;
        case "editor":
          MNUtil.postNotification("editorInsert",{contents:[{type:"text",content:res}]})
          break;
        case "chatModeReference":
          let method = "append"
          if ("method" in des) {
            method = des.method
          }
          MNUtil.postNotification(
            "insertChatModeReference",
            {
              contents:[{type:"text",content:res}],
              method:method
            }
          )
          break;
        default:
          break;
      }
    }
      
    } catch (error) {
      this.addErrorLog(error, "ocr")
    }
  
  }
  static moveComment(des){
    let focusNotes = MNNote.getFocusNotes()
    let commentIndex
    if (des.find) {
      let condition  = des.find
      MNUtil.undoGrouping(()=>{
        focusNotes.forEach(note=>{
          let indices = note.getCommentIndicesByCondition(condition)
          if (!indices.length) {
            MNUtil.showHUD("No match")
            return
          }
          if (indices.length && "to" in des) {
            switch (typeof des.to) {
              case "string":
                note.moveCommentByAction(indices[0],des.to)
                break;
              case "number":
                note.moveComment(indices[0], des.to)
                break
              default:
                break;
            }
            return
          }
        })
      })
      return
    }
    if (des.type && "to" in des) {
      let type = Array.isArray(des.type) ? des.type : [des.type]
      switch (typeof des.to) {
        case "string":
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(note=>{
                let index = note.comments.findIndex(comment=>type.includes(comment.type))
                if (index == -1) {
                  MNUtil.showHUD("No match")
                  return
                }
                note.moveCommentByAction(index,des.to)
            })
          })
          break;
        case "number":
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(note=>{
                let index = note.comments.findIndex(comment=>type.includes(comment.type))
                if (index == -1) {
                  MNUtil.showHUD("No match")
                  return
                }
                note.moveComment(index,des.to)
            })
          })
          break
        default:
          break;
      }
      return
    }
    commentIndex = des.index
    if (commentIndex === undefined) {
      MNUtil.showHUD("Invalid index!")
    }
    if ("to" in des) {
      switch (typeof des.to) {
        case "string":
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(note => {
              note.moveCommentByAction(commentIndex, des.to)
            })
          })
          break;
        case "number":
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(note => {
              note.moveComment(commentIndex, des.to)
            })
          })
          break
        default:
          break;
      }
    }
  
  }
  static getDateObject(){
    let dateObject = {
      now:new Date(Date.now()).toLocaleString(),
      tomorrow:new Date(Date.now()+86400000).toLocaleString(),
      yesterday:new Date(Date.now()-86400000).toLocaleString(),
      year:new Date().getFullYear(),
      month:new Date().getMonth()+1,
      day:new Date().getDate(),
      hour:new Date().getHours(),
      minute:new Date().getMinutes(),
      second:new Date().getSeconds()
    }
    return dateObject
  }
  /**
   * 
   * @param {MNNote} note 
   */
  static getNoteObject(note,config={},opt={}) {
    try {
      
    let noteConfig = config
    noteConfig.id = note.noteId
    noteConfig.notebook = {
      id:note.notebookId,
      name:MNUtil.getNoteBookById(note.notebookId).title,
    }
    noteConfig.title = note.noteTitle
    noteConfig.url = note.noteURL
    noteConfig.excerptText = note.excerptText
    noteConfig.date = {
      create:note.createDate.toLocaleString(),
      modify:note.modifiedDate.toLocaleString(),
    }
    noteConfig.allText = note.allNoteText()
    noteConfig.tags = note.tags
    noteConfig.hashTags = note.tags.map(tag=> ("#"+tag))
    if (note.docMd5 && MNUtil.getDocById(note.docMd5)) {
      noteConfig.docName = MNUtil.getFileName(MNUtil.getDocById(note.docMd5).pathFile) 
    }
    if (note.childMindMap) {
      noteConfig.childMindMap = this.getNoteObject(note.childMindMap)
    }
    if ("parent" in opt && opt.parent && note.parentNote) {
      noteConfig.parent = this.getNoteObject(note.parentNote)
    }
    if ("child" in opt && opt.child && note.childNotes) {
      noteConfig.child = note.childNotes.map(note=>this.getNoteObject(note))
    }
    return noteConfig
    } catch (error) {
      this.addErrorLog(error, "getNoteObject")
      return {}
    }
  }
  static htmlDev(content){
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>JSON Editor with Highlighting</title>
    <style>
        body{
            background-color: lightgray;
            font-size:1.1em;
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
            color: rgb(181, 0, 0);
            font-weight: bold;
        }
        .string {
            color: green;
        }
        .number {
            color: rgb(201, 77, 0);
        }
        .boolean {
            color: rgb(204, 0, 204);
        }
        .null {
            color: gray;
        }
    </style>
</head>
<body>

<div id="editor" class="editor" contenteditable>${content}</div>

<script>
  let isComposing = false;
function getCaretPosition(element) {
    const selection = window.getSelection();
    let caretOffset = 0;
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    }
    return caretOffset;
}

function setCaretPosition(element, offset) {
    const range = document.createRange();
    const selection = window.getSelection();
    let currentOffset = 0;
    let found = false;

    function traverseNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const nodeLength = node.textContent.length;
            if (currentOffset + nodeLength >= offset) {
                range.setStart(node, offset - currentOffset);
                range.collapse(true);
                found = true;
                return;
            } else {
                currentOffset += nodeLength;
            }
        } else {
            for (let i = 0; i < node.childNodes.length; i++) {
                traverseNodes(node.childNodes[i]);
                if (found) return;
            }
        }
    }

    traverseNodes(element);
    selection.removeAllRanges();
    selection.addRange(range);
}
    function updateContentWithoutBlur() {
        if (isComposing) return;
        const editor = document.getElementById('editor');
        const caretPosition = getCaretPosition(editor);
        const json = editor.innerText;
        editor.innerHTML = syntaxHighlight(json);
        setCaretPosition(editor, caretPosition);
    }
    function updateContent() {
        const editor = document.getElementById('editor');
        const json = editor.innerText;
        try {
            const parsedJson = JSON.parse(json);
            editor.innerHTML = syntaxHighlight(JSON.stringify(parsedJson, null, 4));
        } catch (e) {
            console.error("Invalid JSON:", e.message);
        }
        document.getElementById('editor').blur();
    }

    function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?:\\s*:)?|\\b-?\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?\\b|\\btrue\\b|\\bfalse\\b|\\bnull\\b)/g, function (match) {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                    match = match.slice(0, -1) + '</span>:';
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
    }

  document.getElementById('editor').addEventListener('input', updateContentWithoutBlur);
  document.getElementById('editor').addEventListener('compositionstart', () => {
      isComposing = true;
  });

  document.getElementById('editor').addEventListener('compositionend', () => {
      isComposing = false;
      updateContentWithoutBlur();
  });
  updateContent();
</script>

</body>
</html>

`
  }
  static JShtml(content){
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>JSON Editor with Highlighting</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/github.min.css" rel="stylesheet">
    <style>
        body{
          margin: 0;
          background-color: lightgray;
          font-size:1.1em;
        }
        pre{
          margin: 0;
          padding: 0;
        }
        code{
            background-color: lightgray !important;
            height: calc(100vh - 30px);
            white-space: pre-wrap; /* 保留空格和换行符，并自动换行 */
            word-wrap: break-word; /* 针对长单词进行换行 */
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
    .hljs-literal {
        color: rgb(204, 0, 204);
    }
        .null {
            color: gray;
        }
    .hljs-property {
        color: #1870dc; /* 自定义内置类颜色 */
    }
    .hljs-function {
        color: #8f21d8; /* 自定义内置类颜色 */
    }
    .hljs-string {
        color: #429904; /* 自定义内置类颜色 */
    }
    .hljs-built_in {
        font-weight: bold;
        color: #dd6b00; /* 自定义内置类颜色 */
    }
    </style>
</head>
<body>
<pre><code class="javascript" id="code-block" contenteditable>${content}</code></pre>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/highlight.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/languages/javascript.min.js"></script>
<script>
hljs.registerLanguage('javascript', function(hljs) {
  var KEYWORDS = 'in if for while finally var new function do return void else break catch ' +
                 'instanceof with throw case default try this switch continue typeof delete ' +
                 'let yield const export super debugger as await static import from as async await';
  var LITERALS = 'true false null undefined NaN Infinity';
  var TYPES = 'Object Function Boolean Symbol MNUtil MNNote toolbarUtils toolbarConfig';

  return {
    keywords: {
      keyword: KEYWORDS,
      literal: LITERALS,
      built_in: TYPES
    },
    contains: [
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_NUMBER_MODE,
      {
        className: 'property',
        begin: '(?<=\\\\.)\\\\w+\\\\b(?!\\\\()'
      },
      {
        className: 'function',
        begin: '(?<=\\\\.)\\\\w+(?=\\\\()'
      }
    ]
  };
});
let isComposing = false;
function getCaretPosition(element) {
    const selection = window.getSelection();
    let caretOffset = 0;
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    }
    return caretOffset;
}

function setCaretPosition(element, offset) {
    const range = document.createRange();
    const selection = window.getSelection();
    let currentOffset = 0;
    let found = false;

    function traverseNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const nodeLength = node.textContent.length;
            if (currentOffset + nodeLength >= offset) {
                range.setStart(node, offset - currentOffset);
                range.collapse(true);
                found = true;
                return;
            } else {
                currentOffset += nodeLength;
            }
        } else {
            for (let i = 0; i < node.childNodes.length; i++) {
                traverseNodes(node.childNodes[i]);
                if (found) return;
            }
        }
    }

    traverseNodes(element);
    selection.removeAllRanges();
    selection.addRange(range);
}
    function updateContent() {
        const editor = document.getElementById('code-block');
        hljs.highlightElement(editor);
        editor.blur();
    }
    function updateContentWithoutBlur() {
      if (isComposing) return;
      const editor = document.getElementById('code-block');
      const caretPosition = getCaretPosition(editor);
      hljs.highlightElement(editor);
      setCaretPosition(editor, caretPosition);
    }
document.getElementById('code-block').addEventListener('input', updateContentWithoutBlur);
document.getElementById('code-block').addEventListener('compositionstart', () => {
    isComposing = true;
});

document.getElementById('code-block').addEventListener('compositionend', () => {
    isComposing = false;
    updateContentWithoutBlur();
});
    updateContent();
</script>

</body>
</html>
`
  }
  static jsonEditor(){
    return `
<!DOCTYPE HTML>
<html lang="en">
<head>
    <!-- when using the mode "code", it's important to specify charset utf-8 -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
    <title>Vditor</title>
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <link href="jsoneditor.css" rel="stylesheet" type="text/css">
    <script src="jsoneditor.js"></script>
</head>
<style>
body {
    margin: 0;
    padding: 0;
    font-size: large;
    height: 100vh !important;
    min-height: 100vh !important;
}
</style>
<body>
    <div id="jsoneditor"></div>

    <script>
        // create the editor
        const container = document.getElementById("jsoneditor")
        const options = {}
        const editor = new JSONEditor(container, options)

        // set json
        const initialJson = {}
        editor.set(initialJson)

        // get json
        const updatedJson = editor.get()
        function updateContent(data) {
          let tem = decodeURIComponent(data)
          // MNUtil.copy(tem)
          editor.set(JSON.parse(tem))
        }
        function getContent() {
          let tem = JSON.stringify(editor.get(),null,2)
          return encodeURIComponent(tem)
        }
    </script>
</body>
</html>`
  }
  static html(content){
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>JSON Editor with Highlighting</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/github.min.css" rel="stylesheet">
    <style>
        body{
          margin: 0;
          background-color: lightgray;
          font-size:1.1em;
        }
        pre{
          margin: 0;
          padding: 0;
        }
        code{
            padding: 0 !important;
            background-color: lightgray !important;
            height: 100vh;
            white-space: pre-wrap; /* 保留空格和换行符，并自动换行 */
            word-wrap: break-word; /* 针对长单词进行换行 */
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
        .hljs-number {
            color: rgb(253, 99, 4);
        }
    .hljs-literal {
        color: rgb(204, 0, 204);
    }
        .null {
            color: gray;
        }
    .hljs-attr {
            color: rgb(181, 0, 0);
            font-weight: bold;
    }
    .hljs-function {
        color: #8f21d8; /* 自定义内置类颜色 */
    }
    .hljs-string {
        color: #429904; /* 自定义内置类颜色 */
    }
    .hljs-built_in {
        font-weight: bold;
        color: #dd6b00; /* 自定义内置类颜色 */
    }
    </style>
</head>
<body>
<pre><code class="json" id="code-block" contenteditable>${content}</code></pre>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/highlight.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/languages/javascript.min.js"></script>
<script>

let isComposing = false;
function getCaretPosition(element) {
    const selection = window.getSelection();
    let caretOffset = 0;
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    }
    return caretOffset;
}

function setCaretPosition(element, offset) {
    const range = document.createRange();
    const selection = window.getSelection();
    let currentOffset = 0;
    let found = false;

    function traverseNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const nodeLength = node.textContent.length;
            if (currentOffset + nodeLength >= offset) {
                range.setStart(node, offset - currentOffset);
                range.collapse(true);
                found = true;
                return;
            } else {
                currentOffset += nodeLength;
            }
        } else {
            for (let i = 0; i < node.childNodes.length; i++) {
                traverseNodes(node.childNodes[i]);
                if (found) return;
            }
        }
    }

    traverseNodes(element);
    selection.removeAllRanges();
    selection.addRange(range);
}
    function updateContent() {
        const editor = document.getElementById('code-block');
        const json = editor.innerText;

        try {
            const parsedJson = JSON.parse(json);
            editor.innerHTML = JSON.stringify(parsedJson, null, 4);
            hljs.highlightElement(editor);
        } catch (e) {
            console.error("Invalid JSON:", e.message);
        }
        editor.blur();
    }
    function updateContentWithoutBlur() {
      if (isComposing) return;
      const editor = document.getElementById('code-block');
      const caretPosition = getCaretPosition(editor);
      const json = editor.innerText.replace('”,','\",').replace('“,','\",');
      editor.innerHTML = json
      hljs.highlightElement(editor);
      setCaretPosition(editor, caretPosition);
    }
document.getElementById('code-block').addEventListener('input', updateContentWithoutBlur);
document.getElementById('code-block').addEventListener('compositionstart', () => {
    isComposing = true;
});

document.getElementById('code-block').addEventListener('compositionend', () => {
    isComposing = false;
    updateContentWithoutBlur();
});
    updateContent();
</script>

</body>
</html>
`
  }
  /**
   * count为true代表本次check会消耗一次免费额度（如果当天未订阅），如果为false则表示只要当天免费额度没用完，check就会返回true
   * 开启ignoreFree则代表本次check只会看是否订阅，不管是否还有免费额度
   * @returns {Boolean}
   */
  static checkSubscribe(count = true, msg = true,ignoreFree = false){
    // return true

    if (typeof subscriptionConfig !== 'undefined') {
      let res = subscriptionConfig.checkSubscribed(count,ignoreFree,msg)
      return res
    }else{
      if (msg) {
        this.showHUD("Please install 'MN Subscription' first!")
      }
      return false
    }
  }
  static isSubscribed(msg = true){
    if (typeof subscriptionConfig !== 'undefined') {
      return subscriptionConfig.isSubscribed()
    }else{
      if (msg) {
        this.showHUD("Please install 'MN Subscription' first!")
      }
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
    let folderExists = NSFileManager.defaultManager().fileExistsAtPath(extensionFolder+"/marginnote.extension.mnutils/main.js")
    if (!folderExists) {
      this.showHUD("MN Toolbar: Please install 'MN Utils' first!")
    }
    return folderExists
  }
  /**
   * 
   * @param {MNNote} note 
   * @param {*} des 
   */
  static focus(note,des){
    let targetNote = note
    if (des.source) {
      switch (des.source) {
        case "parentNote":
          targetNote = note.parentNote
          if (!targetNote) {
            MNUtil.showHUD("No parentNote!")
            return
          }
          break;
        default:
          break;
      }
    }
    if (!des.target) {
      MNUtil.showHUD("Missing param: target")
      return
    }
    targetNote = targetNote.realGroupNoteForTopicId()
    switch (des.target) {
        case "doc":
          targetNote.focusInDocument()
          break;
        case "mindmap":
          targetNote.focusInMindMap()
          break;
        case "both":
          targetNote.focusInDocument()
          targetNote.focusInMindMap()
          break;
        case "floatMindmap":
          targetNote.focusInFloatMindMap()
          break;
        default:
          MNUtil.showHUD("No valid value for target!")
          break;
      }
    }
  /**
   * 
   * @param {*} des 
   * @returns {Promise<MNNote|undefined>}
   */
  static async noteHighlight(des){
    let selection = MNUtil.currentSelection
    if (!selection.onSelection) {
      return
    }
    let OCRText = undefined
    if ("OCR" in des && des.OCR) {
      OCRText = await this.getTextOCR(selection.image)
    }
    let focusNote = MNNote.new(MNUtil.currentDocController.highlightFromSelection())
    focusNote = focusNote.realGroupNoteForTopicId()
    return new Promise((resolve, reject) => {
      MNUtil.undoGrouping(()=>{
        try {
        if ("color" in des && des.color >= 0) {
          let color = des.color
          focusNote.colorIndex = color
        }
        if ("fillPattern" in des && des.fillPattern >= 0) {
          let fillPattern = des.fillPattern
          focusNote.fillIndex = fillPattern
        }
        if (OCRText) {
          focusNote.excerptText = OCRText
          focusNote.excerptTextMarkdown = true
        }
        if ("asTitle" in des && des.asTitle) {
          focusNote.noteTitle = focusNote.excerptText
          focusNote.excerptText = ""
          focusNote.excerptTextMarkdown = false
        }else if ("title" in des) {
          focusNote.noteTitle = des.title
        }
        if ("tags" in des) {
          let tags = des.tags
          focusNote.appendTags(tags)
        }else if("tag" in des){
          let tag = des.tag
          MNUtil.showHUD("add tag: "+tag)
          focusNote.appendTags([tag])
        }
        if ("mainMindMap" in des && des.mainMindMap) {
          if (focusNote.parentNote) {
            focusNote.removeFromParent()
          }else{
            MNUtil.showHUD("Already in main mindmap")
          }
        }else if ("parentNote" in des) {
          let parentNote = MNNote.new(des.parentNote)
          if (parentNote) {
            parentNote = parentNote.realGroupNoteForTopicId()
          }
          if (parentNote.notebookId === focusNote.notebookId) {
            MNUtil.showHUD("move to "+parentNote.noteId)
            parentNote.addChild(focusNote)
          }else{
            MNUtil.showHUD("Not in same notebook")
          }
        }
        resolve(focusNote)
        } catch (error) {
          toolbarUtils.addErrorLog(error, "noteHighlight")
          resolve(undefined)
        }
      })
    })
  }
  static async moveNote(des){
    let focusNotes = MNNote.getFocusNotes()
    MNUtil.undoGrouping(()=>{
      if (des.target && des.target === "mainMindMap") {
        focusNotes.map((note)=>{
          let realNote = note.realGroupNoteForTopicId()
          if (realNote.parentNote) {
            realNote.removeFromParent()
          }
        })
      }else{
        let parentNote = MNNote.new(des.target)
        if (parentNote) {
          focusNotes.map((note)=>{
            if (parentNote.notebookId === note.notebookId) {
              parentNote.addChild(note)
            }
          })
        }
      }
    })
  }
  static async setColor(des){
  try {
    let fillIndex = -1
    let colorIndex = des.color
    if ("fillPattern" in des) {
      fillIndex = des.fillPattern
    }
    if ("followAutoStyle" in des && des.followAutoStyle && (typeof autoUtils !== 'undefined')) {
      let focusNotes
      let followAutoStyle = true
      let selection = MNUtil.currentSelection
      if (selection.onSelection) {
        focusNotes = MNNote.new(MNUtil.currentDocController.highlightFromSelection())
        // followAutoStyle = false
      }else{
        focusNotes = MNNote.getFocusNotes()
      }
      MNUtil.showHUD("followAutoStyle")
      MNUtil.undoGrouping(()=>{
        focusNotes.map(note=>{
          if (followAutoStyle) {
            let fillIndex
            if (note.excerptPic) {
              fillIndex = autoUtils.getConfig("image")[colorIndex]
            }else{
              fillIndex = autoUtils.getConfig("text")[colorIndex]
            }
          }
          this.setNoteColor(note,colorIndex,fillIndex)
        })
      })
      return
    }

    // MNUtil.copy(description+fillIndex)
    let focusNotes
    let selection = MNUtil.currentSelection
    if (selection.onSelection) {
      focusNotes = [MNNote.new(MNUtil.currentDocController.highlightFromSelection())]
    }else{
      focusNotes = MNNote.getFocusNotes()
    }
    // await MNUtil.delay(1)
    MNUtil.undoGrouping(()=>{
      focusNotes.map(note=>{
        this.setNoteColor(note,colorIndex,fillIndex)
      })
    })
  } catch (error) {
    toolbarUtils.addErrorLog(error, "setColor")
  }
  }
  static switchTitleOrExcerpt() {
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
  }
  /**
   * 
   * @param {MNNote} note 
   * @param {number} colorIndex 
   * @param {number} fillIndex 
   */
  static setNoteColor(note,colorIndex,fillIndex){
    if (note.note.groupNoteId) {
      let originNote = MNNote.new(note.note.groupNoteId)
      originNote.notes.forEach(n=>{
        n.colorIndex = colorIndex
        if (fillIndex !== -1) {
          n.fillIndex = fillIndex
        }
      })
    }else{
      note.notes.forEach(n=>{
        n.colorIndex = colorIndex
        if (fillIndex !== -1) {
          n.fillIndex = fillIndex
        }
      })
    }
  }
  /**
   * 
   * @param {UITextView} textView 
   */
  static getMindmapview(textView){
    let mindmapView
    if (textView.isDescendantOfView(MNUtil.mindmapView)) {
      mindmapView = MNUtil.mindmapView
      return mindmapView
    }else{
      try {
        let targetMindview = textView.superview.superview.superview.superview.superview
        let targetStudyview = targetMindview.superview.superview.superview
        if (targetStudyview === MNUtil.studyView) {
          mindmapView = targetMindview
          MNUtil.floatMindMapView = mindmapView
          return mindmapView
        }
        return undefined
      } catch (error) {
        return undefined
      }
    }
  }
  static checkExtendView(textView) {
    try {
      if (textView.superview.superview.superview.superview.superview.superview.superview.superview === MNUtil.readerController.view) {
        // MNUtil.showHUD("嵌入")
        return true
      }
      if (textView.superview.superview.superview.superview.superview.superview.superview.superview.superview === MNUtil.readerController.view) {
        // MNUtil.showHUD("折叠")
        return true
      }
      if (textView.superview.superview.superview.superview.superview.superview.superview.superview.superview.superview.superview.superview.superview === MNUtil.readerController.view) {
        // MNUtil.showHUD("页边")
        return true
      }
    } catch (error) {
      return false
    }
  }
  static isHexColor(str) {
    // 正则表达式匹配 3 位或 6 位的十六进制颜色代码
    const hexColorPattern = /^#([A-Fa-f0-9]{6})$/;
    return hexColorPattern.test(str);
  }
  static parseWinRect(winRect){
    let rectArr = winRect.replace(/{/g, '').replace(/}/g, '').replace(/\s/g, '').split(',')
    let X = Number(rectArr[0])
    let Y = Number(rectArr[1])
    let H = Number(rectArr[3])
    let W = Number(rectArr[2])
    let studyFrame = MNUtil.studyView.frame
    let studyFrameX = studyFrame.x
    let frame = Frame.gen(X-studyFrameX, Y, W, H)
    return frame
  }
  static getButtonColor(){
    if (!this.isSubscribed(false)) {
      return MNUtil.hexColorAlpha("#ffffff", 0.85)
    }
    // let color = MNUtil.app.defaultBookPageColor.hexStringValue
    // MNUtil.copy(color)
    let varColors = ["defaultBookPageColor","defaultHighlightBlendColor","defaultDisableColor","defaultTextColor","defaultNotebookColor","defaultTintColor","defaultTintColorForSelected","defaultTintColorForDarkBackground"]
    if (varColors.includes(toolbarConfig.buttonConfig.color)) {
      return MNUtil.app[toolbarConfig.buttonConfig.color].colorWithAlphaComponent(toolbarConfig.buttonConfig.alpha)
    }
    // if () {
      
    // }
    return MNUtil.hexColorAlpha(toolbarConfig.buttonConfig.color, toolbarConfig.buttonConfig.alpha)
  }
  static getOnlineImage(url,scale=3){
    MNUtil.showHUD("Downloading image")
    let imageData = NSData.dataWithContentsOfURL(MNUtil.genNSURL(url))
    if (imageData) {
      MNUtil.showHUD("Download success")
      return UIImage.imageWithDataScale(imageData,scale)
    }
    MNUtil.showHUD("Download failed")
    return undefined
  }
  static shortcut(name,des){
    let url = "shortcuts://run-shortcut?name="+encodeURIComponent(name)
    if (des && des.input) {
      url = url+"&input="+encodeURIComponent(des.input)
    }
    if (des && des.text) {
      let text = this.detectAndReplace(des.text)
      url = url+"&text="+encodeURIComponent(text)
    }
    MNUtil.openURL(url)
  }
  static async export(des){
    let focusNote = MNNote.getFocusNote()
    let exportTarget = des.target ?? "auto"
    let exportSource = des.source ?? "noteDoc"
    switch (exportSource) {
      case "noteDoc":
        let noteDocPath = MNUtil.getDocById(focusNote.note.docMd5).fullPathFileName
        MNUtil.saveFile(noteDocPath, ["public.pdf"])
        break;
      case "note":
        let md = await this.getMDFromNote(focusNote)
        MNUtil.copy(md)
        break;
      case "currentDoc":
        let docPath = MNUtil.currentDocController.document.fullPathFileName
        MNUtil.saveFile(docPath, ["public.pdf"])
        break;
      default:
        break;
    }
  }
  /**
   * 
   * @param {MNNote} note 
   * @param {number} level 
   * @returns {Promise<string>}
   */
  static async getMDFromNote(note,level = 0,OCR_enabled = false){
    if (note) {
      note = note.realGroupNoteForTopicId()
    }else{
      return ""
    }
try {
  let title = (note.noteTitle && note.noteTitle.trim()) ? "# "+note.noteTitle.trim() : ""
  if (title.trim()) {
    title = title.split(";").filter(t=>{
      if (/{{.*}}/.test(t)) {
        return false
      }
      return true
    }).join(";")
  }
  let textFirst = note.textFirst
  let excerptText
  if (note.excerptPic && !textFirst) {
    if (OCR_enabled) {
      excerptText = await this.getTextOCR(MNUtil.getMediaByHash(note.excerptPic.paint))
    }else{
      excerptText = ""
    }
  }else{
    excerptText = note.excerptText ?? ""
  }
  if (note.comments.length) {
    let comments = note.comments
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      switch (comment.type) {
        case "TextNote":
          if (/^marginnote\dapp\:\/\//.test(comment.text)) {
            //do nothing
          }else{
            excerptText = excerptText+"\n"+comment.text
          }
          break;
        case "HtmlNote":
          excerptText = excerptText+"\n"+comment.text
          break
        case "LinkNote":
          if (OCR_enabled && comment.q_hpic  && comment.q_hpic.paint && !textFirst) {
            let imageData = MNUtil.getMediaByHash(comment.q_hpic.paint)
            let imageSize = UIImage.imageWithData(imageData).size
            if (imageSize.width === 1 && imageSize.height === 1) {
              if (comment.q_htext) {
                excerptText = excerptText+"\n"+comment.q_htext
              }
            }else{
              excerptText = excerptText+"\n"+await this.getTextOCR(imageData)
            }
          }else{
            excerptText = excerptText+"\n"+comment.q_htext
          }
          break
        case "PaintNote":
          if (OCR_enabled && comment.paint){
            excerptText = excerptText+"\n"+await this.getTextOCR(MNUtil.getMediaByHash(comment.paint))
          }
          break
        default:
          break;
      }
    }
  }
  excerptText = (excerptText && excerptText.trim()) ? this.highlightEqualsContentReverse(excerptText) : ""
  let content = title+"\n"+excerptText
  if (level) {
    content = content.replace(/(#+\s)/g, "#".repeat(level)+"\$1")
  }
  return content
}catch(error){
  this.addErrorLog(error, "getMDFromNote")
  return ""
}
  }
  static highlightEqualsContentReverse(markdown) {
      // 使用正则表达式匹配==xxx==的内容并替换为<mark>xxx</mark>
      return markdown.replace(/<mark>(.+?)<\/mark>/g, '==\$1==');
  }
  static constrain(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
/**
 * 
 * @param {UIButton} button 
 * @returns {CGRect}
 */
static getButtonFrame(button){
  let buttonFrame = button.convertRectToView(button.frame, MNUtil.studyView)
  return buttonFrame
}
  static getTempelateNames(item){
    if (!toolbarConfig.checkCouldSave(item)) {
      return undefined
    }
    switch (item) {
      case "ocr":
        return [
            "🔨 OCR to clipboard",
            "🔨 OCR as chat mode reference",
            "🔨 OCR with menu",
            "🔨 OCR with onFinish"
          ]
      case "search":
        return [
            "🔨 search with menu",
            "🔨 search in Baidu"
          ]
      case "chatglm":
        return [
            "🔨 chatAI with menu",
            "🔨 chatAI in prompt",
            "🔨 chatAI in custom prompt"
          ]
      case "copy":
        return [
            "🔨 smart copy",
            "🔨 copy with menu",
            "🔨 copy markdown link"
          ]
      case "color1":
      case "color2":
      case "color3":
      case "color4":
      case "color5":
      case "color6":
      case "color7":
      case "color8":
      case "color9":
      case "color10":
      case "color11":
      case "color12":
      case "color13":
      case "color14":
      case "color15":
        return [
          "🔨 setColor default",
          "🔨 with fillpattern: both",
          "🔨 with fillpattern: fill",
          "🔨 with fillpattern: border",
          "🔨 with followAutoStyle"
        ]
      default:
        break;
    }
    return [
      "🔨 empty action",
      "🔨 empty action with double click",
      "🔨 empty action with finish action",
      "🔨 insert snippet",
      "🔨 insert snippet with menu",
      "🔨 add note index",
      "🔨 toggle mindmap",
      "🔨 copy with menu",
      "🔨 copy markdown link",
      "🔨 toggle markdown",
      "🔨 toggle textFirst",
      "🔨 chatAI with menu",
      "🔨 search with menu",
      "🔨 OCR with menu",
      "🔨 OCR to clipboard",
      "🔨 OCR as chat mode reference",
      "🔨 toggle full doc and tab bar",
      "🔨 merge text of merged notes",
      "🔨 create & move to main mindmap",
      "🔨 create & move as child note",
      "🔨 move note to main mindmap",
      "🔨 menu with actions",
      "🔨 focus in float window",
    ]
  }
}

class toolbarConfig {
  // 构造器方法，用于初始化新创建的对象
  constructor(name) {
    this.name = name;
  }
  // static defaultAction
  static isFirst = true
  static cloudStore
  static mainPath
  static action = []
  static showEditorOnNoteEdit = false
  static defalutButtonConfig = {color:"#ffffff",alpha:0.85}
  static defaultWindowState = {
    sideMode:"",//固定工具栏下贴边模式
    splitMode:false,//固定工具栏下是否跟随分割线
    open:false,//固定工具栏是否默认常驻
    dynamicButton:9,//跟随模式下的工具栏显示的按钮数量,
    frame:{x:0,y:0,width:40,height:415}
  }
  //非自定义动作的key
  static builtinActionKeys = ["copy","searchInEudic","switchTitleorExcerpt","copyAsMarkdownLink","search","bigbang","snipaste","chatglm","edit","ocr","execute","pasteAsTitle","clearFormat","color0","color1","color2","color3","color4","color5","color6","color7","color8","color9","color10","color11","color12","color13","color14","color15"]
  static allPopupButtons = [
  "copy",
  "copyOCR",
  "toggleTitle",
  "toggleCopyMode",
  "toggleGroupMode",
  "moveNoteTo",
  "linkNoteTo",
  "noteHighlight",
  "blankHighlight",
  "mergeHighlight",
  "delHighlight",
  "sendHighlight",
  "foldHighlight",
  "paintHighlight",
  "sourceHighlight",
  "setTitleHighlight",
  "setCommentHighlight",
  "setEmphasisHighlight",
  "sourceHighlightOfNote",
  "highStyleColor0",
  "highStyleColor1",
  "highStyleColor2",
  "highStyleColor3",
  "highlightType1",
  "highlightType2",
  "highlightType3",
  "highlightType4",
  "highlightShortcut1",
  "highlightShortcut2",
  "highlightShortcut3",
  "highlightShortcut4",
  "highlightShortcut5",
  "highlightShortcut6",
  "highlightShortcut7",
  "highlightShortcut8",
  "editHashtags",
  "deleteNote",
  "commentNote",
  "pasteToNote",
  "mergeIntoNote",
  "focusCurrentNote",
  "draftCurrentNote",
  "collapseBlank",
  "setBlankLayer",
  "insertBlank",
  "insertTranslation",
  "addToTOC",
  "addToReview",
  "addSelToReivew",
  "speechText",
  "speechHighlight",
  "goWiki",
  "goPalette",
  "goWikiNote",
  "goDictionary",
  "goToMindMap",
  "newGroupChild",
  "splitBook",
  "pasteOnPage",
  "textboxOnPage",
  "imageboxOnPage",
  "moreOperations",
]
  static defaultPopupReplaceConfig = {
    noteHighlight:{enabled:false,target:"",name:"noteHighlight"},
    addToReview:{enabled:false,target:"",name:"addToReview"},
    goPalette:{enabled:false,target:"",name:"goPalette"},
    editHashtags:{enabled:false,target:"",name:"editHashtags"},
    toggleTitle:{enabled:false,target:"",name:"toggleTitle"},
    moveNoteTo:{enabled:false,target:"",name:"moveNoteTo"},
    toggleCopyMode:{enabled:false,target:"",name:"toggleCopyMode"},
    pasteToNote:{enabled:false,target:"",name:"pasteToNote"},
    linkNoteTo:{enabled:false,target:"",name:"linkNoteTo"},
    goWikiNote:{enabled:false,target:"",name:"goWikiNote"},
    focusCurrentNote:{enabled:false,target:"",name:"focusCurrentNote"},
    delHighlight:{enabled:false,target:"",name:"delHighlight"},
    moreOperations:{enabled:false,target:"",name:"moreOperations"},
    blankHighlight:{enabled:false,target:"",name:"blankHighlight"},
    mergeHighlight:{enabled:false,target:"",name:"mergeHighlight"},
    highStyleColor0:{enabled:false,target:"",name:"highStyleColor0"},
    highStyleColor1:{enabled:false,target:"",name:"highStyleColor1"},
    highStyleColor2:{enabled:false,target:"",name:"highStyleColor2"},
    highStyleColor3:{enabled:false,target:"",name:"highStyleColor3"},
    goWiki:{enabled:false,target:"",name:"goWiki"},
    speechHighlight:{enabled:false,target:"",name:"speechHighlight"},
    sendHighlight:{enabled:false,target:"",name:"sendHighlight"},
    sourceHighlight:{enabled:false,target:"",name:"sourceHighlight"},
    commentNote:{enabled:false,target:"",name:"commentNote"},
    deleteNote:{enabled:false,target:"",name:"deleteNote"},
    copy:{enabled:false,target:"",name:"copy"},
    insertBlank:{enabled:false,target:"",name:"insertBlank"},
    collapseBlank:{enabled:false,target:"",name:"collapseBlank"},
    copyOCR:{enabled:false,target:"",name:"copyOCR"},
    foldHighlight:{enabled:false,target:"",name:"foldHighlight"},
    addToTOC:{enabled:false,target:"",name:"addToTOC"},
    addSelToReivew:{enabled:false,target:"",name:"addSelToReview"},
    highlightType1:{enabled:false,target:"",name:"highlightType1"},
    highlightType2:{enabled:false,target:"",name:"highlightType2"},
    highlightType3:{enabled:false,target:"",name:"highlightType3"},
    highlightType4:{enabled:false,target:"",name:"highlightType4"},
    highlightShortcut1:{enabled:false,target:"",name:"highlightShortcut1"},
    highlightShortcut2:{enabled:false,target:"",name:"highlightShortcut2"},
    highlightShortcut3:{enabled:false,target:"",name:"highlightShortcut3"},
    highlightShortcut4:{enabled:false,target:"",name:"highlightShortcut4"},
    highlightShortcut5:{enabled:false,target:"",name:"highlightShortcut5"},
    highlightShortcut6:{enabled:false,target:"",name:"highlightShortcut6"},
    highlightShortcut7:{enabled:false,target:"",name:"highlightShortcut7"},
    highlightShortcut8:{enabled:false,target:"",name:"highlightShortcut8"},
    speechText:{enabled:false,target:"",name:"speechText"},
    goDictionary:{enabled:false,target:"",name:"goDictionary"},
    goToMindMap:{enabled:false,target:"",name:"goToMindMap"},
    setTitleHighlight:{enabled:false,target:"",name:"setTitleHighlight"},
    setCommentHighlight:{enabled:false,target:"",name:"setCommentHighlight"},
    setEmphasisHighlight:{enabled:false,target:"",name:"setEmphasisHighlight"},
    mergeIntoNote:{enabled:false,target:"",name:"mergeIntoNote"},
    newGroupChild:{enabled:false,target:"",name:"newGroupChild"},
    toggleGroupMode:{enabled:false,target:"",name:"toggleGroupMode"},
    draftCurrentNote:{enabled:false,target:"",name:"draftCurrentNote"},
    insertTranslation:{enabled:false,target:"",name:"insertTranslation"},
    splitBook:{enabled:false,target:"",name:"splitBook"},
    pasteOnPage:{enabled:false,target:"",name:"pasteOnPage"},
    textboxOnPage:{enabled:false,target:"",name:"textboxOnPage"},
    imageboxOnPage:{enabled:false,target:"",name:"imageboxOnPage"},
    setBlankLayer:{enabled:false,target:"",name:"setBlankLayer"},
    sourceHighlightOfNote:{enabled:false,target:"",name:"sourceHighlightOfNote"},
    paintHighlight:{enabled:false,target:"",name:"paintHighlight"},
  }
  static defalutImageScale = {
    "color0":2.4,
    "color1":2.4,
    "color2":2.4,
    "color3":2.4,
    "color4":2.4,
    "color5":2.4,
    "color6":2.4,
    "color7":2.4,
    "color8":2.4,
    "color9":2.4,
    "color10":2.4,
    "color11":2.4,
    "color12":2.4,
    "color13":2.4,
    "color14":2.4,
    "color15":2.4
  }
  static imageConfigs = {}
  static imageScale = {}
  static defaultSyncConfig = {
    iCloudSync: true,
    lastSyncTime: 0,
    lastModifyTime: 0
  }
  /**
   * @type {{iCloudSync:boolean,lastSyncTime:number,lastModifyTime:number}}
   */
  static syncConfig = {}
  // static defaultConfig = {showEditorWhenEditingNote:false}
  static init(mainPath){
    // this.config = this.getByDefault("MNToolbar_config",this.defaultConfig)
    try {
    this.mainPath = mainPath
    // this.cloudStore = NSUbiquitousKeyValueStore.defaultStore()
    this.dynamic = this.getByDefault("MNToolbar_dynamic",false)
    this.preprocessMode = this.getByDefault("MNToolbar_preprocessMode",false)
    this.addonLogos = this.getByDefault("MNToolbar_addonLogos",{})
    this.windowState = this.getByDefault("MNToolbar_windowState",this.defaultWindowState)
    this.buttonNumber = this.getDefaultActionKeys().length
    //数组格式,存的是每个action的key
    referenceIds = this.getByDefault("MNToolbar_referenceIds",{})
    /**
     * 夏大鱼羊 - end
     */
    this.action = this.getByDefault("MNToolbar_action", this.getDefaultActionKeys())
    this.action = this.action.map(a=>{
      if (a === "excute") {
        return "execute"
      }
      return a
    })
    
    this.actions = this.getByDefault("MNToolbar_actionConfig", this.getActions())
    if ("excute" in this.actions) {
      let action = this.actions["excute"]
      action.image = "execute"
      this.actions["execute"] = action
      delete this.actions["excute"]
    }
    if ("execute" in this.actions) {
      if (this.actions["execute"].image === "excute") {
        this.actions["execute"].image = "execute"
      }
    }
    this.buttonConfig = this.getByDefault("MNToolbar_buttonConfig", this.defalutButtonConfig)
    // MNUtil.copyJSON(this.buttonConfig)
    this.highlightColor = UIColor.blendedColor(
      UIColor.colorWithHexString("#2c4d81").colorWithAlphaComponent(0.8),
      toolbarUtils.app.defaultTextColor,
      0.8
    );
      let editorConfig = this.getDescriptionByName("edit")
      if ("showOnNoteEdit" in editorConfig) {
        this.showEditorOnNoteEdit = editorConfig.showOnNoteEdit
      }
      
    } catch (error) {
      toolbarUtils.addErrorLog(error, "init")
    }
    this.buttonImageFolder = MNUtil.dbFolder+"/buttonImage"
    NSFileManager.defaultManager().createDirectoryAtPathAttributes(this.buttonImageFolder, undefined)
    // this.popupConfig = this.getByDefault("MNToolbar_popupConfig", this.defaultPopupReplaceConfig)
    // this.popupConfig = this.defaultPopupReplaceConfig
    this.popupConfig = this.getByDefault("MNToolbar_popupConfig", this.defaultPopupReplaceConfig)
    this.syncConfig = this.getByDefault("MNToolbar_syncConfig", this.defaultSyncConfig)
    this.initImage()
    // this.readCloudConfig()
    // this.writeCloudConfig()
  }
  static getPopupConfig(key){
    if (this.popupConfig[key] !== undefined) {
      return this.popupConfig[key]
    }else{
      return this.defaultPopupReplaceConfig[key]
    }
  }
  static addCloudChangeObserver(observer, selector, name) {
    NSNotificationCenter.defaultCenter().addObserverSelectorName(observer, selector, name, this.cloudStore)
  }
  static deepEqual(obj1, obj2) {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== 'object' || obj1 === null ||
        typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }

    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
        if (!keys2.includes(key)) {
            return false;
        }
        if (["modifiedTime","lastSyncTime"].includes(key)) {
          return true
        }
        if (!this.deepEqual(obj1[key], obj2[key])) {
          return false;
        }
    }
    return true;
  }
  static getAllConfig(){
    let config = {
      windowState: this.windowState,
      syncConfig: this.syncConfig,
      dynamic: this.dynamic,
      addonLogos: this.addonLogos,
      actionKeys: this.action,
      actions: this.actions,
      buttonConfig:this.buttonConfig,
      popupConfig:this.popupConfig
    }
    return config
  }
  static readCloudConfig(){
    try {
      // let keyValueStore = NSUbiquitousKeyValueStore.defaultStore()
      // keyValueStore.removeObjectForKey("MNToolbar_windowState")
      // keyValueStore.setObjectForKey(this.windowState,"MNToolbar_windowState")
      let cloudConfig = this.cloudStore.objectForKey("MNToolbar_totalConfig")
      if (cloudConfig && cloudConfig.syncConfig) {
        let same = this.deepEqual(cloudConfig, this.getAllConfig())
        if (same) {
          return false
        }
        // MNUtil.copyJSON(cloudConfig)
        if (this.syncConfig.lastSyncTime < cloudConfig.syncConfig.lastSyncTime ) {
          // MNUtil.copy("Import from iCloud")
          this.windowState = cloudConfig.windowState
          this.syncConfig = cloudConfig.syncConfig
          this.dynamic = cloudConfig.dynamic
          this.addonLogos = cloudConfig.addonLogos
          this.action = cloudConfig.actionKeys
          this.actions = cloudConfig.actions
          this.buttonConfig = cloudConfig.buttonConfig
          this.popupConfig = cloudConfig.popupConfig
          this.writeCloudConfig()
          return true

              // self.setButtonText(allActions,self.selectedItem)
    // self.toolbarController.setToolbarButton(allActions)
          // MNUtil.showHUD("Import from iCloud")
        }else{
          this.writeCloudConfig()
          // MNUtil.copy("Upload to iCloud")
          return false
        }
      }else{
        this.writeCloudConfig()
        // MNUtil.copy("No cloud config, write to cloud")
        return false
      }
    } catch (error) {
      MNUtil.copy(error.toString())
      // toolbarUtils.addErrorLog(error, "readCloudConfig")
      return false
    }
  }
  static writeCloudConfig(){
    this.syncConfig.lastSyncTime = Date.now()
    this.syncConfig.lastModifyTime = Date.now()
    let config = {
      windowState: this.windowState,
      syncConfig: this.syncConfig,
      dynamic: this.dynamic,
      addonLogos: this.addonLogos,
      actionKeys: this.action,
      actions: this.actions,
      buttonConfig:this.buttonConfig,
      popupConfig:this.popupConfig
    }
    // MNUtil.copyJSON(config)
    this.cloudStore.setObjectForKey(config,"MNToolbar_totalConfig")

  }
  static initImage(){
    try {
    let keys = this.getDefaultActionKeys()
    this.imageScale = toolbarConfig.getByDefault("MNToolbar_imageScale",{})
    // MNUtil.copyJSON(this.imageScale)
    // let images = keys.map(key=>this.mainPath+"/"+this.getAction(key).image+".png")
    // MNUtil.copyJSON(images)
    keys.forEach((key)=>{
      let tem = this.imageScale[key]
      if (tem && MNUtil.isfileExists(this.buttonImageFolder+"/"+tem.path)) {
        let scale = tem.scale ?? 2
        this.imageConfigs[key] = MNUtil.getImage(this.buttonImageFolder+"/"+tem.path,scale)
      }else{
        let scale = 2
        if (key in toolbarConfig.defalutImageScale) {
          scale = toolbarConfig.defalutImageScale[key]
        }
        this.imageConfigs[key] = MNUtil.getImage(this.mainPath+"/"+this.getAction(key).image+".png",scale)
      }
    })
    this.curveImage = MNUtil.getImage(this.mainPath+"/curve.png",2)
    this.runImage = MNUtil.getImage(this.mainPath+"/run.png",2.6)
    this.templateImage = MNUtil.getImage(this.mainPath+"/template.png",2.2)
    // MNUtil.copyJSON(this.imageConfigs)
      } catch (error) {
      toolbarUtils.addErrorLog(error, "initImage")
    }
  }
  // static setImageByURL(action,url,refresh = false) {
  //   this.imageConfigs[action] = toolbarUtils.getOnlineImage(url)
  //   if (refresh) {
  //     MNUtil.postNotification("refreshToolbarButton", {})
  //   }
  // }
  static setImageByURL(action,url,refresh = false,scale = 3) {
    let md5 = MNUtil.MD5(url)
    // let imagePath = this.mainPath+"/"+this.getAction(action).image+".png"
    // MNUtil.getImage(this.mainPath+"/"+this.getAction(key).image+".png",scale)
    let localPath = this.buttonImageFolder+"/"+md5+".png"
    this.imageScale[action] = {path:md5+".png",scale:scale}
    this.save("MNToolbar_imageScale")
    let image = undefined
    let imageData = undefined
    if (MNUtil.isfileExists(localPath)) {
      image = MNUtil.getImage(localPath,scale)
      // image.pngData().writeToFileAtomically(imagePath, false)
      this.imageConfigs[action] = image
      if (refresh) {
        MNUtil.postNotification("refreshToolbarButton", {})
      }
      return
    }
    if (/^marginnote\dapp:\/\/note\//.test(url)) {
      let note = MNNote.new(url)
      imageData = MNNote.getImageFromNote(note)
      if (imageData) {
        image = UIImage.imageWithDataScale(imageData, scale)
        // imageData.writeToFileAtomically(imagePath, false)
        imageData.writeToFileAtomically(localPath, false)
        this.imageConfigs[action] = image
        if (refresh) {
          MNUtil.postNotification("refreshToolbarButton", {})
        }
      }
      return
    }
    if (/^https?:\/\//.test(url)) {
      image = toolbarUtils.getOnlineImage(url,scale)
      this.imageConfigs[action] = image
      imageData = image.pngData()
      // imageData.writeToFileAtomically(imagePath, false)
      imageData.writeToFileAtomically(localPath, false)
      if (refresh) {
        MNUtil.postNotification("refreshToolbarButton", {})
      }
      return
    }
    // }
    if (refresh) {
      MNUtil.postNotification("refreshToolbarButton", {})
    }
  }
  /**
   * 
   * @param {string} action 
   * @param {UIImage} image 
   * @param {boolean} refresh 
   * @param {number} scale 
   * @returns 
   */
  static setButtonImage(action,image,refresh = false,scale = 3) {
  try {
    let size = image.size
    if (size.width > 500 || size.height > 500) {
      MNUtil.showHUD("Image size is too large")
      return
    }

    let md5 = MNUtil.MD5(image.pngData().base64Encoding())
    // let imagePath = this.mainPath+"/"+this.getAction(action).image+".png"
    // MNUtil.getImage(this.mainPath+"/"+this.getAction(key).image+".png",scale)
    let localPath = this.buttonImageFolder+"/"+md5+".png"
    this.imageScale[action] = {path:md5+".png",scale:1}
    this.save("MNToolbar_imageScale")
    if (MNUtil.isfileExists(localPath)) {
      this.imageConfigs[action] = image
      if (refresh) {
        MNUtil.postNotification("refreshToolbarButton", {})
      }
      return
    }else{
      this.imageConfigs[action] = image
      image.pngData().writeToFileAtomically(localPath, false)
      if (refresh) {
        MNUtil.postNotification("refreshToolbarButton", {})
      }
    }
    // }
    if (refresh) {
      MNUtil.postNotification("refreshToolbarButton", {})
    }
  } catch (error) {
    toolbarUtils.addErrorLog(error, "setButtonImage")
  }
  }
  static getAllActions(){
    let allActions = this.action.concat(this.getDefaultActionKeys().slice(this.action.length))
    return allActions
  }
  static getWindowState(key){
    //用户已有配置可能不包含某些新的key，用这个方法做兼容性处理
    if (this.windowState[key] !== undefined) {
      return this.windowState[key]
    }else{
      return this.defaultWindowState[key]
    }
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
  static checkLogoStatus(addon){
  // try {
    if (this.addonLogos && (addon in this.addonLogos)) {
      return this.addonLogos[addon]
    }else{
      return true
    }
  // } catch (error) {
  //   toolbarUtils.addErrorLog(error, "checkLogoStatus")
  //   return true
  // }
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
      break;
    case "menu_comment":
      config.action = "menu"
      config.menuItems = [
        {
          "action" : "moveNewContentsByPopupTo",
          "menuTitle" : "「自动」移动评论⬆️"
        },
        {
          "action": "moveLastOneCommentByPopupTo",
          "menuTitle": "移动「最后1️⃣条」评论",
        },
        {
          "action": "moveLastTwoCommentByPopupTo",
          "menuTitle": "移动「最后2️⃣条」评论",
        },
        {
          "action": "moveLastThreeCommentByPopupTo",
          "menuTitle": "移动「最后3️⃣条」评论",
        },
      ]
      break;
    case "menu_think":
      config.action = "menu"
      config.menuWidth =  330,
      config.menuItems = [
        {
          "action" : "moveUpThoughtPoints",
          "menuTitle" : "思考点⬆️"
        },
        {
          "action" : "addThoughtPoint",
          "menuTitle" : "➕思考点"
        },
        {
          "action": "addThoughtPointAndMoveLastCommentToThought",
          "menuTitle": "➕思考点&最后💬⬆️思考",
        },
        {
          "action" : "moveLastCommentToThought",
          "menuTitle" : "最后1️⃣💬⬆️思考"
        },
        {
          "action" : "moveLastTwoCommentsToThought",
          "menuTitle" : "最后2️⃣💬⬆️思考"
        },
        {
          "action": "moveLastTwoCommentsInBiLinkNotesToThought",
          "menuTitle": "双向链接的两张卡片同时最后2️⃣💬⬆️思考",
        }
      ]
      break;
    case "menu_study":
      config.action = "menu"
      config.menuItems = [
        {
          "action": "menu",
          "menuTitle": "➡️ 注释",
          "menuWidth": 260,
          "menuItems": [
            {
              "action": "renewCommentsInProofToHtmlType",
              "menuTitle": "🔄更新证明里的注释➡️高亮",
            },
            {
              "action": "htmlCommentToProofFromClipboard",
              "menuTitle": "从剪切板粘贴到证明中"
            },
            {
              "action": "htmlCommentToBottom",
              "menuTitle": "➕卡片末尾"
            },
            {
              "action": "htmlCommentToProofBottom",
              "menuTitle": "⬆️证明末尾"
            },
            {
              "action": "htmlCommentToProofTop",
              "menuTitle": "⬆️证明开始"
            }
          ]
        },
        {
          "action": "menu",
          "menuTitle": "➡️ 证明",
          "menuWidth": 250,
          "menuItems": [
            {
              "action" : "addProofToStartFromClipboard",
              "menuTitle" : "从剪切板增加证明⬆️证明「开始」"
            },
            {
              "action" : "addProofFromClipboard",
              "menuTitle" : "从剪切板增加证明⬆️证明「末尾」"
            },
            {
              "action": "moveProofToMethod",
              "menuTitle": "证明⬆️某种方法",
            },
            {
              "action": "proofAddNewMethodWithComment",
              "menuTitle": "➕证明方法（补充注释）",
            },
            {
              "action": "proofAddNewMethod",
              "menuTitle": "➕证明方法（无注释）",
            },
            {
              "action": "proofAddMethodComment",
              "menuTitle": "补充某证明方法的注释",
            },
            {
              "action" : "renewProof",
              "menuTitle" : "更新证明"
            },
            {
              "action": "moveProofDown",
              "menuTitle": "将证明移到最下方",
            },
          ]
        },
        {
          "action": "menu",
          "menuTitle": "➡️ 链接 🔗",
          "menuWidth": 400,
          "menuItems": [
            {
              "action": "renewLinksBetweenClassificationNoteAndExtensionNote",
              "menuTitle": "更新1️⃣次「归类卡片」与「概念or归类卡片」之间的🔗"
            },
            {
              "action": "moveUpLinkToBelonging",
              "menuTitle": "最后1️⃣💬⬆️所属",
            },
          ]
        },
        {
          "action": "menu",
          "menuTitle": "➡️ 反例",
          "menuItems": [
            {
              "action": "proofAddNewAntiexample",
              "menuTitle": "➕反例（无注释）"
            },
            {
              "action": "proofAddNewAntiexampleWithComment",
              "menuTitle": "➕反例（补充注释）"
            }
          ]
        },
        {
          "action": "addOldNoteKeyword",
          "menuTitle": "（旧卡片）➕关键词",
        },
      ]
      break;
    case "menu_reference":
      config.action = "menu"
      config.menuItems = [
        // {
        //   "action": "renewBookSeriesNotes",
        //   "menuTitle": "书作系列卡片更新",
        // },
        // {
        //   "action": "renewBookNotes",
        //   "menuTitle": "书作卡片更新",
        // },
        {
          "action": "menu",
          "menuTitle": "➡️ 🧠文献学习",
          "menuItems": [
            {
              "action": "menu",
              "menuTitle": "➡️ 引用",
              "menuWidth": 500,
              "menuItems": [
                "⬇️ ➕引用",
                {
                  "action": "referenceRefByRefNum",
                  "menuTitle": "选中「具体引用」卡片+输入文献号→ ➕引用"
                },
                {
                  "action": "referenceRefByRefNumAndFocusInMindMap",
                  "menuTitle": "选中「具体引用」卡片+输入文献号→ ➕引用 + 剪切归类 + 主视图定位"
                },
                {
                  "action": "referenceRefByRefNumAddFocusInFloatMindMap",
                  "menuTitle": "选中「具体引用」卡片+输入文献号→ ➕引用 + 剪切归类 + 浮窗定位"
                },
                "⬇️ ➕引用归类卡片",
                {
                  "action": "referenceCreateClassificationNoteByIdAndFocusNote",
                  "menuTitle": "选中「参考文献摘录」卡片+输入文献号→ ➕引用归类卡片 + 浮窗定位",
                },
                {
                  "action": "referenceCreateClassificationNoteById",
                  "menuTitle": "输入文献号→ ➕引用归类卡片 + 浮窗定位",
                },
                // {
                //   "action": "referenceCreateClassificationNoteByFocusNote",
                //   "menuTitle": "选中「参考文献摘录」卡片→ ➕引用归类卡片",
                // },
              ]
            },
            {
              "action": "menu",
              "menuTitle": "➡️ 思考",
              "menuItems": [
                {
                  "action" : "referenceMoveUpThoughtPoints",
                  "menuTitle" : "思考点⬆️"
                },
                {
                  "action" : "referenceAddThoughtPoint",
                  "menuTitle" : "➕思考点"
                },
                {
                  "action": "referenceAddThoughtPointAndMoveLastCommentToThought",
                  "menuTitle": "➕思考点 + 最后🔗⬆️思考",
                },
                {
                  "action" : "referenceMoveLastCommentToThought",
                  "menuTitle" : "最后1️⃣💬⬆️思考"
                },
                {
                  "action" : "referenceMoveLastTwoCommentsToThought",
                  "menuTitle" : "最后2️⃣💬⬆️思考"
                },
              ]
            },
          ]
        },
        {
          "action": "menu",
          "menuTitle": "➡️ 参考文献",
          "menuItems": [
            {
              "action": "menu",
              "menuTitle": "👉 当前文档",
              "menuWidth": 350,
              "menuItems": [
                {
                  "action": "referenceTestIfIdInCurrentDoc",
                  "menuTitle": "检测文献号的🆔绑定情况",
                },
                {
                  "action": "referenceStoreIdForCurrentDocByFocusNote",
                  "menuTitle": "当前文档与选中卡片的🆔绑定",
                },
                {
                  "action": "referenceStoreOneIdForCurrentDocByFocusNote",
                  "menuTitle": "录入「选中卡片」的🆔"
                },
                // {
                //   "action": "referenceStoreOneIdForCurrentDoc",
                //   "menuTitle": "当前文档：手动录入 1 条参考文献卡片🆔"
                // },
                {
                  "action": "referenceStoreIdsForCurrentDoc",
                  "menuTitle": "「手动录入」参考文献卡片🆔"
                },
                {
                  "action": "referenceStoreIdsForCurrentDocFromClipboard",
                  "menuTitle": "从剪切板录入当前文档的参考文献卡片🆔"
                },
                {
                  "action": "referenceClearIdsForCurrentDoc",
                  "menuTitle": "清空当前文档卡片🆔",
                },
              ]
            },
            {
              "action": "menu",
              "menuTitle": "➡️ 导出",
              "menuWidth": 250,
              "menuItems": [
                {
                  "action": "referenceExportReferenceIdsToClipboard",
                  "menuTitle": "导出参考文献卡片🆔到剪切板"
                },
                {
                  "action": "referenceExportReferenceIdsToFile",
                  "menuTitle": "导出参考文献卡片🆔到文件"
                },
              ]
            },
            {
              "action": "menu",
              "menuTitle": "⬅️ 导入",
              "menuWidth": 250,
              "menuItems": [
                {
                  "action": "referenceInputReferenceIdsFromClipboard",
                  "menuTitle": "从剪切板导入参考文献卡片🆔"
                },
                {
                  "action": "referenceInputReferenceIdsFromFile",
                  "menuTitle": "从文件导入参考文献卡片🆔"
                },
              ]
            }
          ]
        },
        {
          "action": "menu",
          "menuTitle": "➡️ 🗂️文献卡片",
          "menuItems": [
            {
              "action": "menu",
              "menuTitle": "️️➡️ 文献制卡",
              "menuItems": [
                // {
                //   "menuTitle": "🔽 "
                // },
                {
                  "action": "referencePaperMakeCards",
                  "menuTitle": "📄 论文制卡"
                },
                {
                  "action": "referenceBookMakeCards",
                  "menuTitle": "📚 书作制卡"
                },
                {
                  "action": "referenceSeriesBookMakeCard",
                  "menuTitle": "📚 系列书作制卡"
                },
                {
                  "action": "referenceOneVolumeJournalMakeCards",
                  "menuTitle": "📄 整卷期刊制卡"
                },
              ]
            },
            {
              "action": "referenceInfoAuthor",
              "menuTitle": "👨‍🎓 作者"
            },
            {
              "action": "referenceInfoYear",
              "menuTitle": "⌛️ 年份",
            },
            {
              "action": "referenceInfoJournal",
              "menuTitle": "📄 期刊",
            },
            {
              "action": "referenceInfoPublisher",
              "menuTitle": "📚 出版社",
            },
            {
              "action": "referenceInfoKeywords",
              "menuTitle": "📌 关键词",
            },
            {
              "action": "referenceInfoDoiFromClipboard",
              "menuTitle": "🔢 DOI",
            },
            {
              "action": "menu",
              "menuTitle": "➡️ 🔗 引用样式",
              "menuItems": [
                {
                  "action": "referenceInfoRefFromInputRefNum",
                  "menuTitle": "输入文献号录入引用样式"
                },
                {
                  "action": "referenceInfoRefFromFocusNote",
                  "menuTitle": "选中摘录自动录入引用样式"
                },
                {
                  "action": "referenceInfoInputRef",
                  "menuTitle": "手动输入引用样式"
                }
              ]
            },
            {
              "action": "menu",
              "menuTitle": "➡️ .bib 信息",
              "menuItems": [
                {
                  "action": "referenceBibInfoPasteFromClipboard",
                  "menuTitle": "从剪切板粘贴 .bib 信息"
                },
                {
                  "action": "referenceBibInfoCopy",
                  "menuTitle": "复制 .bib 信息"
                },
                {
                  "action": "referenceBibInfoExport",
                  "menuTitle": "导出 .bib 信息",
                }
              ]
            }
          ]
        },
        {
          "action": "menu",
          "menuTitle": "➡️ 👨‍🎓作者卡片",
          "menuItems": [
            {
              "action": "referenceAuthorRenewAbbreviation",
              "menuTitle": "更新作者缩写",
            },
            {
              "action": "referenceAuthorInfoFromClipboard",
              "menuTitle": "粘贴个人信息"
            }
          ]
        },
        {
          "action": "menu",
          "menuTitle": "➡️ 📄期刊卡片",
          "menuItems": [
            // {
            //   "menuTitle": "🔽 "
            // },
            // {
            //   "action": "",
            //   "menuTitle": "➕出版社"
            // },
            // {
            //   "action": "",
            //   "menuTitle": "修改整卷期刊前缀"
            // }
          ]
        },
        {
          "action": "menu",
          "menuTitle": "➡️ 📌关键词卡片",
          "menuItems": [
            {
              "action": "referenceKeywordsAddRelatedKeywords",
              "menuTitle": "➕相关关键词"
            },
            {
              "action": "referenceGetRelatedReferencesByKeywords",
              "menuTitle": "根据关键词筛选文献"
            }
          ]
        },
      ]
      break;
    case "menu_text":
      config.action = "menu"
      config.menuItems = [
        {
          "action": "menu",
          "menuTitle": "→ 文档中选中的文本",
          "menuItems": [
            {
              "action": "selectionTextToTitleCase",
              "menuTitle": "标题规范"
            },
            {
              "action": "selectionTextToLowerCase",
              "menuTitle": "转小写"
            },
            {
              "action": "selectionTextHandleSpaces",
              "menuTitle": "处理空格"
            }
          ]
        },
        {
          "action": "menu",
          "menuTitle": "→ 复制的文本",
          "menuItems": [
            {
              "action": "copiedTextToTitleCase",
              "menuTitle": "标题规范"
            },
            {
              "action": "copiedTextToLowerCase",
              "menuTitle": "转小写"
            },
            {
              "action": "copiedTextHandleSpaces",
              "menuTitle": "处理空格"
            }
          ]
        },
      ]
      break;
    case "menu_card":
      config.action = "menu"
      config.menuWidth = 250
      config.menuItems = [
        {
          "action": "copyFocusNotesIdArr",
          "menuTitle": "复制卡片🆔",
        },
        {
          "action": "pasteAsChildNotesByIdArrFromClipboard",
          "menuTitle": "复制卡片🆔后，剪切到选中卡片",
        },
        {
          "action": "getNewClassificationInformation",
          "menuTitle": "更新卡片归类情况到选中的卡片中",
        },
        {
          "action": "mergeInParentAndReappendAllLinks",
          "menuTitle": "合并卡片到父卡片",
        },
        {
          "action": "menu",
          "menuTitle": "➡️ 处理旧卡片",
          "menuWidth":250,
          "menuItems": [
            {
              "action" : "renewCards",
              "menuTitle" : "🔄 更新旧卡片"
            },
            {
              "action": "reappendAllLinksInNote",
              "menuTitle": "🔄 卡片的所有链接重新链接",
            },
            // {
            //   "action": "linksConvertToMN4Type",
            //   "menuTitle": "mn3 链接 → mn4 链接",
            // },
            {
              "action": "clearAllFailedLinks",
              "menuTitle": "❌ 处理旧链接、失效的链接",
            },
            // {
            //   "action": "clearAllFailedMN3Links",
            //   "menuTitle": "❌ 失效的 mn3 链接",
            // },
            {
              "action": "clearAllLinks",
              "menuTitle": "❌ 所有链接",
            },
            {
              "action": "clearContentKeepExcerptWithTitle",
              "menuTitle": "✅ 摘录 ✅ 标题",
            },
            {
              "action": "clearContentKeepExcerpt",
              "menuTitle": "✅ 摘录 ❌ 标题",
            },
            {
              "action": "clearContentKeepHandwritingAndImage",
              "menuTitle": "✅ 手写、图片 ❌ 标题",
            },
            {
              "action" : "clearContentKeepExcerptAndHandwritingAndImage",
              "menuTitle" : "✅ 摘录、手写和图片 ❌ 标题",
            },
            {
              "action" : "clearContentKeepMarkdownText",
              "menuTitle" : "✅ Markdown 文本 ❌ 标题"
            },
            {
              "action" : "clearContentKeepHtmlText",
              "menuTitle" : "✅ HTML 文本 ❌ 标题"
            },
            {
              "action" : "clearContentKeepText",
              "menuTitle" : "✅ MD & HTML 文本 ❌ 标题"
            },
            {
              "action" : "achieveCards",
              "menuTitle" : "📦 存档旧卡片"
            }
          ]
        },
        {
          "action": "convertNoteToNonexcerptVersion",
          "menuTitle": "➡️ 非摘录版本",
        },
        {
          "action": "AddToReview",
          "menuTitle": "加入复习",
        },
        "-----存档------",
        {
          "action": "changeChildNotesPrefix",
          "menuTitle": "✂️ 修改子卡片前缀",
        },
        {
          "action": "renewChildNotesPrefix",
          "menuTitle": "✂️ 重新设置子卡片前缀",
        },
        {
          "action": "refreshNotes",
          "menuTitle": "🔄 刷新卡片",
        },
        {
          "action": "refreshCardsAndAncestorsAndDescendants",
          "menuTitle": "🔄 刷新卡片及其所有父子卡片",
        },
        {
          "action": "menu",
          "menuTitle": "➡️ 链接",
          "menuItems": [
            {
              "action": "linkRemoveDuplicatesAfterApplication",
              "menuTitle": "“应用”下方的链接去重"
            }
          ]
        },
        {
          "action": "focusInMindMap",
          "menuTitle": "focus In 主视图",
        },
        {
          "action": "focusInFloatMindMap",
          "menuTitle": "focus In 浮窗",
        },
        {
          "action": "menu",
          "menuTitle": "➡️ 卡片标题",
          "menuItems": [
            {
              "action": "handleTitleSpaces",
              "menuTitle": "处理标题空格",
            },
            {
              "action" : "menu",
              "menuTitle" : "➡️ 复制标题",
              "menuItems": [
                {
                  "action": "copyWholeTitle",
                  "menuTitle": "复制整个标题",
                },
                {
                  "action": "copyTitleSecondPart",
                  "menuTitle": "【】后的标题主体",
                },
                {
                  "action": "copyTitleFirstKeyword",
                  "menuTitle": "第1️⃣个标题词",
                },
                {
                  "action": "copyTitleFirstQuoteContent",
                  "menuTitle": "第1️⃣个引号内容",
                },
                {
                  "action": "copyTitleSecondQuoteContent",
                  "menuTitle": "第2️⃣个引号内容",
                }
              ]
            },
            {
              "action" : "menu",
              "menuTitle" : "➡️ 粘贴到标题",
              "menuItems": [
                {
                  "action": "pasteInTitle",
                  "menuTitle": "完全替换标题",
                },
                {
                  "action": "pasteAfterTitle",
                  "menuTitle": "添加到原标题后面",
                },
              ]
            },
            {
              "action" : "findDuplicateTitles",
              "menuTitle" : "子卡片标题查重"
            }
          ]
        },
      ]
      break;
    case "menu_workflow":
      config.action = "menu"
      config.menuWidth = 200
      config.menuItems = [
        {
          "action": "toBeProgressNote",
          "menuTitle": "⇨ 📍进度标记",
        },
        {
          "action": "toBeIndependent",
          "menuTitle": "⇨ 独立",
        },
        {
          "action": "moveToInput",
          "menuTitle": "⇨ 输入",
        },
        {
          "action": "moveToInternalize",
          "menuTitle": "⇨ 内化",
        },
        {
          "action": "moveToBeClassified",
          "menuTitle": "⇨ 待归类",
        },
      ]
      break;
    case "menu_excerpt":
      config.action = "menu"
      config.menuItems = [
        {
          "action": "moveToExcerptPartBottom",
          "menuTitle": "⇨ 摘录区「⬇️ bottom」",
        },
        {
          "action": "moveToExcerptPartTop",
          "menuTitle": "⇨ 摘录区「🔝 top」",
        }
      ]
      break;
    /**
     * 把 MN 原生的一些功能整合，以把原本菜单用于替换自己的功能
     */
    case "menu_MN":
      config.action = "menu"
      config.menuItems = [
        {
          "action": "MNEditDeleteNote",
          "menuTitle": "删除卡片",
        },
        {
          "action": "MNFocusNote",
          "menuTitle": "焦点",
        },
      ]
      break;
    // // 尝试制卡的双击操作
    case "TemplateMakeNotes":
      config.action = "TemplateMakeNotes"
      config.doubleClick = {
        "action": "mergeTemplateNotes"
      }
      break;
    default:
      break;
  }
  return JSON.stringify(config,null,2)
}
static getAction(actionName){
  if (actionName in this.actions) {
    return this.actions[actionName]
  }
  return this.getActions()[actionName]
}

static getActions() {
  return {
    "custom1":{name:"制卡",image:"makeCards",description: this.template("TemplateMakeNotes")},
    "custom9":{name:"思考",image:"think",description: this.template("menu_think")},
    "custom10":{name:"评论",image:"comment",description: this.template("menu_comment")},
    "custom2":{name:"学习",image:"study",description: this.template("menu_study")},
    "custom11":{name:"工作流",image:"workflow",description: this.template("menu_workflow")},
    "custom3":{name:"增加模板",image:"addTemplate",description: this.template("addTemplate")},
    "custom5":{name:"卡片",image:"card",description: this.template("menu_card")},
    "custom4":{name:"文献",image:"reference",description: this.template("menu_reference")},
    "custom6":{name:"文本",image:"text",description: this.template("menu_text")},
    "snipaste":{name:"Snipaste",image:"snipaste",description:"Snipaste"},
    "custom7":{name:"隐藏插件栏",image:"hideAddonBar",description: this.template("hideAddonBar")},
    "custom8":{name:"测试",image:"test",description: this.template("test")},
    "execute":{name:"execute",image:"execute",description:"let focusNote = MNNote.getFocusNote()\nMNUtil.showHUD(focusNote.noteTitle)"},
    "ocr":{name:"ocr",image:"ocr",description:JSON.stringify({target:"comment",source:"default"})},
    "edit":{name:"edit",image:"edit",description:JSON.stringify({showOnNoteEdit:false})},
    "copyAsMarkdownLink":{name:"Copy md link",image:"copyAsMarkdownLink",description:"Copy md link"},
    "search":{name:"Search",image:"search",description:"Search"},
    "bigbang":{name:"Bigbang",image:"bigbang",description:"Bigbang"},
    "chatglm":{name:"ChatAI",image:"ai",description:"ChatAI"},
    // "setting":{name:"Setting",image:"setting",description:"Setting"}
    "custom12":{name:"工作流",image:"workflow_white",description: this.template("menu_workflow")},
    "custom13":{name:"摘录",image:"excerpt_white",description: this.template("menu_excerpt")},
    "custom14":{name:"MN",image:"MN_white",description: this.template("menu_MN")},
  }
}
static execute(){


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
      case "MNToolbar_referenceIds":
        // this.referenceIds = referenceIds
        NSUserDefaults.standardUserDefaults().setObjectForKey(referenceIds,key)
      case "MNToolbar_windowState":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.windowState,key)
        break;
      case "MNToolbar_dynamic":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.dynamic,key)
        break;
      case "MNToolbar_preprocessMode":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.preprocessMode,key)
        break;
      case "MNToolbar_action":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.action,key)
        break;
      case "MNToolbar_actionConfig":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.actions,key)
        break;
      case "MNToolbar_addonLogos":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.addonLogos,key)
        break;
      case "MNToolbar_buttonConfig":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.buttonConfig,key)
        break;
      case "MNToolbar_popupConfig":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.popupConfig,key)
        break;
      case "MNToolbar_imageScale":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.imageScale,key)
        break;
      default:
        toolbarUtils.showHUD("Not supported")
        break;
    }
    // this.readCloudConfig()
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
static getDescriptionByIndex(index){
  let actionName = toolbarConfig.action[index]
  if (actionName in toolbarConfig.actions) {
    return JSON.parse(toolbarConfig.actions[actionName].description)
  }else{
    return JSON.parse(toolbarConfig.getActions()[actionName].description)
  }
}
static getExecuteCode(){
  let actionName = "execute"
  if (actionName in toolbarConfig.actions) {
    return toolbarConfig.actions[actionName].description
  }else{
    return toolbarConfig.getActions()[actionName].description
  }
}
static getDescriptionByName(actionName){
  let des
  if (actionName in toolbarConfig.actions) {
    des = toolbarConfig.actions[actionName].description
  }else{
    des = toolbarConfig.getActions()[actionName].description
  }
  if (MNUtil.isValidJSON(des)) {
    return JSON.parse(des)
  }
  return undefined
}
  static checkCouldSave(actionName){
    if (actionName.includes("custom")) {
      return true
    }
    if (actionName.includes("color")) {
      return true
    }
    let whiteNamelist = ["search","copy","chatglm","ocr","edit","searchInEudic","pasteAsTitle"]
    if (whiteNamelist.includes(actionName)) {
      return true
    }
    MNUtil.showHUD("Only available for Custom Action!")
    return false
  }

}
class toolbarSandbox{
  static async execute(code){
    'use strict';
    if (!toolbarUtils.checkSubscribe(true)) {
      return
    }
    try {
      eval(code)
      // MNUtil.studyView.bringSubviewToFront(MNUtil.mindmapView)
      // MNUtil.notebookController.view.hidden = true
      // MNUtil.mindmapView.setZoomScaleAnimated(10.0,true)
      // MNUtil.mindmapView.zoomScale = 0.1;
      // MNUtil.mindmapView.hidden = true
      // MNUtil.showHUD("message"+MNUtil.mindmapView.minimumZoomScale)
      // MNUtil.copyJSON(getAllProperties(MNUtil.mindmapView))
    } catch (error) {
      toolbarUtils.addErrorLog(error, "executeInSandbox",code)
    }
  }
}