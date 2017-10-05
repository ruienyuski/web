let url = 'https://ruienyuski.github.io/web/travel/js/travel.json';
let optionData;
let data = [];
let selectItem = [];
let area = document.getElementById('areaId');
let list = document.querySelector('.list');
let title = document.querySelector('.title');
let btn = document.querySelector('.hot_list');
let listpage = document.querySelector('.page');
let googleMap = document.getElementById('map');
let infowindow;
let markers=[];
let currentInfoWindow = '';
let xhr = new XMLHttpRequest();

// 當有滾動的時候
window.onscroll = function() {
    // 移動的距離
    let scPos = window.pageYOffset;
    if (scPos > (window.innerHeight) / 3) {
        document.querySelector('.top').style.display = '';
    } else {
        document.querySelector('.top').style.display = 'none';
    }
};

document.querySelector('.top').addEventListener('click', function (e) {
   scrollTo(document.body, 0, 1250);   
});
    
function scrollTo(element, to, duration) {
    let start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;
        
    let animateScroll = function(){        
        currentTime += increment;
        let val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
  t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};


    function initMap() {
                map = new google.maps.Map(googleMap,{
                zoom:10,
                center: { lat: 22.6048695,lng: 120.299119}
    });
    callAjax(url);
    }
 

function loadData(lat,lng,title){
let infowindow = new google.maps.InfoWindow({
    content: title
  });
  
  let marker = new google.maps.Marker({
    position: {lat: parseFloat(lat), lng: parseFloat(lng)},
    title: title,
    map: map,
  });
  marker.addListener('click', function() {
     if(currentInfoWindow != '')   
      {    
        currentInfoWindow.close();   
        currentInfoWindow = '';   
      }   
      infowindow.open(map, marker);   
      currentInfoWindow = infowindow; 
  });
  markers.push(marker);
}



// 此次是要撈取全部的地區用
callAjax(url);

function callAjax(url) {
    let xhr;
    xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.send(null);

    xhr.onload = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let record = JSON.parse(xhr.responseText);
            optionData = record.result.records;
             len = optionData.length;
        for(let i=0;optionData.length>i;i++){
            loadData(optionData[i].Py,optionData[i].Px,optionData[i].Picdescribe1);
            }


            // 若載入的時候已經有產生選單之後就不再做
            if (selectItem.length < 1) {
                renderOption(optionData);
            }
            // 渲染內容
            // 當不是第一次載入時不做renderContent = 沒有查詢
            if (status != 0) {
                // 有觸發到下拉選單或熱門區都是第一頁開始
                renderContent(1);
            }

        };
    };
};


// load已確認 data 有資料
// 渲染下拉選單
// 判斷有哪些地區，並且重複的地區塞到selectItem內
function renderOption(option) {
    for (let i = 0; i < option.length; i++) {

        if (selectItem.indexOf(option[i].Zone) == -1) {
            selectItem.push(option[i].Zone);
           
        }
    }

    // 將selectItem內的資料渲染到option內
    for (let i = 0; i < selectItem.length; i++) {
        // 新增option作法如下
        let varItem = new Option(selectItem[i], selectItem[i]);
        area.options.add(varItem);
    }
}

// 目前頁數、總頁數、總共幾筆
let currentPage, totoalPage, totalItem;
// 一頁6筆資料
let perPage = 6;
// 渲染內容(第一次call api跟換頁功能共用方法 )
function renderContent(goPage) {

    totalItem = data.length;
    // 當沒有查詢到資料的時候
    if (totalItem == 0) {
        title.textContent = '查無資料';
        list.innerHTML = '';
        listpage.style.display = 'none';
        return false;
    }
    // 有資料的時候只要取第一筆的name即可
    title.textContent = data[0].Zone;
    // 計算總共有幾頁(使用無條件進位)
    totoalPage = Math.ceil(totalItem / perPage);


    // 起始資料index,結束資料index
    let startItem;
    let endItem;
    // 如果是最後一頁要判斷抓取幾筆資料， 其餘都一定是6筆
    if (goPage == totoalPage) {
        let minusItem = totalItem - (totoalPage * perPage);

        if (minusItem == 0) { //判斷最後一頁是幾筆用 = 0 就是6筆
            startItem = ((totoalPage - 1) * perPage);
            endItem = totalItem;
        } else { // 小於6筆
            startItem = ((totoalPage - 1) * perPage);
            endItem = totalItem;
        }
    } else {
        startItem = perPage * (goPage - 1);
        endItem = (goPage * 6);

    }
    let str = '';
    for (let i = startItem; i < endItem; i++) {
        let name = `<h2>${data[i].Name}</h2>`;
        let zone = `<h4>${data[i].Zone}</h4>`;
        let picture = `<p><div class ="picture"><img src="${data[i].Picture1}"></div></p>`
        let opentime = `<div class = "li_block"><img src="images/icons_clock.png" class="li_icon"><div class ="opentime">${data[i].Opentime}</div></div>`
        let address = `<div class = "li_block"><img src="images/icons_pin.png" class="li_icon"><div class ="address">${data[i].Add}</div></div>`
        let tel = `<div class = "li_block_left"><img src="images/icons_phone.png" class="li_icon_tel"><div class ="tel">${data[i].Tel}</div></div>`
        
      
        if (data[i].Ticketinfo != "") {
            ticket = `<div class = "li_block_right"><img src="images/icons_tag.png"class="li_icon_ticket" >${data[i].Ticketinfo}</div>`
        } else {
            ticket = "";
        };
        str += '<li>' + name + zone + picture + opentime + address + tel + ticket + '</li>';
    };
    list.innerHTML = str;
    // 紀錄目前頁數用來點選上下頁用
    currentPage = goPage;
    // 渲染頁碼
    renderPage(totoalPage);
}

// 渲染有幾頁用
function renderPage() {

    if (data.length <= 0) {
        // 沒有資料的時候不顯示筆數
        listpage.style.display = 'none';
    } else {
        listpage.style.display = '';

        // 模板
        let prevPage = `<a href="#" data-num="-1">< prev</a> &nbsp;`;
        let nexPage = ` &nbsp;<a href="#" data-num="1">next ></a>`;
        if (totoalPage > 0) {
            let nbrHtml = '';
            for (let i = 0; i < totoalPage; i++) {
                let tempNbr = '<a href="#" data-page="' + (i + 1) + '">' + (i + 1) + '</a> ';
                nbrHtml += tempNbr;
            }

            listpage.innerHTML = prevPage + nbrHtml + nexPage;
        }
    }
}

// 當下拉選單異動的時候就重新select資料
// 觸發下拉都是從第一頁開始
area.addEventListener('change', function(e) {
    let objValue = e.target.value;
    for(i=0;i<markers.length;i++){
        markers[i].setMap(null);   
        }
       markers = []; 
       infoWindows = [];
   // 載入資料
       for(let i=0;optionData.length>i;i++){
          if(optionData[i].Zone== objValue){
            loadData(optionData[i].Py,optionData[i].Px,optionData[i].Picdescribe1)
          }
        }

    // 不是選到請選擇在去做執行
    if (objValue != "") {

        // 重串url條件(jason查詢&q=三民區)
        let newurl = url + '&q=' + objValue;

        queryArea(objValue);

        renderContent(1); //從第一頁開始
    }
});
// 熱門區按鈕做偵聽
btn.addEventListener('click', function(e) {
    e.preventDefault();

    for(i=0;i<markers.length;i++){
        markers[i].setMap(null);   
        }
       markers = []; 
       infoWindows = [];
   // 載入資料
       for(let i=0;optionData.length>i;i++){
          if(optionData[i].Zone== e.target.textContent){
            loadData(optionData[i].Py,optionData[i].Px,optionData[i].Picdescribe1)
          }
        }


    // 是點選到a標籤
    if (e.target.nodeName == 'A') {
        // 重串url條件
        let newurl = url + '&q=' + e.target.textContent;
        queryArea(e.target.textContent);

        renderContent(1);
    }
});

// 重新將查詢的資料放入到新的物件
function queryArea(areaName) {
    // 清空
    data = [];
    // queryData
    for (let i = 0; i < optionData.length; i++) {
        // console.log(data[i].Zone);
        if (optionData[i].Zone == areaName) {
            data.push(optionData[i]);
        }
    }
}

// 頁次偵聽
listpage.addEventListener('click', function(e) {
    e.preventDefault();
    if (e.target.nodeName == 'A') {
        // 要前往哪一頁
        let goPage;
        let pervNext = Number(e.target.dataset.num);
        // 當有按下下一頁或上頁
        if (pervNext == -1 || pervNext == 1) {
            if (pervNext == -1) {
                if (currentPage + pervNext < 1) {
                    return false;
                }
                goPage = currentPage - 1;
            } else if (pervNext == 1) {
                if (currentPage + pervNext > totoalPage) {
                    return false;
                }
                goPage = currentPage + 1;
            }
        } else {
            goPage = Number(e.target.dataset.page);
            if (currentPage == goPage) {
                return false;
            }
        }
        renderContent(goPage);
    }
});
