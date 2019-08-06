let url = 'https://ruienyuski.github.io/web/travel/js/travel.json';
let optionData;
let printData;
let Targetvalue;
let currentPage = 0;
let selectZone = '三民區';
let area = document.getElementById('areaId');
let list = document.querySelector('.list');
let title = document.querySelector('.title');
let btn = document.querySelector('.hot_list');
let pagination = document.querySelector('.pagination');
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



//google map
function initMap() {
    map = new google.maps.Map( googleMap, {
    zoom:10,
    center: { lat: 22.6048695,lng: 120.299119}
    });
}
function loadData (lat,lng,title) {
    let infowindow = new google.maps.InfoWindow ({
        content: title
    });

      let marker = new google.maps.Marker({
        position: {lat: parseFloat(lat), lng: parseFloat(lng)},
        title: title,
        map: map,
    });
      marker.addEventListener('click', function() {
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

// 撈取資料
xhr.open('get', url, true);
xhr.send(null);
xhr.onload = () => {
    let res = JSON.parse(xhr.responseText);
    let str = '';
    let pageCount = [];
    let selectItem = [];
    let data = [];
    optionData = res.records;
    optionData.forEach((item) => {
      selectItem.push(item.Zone);
      data.push(item);
    });

    let select = selectItem.filter((item, key, arr) => {
      return arr.indexOf(item) === key;
    })

    select.forEach((item) => {
      let option = document.createElement('option');
      option.value = item;
      option.innerText = item;
      area.appendChild(option);
    })
    let printData = () => {
      let newData = [];
      let prevPage = '';
      let nextPage = '';
      let prev = 0;
      let pageIndex = '';
      data.filter((item) => {
        if(Targetvalue === item.Zone) {
          pageCount.push(item);
          // Google Map Mark
          loadData(item.Py,item.Px,item.Picdescribe1)
        } else if (!Targetvalue && selectZone === item.Zone) {
          pageCount.push(item);
          // Google Map Mark
          loadData(item.Py,item.Px,item.Picdescribe1)
        }
      })
      pageCount.forEach((item, i) => {
        if( i % 6 === 0 ) {
          newData.push([]);
        }
        const pageNum = parseInt( i / 6 );
        newData[pageNum].push(item);
      })
      let totalPage = (newData.length) - 1;
      //呼叫所屬頁數的資料
      rePage = (currentPage) => {
        let currentPageary = newData[currentPage];
        currentPageary.forEach((item) => {
        let picture = `<p><div class ="list__li__img" style="background-image:url(${item.Picture1})"><h2>${item.Name}</h2><h4>${item.Zone}</h4><div class="list__li__img__Titlebg"></div></div></p>`
        let NameTitle = `<div class = "list__li__block"><div class="h4">${item.Name}</div></div>`;
        let opentime = `<div class = "list__li__block"><img src="images/icons_clock.png" class="list__li__block__icon"><div class ="opentime">${item.Opentime}</div></div>`
        let address = `<div class = "list__li__block"><img src="images/icons_pin.png" class="list__li__block__icon"><div class ="address">${item.Add}</div></div>`
        let tel = `<div class = "list__li__block"><img src="images/icons_phone.png" class="list__li__block__icon"><div class ="tel  ml-1">${item.Tel}</div></div>`
        if (item.Ticketinfo != "") {
          ticket = `<div class = "list__li__block mr-3"><img src="images/icons_tag.png" class="list__li__block__icon" >${item.Ticketinfo}</div>`
        } else {
            ticket = ``;
        };
        let wrap = `<div class="row text-nowrap m-0 p-0">
        <div class="col-lg-8 col-md-8 col-12 ml-1 p-0">${tel}</div>
        <div class="col-lg-3 col-md-3 col-12 m-0 p-0">${ticket}</div>
        </div>`;
        str += `<li class="list__li   col-lg-6 col-md-6 col-sm-12 col-12"><div class="bg-white pb-3">${picture}${NameTitle}${opentime}${address}${wrap}</div></li>`;
      })
        list.innerHTML = str;
      }
      rePage(currentPage);


      //頁數
      newData.forEach((item, i) => {
        pageIndex += `<li class="page-item" data-click="${i}"><a class="page-link" href="#" data-page="${i}">${i + 1}</a></li>`;
      })

      prevPage += `<li class="page-item">
      <a class="page-link" href="#" aria-label="Previous" data-page="${prev}">
          <span aria-hidden="true" data-page="${prev}">&laquo;</span>
      </a>
      </li>`;
      nextPage += `<li class="page-item">
        <a class="page-link" href="#" aria-label="Next" data-page="${totalPage}">
            <span aria-hidden="true" data-page="${totalPage}">&raquo;</span>
        </a>
        </li>`;

      pagination.innerHTML = prevPage + pageIndex + nextPage;

      let pageItem = (e) => {
          e.preventDefault();
          currentPage = e.target.dataset.page;
          str = '';
          prevPage = '';
          nextPage = '';
          rePage(currentPage);
        }
      pagination.addEventListener('click', pageItem, false);
    }
    printData();

    let selectArea = (e) => {
      Targetvalue = e.target.value;
      for(i=0;i<markers.length;i++){
        markers[i].setMap(null);
        }
       markers = [];// Map 標記清空
       infowindow = [];//資訊視窗清空
      if(!Targetvalue) {
        Targetvalue = selectZone;
      }
      str = '';
      pageCount = [];
      printData();
    }

    let btnArea = (e) => {
      Targetvalue = e.target.innerText;
      for(i=0;i<markers.length;i++){
        markers[i].setMap(null);
        }
       markers = []; // Map 標記清空
       infowindow = []; //資訊視窗清空
      str = '';
      pageCount = [];
      printData();
    }

    area.addEventListener('click', selectArea, false);
    btn.addEventListener('click', btnArea, false);
}

