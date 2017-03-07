function searchOpt2no(options, no)
{
    for (var idx in options)
    {
        var option = options[idx];
        if (option.no == no) return option;
    }
}

// 클라이언트 렌더링할때 데이터 뽑아내는 모듈 가져왔음!
exports.buildChartData =  function (form, data, output) {

    var temp = {};
    var titles = {};

    function apply(arr) { output.push(arr); }
    function swap(order, arr) {
        if (!temp.hasOwnProperty(order)) temp[order] = [];
        temp[order].push(arr);
    }
    function enterTitle(order, title) { titles[order] = title; }
    function getQTitle(type, order, name)
    {
        var tmsg = "";

        switch (type)
        {
            case 1: tmsg = "(단일선택)"; break;
            case 2: tmsg = "(다중선택)"; break;
            case 3: tmsg = "(순위지정)"; break;
        }

        return order + '. ' + name + ' ' + tmsg;
    }

    // 하나의 Question - 하나의 format 데이터.
    if (form == undefined || data == undefined) return undefined;

    // 이거 formats 에 데이터를 저장함.
    // 여기에서 모든 정리를 다 합니다.
    // var formats = [];

    for (var idx in form.questions)
    {
        var question = form.questions[idx];
        var type = question.type; var order = Number(question.order) + 1; var name = question.name;
        if (type == 0) continue;

        // var format = {};

        // apply([getQTitle(type, order, name)]);
        enterTitle(order, getQTitle(type, order, name));
        // var labels = []; var datas = []; var colors = [];

        // data
        var stats = data[question.no];
        for (var i in stats)
        {
            var stat = stats[i]; // 해당 데이터
            // colors.push(getRandomColor());

            switch (question.type)
            {
                case 3: // 순위형 (객관식 여러개 선택가능 - order 로 정렬되어있음
                    var key = stat[0]; var value = stat[1];
                    var option = searchOpt2no(question.options, key);
                    // order + 1 을 해주어야 함.
                    // labels.push('#' + (Number(i) + 1) + '. ' + option.name); datas.push(value);
                    swap(order, ['#' + (Number(i) + 1) + '. ' + option.name, value]);
                    break;

                default: // 일반형 (객관식 단일, 다중선택)
                    // value :: stat!
                    var option = searchOpt2no(question.options, i);
                    swap(order, [option.name, stat]);
                    // labels.push(option.name;); datas.push(stat);
                    break;
            }
        }
    }

    var keys = Object.keys(temp);
    keys.sort();
    for (var idx in keys)
    {
        var k = Number(keys[idx]); // order number
        apply([titles[k]]);
        var d = temp[k]; for (var i in d) apply(d[i]);
        apply([""]); // 공백 삽입
    }

    // return output;
    // return formats

};