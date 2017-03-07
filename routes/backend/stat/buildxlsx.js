const builder = require('./bc_client');
const async = require('async');
const XLSX = require('xlsx');
// const xlsx = require('node-xlsx');
/*
* 이게... 우선은 이걸로 했는데,
* 파생된 모듈이 굉장히 많은듯. 우선은 이걸로 했음.
* */
// https://github.com/felixge/node-dateformat
const dateformat = require('dateformat');
const fs = require('fs');

function getTime() {
    return dateformat(new Date(), "yyyy-mm-dd hh:MM:ss TT")
}

/* TODO: date1904 logic */
function datenum(v, date1904) {
    if(date1904) v+=1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

/* convert an array of arrays in JS to a CSF spreadsheet */
function sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
    for(var R = 0; R != data.length; ++R) {
        for(var C = 0; C != data[R].length; ++C) {
            if(range.s.r > R) range.s.r = R;
            if(range.s.c > C) range.s.c = C;
            if(range.e.r < R) range.e.r = R;
            if(range.e.c < C) range.e.c = C;
            var cell = {v: data[R][C] };
            if(cell.v == null) continue;
            var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

            /* TEST: proper cell types and value handling */
            if(typeof cell.v === 'number') cell.t = 'n';
            else if(typeof cell.v === 'boolean') cell.t = 'b';
            else if(cell.v instanceof Date) {
                cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            }
            else cell.t = 's';
            ws[cell_ref] = cell;
        }
    }

    /* TEST: proper range */
    if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}

function Workbook() {
    if(!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}


function buildSheetData(workbook, ws_name, data, wscols)
{
    var ws = sheet_from_array_of_arrays(data);
    workbook.SheetNames.push(ws_name);
    workbook.Sheets[ws_name] = ws;
    if (wscols !== undefined) ws['!cols'] = wscols;
}

// wscols example :: wscols = [ {wch:30}, {wch:30}, ... ];

// user_id : 데이터 저장한 사람. (설문지 만든 사람 아님!!)
// https://github.com/SheetJS/js-xlsx/blob/master/tests/write.js
exports.buildXLSXFile = function (callback, user_id, stat, form, filter_year, filter_grade)
{
    var ts = new Date() / 1000;
    var path = process.cwd() + '/public/downloads/' + form.title + '_' +
        user_id + '_' + ts + '.xlsx';

    var task = [
        function (cb) {
            var data = [];
            function apply(arr) { data.push(arr); }

            // 컬럼 공백 설정
            var wscols_intro = [
                {wch:15},
                {wch:30},
                {wch:5},
                {wch:60}
            ];

            var wscols_data = [
                {wch:30},
                {wch:10}
            ];

            // workboot 안에 worksheet 가 들어있는 형태임.
            var wb = new Workbook(); // workbook
            builder.buildChartData(form, stat, data); // data - call by reference!
            buildSheetData(wb, "설문 데이터", data, wscols_data); data = []; // reset

            // 파일 정보 데이터
            apply(['설문지명', form.title, '', "고려대학교 세종캠퍼스 온라인 학생설문시스템에서 만들어진 파일입니다."]);
            apply(['작성자', user_id]);
            apply(['파일 출력일', getTime(), '', "설문 데이터 열람은 좌측 하단의 '설문 데이터' 탭을 선택하세요."]);
            apply(['학년 필터', filter_grade === undefined ? "없음" : filter_grade]);
            apply(['학번 필터', filter_year === undefined ? "없음" : filter_year]);
            buildSheetData(wb, "파일 정보", data, wscols_intro); data = []; // reset


            // 최종 파일 만들기
            // 이게 파일 쓰기가 실패했을때 핸들러가 없는게 문제..
            // 해결함. sync 파일 exist 확인하여 true false 반환한다.
            // TODO :: 블럭킹 작업이라 많이하면 서버 느려짐. (하드 껏을 경우.) 추후 sync 가능하도록 교체. (또한 바이너리 return 직접 전송)
            XLSX.writeFile(wb, path);

            if (fs.existsSync(path)) cb(null);
            else cb(1); // not null
        }
    ];

    async.waterfall(task, function (err) {
        if (err) callback(false);
        else callback(true, path);
    });
};