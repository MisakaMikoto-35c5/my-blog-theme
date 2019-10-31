/*
 * @author KelaKim
 * @copyright KelaKim
 * @license MIT
 */
(function() {
    /**
     * 获得 Canvas context
     */
    function getCanvasContext(contextType) {
        var canvas = document.createElement("CANVAS");
        canvas.height = 350;
        canvas.width = 1000;
	    if (canvas.getContext) {
            if (contextType == null) {
                contextType = '2d';
            }
            var context = canvas.getContext(contextType);
            return {
                canvas: canvas,
                context: context
            };
        }
        console.error("Can't get canvas context.");
        return null;
    }

    function getCanvasFingerprint() {
        var result = {};
        return new Promise(function(resolve, reject) {
            checkFingerprintTrusted().then(function(truested) {
                console.log("Draw start");
                result.trusted = truested;
            }).then(function() {
                if (!result.trusted) {
                    console.warn("Canvas fingerprint maybe fake.");
                }
                return getCanvasEmojiFingerprint().then(function(emoji) {
                    result.emoji = emoji;
                }).then(function() {
                    return getMagicCanvasEmojiFingerprint().then(function(magicEmoji) {
                        result.magicEmoji = magicEmoji;
                    });
                }).then(function() {
                    return getCanvasDrawFingerprint().then(function(draw) {
                        result.draw = draw;
                    });
                }).then(function() {
                    return getCanvasEnglishFingerprint().then(function(english) {
                        result.english = english;
                    });
                }).then(function() {
                    return getCanvasSpecialTextFingerprint().then(function(specialText) {
                        result.specialText = specialText;
                    });
                }).then(function() {
                    return getCanvasChineseFingerprint().then(function(chinese) {
                        result.chinese = chinese;
                    });
                }).then(function() {
                    console.log(result);
                    resolve(result);
                });
            });
        });
    }

    function sumbitFingerprint() {
        var canvas = getCanvasContext('webgl');

        var vendor = null;
        var renderer = null;
        if (canvas != null && canvas.context.getExtension != null) {
            var debugInfo = canvas.context.getExtension('WEBGL_debug_renderer_info');
            vendor = canvas.context.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            renderer = canvas.context.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }

        getCanvasFingerprint().then(function(val) {
            val.webglVendor = vendor;
            val.webglRenderer = renderer;

            var xhrObject = new XMLHttpRequest();
            xhrObject.open('POST', 'https://research.wsl.moe/research/data/canvas.php?_t=' + Date.now());
            xhrObject.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhrObject.send(arrayToUrlEncode(val));
        });
    }

    function arrayToUrlEncode(data) {
        return Object
        .keys(data)
        .map(function(value) {
            return value + '=' + encodeURIComponent(data[value]);
        })
        .join('&');
    }

    /**
     * 检查 Canvas Fingerprint 是否可以信任
     */
    function checkFingerprintTrusted() {
        return new Promise(function(resolve, reject) {
            var canvas = getCanvasContext();
    
            if (canvas == null) {
                resolve(false);
                return false;
            }
    
            var startHeight = generateRandomNumber(0, canvas.canvas.height - 1);
            var startWidth = generateRandomNumber(0, canvas.canvas.width - 1);
    
            canvas.context.fillStyle = "rgba(0, 0, 0, 255)";
            canvas.context.fillRect(startWidth, startHeight, 1, 1);
            canvas.context.fillRect(startWidth + 1, startHeight + 1, 1, 1);
    
            canvas.context.fillStyle = "rgba(255, 255, 255, 255)";
            canvas.context.fillRect(startWidth + 1, startHeight, 1, 1);
            canvas.context.fillRect(startWidth, startHeight + 1, 1, 1);
    
            var imageData = canvas.context.getImageData(startWidth, startHeight, 2, 2);
    
            for (var i = 0; i < imageData.data.length; i++) {
                var color = imageData.data[i];
                switch (i) {
                    case 0:
                    case 1:
                    case 2:
                    case 12:
                    case 13:
                    case 14:
                        if (color != 0) {
                            resolve(false);
                            return false;
                        }
                        continue;
                    default:
                        if (color != 255) {
                            resolve(false);
                            return false;
                        }
                        continue;
                }
            }
    
            resolve(true);
            return true;
        });
    }

    /**
     * 测试各种 Unicode 版本的 Emoji
     * 另外，在 Windows 设备上显示不出任何国旗，包括联合国
     * 在大部分中国产的移动设备（比如 iPhone）会显示不出台湾国旗（显示一个 ×）
     */
    function getCanvasEmojiFingerprint() {
        return new Promise(function(resolve, reject) {
            var canvas = getCanvasContext();

            if (canvas == null) {
                resolve(null);
                return null;
            }
        
            canvas.context.font = '48px sans'
            canvas.context.fillStyle = "rgba(0, 0, 0, 1)";
        
            canvas.context.fillText('🏳️‍🌈🏳🌈🇹🇼🏳️‍⚧️🇺🇳©#️⃣⛩🤷🏿‍♀️🧕🏻🦨🟠\u200b\uffff', 10, 50);

            resolve(sha512(canvas.canvas.toDataURL()));
        });
    }

    /**
     * 不同版本的不同浏览器会有不同的渲染效果
     */
    function getMagicCanvasEmojiFingerprint() {
        return new Promise(function(resolve, reject) {
            var canvas = getCanvasContext();

            if (canvas == null) {
                resolve(null);
                return null;
            }
        
            canvas.context.font = '48px sans'
            canvas.context.fillStyle = "rgba(0, 0, 0, 1)";
        
            canvas.context.fillText('💃🏿👩‍👩‍👧👩‍👧‍👧👩‍👩‍👦‍👦', 10, 50);

            resolve(sha512(canvas.canvas.toDataURL()));
        });
    }

    function getCanvasDrawFingerprint() {
        return new Promise(function(resolve, reject) {
            var canvas = getCanvasContext();
    
            if (canvas == null) {
                resolve(null);
                return null;
            }
    
            canvas.context.fillStyle = "rgb(200,0,0)";
            canvas.context.fillRect(10, 10, 55, 50);
        
            canvas.context.fillStyle = "rgba(0, 0, 200, 0.5)";
            canvas.context.fillRect(30, 30, 55, 50);
        
            canvas.context.beginPath();
            canvas.context.arc(75, 75, 50, 0, Math.PI * 2, true);
            canvas.context.stroke();
            canvas.context.fill();
        
            canvas.context.fillStyle = "rgba(0, 200, 200, 0.5)";
            canvas.context.beginPath();
            canvas.context.arc(0, 0, 50, 0, Math.PI * 2, true);
            canvas.context.stroke();
            canvas.context.fill();
        
            canvas.context.fillStyle = "rgba(200, 200, 200, 0.5)";
            canvas.context.beginPath();
            canvas.context.arc(50, 50, 50, 0, Math.PI * 2, true);
            canvas.context.stroke();
            canvas.context.fill();

            resolve(sha512(canvas.canvas.toDataURL()));
        });
    }

    function getCanvasEnglishFingerprint() {
        return getCanvasTextFingerprint('The quick fox jumps over the lazy dog.');
    }

    function getCanvasSpecialTextFingerprint() {
        return getCanvasTextFingerprint('1234567890/*-+[{|;:\'\",./<?(*&^%$#@!\`~');
    }

    function getCanvasChineseFingerprint() {
        return getCanvasTextFingerprint('の我能吞下玻璃而不伤身体；：，。？【】、“');
    }

    function getCanvasTextFingerprint(text) {
        return new Promise(function(resolve, reject) {
            var canvas = getCanvasContext();
    
            if (canvas == null) {
                resolve(null);
                return null;
            }
    
            canvas.context.fillStyle = "rgba(0, 0, 0, 0.5)";

            canvas.context.font = '48px sans';
            canvas.context.fillText(text, 5, 40);
    
            canvas.context.font = '48px serif';
            canvas.context.fillText(text, 5, 60);

            canvas.context.font = '48px mono';
            canvas.context.fillText(text, 5, 80);
    
            canvas.context.font = '48px noto sans';
            canvas.context.fillText(text, 5, 100);
    
            canvas.context.font = '48px noto sans cjk';
            canvas.context.fillText(text, 5, 120);
    
            canvas.context.font = '48px noto sans cjk sc';
            canvas.context.fillText(text, 5, 140);
    
            canvas.context.font = '48px wingdings';
            canvas.context.fillText(text, 5, 160);
    
            canvas.context.font = '48px microsoft yahei ui';
            canvas.context.fillText(text, 5, 180);
    
            canvas.context.font = '48px comic sans ms';
            canvas.context.fillText(text, 5, 200);
    
            canvas.context.font = '48px consolas';
            canvas.context.fillText(text, 5, 220);
    
            canvas.context.font = '48px mingliu_hkscs-extb';
            canvas.context.fillText(text, 5, 240);
    
            canvas.context.font = '48px emojione color';
            canvas.context.fillText(text, 5, 260);
    
            canvas.context.font = '48px 等线';
            canvas.context.fillText(text, 5, 280);
    
            canvas.context.font = '48px wingdings 2';
            canvas.context.fillText(text, 5, 300);
    
            canvas.context.font = '48px source sans';
            canvas.context.fillText(text, 5, 320);
    
            canvas.context.font = '48px arial';
            canvas.context.fillText(text, 5, 340);
    
            canvas.context.font = '48px simsun';
            canvas.context.fillText(text, 5, 360);


            resolve(sha512(canvas.canvas.toDataURL()));
        });
    }

    function generateRandomNumber(Min,Max){
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.round(Rand * Range);
        return num;
    }

    setTimeout(function() {
        sumbitFingerprint();
    }, 100);
})();