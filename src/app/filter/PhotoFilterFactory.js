(function () {
    'use strict';
    angular.module('starter').factory('PhotoFilter', PhotoFilterFactory);

    function PhotoFilterFactory() {

        var image, texture;
        // Try Canvas
        try {
            var canvas  = fx.canvas();
            var canvas2 = fx.canvas();
        } catch (err) {
            alert(err);
            return;
        }

        var imageFilter = {
            brightness: 0,
            contrast  : 0,
            hue       : 0,
            denoise   : 20,
            saturation: 0,
            vibrance  : 0,
            radius    : 0,
            strength  : 0,
            noise     : 0,
            sepia     : 0,
            size      : 0,
            amount    : 0,
        };

        var imageFilters = [
            {
                name  : 'Normal',
                id    : 'normal',
                filter: {
                    brightness: 0,
                    contrast  : 0,
                    hue       : 0,
                    denoise   : 20,
                    saturation: 0,
                    vibrance  : 0,
                    radius    : 0,
                    strength  : 0,
                    noise     : 0,
                    sepia     : 0,
                    size      : 0,
                    amount    : 0,
                }
            },
            {
                name  : 'Claredon',
                id    : 'claredon',
                filter: {
                    brightness: 0.3,
                    contrast  : 0,
                    hue       : 0,
                    denoise   : 20,
                    saturation: 0,
                    vibrance  : 0,
                    radius    : 0,
                    strength  : 0,
                    noise     : 0,
                    sepia     : 0,
                    size      : 0,
                    amount    : 0,
                }
            },
            {
                name  : 'Gingham',
                id    : 'gingham',
                filter: {
                    brightness: 0,
                    contrast  : 0.5,
                    hue       : 0,
                    denoise   : 20,
                    saturation: 0.1,
                    vibrance  : 0.3,
                    radius    : 0,
                    strength  : 0,
                    noise     : 0,
                    sepia     : 0,
                    size      : 0,
                    amount    : 0.3,
                }
            },
            {
                name  : 'Moon',
                id    : 'moon',
                filter: {
                    brightness: 0,
                    contrast  : 0,
                    hue       : 0,
                    denoise   : 20,
                    saturation: -1,
                    vibrance  : 0,
                    radius    : 0,
                    strength  : 0,
                    noise     : 0,
                    sepia     : 0,
                    size      : 0,
                    amount    : 0.8,
                }
            },
            {
                name  : 'Lark',
                id    : 'lark',
                filter: {
                    brightness: 0,
                    contrast  : 0,
                    hue       : 0,
                    denoise   : 20,
                    saturation: 0,
                    vibrance  : -0.3,
                    radius    : 0.2,
                    strength  : 0,
                    noise     : 0,
                    sepia     : 0,
                    size      : 0,
                    amount    : 0,
                }
            },
            {
                name  : 'Reyes',
                id    : 'reyes',
                filter: {
                    brightness: 0,
                    contrast  : 0,
                    hue       : 0,
                    denoise   : 20,
                    saturation: -1,
                    vibrance  : 0,
                    radius    : 0,
                    strength  : 0,
                    noise     : 0,
                    sepia     : 0,
                    size      : 0,
                    amount    : 0,
                }
            },
            {
                name  : 'Juno',
                id    : 'juno',
                filter: {
                    brightness: 0,
                    contrast  : 0,
                    hue       : 0,
                    denoise   : 20,
                    saturation: -1,
                    vibrance  : 0,
                    radius    : 0,
                    strength  : 0,
                    noise     : 0,
                    sepia     : 0,
                    size      : 0,
                    amount    : 0,
                }
            },
            {
                name  : 'Slumber',
                id    : 'slumber',
                filter: {
                    brightness: 0,
                    contrast  : 0,
                    hue       : 0,
                    denoise   : 20,
                    saturation: -1,
                    vibrance  : 0,
                    radius    : 0,
                    strength  : 0,
                    noise     : 0,
                    sepia     : 0,
                    size      : 0,
                    amount    : 0,
                }
            },
            {
                name  : 'Crema',
                id    : 'crema',
                filter: {
                    brightness: 0,
                    contrast  : 0,
                    hue       : 0,
                    denoise   : 20,
                    saturation: -1,
                    vibrance  : 0,
                    radius    : 0,
                    strength  : 0,
                    noise     : 0,
                    sepia     : 0,
                    size      : 0,
                    amount    : 0,
                }
            }
        ];

        function init(elementId) {
            // convert the image to a texture
            image = document.getElementById(elementId);
            texture = canvas.texture(image);

            // Generate Filters Thumb
            imageFilters.map(function (imageThumb) {
                var thumbFilter = document.getElementById(imageThumb.id);
                if (thumbFilter) {
                    var img = new Image();
                    img.src = image.src;

                    console.log(img);
                    canvas2
                        .draw(canvas2.texture(img))
                        .brightnessContrast(imageThumb.filter.brightness, imageThumb.filter.contrast)
                        .hueSaturation(imageThumb.filter.hue, imageThumb.filter.saturation)
                        .vibrance(imageThumb.filter.vibrance)
                        .denoise(imageThumb.filter.denoise * 100)
                        .unsharpMask(imageThumb.filter.radius * 100, imageThumb.filter.strength)
                        .noise(imageThumb.filter.noise)
                        .sepia(imageThumb.filter.sepia)
                        .vignette(imageThumb.filter.size, imageThumb.filter.amount)
                        .update();
                    thumbFilter.src = canvas2.toDataURL('image/png');
                }

            });

            console.log(canvas);
            // replace the image with the canvas
            canvas.draw(texture).update();
            console.log(canvas);
            image.src = canvas.toDataURL('image/png');
        }

        function Filter(name, icon, func, init, update, imageFile) {
            this.name      = name;
            this.icon      = icon;
            this.func      = func;
            this.update    = update;
            this.imageFile = imageFile;
            this.slider    = {};
            this.nubs      = [];
            init.call(this);
        }

        Filter.prototype.addNub = function (name, x, y) {
            this.nubs.push({
                name: name,
                x   : x,
                y   : y
            });
        };

        Filter.prototype.addSlider = function (name, label, min, max, value, step) {
            this.slider = {
                name : name,
                label: label,
                min  : min,
                max  : max,
                value: value,
                step : step
            };
        };

        Filter.prototype.setSlider = function (slider) {
            this[slider.name] = slider.value / 100;
            this.update();
        };

        Filter.prototype.setCode = function (values) {
            imageFilter[Object.keys(values)[0]] = values[Object.keys(values)[0]];

            canvas
                .draw(texture, 0, 0)
                .brightnessContrast(imageFilter.brightness, imageFilter.contrast)
                .hueSaturation(imageFilter.hue, imageFilter.saturation)
                .vibrance(imageFilter.vibrance)
                .denoise(imageFilter.denoise * 100)
                .unsharpMask(imageFilter.radius * 100, imageFilter.strength)
                .noise(imageFilter.noise)
                .sepia(imageFilter.sepia)
                .vignette(imageFilter.size, imageFilter.amount)
                .update();

            image.src = canvas.toDataURL('image/png');
        };

        var perspectiveNubs = [175, 156, 496, 55, 161, 279, 504, 330];
        var filters         = {
            'Adjust': [
                new Filter('Brightness', 'ion-ios-sunny-outline', 'brightnessContrast', function () {
                    this.addSlider('brightness', 'Brightness', -100, 100, 0, 0.1);
                }, function () {
                    this.setCode({
                        brightness: this.brightness
                    });
                }),
                new Filter('Contrast', 'ion-contrast', 'brightnessContrast', function () {
                    this.addSlider('contrast', 'Contrast', -100, 100, 0, 0.1);
                }, function () {
                    this.setCode({
                        contrast: this.contrast,
                    });
                }),
                new Filter('Hue', 'ion-ios-color-filter-outline', 'hueSaturation', function () {
                    this.addSlider('hue', 'Hue', -100, 100, 0, 0.1);
                }, function () {
                    this.setCode({
                        hue: this.hue
                    });
                }),
                new Filter('Saturation', 'ion-ios-partlysunny-outline', 'hueSaturation', function () {
                    this.addSlider('saturation', 'Saturation', -100, 100, 0, 0.1);
                }, function () {
                    this.setCode({
                        saturation: this.saturation,
                    });
                }),
                new Filter('Vibrance', 'ion-ios-flower-outline', 'vibrance', function () {
                    this.addSlider('amount', 'Amount', -100, 100, 0.5, 0.1);
                }, function () {
                    this.setCode({
                        vibrance: this.amount
                    });
                }),
                new Filter('Denoise', 'ion-ios-eye-outline', 'denoise', function () {
                    this.addSlider('exponent', 'Exponent', 0, 50, 20, 1);
                }, function () {
                    this.setCode({
                        denoise: this.exponent
                    });
                }),
                //new Filter('Unsharp Mask', 'ion-ios-rose-outline', 'unsharpMask', function () {
                //    this.addSlider('radius', 'Radius', 0, 200, 0, 0.1);
                //    this.addSlider('strength', 'Strength', 0, 50, 0, 0.01);
                //}, function () {
                //    //this.setCode('canvas.draw(texture).unsharpMask(' + this.radius + ', ' + this.strength + ').update();');
                //    this.setCode({
                //        radius  : this.radius,
                //        strength: this.strength,
                //    });
                //}),
                new Filter('Noise', 'ion-ios-analytics-outline', 'noise', function () {
                    this.addSlider('amount', 'Amount', 0, 100, 5, 1);
                }, function () {
                    this.setCode({
                        noise: this.amount,
                    });
                }),
                new Filter('Sepia', 'ion-ios-partlysunny-outline', 'sepia', function () {
                    this.addSlider('amount', 'Amount', 0, 100, 0, 1);
                }, function () {
                    this.setCode({
                        sepia: this.amount,
                    });
                }),
                //new Filter('Vignette Size', 'ion-ios-glasses-outline', 'vignette', function () {
                //    this.addSlider('size', 'Size', 0, 100, 0, 1);
                //}, function () {
                //    this.setCode({
                //        amount: this.amount,
                //    });
                //}),
                new Filter('Vignette', 'ion-ios-glasses-outline', 'vignette', function () {
                    this.addSlider('amount', 'Amount', 0, 100, 0, 1);
                }, function () {
                    this.setCode({
                        amount: this.amount,
                    });
                })
            ],
            //'Blur'  : [
            //    new Filter('Zoom Blur', 'zoomBlur', function () {
            //        this.addNub('center', 0.5, 0.5);
            //        this.addSlider('strength', 'Strength', 0, 1, 0.3, 0.01);
            //    }, function () {
            //        this.setCode('canvas.draw(texture).zoomBlur(' + this.center.x + ', ' + this.center.y + ', ' + this.strength + ').update();');
            //    }),
            //    new Filter('Triangle Blur', 'triangleBlur', function () {
            //        this.addSlider('radius', 'Radius', 0, 200, 50, 1);
            //    }, function () {
            //        this.setCode('canvas.draw(texture).triangleBlur(' + this.radius + ').update();');
            //    }),
            //    new Filter('Tilt Shift', 'tiltShift', function () {
            //        this.addNub('start', 0.15, 0.75);
            //        this.addNub('end', 0.75, 0.6);
            //        this.addSlider('blurRadius', 'Blur Radius', 0, 50, 15, 1);
            //        this.addSlider('gradientRadius', 'Gradient Radius', 0, 400, 200, 1);
            //    }, function () {
            //        this.setCode('canvas.draw(texture).tiltShift(' + this.start.x + ', ' + this.start.y + ', ' + this.end.x + ', ' + this.end.y + ', ' + this.blurRadius + ', ' + this.gradientRadius + ').update();');
            //    }),
            //    new Filter('Lens Blur', 'lensBlur', function () {
            //        this.addSlider('radius', 'Radius', 0, 50, 10, 1);
            //        this.addSlider('brightness', 'Brightness', -1, 1, 0.75, 0.01);
            //        this.addSlider('angle', 'Angle', -Math.PI, Math.PI, 0, 0.01);
            //    }, function () {
            //        this.setCode('canvas.draw(texture).lensBlur(' + this.radius + ', ' + this.brightness + ', ' + this.angle + ').update();');
            //    }, 'lighthouse.jpg')
            //],
            //'Warp'  : [
            //    new Filter('Swirl', 'swirl', function () {
            //        this.addNub('center', 0.5, 0.5);
            //        this.addSlider('angle', 'Angle', -25, 25, 3, 0.1);
            //        this.addSlider('radius', 'Radius', 0, 600, 200, 1);
            //    }, function () {
            //        this.setCode('canvas.draw(texture).swirl(' + this.center.x + ', ' + this.center.y + ', ' + this.radius + ', ' + this.angle + ').update();');
            //    }),
            //    new Filter('Bulge / Pinch', 'bulgePinch', function () {
            //        this.addNub('center', 0.5, 0.5);
            //        this.addSlider('strength', 'Strength', -1, 1, 0.5, 0.01);
            //        this.addSlider('radius', 'Radius', 0, 600, 200, 1);
            //    }, function () {
            //        this.setCode('canvas.draw(texture).bulgePinch(' + this.center.x + ', ' + this.center.y + ', ' + this.radius + ', ' + this.strength + ').update();');
            //    }),
            //    new Filter('Perspective', 'perspective', function () {
            //        var w = 640, h = 425;
            //        this.addNub('a', perspectiveNubs[0] / w, perspectiveNubs[1] / h);
            //        this.addNub('b', perspectiveNubs[2] / w, perspectiveNubs[3] / h);
            //        this.addNub('c', perspectiveNubs[4] / w, perspectiveNubs[5] / h);
            //        this.addNub('d', perspectiveNubs[6] / w, perspectiveNubs[7] / h);
            //    }, function () {
            //        var before = perspectiveNubs;
            //        var after  = [this.a.x, this.a.y, this.b.x, this.b.y, this.c.x, this.c.y, this.d.x, this.d.y];
            //        this.setCode('canvas.draw(texture).perspective([' + before + '], [' + after + ']).update();');
            //    }, 'perspective.jpg')
            //],
            //'Fun'   : [
            //    new Filter('Ink', 'ink', function () {
            //        this.addSlider('strength', 'Strength', 0, 1, 0.25, 0.01);
            //    }, function () {
            //        this.setCode('canvas.draw(texture).ink(' + this.strength + ').update();');
            //    }),
            //    new Filter('Edge Work', 'edgeWork', function () {
            //        this.addSlider('radius', 'Radius', 0, 200, 10, 1);
            //    }, function () {
            //        this.setCode('canvas.draw(texture).edgeWork(' + this.radius + ').update();');
            //    }),
            //    new Filter('Hexagonal Pixelate', 'hexagonalPixelate', function () {
            //        this.addNub('center', 0.5, 0.5);
            //        this.addSlider('scale', 'Scale', 10, 100, 20, 1);
            //    }, function () {
            //        this.setCode('canvas.draw(texture).hexagonalPixelate(' + this.center.x + ', ' + this.center.y + ', ' + this.scale + ').update();');
            //    }),
            //    new Filter('Dot Screen', 'dotScreen', function () {
            //        this.addNub('center', 0.5, 0.5);
            //        this.addSlider('angle', 'Angle', 0, Math.PI / 2, 1.1, 0.01);
            //        this.addSlider('size', 'Size', 3, 20, 3, 0.01);
            //    }, function () {
            //        this.setCode('canvas.draw(texture).dotScreen(' + this.center.x + ', ' + this.center.y + ', ' + this.angle + ', ' + this.size + ').update();');
            //    }),
            //    new Filter('Color Halftone', 'colorHalftone', function () {
            //        this.addNub('center', 0.5, 0.5);
            //        this.addSlider('angle', 'Angle', 0, Math.PI / 2, 0.25, 0.01);
            //        this.addSlider('size', 'Size', 3, 20, 4, 0.01);
            //    }, function () {
            //        this.setCode('canvas.draw(texture).colorHalftone(' + this.center.x + ', ' + this.center.y + ', ' + this.angle + ', ' + this.size + ').update();');
            //    })
            //]
        };

        function apply(filters) {
            imageFilter = filters;
            canvas
                .draw(texture)
                .brightnessContrast(imageFilter.brightness, imageFilter.contrast)
                .hueSaturation(imageFilter.hue, imageFilter.saturation)
                .vibrance(imageFilter.vibrance)
                .denoise(imageFilter.denoise * 100)
                .unsharpMask(imageFilter.radius * 100, imageFilter.strength)
                .noise(imageFilter.noise)
                .sepia(imageFilter.sepia)
                .vignette(imageFilter.size, imageFilter.amount)
                .update();

            image.src = canvas.toDataURL('image/png');
        }

        function reset() {

            _.map(filters.Adjust, function (filter) {
                filter.slider.value = 0;
                filter.setSlider(filter.slider);
            });

            imageFilter = {
                brightness: 0,
                contrast  : 0,
                hue       : 0,
                denoise   : 20,
                saturation: 0,
                vibrance  : 0,
                radius    : 0,
                strength  : 0,
                noise     : 0,
                sepia     : 0,
                size      : 0,
                amount    : 0,
            };
            canvas
                .draw(texture)
                .brightnessContrast(imageFilter.brightness, imageFilter.contrast)
                .hueSaturation(imageFilter.hue, imageFilter.saturation)
                .vibrance(imageFilter.vibrance)
                .denoise(imageFilter.denoise * 100)
                .unsharpMask(imageFilter.radius * 100, imageFilter.strength)
                .noise(imageFilter.noise)
                .sepia(imageFilter.sepia)
                .vignette(imageFilter.size, imageFilter.amount)
                .update();

            image.src = canvas.toDataURL('image/png');
        }


        return {
            filters     : filters,
            imageFilters: imageFilters,
            init        : init,
            reset       : reset,
            apply       : apply,
        };


    }

})();