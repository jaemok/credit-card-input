(function () {
    function _getcaret(input) {
        if ('selectionStart' in input) {
            // Standard-compliant browsers
            return input.selectionStart;
        } else if(document.selection) {
            input.focus();
            var sel = document.selection.createRange();
            var selLen = document.selection.createRange().text.length;
            sel.moveStart('character', -input.value.length);
            return sel.text.length - selLen;
        }
    }
    function _setcaret(input, pos) {
        if (input.setSelectionRange) {
            input.focus()
            input.setSelectionRange(pos,pos)
        } else if(input.createTextRange) {
            var range = input.createTextRange();
            range.move('character', pos);
            range.select();
        }
    }

    function _format_464 (cc) {
        return [cc.substring(0,4),cc.substring(4,10),cc.substring(10,14)].join(' ').trim()
    }
    function _format_465 (cc) {
        return [cc.substring(0,4),cc.substring(4,10),cc.substring(10,15)].join(' ').trim()
    }
    function _format_4444 (cc) {
        return cc?cc.match(/[0-9]{1,4}/g).join(' '):''
    }
    _CARD_TYPES = [
        {'type':'visa','pattern':/^4/, 'format': _format_4444, 'maxlength': 19},
        {'type':'master','pattern':/^((5[12345])|(2[2-7]))/, 'format': _format_4444, 'maxlength': 16},
        {'type':'amex','pattern':/^3[47]/, 'format': _format_465, 'maxlength':15},
        {'type':'jcb','pattern':/^35[2-8]/, 'format': _format_465, 'maxlength':19},
        {'type':'maestro','pattern':/^(5018|5020|5038|5893|6304|6759|676[123])/, 'format': _format_4444, 'maxlength':19},
        {'type':'discover','pattern':/^6[024]/, 'format': _format_4444, 'maxlength':19},
        {'type':'instapayment','pattern':/^63[789]/, 'format': _format_4444, 'maxlength':16},
        {'type':'diners_club','pattern':/^54/, 'format': _format_4444, 'maxlength':16},
        {'type':'diners_club_international','pattern':/^36/, 'format': _format_464, 'maxlength':14},
        {'type':'diners_club_carte_blanche','pattern':/^30[0-5]/, 'format': _format_464, 'maxlength':14}
    ]
    function _format_cardnumber(cc, maxlength) {
        cc = cc.replace(/[^0-9]+/g,'')

        for(var i in _CARD_TYPES) {
            const ct = _CARD_TYPES[i]
            if(cc.match(ct.pattern)) {
                cc = cc.substring(0,ct.maxlength)
                return ct.format(cc)
            }
        }

        cc = cc.substring(0,19)
        return _format_4444(cc)
    }

    function _set_creditcard_number(event) {
        const input = event.target
        const maxlength = input.getAttribute('maxlength')

        var oldval = input.value
        var caret_position = _getcaret(input)
        var before_caret = oldval.substring(0,caret_position)
        before_caret = _format_cardnumber(before_caret)
        caret_position = before_caret.length

        var newvalue = _format_cardnumber(oldval, maxlength)

        if(oldval==newvalue) return

        input.value = newvalue
        _setcaret(input, caret_position)
    }

    function make_credit_card_input(input) {
        input.addEventListener('input',_set_creditcard_number)
        input.addEventListener('keyup',_set_creditcard_number)
        input.addEventListener('keydown',_set_creditcard_number)
        input.addEventListener('keypress',_set_creditcard_number)
        input.addEventListener('change',_set_creditcard_number)
    }

    window.credit_card_input = make_credit_card_input
})()
