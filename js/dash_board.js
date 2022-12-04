let itemsForOrder = [];
let alacarte = [];
quantity ='';
let isInAnOrder= false;
let time=null;
let orderId = 'D-001';
let orders = [];

let tempUsers = JSON.parse(localStorage.getItem('users'));
if(tempUsers===null){
    window.location.replace('./index.html');
}

initializeItems = () => {

    alacarte.push({
        id: '1001',
        name: 'Mc Chicken',
        image: 'https://w7.pngwing.com/pngs/201/77/png-transparent-hamburger-veggie-burger-take-out-fast-food-kebab-delicious-beef-burger-burger-with-lettuce-tomato-and-cheese-food-beef-recipe.png',
        price: 500
    });
    alacarte.push({
        id: '1002',
        name: 'Big Mac (Chicken)',
        image: 'https://pngimg.com/uploads/burger_sandwich/burger_sandwich_PNG4135.png',
        price: 450
    });
    alacarte.push({
        id: '1003',
        name: 'Cheese Burger',
        image: 'https://www.pngall.com/wp-content/uploads/2016/05/Burger-Free-Download-PNG.png',
        price: 700
    });
    alacarte.push({
        id: '1004',
        name: '4ps Nuggets',
        image: 'https://www.mcdelivery.lk/lk/static/1665910229621/assets/94/products/2004.png?',
        price: 280
    });
    alacarte.push({
        id: '1005',
        name: '9ps Nuggets',
        image: 'https://www.godairyfree.org/wp-content/uploads/2020/01/mcdonalds4.jpg',
        price: 900
    });
    alacarte.push({
        id: '1006',
        name: '2 ps Wings',
        image: 'https://www.mcdonalds.com/is/image/content/dam/usa/nfl/nutrition/items/iconic/desktop/t-mcdonalds-Big-Mac.jpg',
        price: 420
    });
    alacarte.push({
        id: '1007',
        name: 'Chicken Wrap',
        image: 'https://i.insider.com/5fda25da6524f1001979254c?width=700',
        price: 820
    });
    alacarte.push({
        id: '1008',
        name: 'Beef Burger',
        image: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/mcdonalds-big-mac-is-seen-in-hong-kong-hong-kong-on-august-news-photo-1573842906.jpg?crop=0.862xw:0.575xh;0,0.425xh&resize=640:*',
        price: 900
    });
    alacarte.push({
        id: '1009',
        name: 'Big Mac (Beef)',
        image: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/mcspicy-mcdonalds-menu-new-1650538584.jpg',
        price: 450
    });
    alacarte.push({
        id: '1010',
        name: 'Spicy Bun',
        image: 'https://loveincorporated.blob.core.windows.net/contentimages/gallery/71c5d7d9-1b0f-4a15-b5cd-e037262a7b6e-mcdonalds-hash-brown-mcmuffin.jpg',
        price: 250
    });
    localStorage.setItem('alacarte', JSON.stringify(alacarte));
    generateOrderId();
    initializeOrders();

    let item =''
    alacarte.forEach(response=>{
        item +=`
    <div onclick="placeOrderItem(${response.id})" class="item">
                            <div class="item-inner" style="background-color: rgb(${getColor()})">
                                <div class="name-price">
                                    <p class="item-name">${response.name}</p>
                                    <p class="item-price">${response.price}</p>
                                </div>
                                <img src="${response.image}" alt="${response.name}">
                            </div>
                        </div>
    `;
    });
    $('.area').html(item);
};
initializeOrders=()=>{
    let ordersSet = JSON.parse(localStorage.getItem('orders'));
    if(ordersSet!=null){
        orders=ordersSet;
    }
}

const getColor = () => {
    return getRandom() + ',' + getRandom() + ',' + getRandom();
}
getRandom = () => {
    return Math.floor(Math.random() * (255));
}

//=========calculate time==========
const calculateTime=()=>{
    let min =0;
    let sec =0;
    time = setInterval(()=>{
        sec+=1;
        if(sec<10){
            $('.sec').html('0'+sec);
        }
        else{
            $('.sec').html(sec);
        }
        if(sec==60){
            sec=0;
            min+=1;
            if(min<10){
                $('.min').html('0'+min);
            }
            else{
                $('.min').html(min);
            }
        }
    },1000);
}
//=========calculate time==========

const placeOrderItem=(item)=>{
    //=========time generate=========
    if(!isInAnOrder){
        isInAnOrder=true;
        calculateTime();
    }
    //=========time generate=========
    // let tempItem = alacarte.filter(e=> e.id==item); ==> return array
    let tempItem = alacarte.find(e=> e.id==item); //==> return value
    item = {
        id: tempItem.id,
        name: tempItem.name,
        requestedQuantity: 1,
        total: tempItem.price
    }

    const exists = isAlreadyExists(tempItem.id);

    if (quantity != 0) {
        tempQuantity = Number(quantity);
        total = tempItem.price * tempQuantity;
        item['requestedQuantity'] = tempQuantity;
        item['total'] = total;
    }

    if(item.total>=5000){
        let pass = prompt("we have detected, there are some suspicious behaviors!");
        if(pass!='1234'){
            alert("Sorry! You can\'t make this order");
            return;
        }
    }

    if (exists != -1) {
        isExistsQuantity = item.requestedQuantity + itemsForOrder[exists].requestedQuantity;
        isExistsTotal = item['total'] + itemsForOrder[exists].total;
        itemsForOrder[exists] = {
            id: itemsForOrder[exists].id,
            name: itemsForOrder[exists].name,
            requestedQuantity: isExistsQuantity,
            total: isExistsTotal
        }
    } else {
        itemsForOrder.push(item);
    }

    loadOrderTableData();
}
const loadOrderTableData=()=>{
    let html ='';
    itemsForOrder.forEach(response=>{
        html+=`<tr onclick="removeItem('${response.id}')"><td>${response.name}</td>
<td>${response.requestedQuantity}</td>
<td>${response.total}</td></tr>`
    });
    $('#order-items-tbl').html(html);

    calculateTotal();
}

const isAlreadyExists = (id) => {
    for (let x = 0; x < itemsForOrder.length; x++) {
        if (itemsForOrder[x].id == id) {
            return x;
        }
    }
    return -1;
}
const manageCount=(number)=>{
    if(number==0){
        if(quantity==0){
            return;
        }
        else{
            quantity += number;
        }
    }
    else{
        quantity += number;
    }
    $('.count-txt').html(quantity);
}
const resetQuantity = () => {
    quantity = '';
    $('.count-txt').html(quantity);
}
const calculateTotal=()=>{
    let total=0;
    for(let tempTotal of itemsForOrder){
        total += tempTotal.total;
    }
    $('#process-total').html(total);
}
const removeItem=(id)=>{
    if(confirm('Are you sure to remove?')){
        for(let tempId=0; tempId<itemsForOrder.length; tempId++){
            if(id==itemsForOrder[tempId].id){
                itemsForOrder.splice(tempId,1);
                loadOrderTableData();
                return;
            }
        }
    }
}
function Order(
    id, date, takingTime, placedTime, total, presentedTime, items
) {
    this.id = id;
    this.date = date;
    this.takingTime = takingTime;
    this.placedTime = placedTime;
    this.total = total;
    this.presentedTime = presentedTime;
    this.items = items;
}
const makeOrder = () => {
    if(!isInAnOrder){
        console.log('empty');
    }
    else{
        let todayDate = new Date().toISOString().split('T')[0];
        let placedTime = new Date().toLocaleTimeString();
        let takingTime = $('.min').html() + ' : ' + $('.sec').html();
        let total = $('#process-total').html();
        let order = new Order(orderId, todayDate, takingTime, placedTime, total, '0', itemsForOrder);
        itemsForOrder = [];
        clearInterval(time);

        //==============
        setClear();
        //==============
        loadOrderTableData();
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        console.log(orders);
        generateOrderId();
        setPlacedOrdersToTable();
    }
}
const setClear = () => {
    $('#total').html('0');
    $('.min').html('00');
    $('.sec').html('00');
    resetQuantity();
    isInAnOrder=false;
}

setPlacedOrdersToTable=()=>{
    let html ='';
    orders.forEach(response=>{
        html += `
        <tr>
            <td>
                <p style="font-weight: bold; margin: 0; font-size: 10px">
                    <span>${response.id}</span>&nbsp;=>&nbsp;
                    <span>${response.total} USD</span>&nbsp;=>&nbsp;
                    <span></span>
                </p>
            </td>
        </tr>
        `;
    });
    $('#placed_orders').html(html);
}
const generateOrderId=()=>{
    let ordersSet = JSON.parse(localStorage.getItem('orders'));
    if(ordersSet!=null){
        let tempOrderId = Number(ordersSet[ordersSet.length-1].id.toString().split('-')[1]);
        let ID = tempOrderId +1;
        if(ID<9){
            orderId='D-00'+ID;
        }
        else if(ID<99){
            orderId='D-0'+ID;
        }
        else{
            orderId='D-'+ID;
        }
    }
    else{
        orderId = 'D-001';
    }
}
const viewOrders=()=>{
    let html ='';
    orders.forEach(response=>{
        html += `
        <tr onclick="loadOrderDetailsTable('${response.id}')">
            <td>${response.id}</td>
            <td>${response.date}</td>
            <td>${response.total}</td>
        </tr>
        `;
    });
    $('#orders-t-body').html(html);
    $('#ordersModelBtn').click();
}
let printData=()=>{
    //$('.main-outer').css('display','none');
    print();
}
const loadOrderDetailsTable=(id)=>{
    let tempOrder = orders.find((e)=>e.id==id);
    $('#id').html(tempOrder.id);
    $('#orderDate').html(tempOrder.date);
    $('#takingTime').html(tempOrder.takingTime);
    $('#placedTime').html(tempOrder.placedTime);
    $('#totalCost').html(tempOrder.total);
    $('#presentedTime').html(tempOrder.presentedTime);

    let dataHtml='';
    tempOrder.items.forEach(data=>{
        dataHtml+=`
        <tr>
                        <td>${data.id}</td>
                        <td>${data.name}</td>
                        <td>${data.requestedQuantity}</td>
                        <td>${data.total}</td>
                    </tr>`;
    });

    $('#order-details').html(dataHtml);
    $('#order-details-modal-button').click();
}
const loadChart=()=>{

    let dataPoints = [];
    let dataSet = [
        {date:'11/05/2022',price:200},
        {date:'11/06/2022',price:350},
        {date:'11/07/2022',price:420},
        {date:'11/08/2022',price:760},
        {date:'11/09/2022',price:220},
        {date:'11/10/2022',price:1080},
        {date:'11/11/2022',price:560},
        {date:'11/12/2022',price:2000},
        {date:'11/13/2022',price:2050},
        {date:'11/14/2022',price:1020},
        {date:'11/15/2022',price:840},
        {date:'11/16/2022',price:950},
        {date:'11/17/2022',price:640}
    ]

    let options =  {
        animationEnabled: true,
        width:1000,
        theme: "light2",
        title: {
            text: "Daily Sales Data"
        },
        axisX: {
            valueFormatString: "DD MMM YYYY",
        },
        axisY: {
            title: "USD",
            titleFontSize: 24
        },
        data: [{
            type: "spline",
            yValueFormatString: "$#,###.##",
            dataPoints: dataPoints
        }]
    };

    for (let i = 0; i < dataSet.length; i++) {
        dataPoints.push({
            x: new Date(dataSet[i].date),
            y: dataSet[i].price
        });
    }
    $("#chart").CanvasJSChart(options);


    $('#chartModelBtn').click();
}