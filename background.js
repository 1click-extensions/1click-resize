chrome.runtime.setUninstallURL("https://1ce.org");

if (!localStorage.created) {
  chrome.tabs.create({ url: "https://1ce.org" });
  var manifest = chrome.runtime.getManifest();
  localStorage.ver = manifest.version;
  localStorage.created = 1;
}
 function getCustom(){
  return JSON.parse(localStorage.getItem('customSizes'));
 }
function addSize(size){
  console.log(size);
  let sizes = getCustom();
  sizes = sizes ? sizes : [];
  sizes.push({name:size +' (custom)',size:size});
  localStorage.setItem('customSizes',JSON.stringify(sizes));
}
function removeSize(size){
  console.log(size);
  let sizes = getCustom();
  sizes = sizes ? sizes : [];
  for(let i =0; i < sizes.length; i++){
    if(size == sizes[i].size){
      sizes.splice(i,1);
      break;
    }
  }
  //sizes.push({name:size +' (custom)',size:size});
  localStorage.setItem('customSizes',JSON.stringify(sizes));
}
function getDevices(){
  return [
{name: "iPhone X", size: "1125 x 2436"},
{name: "iPhone 8 Plus", size: "1080 x 1920"},
{name: "iPhone 8", size: "750 x 1334"},
{name: "iPhone 7 Plus", size: "1080 x 1920"},
{name: "iPhone 7", size: "750 x 1334"},
{name: "iPhone 6 Plus/6S Plus", size: "1080 x 1920"},
{name: "iPhone 6/6S", size: "750 x 1334"},
{name: "iPHone 5", size: "640 x 1136"},
{name: "iPod Touch", size: "640 x 1136"},
{name: "iPad Pro", size: "2048 x 2732"},
{name: "iPad Third & Fourth Generation", size: "1536 x 2048"},
{name: "iPad Air 1 & 2", size: "1536 x 2048"},
{name: "iPad Mini", size: "768 x 1024"},
{name: "iPad Mini 2 & 3", size: "1536 x 2048"},
{name: "Nexus 6P", size: "1440 x 2560"},
{name: "Nexus 5X", size: "1080 x 1920"},
{name: "Google Pixel", size: "1080 x 1920"},
{name: "Google Pixel XL", size: "1440 x 2560"},
{name: "Google Pixel 2", size: "1080 x 1920"},
{name: "Google Pixel 2 XL", size: "1440 x 2560"},
{name: "Samsung Galaxy Note 5", size: "1440 x 2560"},
{name: "LG G5", size: "1440 x 2560"},
{name: "One Plus 3", size: "1080 x 1920"},
{name: "Samsung Galaxy S9", size: "1440 x 2960"},
{name: "Samsung Galaxy S9+", size: "1440 x 2960"},
{name: "Samsung Galaxy S8", size: "1440 x 2960"},
{name: "Samsung Galaxy S8+", size: "1440 x 2960"},
{name: "Samsung Galaxy S7", size: "1440 x 2560"},
{name: "Samsung Galaxy S7 Edge", size: "1440 x 2560"},
{name: "Nexus 7 (2013)", size: "1200 x 1920"},
{name: "Nexus 9", size: "1536 x 2048"},
{name: "Samsung Galaxy Tab 10", size: "800 x 1280"},
{name: "Chromebook Pixel", size: "2560 x 1700"}
  ];
 }

 function getSizes(){
  var sizes = [
    
    {
      name : '66%',
      size :'66%'
    },
    {
      name : '100%',
      size :'100%'
    },
    {
      name : '50%',
      size :'50%'
    },
    {
      name : '33%',
      size :'33%'
    }
  ],
    sizesDevices = getDevices(),
    sizesCustom = getCustom();
  sizes = sizes.concat(sizesDevices);
  if(sizesCustom){
    sizes = sizes.concat(sizesCustom);
  }
  console.log('sizes', sizes)
  return sizes;
 }

chrome.runtime.onMessage.addListener( function(request,sender,sendResponse)
{
    if( request.action === "addSize" ){
      //console.log(request);
      addSize(request.size);
      sendResponse(true);
    }
    if( request.action === "removeSize" ){
      console.log(request);
      removeSize(request.size);
      sendResponse(true);
    }
    if( request.action === "getSizes" ){
      sendResponse(getSizes());
    }
    if( request.action === "resize" )
    {
      
      var newWidth,newHeight;
      if(/\d+\%/.test(request.size)){
        newWidth = request.size.replace('%','');
        newWidth = Math.floor(window.screen.availWidth * (newWidth/100));
      }
      else{
        let sizes = request.size.split('x');
        newWidth = sizes[0];
        newHeight = sizes[1];
      }
      var options = { 
        width: parseInt(newWidth),
        state:'normal'
      };
      if(newHeight && newHeight.trim()){
        options.height = parseInt(newHeight);
      }
      //console.log(options);
      chrome.windows.getCurrent(function(wind) {
        console.log(options);
        chrome.windows.update(wind.id,options);
        injectJsCurrentTab();
      })
      
      }
      
  });


chrome.windows.onRemoved.addListener(function(windowId){
  if(windowId == openWindowFirst){
    windowId = null;
  }
});