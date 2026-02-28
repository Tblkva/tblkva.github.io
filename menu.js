/**
 * Загрузка и инициализация общего меню переключения калькуляторов (index / кошки / собаки).
 * Контейнер: #pets-menu-container. Требуется iconify-icon.min.js и style.css.
 */
(function () {
    var petsTabs = [
        { key: 'old', label: 'Текущий калькулятор', icon: 'mdi:calculator-variant' },
        { key: 'cats', label: 'Для кошек', icon: 'mdi:cat' },
        { key: 'dogs', label: 'Для собак', icon: 'mdi:dog' }
    ];

    function setActiveItem(screenKey) {
        var tab = petsTabs.find(function (t) { return t.key === screenKey; });
        if (!tab) return;
        var tabTextEl = document.getElementById('pets-tab-text');
        var tabIconEl = document.getElementById('pets-tab-icon');
        if (tabTextEl) tabTextEl.textContent = tab.label;
        if (tabIconEl) tabIconEl.setAttribute('icon', tab.icon);
        var items = document.querySelectorAll('.pets-tab-dropdown-item');
        items.forEach(function (item) {
            if (item.dataset.screen === screenKey) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function toggleMenu() {
        var menu = document.getElementById('pets-tab-menu');
        if (!menu) return;
        var isHidden = menu.classList.contains('hidden') || menu.style.display === 'none';
        if (isHidden) {
            menu.classList.remove('hidden');
            menu.style.display = 'block';
        } else {
            menu.classList.add('hidden');
            menu.style.display = 'none';
        }
    }

    window.initPetsMenu = function (config) {
        var container = document.getElementById('pets-menu-container');
        if (!container) return Promise.resolve();

        var currentPage = config && config.currentPage ? config.currentPage : 'old';
        var onSelect = config && config.onSelect ? config.onSelect : function () {};
        var skipFetch = config && config.skipFetch;

        function bindMenu() {
            setActiveItem(currentPage);
            var menu = document.getElementById('pets-tab-menu');
            var btn = document.getElementById('pets-tab-btn');
            var prev = document.getElementById('pets-tab-prev');
            var next = document.getElementById('pets-tab-next');

            if (btn) {
                btn.addEventListener('click', function () { toggleMenu(); });
            }
            if (prev) {
                prev.addEventListener('click', function () {
                    var idx = petsTabs.findIndex(function (t) { return t.key === currentPage; });
                    idx = (idx - 1 + petsTabs.length) % petsTabs.length;
                    var key = petsTabs[idx].key;
                    setActiveItem(key);
                    if (menu) { menu.classList.add('hidden'); menu.style.display = 'none'; }
                    onSelect(key);
                });
            }
            if (next) {
                next.addEventListener('click', function () {
                    var idx = petsTabs.findIndex(function (t) { return t.key === currentPage; });
                    idx = (idx + 1) % petsTabs.length;
                    var key = petsTabs[idx].key;
                    setActiveItem(key);
                    if (menu) { menu.classList.add('hidden'); menu.style.display = 'none'; }
                    onSelect(key);
                });
            }

            var items = document.querySelectorAll('.pets-tab-dropdown-item');
            items.forEach(function (item) {
                item.addEventListener('click', function () {
                    var key = this.dataset.screen;
                    setActiveItem(key);
                    if (menu) { menu.classList.add('hidden'); menu.style.display = 'none'; }
                    onSelect(key);
                });
            });

            document.addEventListener('click', function (e) {
                if (btn && !btn.contains(e.target) && menu && !menu.contains(e.target)) {
                    menu.classList.add('hidden');
                    menu.style.display = 'none';
                }
            });
        }

        if (skipFetch && container.children.length > 0) {
            bindMenu();
            return Promise.resolve();
        }

        return fetch('menu.html')
            .then(function (r) { return r.text(); })
            .then(function (html) {
                container.innerHTML = html;
                bindMenu();
            })
            .catch(function (err) {
                console.error('Pets menu load error:', err);
            });
    };
})();
