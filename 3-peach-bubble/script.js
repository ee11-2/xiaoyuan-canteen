class FoodManager {
    constructor() {
        this.foods = this.loadFoods();
        this.isSpinning = false;
        this.init();
    }

    init() {
        if (this.foods.length === 0) {
            this.foods = [
                { name: '米饭', description: '香喷喷的白米饭，主食之王', category: '主食' },
                { name: '馒头', description: '松软可口，北方经典主食', category: '主食' },
                { name: '花卷', description: '层层叠叠，香甜松软', category: '主食' },
                { name: '玉米', description: '粗粮之王，健康美味', category: '主食' },
                { name: '红薯', description: '香甜软糯，营养丰富', category: '主食' },
                { name: '面条', description: '筋道爽滑，汤浓味美', category: '主食' },
                { name: '西红柿炒蛋', description: '酸甜开胃，下饭神器', category: '炒菜' },
                { name: '青椒肉丝', description: '青椒爽脆，肉丝滑嫩', category: '炒菜' },
                { name: '土豆炖牛腩', description: '软烂入味，汤汁浓郁', category: '炒菜' },
                { name: '香菇青菜', description: '清淡爽口，营养健康', category: '炒菜' },
                { name: '红烧茄子', description: '软糯香甜，下饭神器', category: '炒菜' },
                { name: '鱼香肉丝', description: '酸甜微辣，经典川菜', category: '炒菜' },
                { name: '紫菜蛋花汤', description: '清淡鲜美，营养丰富', category: '汤品' },
                { name: '冬瓜排骨汤', description: '清热解暑，汤鲜肉嫩', category: '汤品' },
                { name: '番茄蛋汤', description: '酸甜开胃，简单美味', category: '汤品' },
                { name: '玉米排骨汤', description: '清甜滋补，营养满分', category: '汤品' },
                { name: '凉拌黄瓜', description: '清脆爽口，开胃解腻', category: '凉菜' },
                { name: '皮蛋豆腐', description: '嫩滑清爽，夏日必备', category: '凉菜' },
                { name: '拍黄瓜', description: '蒜香浓郁，酸辣开胃', category: '凉菜' },
                { name: '黄焖鸡', description: '汤汁浓郁，鸡肉软烂', category: '特色' },
                { name: '麻辣烫', description: '麻辣鲜香，自选配料', category: '特色' },
                { name: '麻辣香锅', description: '香辣过瘾，香气四溢', category: '特色' }
            ];
            this.saveFoods();
        }
        this.renderFoodList();
    }

    loadFoods() {
        const saved = localStorage.getItem('randomFoods');
        return saved ? JSON.parse(saved) : [];
    }

    saveFoods() { localStorage.setItem('randomFoods', JSON.stringify(this.foods)); }

    addFood(food) {
        this.foods.push(food);
        this.saveFoods();
        this.renderFoodList();
        this.showNotification('菜品添加成功！', 'success');
    }

    deleteFood(index) {
        const deletedFood = this.foods[index];
        this.foods.splice(index, 1);
        this.saveFoods();
        this.renderFoodList();
        this.showNotification('已删除：' + deletedFood.name, 'info');
    }

    randomSelect() {
        if (this.foods.length === 0) { this.showNotification('请先添加一些菜品！', 'warning'); return; }
        if (this.isSpinning) return;
        this.isSpinning = true;
        const foodCard = document.getElementById('foodCard');
        const foodIcon = foodCard.querySelector('.food-icon i');
        const foodName = document.getElementById('foodName');
        const foodDescription = document.getElementById('foodDescription');
        this.startSpinningAnimation(foodCard, foodIcon);
        let counter = 0;
        const maxCount = 25;
        const interval = setInterval(() => {
            const randomFood = this.foods[Math.floor(Math.random() * this.foods.length)];
            this.fadeOutText(foodName, foodDescription, () => {
                foodName.textContent = randomFood.name;
                foodDescription.textContent = randomFood.description;
                this.fadeInText(foodName, foodDescription);
            });
            counter++;
            if (counter >= maxCount) {
                clearInterval(interval);
                this.stopSpinningAnimation(foodCard, foodIcon);
                const finalFood = this.foods[Math.floor(Math.random() * this.foods.length)];
                this.showFinalResult(foodName, foodDescription, finalFood, foodCard);
            }
        }, 80);
    }

    startSpinningAnimation(foodCard, foodIcon) {
        foodIcon.classList.add('spinning');
        foodCard.style.transform = 'scale(0.95) rotate(2deg)';
        foodCard.style.boxShadow = '0 30px 60px rgba(255, 20, 147, 0.25)';
        foodCard.style.animation = 'cardPulse 0.6s ease-in-out infinite';
    }

    stopSpinningAnimation(foodCard, foodIcon) {
        foodIcon.classList.remove('spinning');
        foodCard.style.animation = 'none';
        foodCard.style.transform = 'scale(1) rotate(0deg)';
        foodCard.style.boxShadow = '';
    }

    fadeOutText(foodName, foodDescription, callback) {
        foodName.style.opacity = '0';
        foodDescription.style.opacity = '0';
        foodName.style.transform = 'translateY(-10px)';
        foodDescription.style.transform = 'translateY(-10px)';
        setTimeout(() => { if (callback) callback(); }, 150);
    }

    fadeInText(foodName, foodDescription) {
        foodName.style.opacity = '1';
        foodDescription.style.opacity = '1';
        foodName.style.transform = 'translateY(0)';
        foodDescription.style.transform = 'translateY(0)';
    }

    showFinalResult(foodName, foodDescription, finalFood, foodCard) {
        this.fadeOutText(foodName, foodDescription, () => {
            foodName.textContent = finalFood.name;
            foodDescription.textContent = finalFood.description;
            this.fadeInText(foodName, foodDescription);
            this.celebrateResult(foodCard, finalFood);
        });
    }

    celebrateResult(foodCard, finalFood) {
        foodCard.style.animation = 'celebrateCard 1s ease-out';
        this.createParticles();
        const foodIcon = foodCard.querySelector('.food-icon i');
        foodIcon.style.animation = 'iconBounce 0.8s ease-out';
        setTimeout(() => { this.showNotification('🍑 今天吃：' + finalFood.name + '！', 'success'); this.isSpinning = false; }, 500);
    }

    createParticles() {
        const colors = ['#FF69B4', '#FF1493', '#FFB6C1', '#FFDAB9', '#DDA0DD', '#FF69B4'];
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                particle.style.animationDelay = Math.random() * 0.5 + 's';
                document.body.appendChild(particle);
                setTimeout(() => { if (particle.parentNode) particle.parentNode.removeChild(particle); }, 2000);
            }, i * 50);
        }
    }

    renderFoodList() {
        const foodList = document.getElementById('foodList');
        foodList.innerHTML = '';
        this.foods.forEach((food, index) => {
            const foodItem = document.createElement('div');
            foodItem.className = 'food-item';
            foodItem.innerHTML = '<div class="food-item-header"><span class="food-item-name">' + food.name + '</span>' + (food.category ? '<span class="food-item-category">' + food.category + '</span>' : '') + '</div><p class="food-item-description">' + food.description + '</p><button class="delete-btn" onclick="foodManager.deleteFood(' + index + ')" title="删除"><i class="fas fa-times"></i></button>';
            foodList.appendChild(foodItem);
        });
    }

    resetToDefault() {
        localStorage.removeItem('randomFoods');
        this.foods = [];
        this.init();
        this.showNotification('已重置为默认菜单列表！', 'success');
    }

    showNotification(message, type) {
        type = type || 'info';
        const notification = document.createElement('div');
        notification.className = 'notification notification-' + type;
        notification.innerHTML = '<i class="fas fa-' + (type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle') + '"></i><span>' + message + '</span>';
        document.body.appendChild(notification);
        setTimeout(() => { notification.classList.add('show'); }, 100);
        setTimeout(() => { notification.classList.remove('show'); setTimeout(() => { document.body.removeChild(notification); }, 300); }, 3000);
    }
}

class ModalManager {
    constructor() {
        this.modal = document.getElementById('addFoodModal');
        this.init();
    }

    init() {
        document.getElementById('addFoodBtn').addEventListener('click', () => this.openModal());
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelAdd').addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => { if (e.target === this.modal) this.closeModal(); });
        document.getElementById('confirmAdd').addEventListener('click', () => this.addFood());
        document.getElementById('foodNameInput').addEventListener('keypress', (e) => { if (e.key === 'Enter') this.addFood(); });
    }

    openModal() {
        this.modal.classList.add('show');
        document.getElementById('foodNameInput').focus();
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('show');
        this.clearForm();
        document.body.style.overflow = 'auto';
    }

    clearForm() {
        document.getElementById('foodNameInput').value = '';
        document.getElementById('foodDescriptionInput').value = '';
        document.getElementById('foodCategoryInput').value = '';
    }

    addFood() {
        const name = document.getElementById('foodNameInput').value.trim();
        const description = document.getElementById('foodDescriptionInput').value.trim();
        const category = document.getElementById('foodCategoryInput').value;
        if (!name) { foodManager.showNotification('请输入菜品名称！', 'warning'); return; }
        foodManager.addFood({ name: name, description: description || '美味可口，值得一试', category: category || '' });
        this.closeModal();
    }
}

let foodManager;
let modalManager;

document.addEventListener('DOMContentLoaded', () => {
    foodManager = new FoodManager();
    modalManager = new ModalManager();
    const splash = document.getElementById('welcomeSplash');
    const splashBtn = document.getElementById('splashBtn');
    const dismissSplash = () => {
        splash.classList.add('hidden');
        setTimeout(() => { if (splash.parentNode) splash.parentNode.removeChild(splash); }, 800);
        createBubbles();
    };
    splashBtn.addEventListener('click', dismissSplash);
    const bgBubbles = document.getElementById('bgBubbles');
    const bubbleCount = 15;
    function createBubbles() {
        for (let i = 0; i < bubbleCount; i++) {
            setTimeout(() => {
                const bubble = document.createElement('span');
                const size = Math.random() * 60 + 20;
                bubble.style.width = size + 'px';
                bubble.style.height = size + 'px';
                bubble.style.left = Math.random() * 100 + '%';
                bubble.style.animationDuration = (Math.random() * 10 + 8) + 's';
                bubble.style.animationDelay = Math.random() * 2 + 's';
                bgBubbles.appendChild(bubble);
            }, i * 200);
        }
    }
    const style = document.createElement('style');
    style.textContent = '.notification { position: fixed; top: 20px; right: 20px; background: white; padding: 15px 20px; border-radius: 15px; box-shadow: 0 10px 30px rgba(255, 20, 147, 0.25); display: flex; align-items: center; gap: 10px; z-index: 10000; transform: translateX(400px); transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); max-width: 300px; border: 2px solid rgba(255, 105, 180, 0.2); } .notification.show { transform: translateX(0); } .notification-success { border-left: 4px solid #FF1493; } .notification-warning { border-left: 4px solid #FFB347; } .notification-info { border-left: 4px solid #DDA0DD; } .notification i { font-size: 1.2rem; } .notification-success i { color: #FF1493; } .notification-warning i { color: #FFB347; } .notification-info i { color: #DDA0DD; }';
    document.head.appendChild(style);
    setTimeout(() => foodManager.showNotification('🍑 欢迎来到小媛的食堂！点击卡片或按钮开始选菜', 'info'), 2500);
});

document.addEventListener('DOMContentLoaded', () => {
    const foodCard = document.getElementById('foodCard');
    foodCard.addEventListener('mousemove', (e) => {
        if (!foodManager.isSpinning) {
            const rect = foodCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = (y - rect.height / 2) / 10;
            const rotateY = (rect.width / 2 - x) / 10;
            foodCard.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';
        }
    });
    foodCard.addEventListener('mouseleave', () => { if (!foodManager.isSpinning) foodCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'; });
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
    document.getElementById('foodList').addEventListener('mouseover', (e) => { if (e.target.closest('.food-item')) e.target.closest('.food-item').style.transform = 'translateY(-5px) scale(1.02)'; });
    document.getElementById('foodList').addEventListener('mouseout', (e) => { if (e.target.closest('.food-item')) e.target.closest('.food-item').style.transform = 'translateY(0) scale(1)'; });
});