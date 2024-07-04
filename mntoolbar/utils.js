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

  // 夏大鱼羊自定义函数

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
    let testIndex = focusNote.getCommentIndex("相关链接：", true)
    // MNUtil.showHUD(testIndex)
    if (testIndex == -1) { // 每种模板卡里都有“相关链接：”
      switch (focusNoteType) {
        case "definition":
          templateNoteId = "C1052FDA-3343-45C6-93F6-61DCECF31A6D"
          cloneAndMerge(focusNote, templateNoteId)
          break;
        case "theorem":
          templateNoteId = "C4B464CD-B8C6-42DE-B459-55B48EB31AD8"
          cloneAndMerge(focusNote, templateNoteId)
          break;
        case "example":
          templateNoteId = "C1052FDA-3343-45C6-93F6-61DCECF31A6D"
          cloneAndMerge(focusNote, templateNoteId)
          break;
        case "antiexample":
          templateNoteId = "E64BDC36-DD8D-416D-88F5-0B3FCBE5D151"
          cloneAndMerge(focusNote, templateNoteId)
          break;
        case "method":
          templateNoteId = "EC68EDFE-580E-4E53-BA1B-875F3BEEFE62"
          cloneAndMerge(focusNote, templateNoteId)
          break;
      }
    }
  }
  static makeCardsAuxSecondLayerTemplate(focusNote, focusNoteType,focusNoteColorIndex) {
    let templateNoteId
    let testIndexI = focusNote.getCommentIndex("相关概念：", true)
    let testIndexII = focusNote.getCommentIndex("应用：", true)
    let testIndex = Math.max(testIndexI, testIndexII)
    if ([2, 3, 9, 10, 15].includes(focusNoteColorIndex)) {
      if (testIndex == -1){
        if (focusNoteType === "definition") {
          templateNoteId = "9129B736-DBA1-441B-A111-EC0655B6120D"
          cloneAndMerge(focusNote, templateNoteId)
        } else {
          templateNoteId = "3D07C54E-9DF3-4EC9-9122-871760709EB9"
          cloneAndMerge(focusNote, templateNoteId)
        }
      }
    }
  }
  // 修改卡片前缀
  static makeCardsAuxChangefocusNotePrefix(focusNote, parentNoteTitle, focusNoteColorIndex) {
    let newTitle
    // 有淡黄色的父卡片时，parentNoteTitle 非空（只考虑父卡片都有标题的情况）
    if (parentNoteTitle) {
      // MNUtil.showHUD(parentNoteTitle)
      let focusNoteTitle = focusNote.noteTitle
      let matchContentFromParentNoteTitle = parentNoteTitle.replace(/“(.+)”：“(.+)”\s*相关(.+)/g, "$3：$2")
      // let matchResultFromParentNoteTitle = parentNoteTitle.match(/“(.+)”：“(.+)”\s*相关(.+)/g)
      // if (matchResultFromParentNoteTitle && matchResultFromParentNoteTitle.length > 0) {
      //   MNUtil.showHUD("匹配成功");
      // } else {
      //   MNUtil.showHUD("匹配失败");
      // }

      // MNUtil.showHUD(matchContentFromParentNoteTitle)
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
  static makeCardsAuxLinkToParentNote(focusNote, parentNote, parentNoteTitle, parentNoteId) {
    /*
      归类型的淡黄色卡片：双向链接
      非归类型的淡黄色卡片：单向链接
      其它卡片：不链接

      要注意防止第二次链接
    */
    let parentNoteOldLinkIndex
    let parentNoteNewLinkIndex
    let linkHtmlCommentIndex
    if (!focusNote.excerptText) { // 非摘录版本才开始链接
      if (parentNoteTitle) { // 有 parentNoteTitle 说明是淡黄色卡片
        let matchResultFromParentNoteTitle = parentNoteTitle.match(/“(.+)”：“(.+)”\s*相关(.+)/g)
        if (matchResultFromParentNoteTitle && matchResultFromParentNoteTitle.length > 0) {
          // 归类型的淡黄色卡片
          let parentNoteOldUrl = "marginnote3app://note/" + parentNoteId
          let parentNoteNewUrl = "marginnote4app://note/" + parentNoteId
          parentNoteOldLinkIndex = focusNote.getCommentIndex(parentNoteOldUrl)
          parentNoteNewLinkIndex = focusNote.getCommentIndex(parentNoteNewUrl)
          linkHtmlCommentIndex = focusNote.getCommentIndex("相关链接：",true)
          if ((parentNoteOldLinkIndex == -1) && (parentNoteNewLinkIndex == -1)) { // 防止第二次链接
            parentNote.appendNoteLink(focusNote, "Both")
            focusNote.moveComment(focusNote.note.comments.length-1, linkHtmlCommentIndex+1)  // 放在“相关链接：”下面
          }
        } else {
          // 非归类型的淡黄色卡片
          parentNoteOldLinkIndex = parentNote.getCommentIndex("marginnote3app://note/" + focusNote.noteId)
          parentNoteNewLinkIndex = parentNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
          if ((parentNoteOldLinkIndex == -1) && (parentNoteNewLinkIndex == -1)) { // 防止第二次链接
            parentNote.appendNoteLink(focusNote, "To")
          }
        }
      }
    }
  }

  // 将“相关概念：”移动到下方
  static makeCardsAuxMoveDownDefinitionsComments(focusNote) {
    let definitionHtmlCommentIndex = focusNote.getCommentIndex("相关概念：", true)
    let linkHtmlCommentIndex = focusNote.getCommentIndex("相关链接：", true)
    if (definitionHtmlCommentIndex < linkHtmlCommentIndex) {
      for (let i = linkHtmlCommentIndex-1; i >=definitionHtmlCommentIndex; i-- ) {
        // 注意这里不是 focusNote.moveComment(i, focusNote.comments.length-1)
        focusNote.moveComment(definitionHtmlCommentIndex, focusNote.comments.length-1)
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
                if (comment.text.includes("marginnote4app") || comment.text.includes("marginnote3app")) {
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

  // 问题所在：应用部分先往下移动了
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
          if (comment.type == "PaintNote") {
            nonLinkNoteCommentsIndex.push(index)
          } else {
            if (!comment.text.includes("marginnote4app") && !comment.text.includes("marginnote3app") ) {
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
    // }
  }

  // 增加思考
  static addThought(focusNote, focusNoteType) {
    let keywordsIHtmlCommentIndex = focusNote.getCommentIndex("关键词： ", true)
    let keywordsIIHtmlCommentIndex = focusNote.getCommentIndex("关键词：", true)
    let keywordsHtmlCommentIndex = Math.max(keywordsIHtmlCommentIndex, keywordsIIHtmlCommentIndex)  // 兼容两种“关键词：”
    let definitionHtmlCommentIndex = focusNote.getCommentIndex("相关概念：", true)
    let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
    let linkHtmlCommentIndex = focusNote.getCommentIndex("相关链接：", true)
    let applicationHtmlCommentIndex = focusNote.getCommentIndex("应用：", true)
    let focusNoteComments = focusNote.note.comments
    let focusNoteCommentLength = focusNoteComments.length
    let nonLinkNoteCommentsIndex = []
    let proofHtmlCommentIndex
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
          if (comment.type == "PaintNote") {
            nonLinkNoteCommentsIndex.push(index)
          } else {
            if (!comment.text.includes("marginnote4app") && !comment.text.includes("marginnote3app") ) {
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

  // 消除卡片内容，保留文字评论
  static clearContentKeepText(focusNote) {
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

  static clearContentKeepExcerptAndImage(focusNote) {
    let focusNoteComments = focusNote.note.comments
    let focusNoteCommentLength = focusNoteComments.length
    let comment
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "请确认",
      "只保留摘录、手写和图片吗？",
      0,
      "点错了",
      ["确定"],
      (alert, buttonIndex) => {
        if (buttonIndex == 1) {
          MNUtil.undoGrouping(()=>{
            focusNote.noteTitle = ""
            // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
            for (let i = focusNoteCommentLength-1; i >= 0; i--) {
              comment = focusNoteComments[i]
              if (
                (comment.type == "TextNote")
                ||
                (comment.type == "HtmlNote")
              ) {
                focusNote.removeCommentByIndex(i)
              }
            }
          })
        }
      }
    )
  }

  // 把卡片中的 HtmlNote 的内容转化为 Markdown 语法
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
    let parentNote, templateNote
    let type
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "增加模板",
      "请输入标题并选择类型\n注意：“向下层添加模板”的标题是「增量」输入",
      2,
      "取消",
      ["向下层增加模板", "最顶层（淡绿色）", "专题"],
      (alert, buttonIndex) => {
        let userInputTitle = alert.textFieldAtIndex(0).text;
        switch (buttonIndex) {
          case 3:
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
          case 2:
            /* 增加最顶层的淡绿色模板 */
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
            
            break;
          case 1:
            /* 往下增加模板 */
            // 需要看选中的卡片的颜色
            if (focusNoteColorIndex == 1) {
              /* 淡绿色 */
              type = focusNote.noteTitle.match(/“.+”相关(.*)/)[1]
              // MNUtil.showHUD(type);
              templateNote = MNNote.clone(this.addTemplateAuxGetNoteIdByType(type))
              templateNote.note.colorIndex = 4  // 颜色为黄色
              templateNote.note.noteTitle = "“" + focusNote.noteTitle.match(/“(.*)”相关.*/)[1] + "”：“" + focusNote.noteTitle.match(/“(.*)”相关.*/)[1] + userInputTitle + "”相关" + type
              MNUtil.undoGrouping(()=>{
                focusNote.addChild(templateNote.note)
                focusNote.appendNoteLink(templateNote, "Both")
                templateNote.moveComment(templateNote.note.comments.length-1, 1)
              })
              // 林立飞：可能是 MN 底层的原因，数据库还没处理完，所以需要加一个延时
              MNUtil.delay(0.5).then(()=>{
                templateNote.focusInMindMap()
              })
            } else {
              /* 淡黄色、黄色甚至其它颜色 */
              type = focusNote.noteTitle.match(/“.+”相关(.*)/)[1]
              // MNUtil.showHUD(type);
              templateNote = MNNote.clone(this.addTemplateAuxGetNoteIdByType(type))
              templateNote.note.colorIndex = 0  // 颜色为淡黄色
              templateNote.note.noteTitle = "“" + focusNote.noteTitle.match(/“(.*)”：“(.*)”相关.*/)[2] + "”：“" + focusNote.noteTitle.match(/“(.*)”：“(.*)”相关.*/)[2] +  userInputTitle + "”相关" + type
              MNUtil.undoGrouping(()=>{
                focusNote.addChild(templateNote.note)
                focusNote.appendNoteLink(templateNote, "Both")
                templateNote.moveComment(templateNote.note.comments.length-1, 1)
              })
              // 林立飞：可能是 MN 底层的原因，数据库还没处理完，所以需要加一个延时
              MNUtil.delay(0.5).then(()=>{
                templateNote.focusInMindMap()
              })
            }
            break;
        }
      }
    )
  }

  /* 
    处理旧卡片 
    1. 去掉“模板：”或者“模版：”及下面的内容
    2. 去掉“两层”到“五层”
  */
  
  static renewCards(focusNotes, focusNoteColorIndex) {
    focusNotes.forEach(focusNote => {
      let focusNoteComments = focusNote.note.comments
      let focusNoteCommentLength = focusNoteComments.length
      let comment
      let htmlCommentsIndexArr = []

      try {
        // MNUtil.undoGrouping(()=>{
          this.makeCardsAuxMoveDownApplicationsComments(focusNote)
          this.makeCardsAuxMoveDownDefinitionsComments(focusNote)
        // })
      } catch (error) {
        MNUtil.showHUD(error);
      }

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
              comment.text == "-" ||
              comment.text == "- "
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

    })
  }

  static changePrefix(focusNote, focusNoteColorIndex) {
    let prefix, postfix
    if (focusNoteColorIndex == 1) {
      // 淡绿色卡片
      prefix = focusNote.noteTitle.match(/“(.+)”相关.*/)[1]
      focusNote.childNotes.forEach(childNote => {
        childNote.noteTitle = childNote.noteTitle.replace(/“(.*)”(：“.*”相关.*)/, "“" + prefix + "”" + "$2")
      })
      // todo: focusNote 的链接，因为被链接的标题改变了，所以变成了空白，而且无法自己刷新
      // 目前的暂时解决办法是添加评论再删除
      // focusNote.appendMarkdownComment("")
      // focusNote.removeCommentByIndex(focusNote.note.comments.length-1)
      // focusNote.descendantNodes.descendant.forEach(descendantNote => {
      //   descendantNote.appendMarkdownComment("")
      //   descendantNote.removeCommentByIndex(descendantNote.note.comments.length-1)
      // })
      // focusNote.ancestorNodes.forEach(ancestorNote => {
      //   ancestorNote.appendMarkdownComment("")
      //   ancestorNote.removeCommentByIndex(ancestorNote.note.comments.length-1)
      // })
      focusNote.refresh()
      focusNote.descendantNodes.descendant.forEach(descendantNote => {
        descendantNote.refresh()
      })
      focusNote.ancestorNodes.forEach(ancestorNote => {
        ancestorNote.refresh()
      })
    } else {
      if (focusNoteColorIndex == 0 || focusNoteColorIndex == 4) {
        // 淡黄色或黄色
        prefix = focusNote.noteTitle.match(/“(.*)”：“(.*)”相关.*/)[2]
        focusNote.childNotes.forEach(childNote => {
          if (childNote.colorIndex == 0 || childNote.colorIndex == 4) {
            childNote.noteTitle = childNote.noteTitle.replace(/“(.*)”(：“.*”相关.*)/, "“" + prefix + "”" + "$2")
          } else {
            // 其余颜色的内容卡片
            const regex = /【(.*?)：(.*?)(：.+)?】(.*)/;  // 注意前面的两个要加 ? 变成非贪婪模式
            try {
              childNote.noteTitle = childNote.noteTitle.replace(regex, `【$1：${prefix}$3】$4`);
              childNote.descendantNodes.descendant.forEach(descendantNote => {
                descendantNote.noteTitle = descendantNote.noteTitle.replace(regex, `【$1：${prefix}$3】$4`);
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        })
        // focusNote.appendMarkdownComment("")
        // focusNote.removeCommentByIndex(focusNote.note.comments.length-1)
        // focusNote.descendantNodes.descendant.forEach(descendantNote => {
        //   descendantNote.appendMarkdownComment("")
        //   descendantNote.removeCommentByIndex(descendantNote.note.comments.length-1)
        // })
        // focusNote.ancestorNodes.forEach(ancestorNote => {
        //   ancestorNote.appendMarkdownComment("")
        //   ancestorNote.removeCommentByIndex(ancestorNote.note.comments.length-1)
        // })
        focusNote.refresh()
        focusNote.descendantNodes.descendant.forEach(descendantNote => {
          descendantNote.refresh()
        })
        focusNote.ancestorNodes.forEach(ancestorNote => {
          ancestorNote.refresh()
        })
      }
    }
  }

  static init(){
    this.app = Application.sharedInstance()
    this.data = Database.sharedInstance()
    this.focusWindow = this.app.focusWindow
    this.version = this.appVersion()
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
              break;
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
  /**
   * 
   * @param {MNNote} note 
   * @param {*} des 
   * @returns 
   */
  static getMergedText(note,des){
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
        note.comments.map((comment,index)=>{
          if (comment.type === "TextNote" && !/^marginnote\dapp:\/\/note\//.test(comment.text) && !comment.text.startsWith("#") ) {
            textList.push(text.replace('{{textComments}}',(des.trim ? comment.text.trim(): comment.text)))
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
        note.comments.map((comment,index)=>{
          if (comment.type === "HtmlNote") {
            textList.push(text.replace('{{htmlComments}}',(des.trim ? comment.text.trim(): comment.text)))
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
      if (text.includes("{{excerptTexts}}")) {
        // MNUtil.undoGrouping(()=>{
          note.notes.map(n=>{
            if (n.excerptText) {
              let targetText = n.excerptText
              if (des.trim) {
                targetText = targetText.trim()
              }
              textList.push(text.replace('{{excerptTexts}}',targetText))
              if (des.removeSource && n.noteId !== note.noteId) {
                this.sourceToRemove.push(n)
                  // n.excerptText = ""
              }
            }
          })
        // })
        return
      }

      textList.push(toolbarUtils.detectAndReplaceWithNote(text,note)) 
    })
    if (des.format) {
      textList = textList.map((text,index)=>{
        return des.format.replace("{{element}}",text).replace("{{index}}",index+1)
      })
    }
    let join = des.join ?? ""
    let mergedText = textList.join(join)
    if (des.replace) {
      let ptt = new RegExp(des.replace[0], "g")
      mergedText = mergedText.replace(ptt,des.replace[1])
    }
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
  static checkHeight(height,maxButtons = 9){
    if (height > 420 && !this.checkSubscribe(false,false,true)) {
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
    MNUtil.showHUD("MN Toolbar Error ("+source+"): "+error)
    if (info) {
      this.errorLog.push({error:error.toString(),source:source,info:info,time:(new Date(Date.now())).toString()})
    }else{
      this.errorLog.push({error:error.toString(),source:source,time:(new Date(Date.now())).toString()})
    }
    MNUtil.copyJSON(this.errorLog)
  }
  static removeComment(des){
    let focusNotes = MNNote.getFocusNotes()
    if (des.find) {
      let condition  = des.find
      MNUtil.undoGrouping(()=>{
        focusNotes.forEach(note=>{
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
        })
      })
      return
    }
    if (des.type) {
      let type = Array.isArray(des.type) ? des.type : [des.type]
      MNUtil.undoGrouping(()=>{
        focusNotes.forEach(note=>{
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
          note.removeCommentsByIndices(commentIndices)
        })
      })
    }else{
      let commentIndex = des.index+1
      if (commentIndex) {
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
    }
  
  }
  static async ocr(){
    if (typeof ocrUtils === 'undefined') {
      MNUtil.showHUD("MN Toolbar: Please install 'MN OCR' first!")
      return
    }
try {
    let des = toolbarConfig.getDescriptionByName("ocr")
    let foucsNote = MNNote.getFocusNote()
    let imageData = MNUtil.getDocImage(true,true)
    if (!imageData) {
      imageData = MNNote.getImageFromNote(foucsNote)
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
    if (res) {
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
              foucsNote.excerptTextMarkdown = true
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
        case "editor":
          MNUtil.postNotification("editorInsert",{contents:[{type:"text",content:res}]})
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
  static setColor(colorIndex){
    let fillIndex = -1
    let description = toolbarConfig.actions["color"+colorIndex].description
    if (MNUtil.isValidJSON(description)) {
      let des = JSON.parse(description)
      if ("fillPattern" in des) {
        fillIndex = des.fillPattern
      }
      if ("followAutoStyle" in des && des.followAutoStyle && (typeof autoUtils !== 'undefined')) {
        MNUtil.showHUD("followAutoStyle")
        let focusNotes = MNNote.getFocusNotes()
        MNUtil.undoGrouping(()=>{
          focusNotes.map(note=>{
            let fillIndex
            if (note.excerptPic) {
              fillIndex = autoUtils.getConfig("image")[colorIndex]
            }else{
              fillIndex = autoUtils.getConfig("text")[colorIndex]
            }
            this.setNoteColor(note,colorIndex,fillIndex)
          })
        })
        return
      }
    }
    // MNUtil.copy(description+fillIndex)
    let focusNotes = MNNote.getFocusNotes()
    MNUtil.undoGrouping(()=>{
      focusNotes.map(note=>{
        this.setNoteColor(note,colorIndex,fillIndex)
      })
    })
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
  static showEditorOnNoteEdit = false
  // static defaultConfig = {showEditorWhenEditingNote:false}
  static init(){
    // this.config = this.getByDefault("MNToolbar_config",this.defaultConfig)
    this.dynamic = this.getByDefault("MNToolbar_dynamic",false)
    this.addonLogos = this.getByDefault("MNToolbar_addonLogos",{})
    this.windowState = this.getByDefault("MNToolbar_windowState",{})
    this.action = this.getByDefault("MNToolbar_action", this.getDefaultActionKeys())
    this.actions = this.getByDefault("MNToolbar_actionConfig", this.getActions())
    this.highlightColor = UIColor.blendedColor(
      UIColor.colorWithHexString("#2c4d81").colorWithAlphaComponent(0.8),
      toolbarUtils.app.defaultTextColor,
      0.8
    );
    try {
      let editorConfig = this.getDescriptionByName("edit")
      if ("showOnNoteEdit" in editorConfig) {
        this.showEditorOnNoteEdit = editorConfig.showOnNoteEdit
      }
      
    } catch (error) {
      // toolbarUtils.addErrorLog(error, "init")
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
    "custom9":{name:"Custom 9",image:"custom9",description: this.template("removeComment")},
    "ocr":{name:"ocr",image:"ocr",description:JSON.stringify({target:"comment",source:"default"})},
    "edit":{name:"edit",image:"edit",description:JSON.stringify({showOnNoteEdit:false})}
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
      case "MNToolbar_addonLogos":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.addonLogos,key)
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
static getDescriptionByIndex(index){
  let actionName = toolbarConfig.action[index]
  if (actionName in toolbarConfig.actions) {
    return JSON.parse(toolbarConfig.actions[actionName].description)
  }else{
    return JSON.parse(toolbarConfig.getActions()[actionName].description)
  }
}
static getDescriptionByName(actionName){
  if (actionName in toolbarConfig.actions) {
    return JSON.parse(toolbarConfig.actions[actionName].description)
  }else{
    return JSON.parse(toolbarConfig.getActions()[actionName].description)
  }
}
}