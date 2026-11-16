const SPREADSHEET_ID_ = 'CONFIGURE_O_ID_DA_PLANILHA_NO_EDITOR_PRIVADO';
const TAB_NAME_ = 'Pedidos do sistema';
const HEADERS_ = ['ID','Data do pedido','Telefone','Quantidade de fotos','Temas','Álbum Google Fotos','Produção','Revisão','Status','Nome / idade nas fotos','Observações','Quantidade correta','Temas corretos','Rosto preservado','Nome / idade conferidos','Mãos, pés e proporções','Fotos no álbum','Link conferido','Versão','Atualizado em','Criado em','Dados do sistema (não editar)'];
const STATUS_ = ['Pendente','Em produção','Em revisão','Finalizado'];
function doGet() { return HtmlService.createHtmlOutputFromFile('Index').setTitle('María Luz · Produção').addMetaTag('viewport','width=device-width, initial-scale=1'); }
function sheet_() {
 const book=SpreadsheetApp.openById(SPREADSHEET_ID_); let sheet=book.getSheetByName(TAB_NAME_);
 if(!sheet){sheet=book.insertSheet(TAB_NAME_);sheet.getRange(1,1,1,HEADERS_.length).setValues([HEADERS_]).setFontWeight('bold').setBackground('#eeeeee').setWrap(true);sheet.setFrozenRows(1);sheet.setColumnWidths(1,HEADERS_.length,150);sheet.setColumnWidth(5,250);sheet.setColumnWidth(6,250);sheet.setColumnWidth(11,300);sheet.hideColumns(22);}
 if(sheet.getRange(1,22).getValue()!==HEADERS_[21])throw Error('Cabeçalhos da aba de dados foram alterados. Restaure os cabeçalhos antes de continuar.');return sheet;
}
function records_(sheet){if(sheet.getLastRow()<2)return [];return sheet.getRange(2,22,sheet.getLastRow()-1,1).getValues().map((row,i)=>{if(!row[0])return null;try{return {row:i+2,data:JSON.parse(row[0])}}catch(e){throw Error('Dados inválidos na linha '+(i+2)+'. Não edite a coluna de dados do sistema.')}}).filter(Boolean);}
function listOrders(){const lock=LockService.getScriptLock();lock.waitLock(20000);try{return records_(sheet_()).map(r=>r.data).sort((a,b)=>b.date.localeCompare(a.date)||b.created_at.localeCompare(a.created_at));}finally{lock.releaseLock();}}
function clean_(input){
 if(!input||typeof input!=='object')throw Error('Pedido inválido.');
 const text=(key,max,required=false)=>{const s=String(input[key]??'').trim();if((required&&!s)||s.length>max)throw Error('Confira o campo '+key+'.');return s;};
 const d={date:text('date',10,true),phone:text('phone',40,true),quantity:Number(input.quantity),themes:text('themes',2000,true),album:text('album',2000,true),producer:'Albert',reviewer:'Albert',status:Number(input.status),caption:text('caption',200),notes:text('notes',5000),checks:input.checks};
 if(!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(d.date)||isNaN(new Date(d.date+'T12:00:00Z').getTime())||new Date(d.date+'T12:00:00Z').toISOString().slice(0,10)!==d.date)throw Error('Data inválida.');
 if(!Number.isInteger(d.quantity)||d.quantity<1||d.quantity>1000)throw Error('Quantidade de fotos inválida.');
 if(!Number.isInteger(d.status)||d.status<0||d.status>3)throw Error('Status inválido.');
 if(!['https://photos.app.goo.gl/','https://photos.google.com/'].some(prefix=>d.album.startsWith(prefix)))throw Error('Informe um link HTTPS do Google Fotos.');
 if(!Array.isArray(d.checks)||d.checks.length!==7||d.checks.some(x=>typeof x!=='boolean'))throw Error('Checklist inválido.');
 if(d.status===3&&!d.checks.every(Boolean))throw Error('Complete os sete itens do checklist antes de finalizar.');return d;
}
function safeCell_(s){return typeof s==='string'&&/^[=+@-]/.test(s)?"'"+s:s;}
function saveOrder(input){
 const data=clean_(input);const lock=LockService.getScriptLock();lock.waitLock(20000);
 try{const sheet=sheet_(),all=records_(sheet);const found=input.id?all.find(r=>r.data.id===input.id):null;
 if(input.id&&!found)throw Error('Pedido não encontrado. Atualize a lista.');
 if(found&&Number(input.version)!==found.data.version)throw Error('Outra pessoa alterou este pedido. Feche, atualize a lista e abra novamente.');
 const now=new Date().toISOString();const record={...data,id:found?found.data.id:Utilities.getUuid(),version:found?found.data.version+1:1,created_at:found?found.data.created_at:now,updated_at:now};
 const values=[record.id,record.date,record.phone,record.quantity,record.themes,record.album,record.producer,record.reviewer,STATUS_[record.status],record.caption,record.notes,...record.checks,record.version,record.updated_at,record.created_at,JSON.stringify(record)].map(safeCell_);
 const row=found?found.row:sheet.getLastRow()+1;if(row>sheet.getMaxRows())sheet.insertRowsAfter(sheet.getMaxRows(),100);sheet.getRange(row,1,1,22).setValues([values]);SpreadsheetApp.flush();return record;
 }finally{lock.releaseLock();}
}
