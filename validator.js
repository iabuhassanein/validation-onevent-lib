/*********************************************************************************************
 **
 **    Author: Ismail Abu Hassanein
 **    Author URI: http://ismail.network/
 **    Description: make html inputs as real time or on event validation
 **    Version: 1.0.5
 **    License: MS-RSL
 **    License URI: https://referencesource.microsoft.com/license.html
 **
 **********************************************************************************************/

(function () {
    let _selector = 'input.is-validator, textarea.is-validator, select.is-validator';
    let _elements = $(document).find(_selector);
    if (!_elements.length) return;

    function validation_text(role, value) {
        switch (role) {
            case 'noSpace':
                return 'يجب الا يحتوي على فراغات';
            case 'email':
                return 'يجب ان يكون بصيغة بريد الكتروني صحيح';
            case 'alpha':
                return 'يجب ان يتكون من احرف انجليزية فقط';
            case 'alphaNum':
                return 'يجب ان يتكون من احرف انجليزية و ارقام فقط';
            case 'numeric':
                return 'يجب ان يتكون من ارقام فقط';
            case 'required':
                return 'هذا الحقل مطلوب';
            case 'min':
                return 'يجب الا يقل عن ' + value + ' حروف';
            case 'max':
                return 'يجب الا يزيد عن ' + value + ' حروف';
            case 'min_num':
                return 'يجب الا يقل عن ' + value;
            case 'max_num':
                return 'يجب الا يزيد عن ' + value;
            default:
                return '';
        }
    }

    function match_role(value, role, role_val) {
        // console.log(value, role, role_val);
        switch (role) {
            case 'noSpace':
                if (value.indexOf(' ') >= 0)
                    return {type: 'noSpace'};
                return null;
            case 'email':
                let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!re.test(value))
                    return {type: 'email'};
                return null;
            case 'alpha':
                let letters = /^[A-Za-z]+$/;
                if (value.match(letters))
                    return null;
                return {type: 'alpha'};
            case 'alphaNum':
                let letterNumber = /^[0-9a-zA-Z]+$/;
                if (value.match(letterNumber))
                    return null;
                return {type: 'alphaNum'};
            case 'numeric':
                if (isNaN(value))
                    return {type: 'numeric'};
                return null;
            case 'required':
                if (value)
                    return null;
                return {type: 'required'};
            case 'min':
                if (value.length < role_val)
                    return {type: 'min', value: role_val};
                return null;
            case 'max':
                if (value.length > role_val)
                    return {type: 'max', value: role_val};
                return null;
            case 'min_num':
                if (parseInt(value) < parseInt(role_val))
                    return {type: 'min_num', value: role_val};
                return null;
            case 'max_num':
                if (parseInt(value) > parseInt(role_val))
                    return {type: 'max_num', value: role_val};
                return null;
            default:
                return null;
        }
    }

    function check_roles(str_roles, value, _elm) {
        var res =  str_roles.split("|");
        var _parent = _elm.parent();
        var BreakException = {};
        _parent.find('.help-block').remove();
        _parent.removeClass('has-error');
        try {
            res.forEach(function (elem, indx) {
                let expr = /:/;
                var result = '';
                if (elem.match(expr)) {
                    var in_role_val = elem.split(":");
                    result = match_role(value, in_role_val[0], in_role_val[1])
                } else {
                    result = match_role(value, elem, '');
                }
                if (result) {
                    _parent.addClass('has-error');
                    _parent.append('\n' +
                        '    <span class="help-block">\n' +
                        '        <strong>' + validation_text(result.type, result.value) + '</strong>\n' +
                        '    </span>');
                    throw BreakException;
                }
            });
        } catch (e) {
            // console.log('exp');
        }
    }

    _elements.each(function (index) {
        var _this = $(this);
        if (_this.data('instant')) {
            _this.change(function (e) {
                e.preventDefault();
                check_roles(_this.data('roles'), _this.val(), _this);
            });
        }else{
            _this.bind("keyup change", function (e) {
                e.preventDefault();
                var _parent = _this.parent();
                _parent.find('.help-block').remove();
                _parent.removeClass('has-error');
            });
        }
    });
    window.fire_validation = function fire_validation(_container) {
        _container.find(_selector).each(function (index) {
            var _this = $(this);
            check_roles(_this.data('roles'), _this.val(), _this);
        });
    }
    window.reset_validation = function reset_validation(_container) {
        _container.find(_selector).each(function (index) {
            var _parent = _this.parent();
            _parent.find('.help-block').remove();
            _parent.removeClass('has-error');
        });
    }
})(jQuery);