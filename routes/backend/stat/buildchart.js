const async = require('async');
const XLSX = require('xlsx');
// const xlsx = require('node-xlsx');
// https://github.com/felixge/node-dateformat
const dateformat = require('dateformat');
const fs = require('fs');

function getTime() {
    return dateformat(new Date(), "yyyy-mm-dd hh:MM:ss TT")
}

// user_id : 데이터 저장한 사람. (설문지 만든 사람 아님!!)
exports.buildXLSXFile = function (callback, user_id, stat, form, filter_year, filter_grade)
{
    var data = [];
    function apply(arr) { data.push(arr); }

    var ts = new Date() / 1000;
    var path = process.cwd() + '/public/downloads/' + form.title + '_' +
        user_id + '_' + ts + '.xlsx';

    apply(['설문지명', '작성자', '파일 출력일', '학년 필터', '학번 필터']);
    apply([form.title, user_id, getTime(),
        filter_grade === undefined ? "없음" : filter_grade,
        filter_year === undefined ? "없음" : filter_year
    ]);

    var ws_name = "SheetJS";

    var wscols = [
        {wch:30},
        {wch:30},
        {wch:30},
        {wch:30},
        {wch:30},
        {wch:30},
        {wch:30},
        {wch:30}
    ];

    // console.log("Sheet Name: " + ws_name);
    // console.log("Data: "); for(var i=0; i!=data.length; ++i) console.log(data[i]);
    // console.log("Columns :"); for(i=0; i!=wscols.length;++i) console.log(wscols[i]);


    // /* require XLSX */
    // if(typeof XLSX === "undefined") { try { XLSX = require('./'); } catch(e) { XLSX = require('../'); } }

    /* dummy workbook constructor */
    function Workbook() {
        if(!(this instanceof Workbook)) return new Workbook();
        this.SheetNames = [];
        this.Sheets = {};
    }
    var wb = new Workbook();


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
    var ws = sheet_from_array_of_arrays(data);

    /* TEST: add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    /* TEST: column widths */
    ws['!cols'] = wscols;

    XLSX.writeFile(wb, path);

    //
    //
    // var buffer = xlsx. build([{name : '설문지', data : data}]);
    // fs.appendFile(path, buffer, function (err)
    // {
    //     callback(true)
    // })
};