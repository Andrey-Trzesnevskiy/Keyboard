var keys = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    [{ ru: 'й', en: 'q' }, { ru: 'ц', en: 'w' }, { ru: 'у', en: 'e' },{ ru: 'к', en: 'r' },{ ru: 'е', en: 't' },
    { ru: 'н', en: 'y' },{ ru: 'г', en: 'u' },{ ru: 'ш', en: 'i' },{ ru: 'щ', en: 'o' }, { ru: 'з', en: 'p' }, { ru: 'х', en: '[' }, { ru: 'ъ', en: ']' }], 
    [{ ru: 'ф', en: 'a' }, { ru: 'ы', en: 's' }, { ru: 'в', en: 'd' },{ ru: 'а', en: 'f' }, { ru: 'п', en: 'g' },
    { ru: 'р', en: 'h' },{ ru: 'о', en: 'j' }, { ru: 'л', en: 'k' }, { ru: 'д', en: 'l' }, { ru: 'ж', en: ';' }, { ru: 'э', en: '\'' }],
    [{shift: 'shift'},{ ru: 'я', en: 'z' },{ ru: 'ч', en: 'x' },{ ru: 'с', en: 'c' },{ ru: 'м', en: 'v' }, { ru: 'и', en: 'b' },
    { ru: 'т', en: 'n' },{ ru: 'ь', en: 'm' },{ ru: 'б', en: ',' },{ ru: 'ю', en: '.' },{ ru: '.', en: '/' },{ ru: ',', en: '|'},
    { type: 'switcher' }],
    [{del: "←"},{backspace: " "}, {clearAll: "clear all"}]
];

class TransferService {
	constructor () {
		this.data = {}
	}
	setData (params) {
		this.data[params.name] = params.data;
	}
	getData (name) {
		return this.data[name];
	}
}

class Keyboard {
    constructor(options) {
        this.options = options;

        this.options.lang = this.options.lang || 'en';
        this.options.keyboardClass = this.options.keyboardClass || 'keyboard';
    }

    rerender() {                                                            
        if (document.querySelector('.' + this.options.keyboardClass)){
            document.querySelector('.' + this.options.keyboardClass).remove();
        }
        var input = document.querySelector('.input');
        this.render(input);
    }

    render(targetInput) {
     	var transferCheck = new TransferService ();                  

        var options = this.options;
        var self = this;

        if(document.querySelector('.' + options.keyboardClass)){
            return;
        }

        this.keyboard = document.createElement('div');
        var line;

        this.keyboard.classList.add(options.keyboardClass);    

        options.keys.forEach(function(row) {
            line = document.createElement('div');
            line.classList.add('row');
            row.forEach((key)=>{
    
                if(key.type) {
                    var switcher = new LangSwticher(['en','ru'], self);
                    switcher.render(line);
                } 
                else if (key.shift) {
                	new SpecialKey({
                	 	target: line,
                	 	symbol: key,
                	 	classList: 'shift-key',
                	 	key: 'shift'
                	 });
                }
                else if (key.backspace) {
                	new SpecialKey({
                		target: line,
                	 	symbol: key,
                	 	classList: 'backspace',
                	 	key: 'backspace'
                	});
                }
                else if (key.del) {
                	new SpecialKey({
                		target: line,
                	 	symbol: key,
                	 	classList: 'delete',
                	 	key: 'del'
                	});
                }
                else if (key.clearAll) {
                	new SpecialKey({
                		target: line,
                	 	symbol: key,
                	 	classList: 'clear-all',
                	 	key: 'clearAll'
                	});
                }
                else {
                    new Key({
                        target: line,
                        symbol: key,
                        lang: options.lang
                    });
                }
            });

            self.keyboard.appendChild(line);
        });

        this.keyboard.addEventListener('click', function(event) {
        	var shiftCheck;
        	shiftCheck = transferCheck.getData('shiftCheck');
        	if (transferCheck.getData('shiftCheck') === undefined) {
            		shiftCheck = false;
            	}

            if(event.target.classList.contains('key')){
            	if (!shiftCheck) {
					targetInput.value += event.target.innerHTML;
            	}
            	else {
            		targetInput.value += event.target.innerHTML.toUpperCase();
            	}  
            }

            else if (event.target.classList.contains('shift-key')) {
            	
            	if (!shiftCheck) {
            		event.target.innerHTML = event.target.innerHTML.toUpperCase();
            		transferCheck.setData({name: 'shiftCheck', data: true });
            	}
            	else {
            		event.target.innerHTML = event.target.innerHTML.toLowerCase();
            		transferCheck.setData({name: 'shiftCheck', data: false});
            	}
            }
            else if (event.target.classList.contains('backspace')) {
            	targetInput.value += " ";
            }
            else if (event.target.classList.contains('delete')) {
				var str = "";
            	for (let i=0; i<targetInput.value.length-1; i++){
                	var str = str+targetInput.value[i];
            	}
            	targetInput.value = str;
            }
            else if (event.target.classList.contains('clear-all')) {
            	targetInput.value = "";
            }

        });
        document.querySelector(options.target).appendChild(this.keyboard);
    }

    remove() {
        this.keyboard.remove();
    }
}

class LangSwticher {                            
    constructor(arr, keyboard) {
        this.arr = arr;
        this.keyboard = keyboard
    }

    render(target) {
        var switcher = document.createElement('select');
        var self = this;

        switcher.id = 'switcher';
        this.arr.forEach(function(lang){
            var option = document.createElement('option');
            option.innerHTML = lang;
            option.value = lang;
            if(self.keyboard.options.lang === lang) {
                option.selected = true;
            }
            switcher.appendChild(option);
        });

        switcher.addEventListener('change', function(event) {
            this.keyboard.options.lang = switcher.value;

            this.keyboard.rerender();
        }.bind(this));

        target.appendChild(switcher);
    }
}

class Key {
    constructor(options) {
        var key = document.createElement('div');
        key.classList.add('key');
        key.innerHTML = options.symbol[ options.lang ] || options.symbol;
        options.target.appendChild(key);
    }
}

class SpecialKey {
	constructor (options) {
		this.options = options;
		var key = document.createElement('div');
		key.classList.add(options.classList);
		key.innerHTML = options.symbol[options.key];
		options.target.appendChild(key);
	}
}

window.onload = function() {
    
    var keyboard = new Keyboard({ 
        target: '.wrapper', 
        keyboardClass: 'keyboard', 
        keys: keys,
        lang: 'en'
    });


    var input = document.querySelector('.input');

    input.addEventListener('focus', () => {
        document.removeEventListener('click', clickHandler);
        keyboard.render(input);
    });

    input.addEventListener('blur', () => {
        document.addEventListener('click', clickHandler)
    });


    function clickHandler(event) {

        if (!(event.target.classList.contains('key') || 
            event.target.classList.contains('keyboard') ||
            event.target.classList.contains('row') ||
            event.target.id == 'switcher' ||
            event.target.classList.contains('shift-key') ||
            event.target.classList.contains('backspace') ||
            event.target.classList.contains('delete') ||
            event.target.classList.contains('clear-all')
        )) {
            keyboard.remove();
        }
    }
}