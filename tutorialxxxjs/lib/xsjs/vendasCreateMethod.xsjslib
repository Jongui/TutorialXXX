/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0*/
"use strict";

$.import("xsjs", "session");
var SESSIONINFO = $.xsjs.session;

function vendasCreate(param){
	var connection = $.hdb.getConnection();
	var criarOrdem = connection.loadProcedure( 
		"criar_ordem");
	var after = param.afterTableName;

		//Get Input New Record Values
	var pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
	var rs = null;
    var venda = SESSIONINFO.recordSetToJSON(pStmt.executeQuery(), "Details");
    pStmt.close();
    var datacriacao = venda.Details[0].datacriacao.toString();
    var cliente = venda.Details[0].cliente.toString();
	criarOrdem(venda.Details[0].id.toString(), venda.Details[0].datacriacao.toString(), venda.Details[0].cliente.toString());
}

function vendasCreateBefore(param){
	var after = param.afterTableName;
	var pStmt = param.connection.prepareStatement("select \"ordemId\".NEXTVAL from dummy");
	var rs = pStmt.executeQuery();
	var vendaID = "";
	while (rs.next()) {
		vendaID = rs.getString(1);
	} 
	pStmt.close();
	
    vendaID = padWithZeroes(vendaID, 10);
	pStmt = param.connection.prepareStatement("update \"" + after + "\" set \"id\" = ?");
	pStmt.setString(1, vendaID.toString());
	pStmt.executeUpdate();
	pStmt.close();
}

function padWithZeroes(number, length) {
    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }
    return my_string;
}