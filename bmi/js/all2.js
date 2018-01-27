// Light = total<18.5;//過輕
// Standard = 18.5<=total<24;//理想
// SWeight = 24<=total<27;//過重
// MWeight = 27<=total<30;//輕度肥胖
// LWeight  = 30<=total<35;//中度肥胖
// XLWeight = total>=35;//重度肥胖

let list = document.querySelector('.list');
let btn = document.getElementById('countId');
let result = document.querySelector('.result');
let height = document.querySelector('.height');
let weight = document.querySelector('.weight');
let data = JSON.parse(localStorage.getItem('listData')) || [];

let Today = new Date();
let date = (("0" + (Today.getMonth() + 1)).slice(-2)) + '-' + Today.getDate() + '-' + Today.getFullYear();


height.addEventListener('blur', checktext, false);
weight.addEventListener('blur', checktext, false);
btn.addEventListener('click', count, false);
list.addEventListener('click', deleteDone, false);
updateList(data);


const color = [
    { name: 'Light', bmi: 'Lightbmi', result: 'Lightword', console: '過輕', color: '#31BAF9' },
    { name: 'Standard', bmi: 'Standardbmi', result: 'Standardword', console: '理想', color: '#86D73E' },
    { name: 'SWeight', bmi: 'SWeightbmi', result: 'SWeightword', console: '過重', color: '#FF982D' },
    { name: 'MWeight', bmi: 'MWeightbmi', result: 'MWeightword', console: '輕度肥胖', color: '#FF6C02' },
    { name: 'LWeight', bmi: 'LWeightbmi', result: 'LWeightword', console: '中度肥胖', color: '#FF2D03' },
    { name: 'XLWeight', bmi: 'XLWeightbmi', result: 'XLWeightword', console: '重度肥胖', color: '#FF1200' }
];

function checktext(e) {
    let str_input = e.target.value;
    if (str_input == '') {
        // alert('此欄位不可為空');
    }
};

function count(e) {
    let H = (parseInt(height.value)).toFixed(2);
    let W = (parseInt(weight.value)).toFixed(2);
    if (H > 0 && W > 0) {
        let total = (W / ((H * 0.01) * (H * 0.01))).toFixed(2); //parseFloat顯示小數點，toFixed(num)設定小數點位數
        let len = color.length;
        let str = '';
        let list_str = '';

        for (let i = 0; i < len; i++) {
            btn.style.display = 'none';
            result.style.display = 'block';


            if (total < 18.5) {

                result.id = 'Light';

            } else if (18.5 <= total && total < 24) {

                result.id = 'Standard';

            } else if (24 <= total && total < 27) {

                result.id = 'SWeight';

            } else if (27 <= total && total < 30) {

                result.id = 'MWeight';

            } else if (30 <= total && total < 35) {

                result.id = 'LWeight';

            } else if (total >= 35) {

                result.id = 'XLWeight';

            } else {
                btn.style.display = 'block';
                result.style.display = 'none';

            };

            if (result.id == color[i].name) {

                str = `<div class="${color[i].name}" 
					style="color:${color[i].color};border:6px solid ${color[i].color};">${total}</div>
					<div class="${color[i].bmi}" style="color:${color[i].color}";>BMI</div>
					<div class="${color[i].result}" style="color:${color[i].color}";>${color[i].console}</div>
					<div class ="img" style="background:${color[i].color};border: 3px solid ${color[i].color};">
					<a href ="index.html"><img src="images/icons_loop.png"></a></div>`;
                result.innerHTML = str;

                list_str = `<ul class="list_box">
							<li class="colorline" style="background:${color[i].color}";></li>
							<li class="list_title"><h2>${color[i].console}</h2></li>
							<li class="list_text"><h4>BMI</h4><span>${total}</span></li>
							<li class="list_text"><h4>weight</h4><span>${W}</span></li>
							<li class="list_text"><h4>height</h4><span>${H}</span></li>
							<li class="list_date">${date}</li>
						</ul>`;


                let todo = {
                    content: list_str
                };
                data.push(todo);

            };
        };
        updateList(data);
        localStorage.setItem('listData', JSON.stringify(data));

    } else { alert('請填寫數字') };
};



function updateList(item) {
    let str2 = '';
    let len = item.length;
    for (let i = 0; i < len; i++) {
        str2 += `<li class="list_item" data-num= ${i}>${item[i].content}</li>`;
        console.log(str2);
    }
    list.innerHTML = str2;
}

function deleteDone(e) {
    e.preventDefault();
    let num = e.target.dataset.num;
    if (e.target.nodeName !== 'LI') {return}
    data.splice(num,1);
    localStorage.setItem('listData', JSON.stringify(data));
    updateList(data);
}