class FoodManager {
    constructor() {
        this.foods = this.loadFoods();
        this.isSpinning = false;
        this.init();
    }

    init() {
        if (this.foods.length === 0) {
            this.foods = [
                { name: '米饭', description: '香喷喷的白米饭', category: '主食' },
                { name: '馒头', description: '北方风味，扎实管饱', category: '主食' },
                { name: '花卷', description: '层层叠叠的美味', category: '主食' },
                { name: '玉米', description: '粗粮细作，健康首选', category: '主食' },
                { name: '红薯', description: '香甜软糯', category: '主食' },
                { name: '面条', description: '汤面干面任你选', category: '主食' },
                { name: '西红柿炒蛋', description: '经典搭配，酸甜开胃', category: '炒菜' },
                { name: '青椒肉丝', description: '香辣下饭', category: '炒菜' },
                { name: '土豆炖牛腩', description: '软烂入味，汤汁浓郁', category: '炒菜' },
                { name: '香菇青菜', description: '清淡爽口', category: '炒菜' },
                { name: '红烧茄子', description: '软糯香甜，下饭神器', category: '炒菜' },
                { name: '鱼香肉丝', description: '酸甜微辣，经典川菜', category: '炒菜' },
                { name: '紫菜蛋花汤', description: '清淡开胃', category: '汤品' },
                { name: '冬瓜排骨汤', description: '滋补养生', category: '汤品' },
                { name: '番茄蛋汤', description: '酸甜开胃', category: '汤品' },
                { name: '玉米排骨汤', description: '汤鲜味美', category: '汤品' },
                { name: '凉拌黄瓜', description: '清脆爽口', category: '凉菜' },
                { name: '皮蛋豆腐', description: '嫩滑开胃', category: '凉菜' },
                { name: '拍黄瓜', description: '蒜香浓郁', category: '凉菜' },
                { name: '黄焖鸡', description: '汤汁浓郁，鸡肉软烂', category: '特色' },
                { name: '麻辣烫', description: '麻辣鲜香，自选配料', category: '特色' },
                { name: '麻辣香锅', description: '香辣过瘾', category: '特色' }
            ];
            this.saveFoods();
        }
        this.renderFoodList();
    }

    loadFoods() {
        const saved = localStorage.getItem('yuanWeiFoods');
        return saved ? JSON.parse(saved) : [];
    }

    saveFoods() {
        localStorage.setItem('yuanWeiFoods', JSON.stringify(this.foods));
    }

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
        if (this.foods.length === 0) {
            this.showNotification('请先添加菜品！', 'warning');
            return;
        }
        if (this.isSpinning) return;
        this.isSpinning = true;
        const foodCard = document.getElementById('foodCard');
        const foodIcon = foodCard.querySelector('.food-icon i');
        const foodName = document.getElementById('foodName');
        const foodDescription = document.getElementById('foodDescription');
        const foodCategoryBadge = document.getElementById('foodCategoryBadge');
        this.startSpinningAnimation(foodCard, foodIcon);
        let counter = 0;
        const maxCount = 25;
        const interval = setInterval(() => {
            const randomFood = this.foods[Math.floor(Math.random() * this.foods.length)];
            this.fadeOutText(foodName, foodDescription, () => {
                foodName.textContent = randomFood.name;
                foodDescription.textContent = randomFood.description;
                foodCategoryBadge.textContent = randomFood.category || '';
                foodCategoryBadge.style.display = randomFood.category ? 'inline-block' : 'none';
                this.fadeInText(foodName, foodDescription);
            });
            counter++;
            if (counter >= maxCount) {
                clearInterval(interval);
                this.stopSpinningAnimation(foodCard, foodIcon);
                const finalFood = this.foods[Math.floor(Math.random() * this.foods.length)];
                this.showFinalResult(foodName, foodDescription, foodCategoryBadge, finalFood, foodCard);
            }
        }, 80);
    }

    startSpinningAnimation(foodCard, foodIcon) {
        foodIcon.classList.add('spinning');
        foodCard.classList.add('spinning');
        foodCard.classList.remove('celebrating');
    }

    stopSpinningAnimation(foodCard, foodIcon) {
        foodIcon.classList.remove('spinning');
        foodCard.classList.remove('spinning');
    }

    fadeOutText(foodName, foodDescription, callback) {
        foodName.classList.add('fading');
        foodDescription.classList.add('fading');
        setTimeout(() => { if (callback) callback(); }, 150);
    }

    fadeInText(foodName, foodDescription) {
        foodName.classList.remove('fading');
        foodDescription.classList.remove('fading');
    }

    showFinalResult(foodName, foodDescription, foodCategoryBadge, finalFood, foodCard) {
        this.fadeOutText(foodName, foodDescription, () => {
            foodName.textContent = finalFood.name;
            foodDescription.textContent = finalFood.description;
            foodCategoryBadge.textContent = finalFood.category || '';
            foodCategoryBadge.style.display = finalFood.category ? 'inline-block' : 'none';
            this.fadeInText(foodName, foodDescription);
            this.celebrateResult(foodCard, finalFood);
        });
    }

    celebrateResult(foodCard, finalFood) {
        foodCard.classList.add('celebrating');
        this.createParticles();
        setTimeout(() => {
            this.showNotification('🎉 今天就吃：' + finalFood.name + '！', 'success');
            this.isSpinning = false;
        }, 500);
    }

    createParticles() {
        const colors = ['#FF9FB5', '#FFD6E0', '#FFC1CC', '#FFB3C1', '#F47E9A', '#FFE4E9'];
        for (let i = 0; i < 16; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = (40 + Math.random() * 20) + '%';
                particle.style.top = (30 + Math.random() * 20) + '%';
                particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                particle.style.animationDelay = (Math.random() * 0.3) + 's';
                document.body.appendChild(particle);
                setTimeout(() => { if (particle.parentNode) particle.parentNode.removeChild(particle); }, 2000);
            }, i * 60);
        }
    }

    renderFoodList() {
        const foodList = document.getElementById('foodList');
        const itemCount = document.getElementById('itemCount');
        foodList.innerHTML = '';
        itemCount.textContent = this.foods.length + ' 道菜';
        const categories = ['主食', '炒菜', '汤品', '凉菜', '特色'];
        const grouped = {};
        categories.forEach(cat => { grouped[cat] = []; });
        this.foods.forEach(food => {
            const cat = food.category || '其他';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(food);
        });
        Object.keys(grouped).forEach(category => {
            if (grouped[category].length === 0) return;
            const group = document.createElement('div');
            group.className = 'food-category-group';
            const title = document.createElement('div');
            title.className = 'food-category-title';
            title.textContent = category;
            group.appendChild(title);
            grouped[category].forEach((food) => {
                const realIndex = this.foods.indexOf(food);
                const foodItem = document.createElement('div');
                foodItem.className = 'food-item';
                foodItem.innerHTML = '<div class="food-item-info"><span class="food-item-name">' + food.name + '</span><span class="food-item-desc">' + food.description + '</span></div><div class="food-item-actions"><button class="delete-btn" title="删除"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></button></div>';
                const deleteBtn = foodItem.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', (e) => { e.stopPropagation(); this.deleteFood(realIndex); });
                group.appendChild(foodItem);
            });
            foodList.appendChild(group);
        });
        if (this.foods.length === 0) {
            const empty = document.createElement('div');
            empty.style.cssText = 'text-align:center; padding:40px 20px; color:#86868B; font-size:0.9rem;';
            empty.textContent = '还没有菜品，点击上方按钮添加吧';
            foodList.appendChild(empty);
        }
    }

    resetToDefault() {
        localStorage.removeItem('yuanWeiFoods');
        this.foods = [];
        this.init();
        this.showNotification('已恢复默认菜单！', 'success');
    }

    showNotification(message, type) {
        type = type || 'info';
        const notification = document.createElement('div');
        notification.className = 'notification notification-' + type;
        const iconMap = { success: 'check-circle', warning: 'exclamation-triangle', info: 'info-circle' };
        notification.innerHTML = '<i class="fas fa-' + (iconMap[type] || 'info-circle') + '"></i><span>' + message + '</span>';
        document.body.appendChild(notification);
        setTimeout(() => { notification.classList.add('show'); }, 100);
        setTimeout(() => { notification.classList.remove('show'); setTimeout(() => { if (notification.parentNode) notification.parentNode.removeChild(notification); }, 400); }, 2800);
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
        const overlay = this.modal.querySelector('.modal-overlay');
        overlay.addEventListener('click', () => this.closeModal());
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
        document.body.style.overflow = '';
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
    setTimeout(() => { splash.classList.add('hidden'); setTimeout(() => { if (splash.parentNode) splash.parentNode.removeChild(splash); }, 600); }, 1500);
    document.getElementById('randomBtn').addEventListener('click', () => foodManager.randomSelect());
    document.getElementById('foodCard').addEventListener('click', () => foodManager.randomSelect());
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('确定要恢复默认菜单吗？这将清除所有自定义添加的菜品。')) foodManager.resetToDefault();
    });
    document.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!modalManager.modal.classList.contains('show')) foodManager.randomSelect(); } });
    setTimeout(() => foodManager.showNotification('你好，小媛 🌸 点击卡片或按钮开始选菜', 'info'), 1800);
});