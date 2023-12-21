var htmlsourcecode = "";
var currenturl = "";
var movie = {
  "id": "", "title": "", "releasedate": "", "runtime": "", "director": "",
  "studio": "", "publisher": "", "series": "", "genres": "", "actors": "",
  "bigimage": "", "smallimage": "", "actorimage": "",
  "magnets": new Array(), "previews": ""
};
chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
  let url = tabs[0].url;
  // use `url` here inside the callback because it's asynchronous!
  currenturl = url;
  // console.log(currenturl);
});







//获得网页源码
chrome.runtime.onMessage.addListener(function (request, sender) {
  if (request.action == "getSource") {
    sourcecode.innerText = request.source;
    htmlsourcecode = request.source;
  }
});


//剪贴板操作
chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
  switch (request.method) {
    case 'getClipboard':
      sendResponse(getClipboard());
      break;
    case 'setClipboard':
      sendResponse(setClipboard(request.value));
      break;
    default:
      console.error('Unknown method "%s"', request.method);
      break;
  }
});

//下载图片



function fadeOut(element,speed){
  var speed = speed || 30 ;
  var num = 10;
  var st = setInterval(function(){
  num--;
  element.style.opacity = num / 10 ;
  if(num<=0)  {   clearInterval(st);  }
  },speed);
}

function fadeIn(element,speed){
  var speed = speed || 30 ;
  var num = 0;
  var st = setInterval(function(){
  num++;
  element.style.opacity = num/10;
  if(num>=10)  {  clearInterval(st);  }
  },speed);
}


function onWindowLoad() {
  document.getElementById("close").onclick = function () {
    window.close();
  }

  //复制磁力链接
  document.getElementById("copymagnets").onclick = function () {
    if (movie["magnets"] != undefined && movie["magnets"].length > 0) {
      var magnets = movie["magnets"];
      var linklist = new Array();
      var idx = 0;

      for (var i = 0; i < magnets.length; i++) {
        var link = magnets[i]["link"];
        linklist[idx] = link;
        idx++;
      }
      var links = linklist.join("\n");
      var w = document.createElement('textarea');
      w.value = links;
      document.body.appendChild(w);
      w.select();

      // 调用浏览器的复制命令
      document.execCommand("Copy");

      // 将input元素隐藏，通知操作完成！
      w.style.display = 'none';
      var dialog=document.getElementById("dialog");
      if(dialog.style.opacity==0) fadeIn(dialog,30);
      setTimeout(function(){
        if(dialog.style.opacity==1) fadeOut(dialog,30);
      },1000);
    }

  }

  //下载图片
  document.getElementById("saveimage").onclick=function(){
    // var movie = {
    //   "id": "", "title": "", "releasedate": "", "runtime": "", "director": "",
    //   "studio": "", "publisher": "", "series": "", "genres": "", "actors": "",
    //   "bigimage": "", "smallimage": "", "actorimage": "",
    //   "magnets": new Array(), "previews": ""
    // };

    var id=movie["id"];
    var bigimage=movie["bigimage"];
    var smallimage=movie["smallimage"];
    var actorimage=movie["actorimage"];
    var actor=movie["actors"];
    var previews=movie["previews"];
    console.log(id);
    console.log(bigimage);
    console.log(smallimage);
    console.log(actorimage);
    console.log(previews);
    if(id.length<=0) return;

    

    if(bigimage.length>0){
      var filename="Pic/BigPic/" +id + ".jpg"; 
      downloadfile(bigimage,filename);
    }

    if(smallimage.length>0){
      var filename="Pic/SmallPic/" +id + ".jpg"; 
      downloadfile(smallimage,filename);
    }

    if(actorimage.length>0 && actor.length>0){
      var imgs=actorimage.split(";");
      var actors=actor.split("/");
      for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i];
        var name=actors[i];
        var filename="Pic/Actresses/" +name + ".jpg";  
        downloadfile(img,filename);
      }
    }

    if(previews.length>0){
      var imgs=previews.split(";");
      for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i];
        var name=img.split("/");
        var filename="Pic/ExtraPic/" +id + "/" + name[name.length-1] + ".jpg";  
        downloadfile(img,filename);
      }
    }




  }


  var sourcecode = document.querySelector('#sourcecode');
  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
  }, function () {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      sourcecode.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });


}

function downloadfile(url,path){
  chrome.downloads.download({
    url: url,
    filename: path ,
    conflictAction:"overwrite"
  });
}




window.onload = function () {
  onWindowLoad();

  setTimeout(function () {
    var parser = new DOMParser();
    var dom = parser.parseFromString(htmlsourcecode, 'text/html');
    var title = dom.title;
    if (title.indexOf("JavBus") >= 0) {
      ParseBus(htmlsourcecode);
    } else if (title.indexOf("JavBus") >= 0) {

    } else if (title.indexOf("JavBus") >= 0) {

    } else if (title.indexOf("JavBus") >= 0) {

    } else if (title.indexOf("JavBus") >= 0) {

    } else {

    }

  }, 100);
}


String.prototype.toCHS = function () {
  switch (this.toString()) {
    case "id": return "识别码";
    case "title": return "名称";
    case "releasedate": return "发行日期";
    case "runtime": return "时长";
    case "director": return "导演";
    case "studio": return "制作商";
    case "publisher": return "发行商";
    case "series": return "系列";
    case "genres": return "类别";
    case "actors": return "演员";
    case "bigimage": return "大图";
    case "smallimage": return "小图";
    case "actorimage": return "演员头像";
    case "magnets": return "磁力链接";
    case "previews": return "预览图";
  }
}




function mouseX(evt) {
  if (evt.pageX) return evt.pageX;
  else if (evt.clientX)
    return evt.clientX + (document.documentElement.scrollLeft ?
      document.documentElement.scrollLeft :
      document.body.scrollLeft);
  else return null;
}
function mouseY(evt) {
  if (evt.pageY) return evt.pageY;
  else if (evt.clientY)
    return evt.clientY + (document.documentElement.scrollTop ?
      document.documentElement.scrollTop :
      document.body.scrollTop);
  else return null;
}






function ParseBus(htmlsourcecode) {


  var parser = new DOMParser();
  var dom = parser.parseFromString(htmlsourcecode, 'text/html');
  var infodiv = dom.querySelector(".col-md-3.info");
  var plist = infodiv.getElementsByTagName("p");

  for (var i = 0; i < plist.length; i++) {
    var p = plist[i];
    var header = p.children[0];
    var content = p.children[1];
    // console.log(header);
    try {
      switch (header.innerText) {
        case "識別碼:":
          movie["id"] = content.innerText;
        case "發行日期:":
          movie["releasedate"] = p.innerText.replace("發行日期: ", "");
        case "長度:":
          movie["runtime"] = p.innerText.replace("長度: ", "").replace("分鐘", "");
        case "導演:":
          movie["director"] = content.innerText;
        case "製作商:":
          movie["studio"] = content.innerText;
        case "發行商:":
          movie["publisher"] = content.innerText;
        case "系列:":
          movie["series"] = content.innerText;
      }
    } catch (error) {
      continue;
    }





  }

  //演员类别
  var genres = new Array();
  var actors = new Array();
  var spanlist = infodiv.getElementsByClassName("genre");
  var idx1 = 0;
  var idx2 = 0;
  for (var i = 0; i < spanlist.length; i++) {
    var span = spanlist[i];
    var label = span.getElementsByTagName("label");
    if (label != undefined && label.length > 0) {
      var a = label[0].getElementsByTagName("a");
      genres[idx1] = a[0].innerText;
      idx1++;
    } else {
      var a = span.children[0];
      if (a.innerText != "多選提交") {
        var href = a.getAttribute("href");
        if (href.indexOf("star") >= 0) {
          actors[idx2] = a.innerText;
          idx2++;
        } else {
          genres[idx1] = a.innerText;
          idx1++;
        }

      }

    }
  }
  if (genres.length > 0) {
    movie["genres"] = genres.join(" ");
  }
  if (actors.length > 0) {
    movie["actors"] = actors.join("/");
  }

  //标题
  var titlenode = dom.getElementsByTagName("h3");
  var title = titlenode[0].innerText.replace(movie["id"], "");
  if (title[0] = " ") {
    title = title.slice(1, title.length);
  }

  movie["title"] = title;


  //磁力
  var magnetlist = new Array();
  var magidx = 0;
  var magnettable = dom.getElementById("magnet-table");
  if (magnettable != undefined) {
    var trlist = magnettable.getElementsByTagName("tr");
    if (trlist != undefined) {
      for (var i = 0; i < trlist.length; i++) {
        var magnets = { "name": "", "link": "", "tag": "", "size": "", "date": "" }
        try {
          var tr = trlist[i];
          var tdlist = tr.getElementsByTagName("td");
          var alist = tdlist[0].getElementsByTagName("a");
          var name = alist[0].innerText.replace(" ", "");
          var link = alist[0].getAttribute("href");
          if (alist.length > 1) {
            var tags = new Array();
            var idx = 0;
            for (let i = 1; i < alist.length; i++) {
              var a = alist[i];
              tags[idx] = a.innerText;
              idx++;
            }
            magnets["tag"] = tags.join(" ");
          }
          var size = tdlist[1].children[0].innerText.replace(" ", "");
          var date = tdlist[2].children[0].innerText.replace(" ", "");
          magnets["name"] = name.replace("\n", "").replace("\t", "").replace("               ", "").replace("               ", "").replace(" \t", "").replace(" ", "");
          magnets["size"] = size.replace("\n", "").replace("\t", "").replace("               ", "").replace("               ", "").replace(" \t", "").replace(" ", "");
          magnets["date"] = date.replace("\n", "").replace("\t", "").replace("               ", "").replace("               ", "").replace(" \t", "").replace(" ", "");
          magnets["link"] = link;
          magnetlist[magidx] = magnets;
          magidx++;
        } catch (error) {
          continue;
        }
      }
    }
  }
  movie["magnets"] = magnetlist;

  //预览图
  var fanarts = new Array();
  var idx = 0;
  var fanartlist = dom.getElementsByClassName("sample-box");
  if (fanartlist != undefined && fanartlist.length > 0) {
    for (var i = 0; i < fanartlist.length; i++) {
      var a = fanartlist[i];
      fanarts[idx] = a.getAttribute("href");
      idx++;
    }
  }
  movie["previews"] = fanarts.join(";");



  //大图
  var bigimage = dom.getElementsByClassName("bigImage");
  if (bigimage != undefined) {
    var url = bigimage[0].getAttribute("href");
    movie["bigimage"] = url;
    if (url.indexOf("pics.javcdn.net") >= 0 || url.indexOf("images.javbus.one") >= 0) {
      movie["smallimage"] = url.replace("cover", "thumb").replace("_b", "");
    } else {
      movie["smallimage"] = url.replace("cover", "thumbs").replace("_b", "");
    }


  }

  //演员头像
  var actorimages = dom.getElementsByClassName("avatar-box");
  if (actorimages != undefined) {
    var actorimagelist = new Array();
    var actoridx = 0;
    for (var i = 0; i < actorimages.length; i++) {
      var actorimage = actorimages[i];
      var img = actorimage.children[0].children[0];
      actorimagelist[actoridx] = img.getAttribute("src");
      actoridx++;
    }
    if (actorimagelist.length > 0) {
      movie["actorimage"] = actorimagelist.join(";");
    }
  }

  // var text = "";
  // for (key in movie) {
  //   text += key + "：" + movie[key] + "<br>";
  // }

  // document.getElementById("info").innerHTML = text;
  // console.log(JSON.stringify(movie));


  var text = "";
  for (key in movie) {
    if(key=="magnets") continue;
    var value = movie[key];
    if (value.length > 0) {
      if (value.indexOf("http") >= 0) {
        if (value.split(";").length > 0) {
          var urls = value.split(";");
          var ahtml = "";
          for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            ahtml += '<a class="infoa"  href="' + url + '">' + url + '</a><br>';
          }
          var injectdiv = '<div class="info"> <span>' + key.toCHS() + '：</span>' + ahtml + '</div>';
          text += injectdiv;
        } else {
          var injectdiv = '<div class="info"> <span>' + key.toCHS() + '：</span> <a class="infoa"   href="' + value + '">' + value + '</a> </div>';
          text += injectdiv;
        }

      } else {
        var injectdiv = '<div class="info"> <span>' + key.toCHS() + '：</span> <span>' + value + '</span> </div>';
        text += injectdiv;
      }

    }
  }
  document.getElementById("info").innerHTML = text;



}




// function showimage(obj) {
//   var event = window.event || arguments.callee.caller.arguments[0];
//   var parser = new DOMParser();
//   var dom = parser.parseFromString(htmlsourcecode, 'text/html');
//   var a = obj.getAttribute("href");
//   // var img = document.getElementById("image");
//   var img = dom.getElementById("image");
//   img.setAttribute("src", a);
//   img.style.left = (mouseX(event) +10) +"px";
//   img.style.top = (mouseY(event)+20)+"px";
//   console.log(mouseX(event));
//   console.log(mouseY(event));
// }

// function hideimage() {
//   var parser = new DOMParser();
//   var dom = parser.parseFromString(htmlsourcecode, 'text/html');
//   var img = dom.getElementById("image");
//   // var img = document.getElementById("image");
//   img.setAttribute("src", "");
// }


