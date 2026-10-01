// Generated from immutable Router contract. Do not edit.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
"use strict";
export const SupplyClass = validate11;
const schema12 = {"enum":["authorized_api","self_hosted"]};

function validate11(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(!((data === "authorized_api") || (data === "self_hosted"))){
validate11.errors = [{instancePath,schemaPath:"#/enum",keyword:"enum",params:{allowedValues: schema12.enum},message:"must be equal to one of the allowed values"}];
return false;
}
validate11.errors = vErrors;
return errors === 0;
}

export const ConnectorProfile = validate12;
const schema13 = {"const":"inference_connector_v1"};

function validate12(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if("inference_connector_v1" !== data){
validate12.errors = [{instancePath,schemaPath:"#/const",keyword:"const",params:{allowedValue: "inference_connector_v1"},message:"must be equal to constant"}];
return false;
}
validate12.errors = vErrors;
return errors === 0;
}

export const Money = validate13;
const schema14 = {"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"};
const pattern0 = new RegExp("^(0|[1-9][0-9]{0,18})$", "u");

function validate13(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(typeof data === "string"){
if(!pattern0.test(data)){
validate13.errors = [{instancePath,schemaPath:"#/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate13.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
validate13.errors = vErrors;
return errors === 0;
}

export const SourcePolicy = validate14;
const schema15 = {"type":"object","additionalProperties":false,"properties":{"supplyClass":{"$ref":"#/$defs/SupplyClass"},"connectorProfile":{"$ref":"#/$defs/ConnectorProfile"},"policyVersion":{"const":"mvp1-v1"}},"required":["supplyClass","connectorProfile","policyVersion"]};

function validate14(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.supplyClass === undefined) && (missing0 = "supplyClass")) || ((data.connectorProfile === undefined) && (missing0 = "connectorProfile"))) || ((data.policyVersion === undefined) && (missing0 = "policyVersion"))){
validate14.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "supplyClass") || (key0 === "connectorProfile")) || (key0 === "policyVersion"))){
validate14.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.supplyClass !== undefined){
let data0 = data.supplyClass;
const _errs2 = errors;
if(!((data0 === "authorized_api") || (data0 === "self_hosted"))){
validate14.errors = [{instancePath:instancePath+"/supplyClass",schemaPath:"#/$defs/SupplyClass/enum",keyword:"enum",params:{allowedValues: schema12.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.connectorProfile !== undefined){
const _errs4 = errors;
if("inference_connector_v1" !== data.connectorProfile){
validate14.errors = [{instancePath:instancePath+"/connectorProfile",schemaPath:"#/$defs/ConnectorProfile/const",keyword:"const",params:{allowedValue: "inference_connector_v1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.policyVersion !== undefined){
const _errs6 = errors;
if("mvp1-v1" !== data.policyVersion){
validate14.errors = [{instancePath:instancePath+"/policyVersion",schemaPath:"#/properties/policyVersion/const",keyword:"const",params:{allowedValue: "mvp1-v1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
else {
validate14.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate14.errors = vErrors;
return errors === 0;
}

export const ApprovedBinding = validate15;
const schema18 = {"type":"object","additionalProperties":false,"properties":{"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"providerNodeId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"modelConfiguration":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"source":{"$ref":"#/$defs/SourcePolicy"},"permissionRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"}},"required":["bindingRevision","providerNodeId","modelConfiguration","source","permissionRevision"]};
const pattern1 = new RegExp("^[a-zA-Z0-9_-]{1,96}$", "u");

function validate15(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.bindingRevision === undefined) && (missing0 = "bindingRevision")) || ((data.providerNodeId === undefined) && (missing0 = "providerNodeId"))) || ((data.modelConfiguration === undefined) && (missing0 = "modelConfiguration"))) || ((data.source === undefined) && (missing0 = "source"))) || ((data.permissionRevision === undefined) && (missing0 = "permissionRevision"))){
validate15.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "bindingRevision") || (key0 === "providerNodeId")) || (key0 === "modelConfiguration")) || (key0 === "source")) || (key0 === "permissionRevision"))){
validate15.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.bindingRevision !== undefined){
let data0 = data.bindingRevision;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(!pattern1.test(data0)){
validate15.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate15.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.providerNodeId !== undefined){
let data1 = data.providerNodeId;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data1 === "string"){
if(!pattern1.test(data1)){
validate15.errors = [{instancePath:instancePath+"/providerNodeId",schemaPath:"#/properties/providerNodeId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate15.errors = [{instancePath:instancePath+"/providerNodeId",schemaPath:"#/properties/providerNodeId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.modelConfiguration !== undefined){
let data2 = data.modelConfiguration;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data2 === "string"){
if(!pattern1.test(data2)){
validate15.errors = [{instancePath:instancePath+"/modelConfiguration",schemaPath:"#/properties/modelConfiguration/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate15.errors = [{instancePath:instancePath+"/modelConfiguration",schemaPath:"#/properties/modelConfiguration/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.source !== undefined){
const _errs8 = errors;
if(!(validate14(data.source, {instancePath:instancePath+"/source",parentData:data,parentDataProperty:"source",rootData}))){
vErrors = vErrors === null ? validate14.errors : vErrors.concat(validate14.errors);
errors = vErrors.length;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.permissionRevision !== undefined){
let data4 = data.permissionRevision;
const _errs9 = errors;
if(errors === _errs9){
if(typeof data4 === "string"){
if(!pattern1.test(data4)){
validate15.errors = [{instancePath:instancePath+"/permissionRevision",schemaPath:"#/properties/permissionRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate15.errors = [{instancePath:instancePath+"/permissionRevision",schemaPath:"#/properties/permissionRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate15.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate15.errors = vErrors;
return errors === 0;
}

export const ToolCall = validate17;
const schema19 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"type":{"const":"function"},"function":{"type":"object","additionalProperties":false,"properties":{"name":{"enum":["read_file","search","write_file","delete_file","run_command"]},"arguments":{"type":"string","maxLength":65536}},"required":["name","arguments"]}},"required":["id","type","function"]};
const func2 = require("ajv/dist/runtime/ucs2length").default;

function validate17(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.id === undefined) && (missing0 = "id")) || ((data.type === undefined) && (missing0 = "type"))) || ((data.function === undefined) && (missing0 = "function"))){
validate17.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "id") || (key0 === "type")) || (key0 === "function"))){
validate17.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(!pattern1.test(data0)){
validate17.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate17.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
const _errs4 = errors;
if("function" !== data.type){
validate17.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "function"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.function !== undefined){
let data2 = data.function;
const _errs5 = errors;
if(errors === _errs5){
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
let missing1;
if(((data2.name === undefined) && (missing1 = "name")) || ((data2.arguments === undefined) && (missing1 = "arguments"))){
validate17.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs7 = errors;
for(const key1 in data2){
if(!((key1 === "name") || (key1 === "arguments"))){
validate17.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs7 === errors){
if(data2.name !== undefined){
let data3 = data2.name;
const _errs8 = errors;
if(!(((((data3 === "read_file") || (data3 === "search")) || (data3 === "write_file")) || (data3 === "delete_file")) || (data3 === "run_command"))){
validate17.errors = [{instancePath:instancePath+"/function/name",schemaPath:"#/properties/function/properties/name/enum",keyword:"enum",params:{allowedValues: schema19.properties.function.properties.name.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid1 = _errs8 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data2.arguments !== undefined){
let data4 = data2.arguments;
const _errs9 = errors;
if(errors === _errs9){
if(typeof data4 === "string"){
if(func2(data4) > 65536){
validate17.errors = [{instancePath:instancePath+"/function/arguments",schemaPath:"#/properties/function/properties/arguments/maxLength",keyword:"maxLength",params:{limit: 65536},message:"must NOT have more than 65536 characters"}];
return false;
}
}
else {
validate17.errors = [{instancePath:instancePath+"/function/arguments",schemaPath:"#/properties/function/properties/arguments/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid1 = _errs9 === errors;
}
else {
var valid1 = true;
}
}
}
}
}
else {
validate17.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
else {
validate17.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate17.errors = vErrors;
return errors === 0;
}

export const ToolDefinition = validate18;
const schema20 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"function"},"function":{"type":"object","additionalProperties":false,"properties":{"name":{"enum":["read_file","search","write_file","delete_file","run_command"]},"description":{"type":"string","maxLength":256},"parameters":{"type":"object","maxProperties":8}},"required":["name","description","parameters"]}},"required":["type","function"]};

function validate18(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.function === undefined) && (missing0 = "function"))){
validate18.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "function"))){
validate18.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("function" !== data.type){
validate18.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "function"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.function !== undefined){
let data1 = data.function;
const _errs3 = errors;
if(errors === _errs3){
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
let missing1;
if((((data1.name === undefined) && (missing1 = "name")) || ((data1.description === undefined) && (missing1 = "description"))) || ((data1.parameters === undefined) && (missing1 = "parameters"))){
validate18.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs5 = errors;
for(const key1 in data1){
if(!(((key1 === "name") || (key1 === "description")) || (key1 === "parameters"))){
validate18.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs5 === errors){
if(data1.name !== undefined){
let data2 = data1.name;
const _errs6 = errors;
if(!(((((data2 === "read_file") || (data2 === "search")) || (data2 === "write_file")) || (data2 === "delete_file")) || (data2 === "run_command"))){
validate18.errors = [{instancePath:instancePath+"/function/name",schemaPath:"#/properties/function/properties/name/enum",keyword:"enum",params:{allowedValues: schema20.properties.function.properties.name.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid1 = _errs6 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data1.description !== undefined){
let data3 = data1.description;
const _errs7 = errors;
if(errors === _errs7){
if(typeof data3 === "string"){
if(func2(data3) > 256){
validate18.errors = [{instancePath:instancePath+"/function/description",schemaPath:"#/properties/function/properties/description/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate18.errors = [{instancePath:instancePath+"/function/description",schemaPath:"#/properties/function/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid1 = _errs7 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data1.parameters !== undefined){
let data4 = data1.parameters;
const _errs9 = errors;
if(errors === _errs9){
if(data4 && typeof data4 == "object" && !Array.isArray(data4)){
if(Object.keys(data4).length > 8){
validate18.errors = [{instancePath:instancePath+"/function/parameters",schemaPath:"#/properties/function/properties/parameters/maxProperties",keyword:"maxProperties",params:{limit: 8},message:"must NOT have more than 8 properties"}];
return false;
}
}
else {
validate18.errors = [{instancePath:instancePath+"/function/parameters",schemaPath:"#/properties/function/properties/parameters/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid1 = _errs9 === errors;
}
else {
var valid1 = true;
}
}
}
}
}
}
else {
validate18.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate18.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate18.errors = vErrors;
return errors === 0;
}

export const Message = validate19;
const schema21 = {"type":"object","additionalProperties":false,"properties":{"role":{"enum":["system","user","assistant","tool"]},"content":{"type":"string","maxLength":65536},"tool_call_id":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"tool_calls":{"type":"array","minItems":1,"maxItems":8,"items":{"$ref":"#/$defs/ToolCall"}}},"required":["role","content"]};

function validate19(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.role === undefined) && (missing0 = "role")) || ((data.content === undefined) && (missing0 = "content"))){
validate19.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "role") || (key0 === "content")) || (key0 === "tool_call_id")) || (key0 === "tool_calls"))){
validate19.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.role !== undefined){
let data0 = data.role;
const _errs2 = errors;
if(!((((data0 === "system") || (data0 === "user")) || (data0 === "assistant")) || (data0 === "tool"))){
validate19.errors = [{instancePath:instancePath+"/role",schemaPath:"#/properties/role/enum",keyword:"enum",params:{allowedValues: schema21.properties.role.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.content !== undefined){
let data1 = data.content;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data1 === "string"){
if(func2(data1) > 65536){
validate19.errors = [{instancePath:instancePath+"/content",schemaPath:"#/properties/content/maxLength",keyword:"maxLength",params:{limit: 65536},message:"must NOT have more than 65536 characters"}];
return false;
}
}
else {
validate19.errors = [{instancePath:instancePath+"/content",schemaPath:"#/properties/content/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.tool_call_id !== undefined){
let data2 = data.tool_call_id;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data2 === "string"){
if(!pattern1.test(data2)){
validate19.errors = [{instancePath:instancePath+"/tool_call_id",schemaPath:"#/properties/tool_call_id/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate19.errors = [{instancePath:instancePath+"/tool_call_id",schemaPath:"#/properties/tool_call_id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.tool_calls !== undefined){
let data3 = data.tool_calls;
const _errs7 = errors;
if(errors === _errs7){
if(Array.isArray(data3)){
if(data3.length > 8){
validate19.errors = [{instancePath:instancePath+"/tool_calls",schemaPath:"#/properties/tool_calls/maxItems",keyword:"maxItems",params:{limit: 8},message:"must NOT have more than 8 items"}];
return false;
}
else {
if(data3.length < 1){
validate19.errors = [{instancePath:instancePath+"/tool_calls",schemaPath:"#/properties/tool_calls/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid1 = true;
const len0 = data3.length;
for(let i0=0; i0<len0; i0++){
let data4 = data3[i0];
const _errs9 = errors;
const _errs10 = errors;
if(errors === _errs10){
if(data4 && typeof data4 == "object" && !Array.isArray(data4)){
let missing1;
if((((data4.id === undefined) && (missing1 = "id")) || ((data4.type === undefined) && (missing1 = "type"))) || ((data4.function === undefined) && (missing1 = "function"))){
validate19.errors = [{instancePath:instancePath+"/tool_calls/" + i0,schemaPath:"#/$defs/ToolCall/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs12 = errors;
for(const key1 in data4){
if(!(((key1 === "id") || (key1 === "type")) || (key1 === "function"))){
validate19.errors = [{instancePath:instancePath+"/tool_calls/" + i0,schemaPath:"#/$defs/ToolCall/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs12 === errors){
if(data4.id !== undefined){
let data5 = data4.id;
const _errs13 = errors;
if(errors === _errs13){
if(typeof data5 === "string"){
if(!pattern1.test(data5)){
validate19.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/id",schemaPath:"#/$defs/ToolCall/properties/id/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate19.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/id",schemaPath:"#/$defs/ToolCall/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid3 = _errs13 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.type !== undefined){
const _errs15 = errors;
if("function" !== data4.type){
validate19.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/type",schemaPath:"#/$defs/ToolCall/properties/type/const",keyword:"const",params:{allowedValue: "function"},message:"must be equal to constant"}];
return false;
}
var valid3 = _errs15 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data4.function !== undefined){
let data7 = data4.function;
const _errs16 = errors;
if(errors === _errs16){
if(data7 && typeof data7 == "object" && !Array.isArray(data7)){
let missing2;
if(((data7.name === undefined) && (missing2 = "name")) || ((data7.arguments === undefined) && (missing2 = "arguments"))){
validate19.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/function",schemaPath:"#/$defs/ToolCall/properties/function/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];
return false;
}
else {
const _errs18 = errors;
for(const key2 in data7){
if(!((key2 === "name") || (key2 === "arguments"))){
validate19.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/function",schemaPath:"#/$defs/ToolCall/properties/function/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs18 === errors){
if(data7.name !== undefined){
let data8 = data7.name;
const _errs19 = errors;
if(!(((((data8 === "read_file") || (data8 === "search")) || (data8 === "write_file")) || (data8 === "delete_file")) || (data8 === "run_command"))){
validate19.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/function/name",schemaPath:"#/$defs/ToolCall/properties/function/properties/name/enum",keyword:"enum",params:{allowedValues: schema19.properties.function.properties.name.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid4 = _errs19 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data7.arguments !== undefined){
let data9 = data7.arguments;
const _errs20 = errors;
if(errors === _errs20){
if(typeof data9 === "string"){
if(func2(data9) > 65536){
validate19.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/function/arguments",schemaPath:"#/$defs/ToolCall/properties/function/properties/arguments/maxLength",keyword:"maxLength",params:{limit: 65536},message:"must NOT have more than 65536 characters"}];
return false;
}
}
else {
validate19.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/function/arguments",schemaPath:"#/$defs/ToolCall/properties/function/properties/arguments/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid4 = _errs20 === errors;
}
else {
var valid4 = true;
}
}
}
}
}
else {
validate19.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/function",schemaPath:"#/$defs/ToolCall/properties/function/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid3 = _errs16 === errors;
}
else {
var valid3 = true;
}
}
}
}
}
}
else {
validate19.errors = [{instancePath:instancePath+"/tool_calls/" + i0,schemaPath:"#/$defs/ToolCall/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid1 = _errs9 === errors;
if(!valid1){
break;
}
}
}
}
}
else {
validate19.errors = [{instancePath:instancePath+"/tool_calls",schemaPath:"#/properties/tool_calls/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
else {
validate19.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate19.errors = vErrors;
return errors === 0;
}

export const UpstreamBudget = validate20;
const schema23 = {"type":"object","additionalProperties":false,"properties":{"reservedMicrousd":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"inputBound":{"type":"integer","minimum":1,"maximum":262144},"tariffVersion":{"type":"string","maxLength":120},"inputMicrousdPerMillion":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"outputMicrousdPerMillion":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"}},"required":["reservedMicrousd","inputBound","tariffVersion","inputMicrousdPerMillion","outputMicrousdPerMillion"]};

function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.reservedMicrousd === undefined) && (missing0 = "reservedMicrousd")) || ((data.inputBound === undefined) && (missing0 = "inputBound"))) || ((data.tariffVersion === undefined) && (missing0 = "tariffVersion"))) || ((data.inputMicrousdPerMillion === undefined) && (missing0 = "inputMicrousdPerMillion"))) || ((data.outputMicrousdPerMillion === undefined) && (missing0 = "outputMicrousdPerMillion"))){
validate20.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "reservedMicrousd") || (key0 === "inputBound")) || (key0 === "tariffVersion")) || (key0 === "inputMicrousdPerMillion")) || (key0 === "outputMicrousdPerMillion"))){
validate20.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.reservedMicrousd !== undefined){
let data0 = data.reservedMicrousd;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(!pattern0.test(data0)){
validate20.errors = [{instancePath:instancePath+"/reservedMicrousd",schemaPath:"#/properties/reservedMicrousd/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate20.errors = [{instancePath:instancePath+"/reservedMicrousd",schemaPath:"#/properties/reservedMicrousd/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.inputBound !== undefined){
let data1 = data.inputBound;
const _errs4 = errors;
if(!(((typeof data1 == "number") && (!(data1 % 1) && !isNaN(data1))) && (isFinite(data1)))){
validate20.errors = [{instancePath:instancePath+"/inputBound",schemaPath:"#/properties/inputBound/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs4){
if((typeof data1 == "number") && (isFinite(data1))){
if(data1 > 262144 || isNaN(data1)){
validate20.errors = [{instancePath:instancePath+"/inputBound",schemaPath:"#/properties/inputBound/maximum",keyword:"maximum",params:{comparison: "<=", limit: 262144},message:"must be <= 262144"}];
return false;
}
else {
if(data1 < 1 || isNaN(data1)){
validate20.errors = [{instancePath:instancePath+"/inputBound",schemaPath:"#/properties/inputBound/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.tariffVersion !== undefined){
let data2 = data.tariffVersion;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data2 === "string"){
if(func2(data2) > 120){
validate20.errors = [{instancePath:instancePath+"/tariffVersion",schemaPath:"#/properties/tariffVersion/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
}
else {
validate20.errors = [{instancePath:instancePath+"/tariffVersion",schemaPath:"#/properties/tariffVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.inputMicrousdPerMillion !== undefined){
let data3 = data.inputMicrousdPerMillion;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data3 === "string"){
if(!pattern0.test(data3)){
validate20.errors = [{instancePath:instancePath+"/inputMicrousdPerMillion",schemaPath:"#/properties/inputMicrousdPerMillion/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate20.errors = [{instancePath:instancePath+"/inputMicrousdPerMillion",schemaPath:"#/properties/inputMicrousdPerMillion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.outputMicrousdPerMillion !== undefined){
let data4 = data.outputMicrousdPerMillion;
const _errs10 = errors;
if(errors === _errs10){
if(typeof data4 === "string"){
if(!pattern0.test(data4)){
validate20.errors = [{instancePath:instancePath+"/outputMicrousdPerMillion",schemaPath:"#/properties/outputMicrousdPerMillion/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate20.errors = [{instancePath:instancePath+"/outputMicrousdPerMillion",schemaPath:"#/properties/outputMicrousdPerMillion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate20.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate20.errors = vErrors;
return errors === 0;
}

export const InferenceRequest = validate21;
const schema24 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"inference"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"requestId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"sequence":{"type":"integer","minimum":1,"maximum":2147483647},"deadlineUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991},"messages":{"type":"array","minItems":1,"maxItems":128,"items":{"$ref":"#/$defs/Message"}},"maxOutputTokens":{"type":"integer","minimum":1,"maximum":8192},"upstreamBudget":{"$ref":"#/$defs/UpstreamBudget"},"tools":{"type":"array","maxItems":5,"items":{"$ref":"#/$defs/ToolDefinition"}}},"required":["type","sessionId","requestId","bindingRevision","sequence","deadlineUnixMs","messages","maxOutputTokens","upstreamBudget","tools"]};
const func7 = Object.prototype.hasOwnProperty;

function validate21(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((((((data.type === undefined) && (missing0 = "type")) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.bindingRevision === undefined) && (missing0 = "bindingRevision"))) || ((data.sequence === undefined) && (missing0 = "sequence"))) || ((data.deadlineUnixMs === undefined) && (missing0 = "deadlineUnixMs"))) || ((data.messages === undefined) && (missing0 = "messages"))) || ((data.maxOutputTokens === undefined) && (missing0 = "maxOutputTokens"))) || ((data.upstreamBudget === undefined) && (missing0 = "upstreamBudget"))) || ((data.tools === undefined) && (missing0 = "tools"))){
validate21.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema24.properties, key0))){
validate21.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("inference" !== data.type){
validate21.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "inference"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sessionId !== undefined){
let data1 = data.sessionId;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data1 === "string"){
if(!pattern1.test(data1)){
validate21.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate21.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestId !== undefined){
let data2 = data.requestId;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data2 === "string"){
if(!pattern1.test(data2)){
validate21.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate21.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.bindingRevision !== undefined){
let data3 = data.bindingRevision;
const _errs7 = errors;
if(errors === _errs7){
if(typeof data3 === "string"){
if(!pattern1.test(data3)){
validate21.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate21.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sequence !== undefined){
let data4 = data.sequence;
const _errs9 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
validate21.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 2147483647 || isNaN(data4)){
validate21.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data4 < 1 || isNaN(data4)){
validate21.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.deadlineUnixMs !== undefined){
let data5 = data.deadlineUnixMs;
const _errs11 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
validate21.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs11){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 9007199254740991 || isNaN(data5)){
validate21.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data5 < 1 || isNaN(data5)){
validate21.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.messages !== undefined){
let data6 = data.messages;
const _errs13 = errors;
if(errors === _errs13){
if(Array.isArray(data6)){
if(data6.length > 128){
validate21.errors = [{instancePath:instancePath+"/messages",schemaPath:"#/properties/messages/maxItems",keyword:"maxItems",params:{limit: 128},message:"must NOT have more than 128 items"}];
return false;
}
else {
if(data6.length < 1){
validate21.errors = [{instancePath:instancePath+"/messages",schemaPath:"#/properties/messages/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid1 = true;
const len0 = data6.length;
for(let i0=0; i0<len0; i0++){
const _errs15 = errors;
if(!(validate19(data6[i0], {instancePath:instancePath+"/messages/" + i0,parentData:data6,parentDataProperty:i0,rootData}))){
vErrors = vErrors === null ? validate19.errors : vErrors.concat(validate19.errors);
errors = vErrors.length;
}
var valid1 = _errs15 === errors;
if(!valid1){
break;
}
}
}
}
}
else {
validate21.errors = [{instancePath:instancePath+"/messages",schemaPath:"#/properties/messages/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.maxOutputTokens !== undefined){
let data8 = data.maxOutputTokens;
const _errs16 = errors;
if(!(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8)))){
validate21.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs16){
if((typeof data8 == "number") && (isFinite(data8))){
if(data8 > 8192 || isNaN(data8)){
validate21.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 8192},message:"must be <= 8192"}];
return false;
}
else {
if(data8 < 1 || isNaN(data8)){
validate21.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.upstreamBudget !== undefined){
let data9 = data.upstreamBudget;
const _errs18 = errors;
const _errs19 = errors;
if(errors === _errs19){
if(data9 && typeof data9 == "object" && !Array.isArray(data9)){
let missing1;
if((((((data9.reservedMicrousd === undefined) && (missing1 = "reservedMicrousd")) || ((data9.inputBound === undefined) && (missing1 = "inputBound"))) || ((data9.tariffVersion === undefined) && (missing1 = "tariffVersion"))) || ((data9.inputMicrousdPerMillion === undefined) && (missing1 = "inputMicrousdPerMillion"))) || ((data9.outputMicrousdPerMillion === undefined) && (missing1 = "outputMicrousdPerMillion"))){
validate21.errors = [{instancePath:instancePath+"/upstreamBudget",schemaPath:"#/$defs/UpstreamBudget/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs21 = errors;
for(const key1 in data9){
if(!(((((key1 === "reservedMicrousd") || (key1 === "inputBound")) || (key1 === "tariffVersion")) || (key1 === "inputMicrousdPerMillion")) || (key1 === "outputMicrousdPerMillion"))){
validate21.errors = [{instancePath:instancePath+"/upstreamBudget",schemaPath:"#/$defs/UpstreamBudget/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs21 === errors){
if(data9.reservedMicrousd !== undefined){
let data10 = data9.reservedMicrousd;
const _errs22 = errors;
if(errors === _errs22){
if(typeof data10 === "string"){
if(!pattern0.test(data10)){
validate21.errors = [{instancePath:instancePath+"/upstreamBudget/reservedMicrousd",schemaPath:"#/$defs/UpstreamBudget/properties/reservedMicrousd/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate21.errors = [{instancePath:instancePath+"/upstreamBudget/reservedMicrousd",schemaPath:"#/$defs/UpstreamBudget/properties/reservedMicrousd/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid3 = _errs22 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data9.inputBound !== undefined){
let data11 = data9.inputBound;
const _errs24 = errors;
if(!(((typeof data11 == "number") && (!(data11 % 1) && !isNaN(data11))) && (isFinite(data11)))){
validate21.errors = [{instancePath:instancePath+"/upstreamBudget/inputBound",schemaPath:"#/$defs/UpstreamBudget/properties/inputBound/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs24){
if((typeof data11 == "number") && (isFinite(data11))){
if(data11 > 262144 || isNaN(data11)){
validate21.errors = [{instancePath:instancePath+"/upstreamBudget/inputBound",schemaPath:"#/$defs/UpstreamBudget/properties/inputBound/maximum",keyword:"maximum",params:{comparison: "<=", limit: 262144},message:"must be <= 262144"}];
return false;
}
else {
if(data11 < 1 || isNaN(data11)){
validate21.errors = [{instancePath:instancePath+"/upstreamBudget/inputBound",schemaPath:"#/$defs/UpstreamBudget/properties/inputBound/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid3 = _errs24 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data9.tariffVersion !== undefined){
let data12 = data9.tariffVersion;
const _errs26 = errors;
if(errors === _errs26){
if(typeof data12 === "string"){
if(func2(data12) > 120){
validate21.errors = [{instancePath:instancePath+"/upstreamBudget/tariffVersion",schemaPath:"#/$defs/UpstreamBudget/properties/tariffVersion/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
}
else {
validate21.errors = [{instancePath:instancePath+"/upstreamBudget/tariffVersion",schemaPath:"#/$defs/UpstreamBudget/properties/tariffVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid3 = _errs26 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data9.inputMicrousdPerMillion !== undefined){
let data13 = data9.inputMicrousdPerMillion;
const _errs28 = errors;
if(errors === _errs28){
if(typeof data13 === "string"){
if(!pattern0.test(data13)){
validate21.errors = [{instancePath:instancePath+"/upstreamBudget/inputMicrousdPerMillion",schemaPath:"#/$defs/UpstreamBudget/properties/inputMicrousdPerMillion/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate21.errors = [{instancePath:instancePath+"/upstreamBudget/inputMicrousdPerMillion",schemaPath:"#/$defs/UpstreamBudget/properties/inputMicrousdPerMillion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid3 = _errs28 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data9.outputMicrousdPerMillion !== undefined){
let data14 = data9.outputMicrousdPerMillion;
const _errs30 = errors;
if(errors === _errs30){
if(typeof data14 === "string"){
if(!pattern0.test(data14)){
validate21.errors = [{instancePath:instancePath+"/upstreamBudget/outputMicrousdPerMillion",schemaPath:"#/$defs/UpstreamBudget/properties/outputMicrousdPerMillion/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate21.errors = [{instancePath:instancePath+"/upstreamBudget/outputMicrousdPerMillion",schemaPath:"#/$defs/UpstreamBudget/properties/outputMicrousdPerMillion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid3 = _errs30 === errors;
}
else {
var valid3 = true;
}
}
}
}
}
}
}
}
else {
validate21.errors = [{instancePath:instancePath+"/upstreamBudget",schemaPath:"#/$defs/UpstreamBudget/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs18 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.tools !== undefined){
let data15 = data.tools;
const _errs32 = errors;
if(errors === _errs32){
if(Array.isArray(data15)){
if(data15.length > 5){
validate21.errors = [{instancePath:instancePath+"/tools",schemaPath:"#/properties/tools/maxItems",keyword:"maxItems",params:{limit: 5},message:"must NOT have more than 5 items"}];
return false;
}
else {
var valid4 = true;
const len1 = data15.length;
for(let i1=0; i1<len1; i1++){
let data16 = data15[i1];
const _errs34 = errors;
const _errs35 = errors;
if(errors === _errs35){
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
let missing2;
if(((data16.type === undefined) && (missing2 = "type")) || ((data16.function === undefined) && (missing2 = "function"))){
validate21.errors = [{instancePath:instancePath+"/tools/" + i1,schemaPath:"#/$defs/ToolDefinition/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];
return false;
}
else {
const _errs37 = errors;
for(const key2 in data16){
if(!((key2 === "type") || (key2 === "function"))){
validate21.errors = [{instancePath:instancePath+"/tools/" + i1,schemaPath:"#/$defs/ToolDefinition/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs37 === errors){
if(data16.type !== undefined){
const _errs38 = errors;
if("function" !== data16.type){
validate21.errors = [{instancePath:instancePath+"/tools/" + i1+"/type",schemaPath:"#/$defs/ToolDefinition/properties/type/const",keyword:"const",params:{allowedValue: "function"},message:"must be equal to constant"}];
return false;
}
var valid6 = _errs38 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data16.function !== undefined){
let data18 = data16.function;
const _errs39 = errors;
if(errors === _errs39){
if(data18 && typeof data18 == "object" && !Array.isArray(data18)){
let missing3;
if((((data18.name === undefined) && (missing3 = "name")) || ((data18.description === undefined) && (missing3 = "description"))) || ((data18.parameters === undefined) && (missing3 = "parameters"))){
validate21.errors = [{instancePath:instancePath+"/tools/" + i1+"/function",schemaPath:"#/$defs/ToolDefinition/properties/function/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"}];
return false;
}
else {
const _errs41 = errors;
for(const key3 in data18){
if(!(((key3 === "name") || (key3 === "description")) || (key3 === "parameters"))){
validate21.errors = [{instancePath:instancePath+"/tools/" + i1+"/function",schemaPath:"#/$defs/ToolDefinition/properties/function/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs41 === errors){
if(data18.name !== undefined){
let data19 = data18.name;
const _errs42 = errors;
if(!(((((data19 === "read_file") || (data19 === "search")) || (data19 === "write_file")) || (data19 === "delete_file")) || (data19 === "run_command"))){
validate21.errors = [{instancePath:instancePath+"/tools/" + i1+"/function/name",schemaPath:"#/$defs/ToolDefinition/properties/function/properties/name/enum",keyword:"enum",params:{allowedValues: schema20.properties.function.properties.name.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid7 = _errs42 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data18.description !== undefined){
let data20 = data18.description;
const _errs43 = errors;
if(errors === _errs43){
if(typeof data20 === "string"){
if(func2(data20) > 256){
validate21.errors = [{instancePath:instancePath+"/tools/" + i1+"/function/description",schemaPath:"#/$defs/ToolDefinition/properties/function/properties/description/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate21.errors = [{instancePath:instancePath+"/tools/" + i1+"/function/description",schemaPath:"#/$defs/ToolDefinition/properties/function/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid7 = _errs43 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data18.parameters !== undefined){
let data21 = data18.parameters;
const _errs45 = errors;
if(errors === _errs45){
if(data21 && typeof data21 == "object" && !Array.isArray(data21)){
if(Object.keys(data21).length > 8){
validate21.errors = [{instancePath:instancePath+"/tools/" + i1+"/function/parameters",schemaPath:"#/$defs/ToolDefinition/properties/function/properties/parameters/maxProperties",keyword:"maxProperties",params:{limit: 8},message:"must NOT have more than 8 properties"}];
return false;
}
}
else {
validate21.errors = [{instancePath:instancePath+"/tools/" + i1+"/function/parameters",schemaPath:"#/$defs/ToolDefinition/properties/function/properties/parameters/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid7 = _errs45 === errors;
}
else {
var valid7 = true;
}
}
}
}
}
}
else {
validate21.errors = [{instancePath:instancePath+"/tools/" + i1+"/function",schemaPath:"#/$defs/ToolDefinition/properties/function/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid6 = _errs39 === errors;
}
else {
var valid6 = true;
}
}
}
}
}
else {
validate21.errors = [{instancePath:instancePath+"/tools/" + i1,schemaPath:"#/$defs/ToolDefinition/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid4 = _errs34 === errors;
if(!valid4){
break;
}
}
}
}
else {
validate21.errors = [{instancePath:instancePath+"/tools",schemaPath:"#/properties/tools/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs32 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate21.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate21.errors = vErrors;
return errors === 0;
}

export const Handshake = validate23;
const schema27 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"handshake"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"installationId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"providerInstallationId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"listingRevision":{"type":"integer","minimum":1,"maximum":2147483647},"challengeId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"deadlineUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991}},"required":["type","sessionId","installationId","providerInstallationId","bindingRevision","listingRevision","challengeId","deadlineUnixMs"]};

function validate23(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((((data.type === undefined) && (missing0 = "type")) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.installationId === undefined) && (missing0 = "installationId"))) || ((data.providerInstallationId === undefined) && (missing0 = "providerInstallationId"))) || ((data.bindingRevision === undefined) && (missing0 = "bindingRevision"))) || ((data.listingRevision === undefined) && (missing0 = "listingRevision"))) || ((data.challengeId === undefined) && (missing0 = "challengeId"))) || ((data.deadlineUnixMs === undefined) && (missing0 = "deadlineUnixMs"))){
validate23.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((((key0 === "type") || (key0 === "sessionId")) || (key0 === "installationId")) || (key0 === "providerInstallationId")) || (key0 === "bindingRevision")) || (key0 === "listingRevision")) || (key0 === "challengeId")) || (key0 === "deadlineUnixMs"))){
validate23.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("handshake" !== data.type){
validate23.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "handshake"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sessionId !== undefined){
let data1 = data.sessionId;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data1 === "string"){
if(!pattern1.test(data1)){
validate23.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate23.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.installationId !== undefined){
let data2 = data.installationId;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data2 === "string"){
if(!pattern1.test(data2)){
validate23.errors = [{instancePath:instancePath+"/installationId",schemaPath:"#/properties/installationId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate23.errors = [{instancePath:instancePath+"/installationId",schemaPath:"#/properties/installationId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.providerInstallationId !== undefined){
let data3 = data.providerInstallationId;
const _errs7 = errors;
if(errors === _errs7){
if(typeof data3 === "string"){
if(!pattern1.test(data3)){
validate23.errors = [{instancePath:instancePath+"/providerInstallationId",schemaPath:"#/properties/providerInstallationId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate23.errors = [{instancePath:instancePath+"/providerInstallationId",schemaPath:"#/properties/providerInstallationId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.bindingRevision !== undefined){
let data4 = data.bindingRevision;
const _errs9 = errors;
if(errors === _errs9){
if(typeof data4 === "string"){
if(!pattern1.test(data4)){
validate23.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate23.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.listingRevision !== undefined){
let data5 = data.listingRevision;
const _errs11 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
validate23.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs11){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 2147483647 || isNaN(data5)){
validate23.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data5 < 1 || isNaN(data5)){
validate23.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.challengeId !== undefined){
let data6 = data.challengeId;
const _errs13 = errors;
if(errors === _errs13){
if(typeof data6 === "string"){
if(!pattern1.test(data6)){
validate23.errors = [{instancePath:instancePath+"/challengeId",schemaPath:"#/properties/challengeId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate23.errors = [{instancePath:instancePath+"/challengeId",schemaPath:"#/properties/challengeId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.deadlineUnixMs !== undefined){
let data7 = data.deadlineUnixMs;
const _errs15 = errors;
if(!(((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7)))){
validate23.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs15){
if((typeof data7 == "number") && (isFinite(data7))){
if(data7 > 9007199254740991 || isNaN(data7)){
validate23.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data7 < 1 || isNaN(data7)){
validate23.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs15 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
else {
validate23.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate23.errors = vErrors;
return errors === 0;
}

export const HandshakeResult = validate24;
const schema28 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"handshake_result"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"installationId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"providerInstallationId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"listingRevision":{"type":"integer","minimum":1,"maximum":2147483647},"challengeId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"deadlineUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991}},"required":["type","sessionId","installationId","providerInstallationId","bindingRevision","listingRevision","challengeId","deadlineUnixMs"]};

function validate24(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((((data.type === undefined) && (missing0 = "type")) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.installationId === undefined) && (missing0 = "installationId"))) || ((data.providerInstallationId === undefined) && (missing0 = "providerInstallationId"))) || ((data.bindingRevision === undefined) && (missing0 = "bindingRevision"))) || ((data.listingRevision === undefined) && (missing0 = "listingRevision"))) || ((data.challengeId === undefined) && (missing0 = "challengeId"))) || ((data.deadlineUnixMs === undefined) && (missing0 = "deadlineUnixMs"))){
validate24.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((((key0 === "type") || (key0 === "sessionId")) || (key0 === "installationId")) || (key0 === "providerInstallationId")) || (key0 === "bindingRevision")) || (key0 === "listingRevision")) || (key0 === "challengeId")) || (key0 === "deadlineUnixMs"))){
validate24.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("handshake_result" !== data.type){
validate24.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "handshake_result"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sessionId !== undefined){
let data1 = data.sessionId;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data1 === "string"){
if(!pattern1.test(data1)){
validate24.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate24.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.installationId !== undefined){
let data2 = data.installationId;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data2 === "string"){
if(!pattern1.test(data2)){
validate24.errors = [{instancePath:instancePath+"/installationId",schemaPath:"#/properties/installationId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate24.errors = [{instancePath:instancePath+"/installationId",schemaPath:"#/properties/installationId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.providerInstallationId !== undefined){
let data3 = data.providerInstallationId;
const _errs7 = errors;
if(errors === _errs7){
if(typeof data3 === "string"){
if(!pattern1.test(data3)){
validate24.errors = [{instancePath:instancePath+"/providerInstallationId",schemaPath:"#/properties/providerInstallationId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate24.errors = [{instancePath:instancePath+"/providerInstallationId",schemaPath:"#/properties/providerInstallationId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.bindingRevision !== undefined){
let data4 = data.bindingRevision;
const _errs9 = errors;
if(errors === _errs9){
if(typeof data4 === "string"){
if(!pattern1.test(data4)){
validate24.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate24.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.listingRevision !== undefined){
let data5 = data.listingRevision;
const _errs11 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
validate24.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs11){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 2147483647 || isNaN(data5)){
validate24.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data5 < 1 || isNaN(data5)){
validate24.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.challengeId !== undefined){
let data6 = data.challengeId;
const _errs13 = errors;
if(errors === _errs13){
if(typeof data6 === "string"){
if(!pattern1.test(data6)){
validate24.errors = [{instancePath:instancePath+"/challengeId",schemaPath:"#/properties/challengeId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate24.errors = [{instancePath:instancePath+"/challengeId",schemaPath:"#/properties/challengeId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.deadlineUnixMs !== undefined){
let data7 = data.deadlineUnixMs;
const _errs15 = errors;
if(!(((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7)))){
validate24.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs15){
if((typeof data7 == "number") && (isFinite(data7))){
if(data7 > 9007199254740991 || isNaN(data7)){
validate24.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data7 < 1 || isNaN(data7)){
validate24.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs15 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
else {
validate24.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate24.errors = vErrors;
return errors === 0;
}

export const Cancel = validate25;
const schema29 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"cancel"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"requestId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"sequence":{"type":"integer","minimum":1,"maximum":2147483647}},"required":["type","sessionId","requestId","bindingRevision","sequence"]};

function validate25(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.type === undefined) && (missing0 = "type")) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.bindingRevision === undefined) && (missing0 = "bindingRevision"))) || ((data.sequence === undefined) && (missing0 = "sequence"))){
validate25.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "type") || (key0 === "sessionId")) || (key0 === "requestId")) || (key0 === "bindingRevision")) || (key0 === "sequence"))){
validate25.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("cancel" !== data.type){
validate25.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "cancel"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sessionId !== undefined){
let data1 = data.sessionId;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data1 === "string"){
if(!pattern1.test(data1)){
validate25.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate25.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestId !== undefined){
let data2 = data.requestId;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data2 === "string"){
if(!pattern1.test(data2)){
validate25.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate25.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.bindingRevision !== undefined){
let data3 = data.bindingRevision;
const _errs7 = errors;
if(errors === _errs7){
if(typeof data3 === "string"){
if(!pattern1.test(data3)){
validate25.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate25.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sequence !== undefined){
let data4 = data.sequence;
const _errs9 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
validate25.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 2147483647 || isNaN(data4)){
validate25.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data4 < 1 || isNaN(data4)){
validate25.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate25.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate25.errors = vErrors;
return errors === 0;
}

export const Activate = validate26;
const schema30 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"activate"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"sequence":{"type":"integer","minimum":1,"maximum":2147483647},"deadlineUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991}},"required":["type","sessionId","bindingRevision","sequence","deadlineUnixMs"]};

function validate26(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.type === undefined) && (missing0 = "type")) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.bindingRevision === undefined) && (missing0 = "bindingRevision"))) || ((data.sequence === undefined) && (missing0 = "sequence"))) || ((data.deadlineUnixMs === undefined) && (missing0 = "deadlineUnixMs"))){
validate26.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "type") || (key0 === "sessionId")) || (key0 === "bindingRevision")) || (key0 === "sequence")) || (key0 === "deadlineUnixMs"))){
validate26.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("activate" !== data.type){
validate26.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "activate"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sessionId !== undefined){
let data1 = data.sessionId;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data1 === "string"){
if(!pattern1.test(data1)){
validate26.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate26.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.bindingRevision !== undefined){
let data2 = data.bindingRevision;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data2 === "string"){
if(!pattern1.test(data2)){
validate26.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate26.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sequence !== undefined){
let data3 = data.sequence;
const _errs7 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate26.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs7){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 2147483647 || isNaN(data3)){
validate26.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data3 < 1 || isNaN(data3)){
validate26.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.deadlineUnixMs !== undefined){
let data4 = data.deadlineUnixMs;
const _errs9 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
validate26.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 9007199254740991 || isNaN(data4)){
validate26.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data4 < 1 || isNaN(data4)){
validate26.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate26.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate26.errors = vErrors;
return errors === 0;
}

export const Health = validate27;
const schema31 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"health"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"ready":{"type":"boolean"}},"required":["type","bindingRevision","ready"]};

function validate27(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.type === undefined) && (missing0 = "type")) || ((data.bindingRevision === undefined) && (missing0 = "bindingRevision"))) || ((data.ready === undefined) && (missing0 = "ready"))){
validate27.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "type") || (key0 === "bindingRevision")) || (key0 === "ready"))){
validate27.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("health" !== data.type){
validate27.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "health"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.bindingRevision !== undefined){
let data1 = data.bindingRevision;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data1 === "string"){
if(!pattern1.test(data1)){
validate27.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate27.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ready !== undefined){
const _errs5 = errors;
if(typeof data.ready !== "boolean"){
validate27.errors = [{instancePath:instancePath+"/ready",schemaPath:"#/properties/ready/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
else {
validate27.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate27.errors = vErrors;
return errors === 0;
}

export const Delta = validate28;
const schema32 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"delta"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"requestId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"sequence":{"type":"integer","minimum":1,"maximum":2147483647},"text":{"type":"string","maxLength":8192}},"required":["type","sessionId","requestId","bindingRevision","sequence","text"]};

function validate28(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.type === undefined) && (missing0 = "type")) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.bindingRevision === undefined) && (missing0 = "bindingRevision"))) || ((data.sequence === undefined) && (missing0 = "sequence"))) || ((data.text === undefined) && (missing0 = "text"))){
validate28.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "type") || (key0 === "sessionId")) || (key0 === "requestId")) || (key0 === "bindingRevision")) || (key0 === "sequence")) || (key0 === "text"))){
validate28.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("delta" !== data.type){
validate28.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "delta"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sessionId !== undefined){
let data1 = data.sessionId;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data1 === "string"){
if(!pattern1.test(data1)){
validate28.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate28.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestId !== undefined){
let data2 = data.requestId;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data2 === "string"){
if(!pattern1.test(data2)){
validate28.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate28.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.bindingRevision !== undefined){
let data3 = data.bindingRevision;
const _errs7 = errors;
if(errors === _errs7){
if(typeof data3 === "string"){
if(!pattern1.test(data3)){
validate28.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate28.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sequence !== undefined){
let data4 = data.sequence;
const _errs9 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
validate28.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 2147483647 || isNaN(data4)){
validate28.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data4 < 1 || isNaN(data4)){
validate28.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.text !== undefined){
let data5 = data.text;
const _errs11 = errors;
if(errors === _errs11){
if(typeof data5 === "string"){
if(func2(data5) > 8192){
validate28.errors = [{instancePath:instancePath+"/text",schemaPath:"#/properties/text/maxLength",keyword:"maxLength",params:{limit: 8192},message:"must NOT have more than 8192 characters"}];
return false;
}
}
else {
validate28.errors = [{instancePath:instancePath+"/text",schemaPath:"#/properties/text/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate28.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate28.errors = vErrors;
return errors === 0;
}

export const Usage = validate29;
const schema33 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"usage"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"requestId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"inputTokens":{"type":"integer","minimum":0,"maximum":1048576},"outputTokens":{"type":"integer","minimum":0,"maximum":8192},"meteringProfile":{"const":"observable_io_v1"}},"required":["type","sessionId","requestId","bindingRevision","inputTokens","outputTokens","meteringProfile"]};

function validate29(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((data.type === undefined) && (missing0 = "type")) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.bindingRevision === undefined) && (missing0 = "bindingRevision"))) || ((data.inputTokens === undefined) && (missing0 = "inputTokens"))) || ((data.outputTokens === undefined) && (missing0 = "outputTokens"))) || ((data.meteringProfile === undefined) && (missing0 = "meteringProfile"))){
validate29.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((((key0 === "type") || (key0 === "sessionId")) || (key0 === "requestId")) || (key0 === "bindingRevision")) || (key0 === "inputTokens")) || (key0 === "outputTokens")) || (key0 === "meteringProfile"))){
validate29.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("usage" !== data.type){
validate29.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "usage"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sessionId !== undefined){
let data1 = data.sessionId;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data1 === "string"){
if(!pattern1.test(data1)){
validate29.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate29.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestId !== undefined){
let data2 = data.requestId;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data2 === "string"){
if(!pattern1.test(data2)){
validate29.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate29.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.bindingRevision !== undefined){
let data3 = data.bindingRevision;
const _errs7 = errors;
if(errors === _errs7){
if(typeof data3 === "string"){
if(!pattern1.test(data3)){
validate29.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate29.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.inputTokens !== undefined){
let data4 = data.inputTokens;
const _errs9 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
validate29.errors = [{instancePath:instancePath+"/inputTokens",schemaPath:"#/properties/inputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 1048576 || isNaN(data4)){
validate29.errors = [{instancePath:instancePath+"/inputTokens",schemaPath:"#/properties/inputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1048576},message:"must be <= 1048576"}];
return false;
}
else {
if(data4 < 0 || isNaN(data4)){
validate29.errors = [{instancePath:instancePath+"/inputTokens",schemaPath:"#/properties/inputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.outputTokens !== undefined){
let data5 = data.outputTokens;
const _errs11 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
validate29.errors = [{instancePath:instancePath+"/outputTokens",schemaPath:"#/properties/outputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs11){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 8192 || isNaN(data5)){
validate29.errors = [{instancePath:instancePath+"/outputTokens",schemaPath:"#/properties/outputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 8192},message:"must be <= 8192"}];
return false;
}
else {
if(data5 < 0 || isNaN(data5)){
validate29.errors = [{instancePath:instancePath+"/outputTokens",schemaPath:"#/properties/outputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.meteringProfile !== undefined){
const _errs13 = errors;
if("observable_io_v1" !== data.meteringProfile){
validate29.errors = [{instancePath:instancePath+"/meteringProfile",schemaPath:"#/properties/meteringProfile/const",keyword:"const",params:{allowedValue: "observable_io_v1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
else {
validate29.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate29.errors = vErrors;
return errors === 0;
}

export const ListingRevision = validate30;
const schema34 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"listingId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"binding":{"$ref":"#/$defs/ApprovedBinding"},"availability":{"enum":["hot","cold"]},"inputRate":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"outputRate":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"rateDenominator":{"type":"string","pattern":"^[1-9][0-9]{0,18}$"},"capacity":{"type":"integer","minimum":1,"maximum":1048576},"concurrency":{"type":"integer","minimum":1,"maximum":128}},"required":["id","listingId","binding","availability","inputRate","outputRate","rateDenominator","capacity","concurrency"]};
const pattern43 = new RegExp("^[1-9][0-9]{0,18}$", "u");

function validate30(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((((data.id === undefined) && (missing0 = "id")) || ((data.listingId === undefined) && (missing0 = "listingId"))) || ((data.binding === undefined) && (missing0 = "binding"))) || ((data.availability === undefined) && (missing0 = "availability"))) || ((data.inputRate === undefined) && (missing0 = "inputRate"))) || ((data.outputRate === undefined) && (missing0 = "outputRate"))) || ((data.rateDenominator === undefined) && (missing0 = "rateDenominator"))) || ((data.capacity === undefined) && (missing0 = "capacity"))) || ((data.concurrency === undefined) && (missing0 = "concurrency"))){
validate30.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema34.properties, key0))){
validate30.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(!pattern1.test(data0)){
validate30.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate30.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.listingId !== undefined){
let data1 = data.listingId;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data1 === "string"){
if(!pattern1.test(data1)){
validate30.errors = [{instancePath:instancePath+"/listingId",schemaPath:"#/properties/listingId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate30.errors = [{instancePath:instancePath+"/listingId",schemaPath:"#/properties/listingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.binding !== undefined){
const _errs6 = errors;
if(!(validate15(data.binding, {instancePath:instancePath+"/binding",parentData:data,parentDataProperty:"binding",rootData}))){
vErrors = vErrors === null ? validate15.errors : vErrors.concat(validate15.errors);
errors = vErrors.length;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.availability !== undefined){
let data3 = data.availability;
const _errs7 = errors;
if(!((data3 === "hot") || (data3 === "cold"))){
validate30.errors = [{instancePath:instancePath+"/availability",schemaPath:"#/properties/availability/enum",keyword:"enum",params:{allowedValues: schema34.properties.availability.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.inputRate !== undefined){
let data4 = data.inputRate;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data4 === "string"){
if(!pattern0.test(data4)){
validate30.errors = [{instancePath:instancePath+"/inputRate",schemaPath:"#/properties/inputRate/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate30.errors = [{instancePath:instancePath+"/inputRate",schemaPath:"#/properties/inputRate/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.outputRate !== undefined){
let data5 = data.outputRate;
const _errs10 = errors;
if(errors === _errs10){
if(typeof data5 === "string"){
if(!pattern0.test(data5)){
validate30.errors = [{instancePath:instancePath+"/outputRate",schemaPath:"#/properties/outputRate/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate30.errors = [{instancePath:instancePath+"/outputRate",schemaPath:"#/properties/outputRate/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.rateDenominator !== undefined){
let data6 = data.rateDenominator;
const _errs12 = errors;
if(errors === _errs12){
if(typeof data6 === "string"){
if(!pattern43.test(data6)){
validate30.errors = [{instancePath:instancePath+"/rateDenominator",schemaPath:"#/properties/rateDenominator/pattern",keyword:"pattern",params:{pattern: "^[1-9][0-9]{0,18}$"},message:"must match pattern \""+"^[1-9][0-9]{0,18}$"+"\""}];
return false;
}
}
else {
validate30.errors = [{instancePath:instancePath+"/rateDenominator",schemaPath:"#/properties/rateDenominator/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.capacity !== undefined){
let data7 = data.capacity;
const _errs14 = errors;
if(!(((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7)))){
validate30.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs14){
if((typeof data7 == "number") && (isFinite(data7))){
if(data7 > 1048576 || isNaN(data7)){
validate30.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1048576},message:"must be <= 1048576"}];
return false;
}
else {
if(data7 < 1 || isNaN(data7)){
validate30.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.concurrency !== undefined){
let data8 = data.concurrency;
const _errs16 = errors;
if(!(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8)))){
validate30.errors = [{instancePath:instancePath+"/concurrency",schemaPath:"#/properties/concurrency/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs16){
if((typeof data8 == "number") && (isFinite(data8))){
if(data8 > 128 || isNaN(data8)){
validate30.errors = [{instancePath:instancePath+"/concurrency",schemaPath:"#/properties/concurrency/maximum",keyword:"maximum",params:{comparison: "<=", limit: 128},message:"must be <= 128"}];
return false;
}
else {
if(data8 < 1 || isNaN(data8)){
validate30.errors = [{instancePath:instancePath+"/concurrency",schemaPath:"#/properties/concurrency/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate30.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate30.errors = vErrors;
return errors === 0;
}

export const Quote = validate32;
const schema35 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"listingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"buyerId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"expiresUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991},"maximumCharge":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"outputQuota":{"type":"integer","minimum":1,"maximum":1048576},"concurrency":{"type":"integer","minimum":1,"maximum":128},"providerBond":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"}},"required":["id","listingRevision","buyerId","expiresUnixMs","maximumCharge","outputQuota","concurrency","providerBond"]};

function validate32(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((((data.id === undefined) && (missing0 = "id")) || ((data.listingRevision === undefined) && (missing0 = "listingRevision"))) || ((data.buyerId === undefined) && (missing0 = "buyerId"))) || ((data.expiresUnixMs === undefined) && (missing0 = "expiresUnixMs"))) || ((data.maximumCharge === undefined) && (missing0 = "maximumCharge"))) || ((data.outputQuota === undefined) && (missing0 = "outputQuota"))) || ((data.concurrency === undefined) && (missing0 = "concurrency"))) || ((data.providerBond === undefined) && (missing0 = "providerBond"))){
validate32.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((((key0 === "id") || (key0 === "listingRevision")) || (key0 === "buyerId")) || (key0 === "expiresUnixMs")) || (key0 === "maximumCharge")) || (key0 === "outputQuota")) || (key0 === "concurrency")) || (key0 === "providerBond"))){
validate32.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(!pattern1.test(data0)){
validate32.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate32.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.listingRevision !== undefined){
let data1 = data.listingRevision;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data1 === "string"){
if(!pattern1.test(data1)){
validate32.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate32.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.buyerId !== undefined){
let data2 = data.buyerId;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data2 === "string"){
if(!pattern1.test(data2)){
validate32.errors = [{instancePath:instancePath+"/buyerId",schemaPath:"#/properties/buyerId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate32.errors = [{instancePath:instancePath+"/buyerId",schemaPath:"#/properties/buyerId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.expiresUnixMs !== undefined){
let data3 = data.expiresUnixMs;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate32.errors = [{instancePath:instancePath+"/expiresUnixMs",schemaPath:"#/properties/expiresUnixMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate32.errors = [{instancePath:instancePath+"/expiresUnixMs",schemaPath:"#/properties/expiresUnixMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 1 || isNaN(data3)){
validate32.errors = [{instancePath:instancePath+"/expiresUnixMs",schemaPath:"#/properties/expiresUnixMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.maximumCharge !== undefined){
let data4 = data.maximumCharge;
const _errs10 = errors;
if(errors === _errs10){
if(typeof data4 === "string"){
if(!pattern0.test(data4)){
validate32.errors = [{instancePath:instancePath+"/maximumCharge",schemaPath:"#/properties/maximumCharge/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate32.errors = [{instancePath:instancePath+"/maximumCharge",schemaPath:"#/properties/maximumCharge/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.outputQuota !== undefined){
let data5 = data.outputQuota;
const _errs12 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
validate32.errors = [{instancePath:instancePath+"/outputQuota",schemaPath:"#/properties/outputQuota/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs12){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 1048576 || isNaN(data5)){
validate32.errors = [{instancePath:instancePath+"/outputQuota",schemaPath:"#/properties/outputQuota/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1048576},message:"must be <= 1048576"}];
return false;
}
else {
if(data5 < 1 || isNaN(data5)){
validate32.errors = [{instancePath:instancePath+"/outputQuota",schemaPath:"#/properties/outputQuota/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.concurrency !== undefined){
let data6 = data.concurrency;
const _errs14 = errors;
if(!(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6)))){
validate32.errors = [{instancePath:instancePath+"/concurrency",schemaPath:"#/properties/concurrency/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs14){
if((typeof data6 == "number") && (isFinite(data6))){
if(data6 > 128 || isNaN(data6)){
validate32.errors = [{instancePath:instancePath+"/concurrency",schemaPath:"#/properties/concurrency/maximum",keyword:"maximum",params:{comparison: "<=", limit: 128},message:"must be <= 128"}];
return false;
}
else {
if(data6 < 1 || isNaN(data6)){
validate32.errors = [{instancePath:instancePath+"/concurrency",schemaPath:"#/properties/concurrency/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.providerBond !== undefined){
let data7 = data.providerBond;
const _errs16 = errors;
if(errors === _errs16){
if(typeof data7 === "string"){
if(!pattern0.test(data7)){
validate32.errors = [{instancePath:instancePath+"/providerBond",schemaPath:"#/properties/providerBond/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate32.errors = [{instancePath:instancePath+"/providerBond",schemaPath:"#/properties/providerBond/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
else {
validate32.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate32.errors = vErrors;
return errors === 0;
}

export const Session = validate33;
const schema36 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"quoteId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"listingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"state":{"enum":["reserved","funding","funded","activating","verifying","ready","active","stopping","settlement_pending","settled","refunded","disputed"]},"funded":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"reserved":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"charged":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"}},"required":["id","quoteId","listingRevision","state","funded","reserved","charged"]};

function validate33(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((data.id === undefined) && (missing0 = "id")) || ((data.quoteId === undefined) && (missing0 = "quoteId"))) || ((data.listingRevision === undefined) && (missing0 = "listingRevision"))) || ((data.state === undefined) && (missing0 = "state"))) || ((data.funded === undefined) && (missing0 = "funded"))) || ((data.reserved === undefined) && (missing0 = "reserved"))) || ((data.charged === undefined) && (missing0 = "charged"))){
validate33.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((((key0 === "id") || (key0 === "quoteId")) || (key0 === "listingRevision")) || (key0 === "state")) || (key0 === "funded")) || (key0 === "reserved")) || (key0 === "charged"))){
validate33.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(!pattern1.test(data0)){
validate33.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate33.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.quoteId !== undefined){
let data1 = data.quoteId;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data1 === "string"){
if(!pattern1.test(data1)){
validate33.errors = [{instancePath:instancePath+"/quoteId",schemaPath:"#/properties/quoteId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate33.errors = [{instancePath:instancePath+"/quoteId",schemaPath:"#/properties/quoteId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.listingRevision !== undefined){
let data2 = data.listingRevision;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data2 === "string"){
if(!pattern1.test(data2)){
validate33.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate33.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.state !== undefined){
let data3 = data.state;
const _errs8 = errors;
if(!((((((((((((data3 === "reserved") || (data3 === "funding")) || (data3 === "funded")) || (data3 === "activating")) || (data3 === "verifying")) || (data3 === "ready")) || (data3 === "active")) || (data3 === "stopping")) || (data3 === "settlement_pending")) || (data3 === "settled")) || (data3 === "refunded")) || (data3 === "disputed"))){
validate33.errors = [{instancePath:instancePath+"/state",schemaPath:"#/properties/state/enum",keyword:"enum",params:{allowedValues: schema36.properties.state.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.funded !== undefined){
let data4 = data.funded;
const _errs9 = errors;
if(errors === _errs9){
if(typeof data4 === "string"){
if(!pattern0.test(data4)){
validate33.errors = [{instancePath:instancePath+"/funded",schemaPath:"#/properties/funded/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate33.errors = [{instancePath:instancePath+"/funded",schemaPath:"#/properties/funded/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.reserved !== undefined){
let data5 = data.reserved;
const _errs11 = errors;
if(errors === _errs11){
if(typeof data5 === "string"){
if(!pattern0.test(data5)){
validate33.errors = [{instancePath:instancePath+"/reserved",schemaPath:"#/properties/reserved/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate33.errors = [{instancePath:instancePath+"/reserved",schemaPath:"#/properties/reserved/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.charged !== undefined){
let data6 = data.charged;
const _errs13 = errors;
if(errors === _errs13){
if(typeof data6 === "string"){
if(!pattern0.test(data6)){
validate33.errors = [{instancePath:instancePath+"/charged",schemaPath:"#/properties/charged/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate33.errors = [{instancePath:instancePath+"/charged",schemaPath:"#/properties/charged/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
else {
validate33.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate33.errors = vErrors;
return errors === 0;
}

export const UsageReceipt = validate34;
const schema37 = {"type":"object","additionalProperties":false,"properties":{"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"requestId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"listingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"providerNodeId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"sequence":{"type":"integer","minimum":1,"maximum":2147483647},"timestampUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991},"inputTokens":{"type":"integer","minimum":0,"maximum":1048576},"outputTokens":{"type":"integer","minimum":0,"maximum":8192},"cumulativeCharge":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"cumulativeFee":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"meteringProfile":{"const":"observable_io_v1"},"signerId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"signature":{"type":"string","pattern":"^[A-Za-z0-9_-]{86}$"}},"required":["sessionId","requestId","bindingRevision","listingRevision","providerNodeId","sequence","timestampUnixMs","inputTokens","outputTokens","cumulativeCharge","cumulativeFee","meteringProfile","signerId","signature"]};
const pattern63 = new RegExp("^[A-Za-z0-9_-]{86}$", "u");

function validate34(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((((((((((data.sessionId === undefined) && (missing0 = "sessionId")) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.bindingRevision === undefined) && (missing0 = "bindingRevision"))) || ((data.listingRevision === undefined) && (missing0 = "listingRevision"))) || ((data.providerNodeId === undefined) && (missing0 = "providerNodeId"))) || ((data.sequence === undefined) && (missing0 = "sequence"))) || ((data.timestampUnixMs === undefined) && (missing0 = "timestampUnixMs"))) || ((data.inputTokens === undefined) && (missing0 = "inputTokens"))) || ((data.outputTokens === undefined) && (missing0 = "outputTokens"))) || ((data.cumulativeCharge === undefined) && (missing0 = "cumulativeCharge"))) || ((data.cumulativeFee === undefined) && (missing0 = "cumulativeFee"))) || ((data.meteringProfile === undefined) && (missing0 = "meteringProfile"))) || ((data.signerId === undefined) && (missing0 = "signerId"))) || ((data.signature === undefined) && (missing0 = "signature"))){
validate34.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema37.properties, key0))){
validate34.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.sessionId !== undefined){
let data0 = data.sessionId;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(!pattern1.test(data0)){
validate34.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate34.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestId !== undefined){
let data1 = data.requestId;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data1 === "string"){
if(!pattern1.test(data1)){
validate34.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate34.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.bindingRevision !== undefined){
let data2 = data.bindingRevision;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data2 === "string"){
if(!pattern1.test(data2)){
validate34.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate34.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.listingRevision !== undefined){
let data3 = data.listingRevision;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data3 === "string"){
if(!pattern1.test(data3)){
validate34.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate34.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.providerNodeId !== undefined){
let data4 = data.providerNodeId;
const _errs10 = errors;
if(errors === _errs10){
if(typeof data4 === "string"){
if(!pattern1.test(data4)){
validate34.errors = [{instancePath:instancePath+"/providerNodeId",schemaPath:"#/properties/providerNodeId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate34.errors = [{instancePath:instancePath+"/providerNodeId",schemaPath:"#/properties/providerNodeId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sequence !== undefined){
let data5 = data.sequence;
const _errs12 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
validate34.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs12){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 2147483647 || isNaN(data5)){
validate34.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data5 < 1 || isNaN(data5)){
validate34.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.timestampUnixMs !== undefined){
let data6 = data.timestampUnixMs;
const _errs14 = errors;
if(!(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6)))){
validate34.errors = [{instancePath:instancePath+"/timestampUnixMs",schemaPath:"#/properties/timestampUnixMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs14){
if((typeof data6 == "number") && (isFinite(data6))){
if(data6 > 9007199254740991 || isNaN(data6)){
validate34.errors = [{instancePath:instancePath+"/timestampUnixMs",schemaPath:"#/properties/timestampUnixMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data6 < 1 || isNaN(data6)){
validate34.errors = [{instancePath:instancePath+"/timestampUnixMs",schemaPath:"#/properties/timestampUnixMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.inputTokens !== undefined){
let data7 = data.inputTokens;
const _errs16 = errors;
if(!(((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7)))){
validate34.errors = [{instancePath:instancePath+"/inputTokens",schemaPath:"#/properties/inputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs16){
if((typeof data7 == "number") && (isFinite(data7))){
if(data7 > 1048576 || isNaN(data7)){
validate34.errors = [{instancePath:instancePath+"/inputTokens",schemaPath:"#/properties/inputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1048576},message:"must be <= 1048576"}];
return false;
}
else {
if(data7 < 0 || isNaN(data7)){
validate34.errors = [{instancePath:instancePath+"/inputTokens",schemaPath:"#/properties/inputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.outputTokens !== undefined){
let data8 = data.outputTokens;
const _errs18 = errors;
if(!(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8)))){
validate34.errors = [{instancePath:instancePath+"/outputTokens",schemaPath:"#/properties/outputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs18){
if((typeof data8 == "number") && (isFinite(data8))){
if(data8 > 8192 || isNaN(data8)){
validate34.errors = [{instancePath:instancePath+"/outputTokens",schemaPath:"#/properties/outputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 8192},message:"must be <= 8192"}];
return false;
}
else {
if(data8 < 0 || isNaN(data8)){
validate34.errors = [{instancePath:instancePath+"/outputTokens",schemaPath:"#/properties/outputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs18 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.cumulativeCharge !== undefined){
let data9 = data.cumulativeCharge;
const _errs20 = errors;
if(errors === _errs20){
if(typeof data9 === "string"){
if(!pattern0.test(data9)){
validate34.errors = [{instancePath:instancePath+"/cumulativeCharge",schemaPath:"#/properties/cumulativeCharge/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate34.errors = [{instancePath:instancePath+"/cumulativeCharge",schemaPath:"#/properties/cumulativeCharge/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs20 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.cumulativeFee !== undefined){
let data10 = data.cumulativeFee;
const _errs22 = errors;
if(errors === _errs22){
if(typeof data10 === "string"){
if(!pattern0.test(data10)){
validate34.errors = [{instancePath:instancePath+"/cumulativeFee",schemaPath:"#/properties/cumulativeFee/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate34.errors = [{instancePath:instancePath+"/cumulativeFee",schemaPath:"#/properties/cumulativeFee/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs22 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.meteringProfile !== undefined){
const _errs24 = errors;
if("observable_io_v1" !== data.meteringProfile){
validate34.errors = [{instancePath:instancePath+"/meteringProfile",schemaPath:"#/properties/meteringProfile/const",keyword:"const",params:{allowedValue: "observable_io_v1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs24 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.signerId !== undefined){
let data12 = data.signerId;
const _errs25 = errors;
if(errors === _errs25){
if(typeof data12 === "string"){
if(!pattern1.test(data12)){
validate34.errors = [{instancePath:instancePath+"/signerId",schemaPath:"#/properties/signerId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate34.errors = [{instancePath:instancePath+"/signerId",schemaPath:"#/properties/signerId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs25 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.signature !== undefined){
let data13 = data.signature;
const _errs27 = errors;
if(errors === _errs27){
if(typeof data13 === "string"){
if(!pattern63.test(data13)){
validate34.errors = [{instancePath:instancePath+"/signature",schemaPath:"#/properties/signature/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z0-9_-]{86}$"},message:"must match pattern \""+"^[A-Za-z0-9_-]{86}$"+"\""}];
return false;
}
}
else {
validate34.errors = [{instancePath:instancePath+"/signature",schemaPath:"#/properties/signature/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs27 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate34.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate34.errors = vErrors;
return errors === 0;
}

export const AgentPermission = validate35;
const schema38 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"expiresUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991},"maximumCharge":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"maxOutputTokens":{"type":"integer","minimum":1,"maximum":8192},"concurrency":{"type":"integer","minimum":1,"maximum":128},"scopes":{"type":"array","minItems":1,"maxItems":2,"uniqueItems":true,"items":{"enum":["marketplace:infer","marketplace:stop"]}}},"required":["id","sessionId","expiresUnixMs","maximumCharge","maxOutputTokens","concurrency","scopes"]};
const func0 = require("ajv/dist/runtime/equal").default;

function validate35(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((data.id === undefined) && (missing0 = "id")) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.expiresUnixMs === undefined) && (missing0 = "expiresUnixMs"))) || ((data.maximumCharge === undefined) && (missing0 = "maximumCharge"))) || ((data.maxOutputTokens === undefined) && (missing0 = "maxOutputTokens"))) || ((data.concurrency === undefined) && (missing0 = "concurrency"))) || ((data.scopes === undefined) && (missing0 = "scopes"))){
validate35.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((((key0 === "id") || (key0 === "sessionId")) || (key0 === "expiresUnixMs")) || (key0 === "maximumCharge")) || (key0 === "maxOutputTokens")) || (key0 === "concurrency")) || (key0 === "scopes"))){
validate35.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(!pattern1.test(data0)){
validate35.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate35.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sessionId !== undefined){
let data1 = data.sessionId;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data1 === "string"){
if(!pattern1.test(data1)){
validate35.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate35.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.expiresUnixMs !== undefined){
let data2 = data.expiresUnixMs;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate35.errors = [{instancePath:instancePath+"/expiresUnixMs",schemaPath:"#/properties/expiresUnixMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate35.errors = [{instancePath:instancePath+"/expiresUnixMs",schemaPath:"#/properties/expiresUnixMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 1 || isNaN(data2)){
validate35.errors = [{instancePath:instancePath+"/expiresUnixMs",schemaPath:"#/properties/expiresUnixMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.maximumCharge !== undefined){
let data3 = data.maximumCharge;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data3 === "string"){
if(!pattern0.test(data3)){
validate35.errors = [{instancePath:instancePath+"/maximumCharge",schemaPath:"#/properties/maximumCharge/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate35.errors = [{instancePath:instancePath+"/maximumCharge",schemaPath:"#/properties/maximumCharge/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.maxOutputTokens !== undefined){
let data4 = data.maxOutputTokens;
const _errs10 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
validate35.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs10){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 8192 || isNaN(data4)){
validate35.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 8192},message:"must be <= 8192"}];
return false;
}
else {
if(data4 < 1 || isNaN(data4)){
validate35.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.concurrency !== undefined){
let data5 = data.concurrency;
const _errs12 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
validate35.errors = [{instancePath:instancePath+"/concurrency",schemaPath:"#/properties/concurrency/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs12){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 128 || isNaN(data5)){
validate35.errors = [{instancePath:instancePath+"/concurrency",schemaPath:"#/properties/concurrency/maximum",keyword:"maximum",params:{comparison: "<=", limit: 128},message:"must be <= 128"}];
return false;
}
else {
if(data5 < 1 || isNaN(data5)){
validate35.errors = [{instancePath:instancePath+"/concurrency",schemaPath:"#/properties/concurrency/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.scopes !== undefined){
let data6 = data.scopes;
const _errs14 = errors;
if(errors === _errs14){
if(Array.isArray(data6)){
if(data6.length > 2){
validate35.errors = [{instancePath:instancePath+"/scopes",schemaPath:"#/properties/scopes/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"}];
return false;
}
else {
if(data6.length < 1){
validate35.errors = [{instancePath:instancePath+"/scopes",schemaPath:"#/properties/scopes/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid1 = true;
const len0 = data6.length;
for(let i0=0; i0<len0; i0++){
let data7 = data6[i0];
const _errs16 = errors;
if(!((data7 === "marketplace:infer") || (data7 === "marketplace:stop"))){
validate35.errors = [{instancePath:instancePath+"/scopes/" + i0,schemaPath:"#/properties/scopes/items/enum",keyword:"enum",params:{allowedValues: schema38.properties.scopes.items.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid1 = _errs16 === errors;
if(!valid1){
break;
}
}
if(valid1){
let i1 = data6.length;
let j0;
if(i1 > 1){
outer0:
for(;i1--;){
for(j0 = i1; j0--;){
if(func0(data6[i1], data6[j0])){
validate35.errors = [{instancePath:instancePath+"/scopes",schemaPath:"#/properties/scopes/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"}];
return false;
break outer0;
}
}
}
}
}
}
}
}
else {
validate35.errors = [{instancePath:instancePath+"/scopes",schemaPath:"#/properties/scopes/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
else {
validate35.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate35.errors = vErrors;
return errors === 0;
}

export const EvaluationSummary = validate36;
const schema39 = {"type":"object","additionalProperties":false,"properties":{"cancellationRequestId":{"anyOf":[{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},{"type":"null"}]},"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"sessionId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"listingId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"listingRevision":{"type":"integer","minimum":1,"maximum":2147483647},"provisional":{"type":"boolean"},"version":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"sampleCount":{"type":"integer","minimum":1,"maximum":1000},"elapsedMs":{"type":"integer","minimum":1,"maximum":86400000},"passed":{"type":"boolean"},"recordedAt":{"type":"integer","minimum":0,"maximum":9007199254740991},"freshUntil":{"type":"integer","minimum":1,"maximum":9007199254740991},"checks":{"type":"object","additionalProperties":false,"properties":{"format":{"type":"boolean"},"tools":{"type":"boolean"},"usage":{"type":"boolean"},"cancellation":{"type":"boolean"},"offlineExecution":{"type":"boolean"}},"required":["format","tools","usage","cancellation","offlineExecution"]}},"required":["cancellationRequestId","id","sessionId","listingId","listingRevision","provisional","version","sampleCount","elapsedMs","passed","recordedAt","freshUntil","checks"]};
const pattern67 = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", "u");
const pattern71 = new RegExp("^[\\x20-\\x7e]+$", "u");

function validate36(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((((((((data.cancellationRequestId === undefined) && (missing0 = "cancellationRequestId")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.listingId === undefined) && (missing0 = "listingId"))) || ((data.listingRevision === undefined) && (missing0 = "listingRevision"))) || ((data.provisional === undefined) && (missing0 = "provisional"))) || ((data.version === undefined) && (missing0 = "version"))) || ((data.sampleCount === undefined) && (missing0 = "sampleCount"))) || ((data.elapsedMs === undefined) && (missing0 = "elapsedMs"))) || ((data.passed === undefined) && (missing0 = "passed"))) || ((data.recordedAt === undefined) && (missing0 = "recordedAt"))) || ((data.freshUntil === undefined) && (missing0 = "freshUntil"))) || ((data.checks === undefined) && (missing0 = "checks"))){
validate36.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema39.properties, key0))){
validate36.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.cancellationRequestId !== undefined){
let data0 = data.cancellationRequestId;
const _errs2 = errors;
const _errs3 = errors;
let valid1 = false;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data0 === "string"){
if(!pattern67.test(data0)){
const err0 = {instancePath:instancePath+"/cancellationRequestId",schemaPath:"#/properties/cancellationRequestId/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
else {
const err1 = {instancePath:instancePath+"/cancellationRequestId",schemaPath:"#/properties/cancellationRequestId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var _valid0 = _errs4 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs6 = errors;
if(data0 !== null){
const err2 = {instancePath:instancePath+"/cancellationRequestId",schemaPath:"#/properties/cancellationRequestId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var _valid0 = _errs6 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err3 = {instancePath:instancePath+"/cancellationRequestId",schemaPath:"#/properties/cancellationRequestId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
validate36.errors = vErrors;
return false;
}
else {
errors = _errs3;
if(vErrors !== null){
if(_errs3){
vErrors.length = _errs3;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data1 === "string"){
if(!pattern67.test(data1)){
validate36.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate36.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sessionId !== undefined){
let data2 = data.sessionId;
const _errs10 = errors;
if(errors === _errs10){
if(typeof data2 === "string"){
if(!pattern67.test(data2)){
validate36.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate36.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.listingId !== undefined){
let data3 = data.listingId;
const _errs12 = errors;
if(errors === _errs12){
if(typeof data3 === "string"){
if(!pattern67.test(data3)){
validate36.errors = [{instancePath:instancePath+"/listingId",schemaPath:"#/properties/listingId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate36.errors = [{instancePath:instancePath+"/listingId",schemaPath:"#/properties/listingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.listingRevision !== undefined){
let data4 = data.listingRevision;
const _errs14 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
validate36.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs14){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 2147483647 || isNaN(data4)){
validate36.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data4 < 1 || isNaN(data4)){
validate36.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.provisional !== undefined){
const _errs16 = errors;
if(typeof data.provisional !== "boolean"){
validate36.errors = [{instancePath:instancePath+"/provisional",schemaPath:"#/properties/provisional/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.version !== undefined){
let data6 = data.version;
const _errs18 = errors;
if(errors === _errs18){
if(typeof data6 === "string"){
if(func2(data6) > 120){
validate36.errors = [{instancePath:instancePath+"/version",schemaPath:"#/properties/version/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data6) < 1){
validate36.errors = [{instancePath:instancePath+"/version",schemaPath:"#/properties/version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data6)){
validate36.errors = [{instancePath:instancePath+"/version",schemaPath:"#/properties/version/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate36.errors = [{instancePath:instancePath+"/version",schemaPath:"#/properties/version/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs18 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sampleCount !== undefined){
let data7 = data.sampleCount;
const _errs20 = errors;
if(!(((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7)))){
validate36.errors = [{instancePath:instancePath+"/sampleCount",schemaPath:"#/properties/sampleCount/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs20){
if((typeof data7 == "number") && (isFinite(data7))){
if(data7 > 1000 || isNaN(data7)){
validate36.errors = [{instancePath:instancePath+"/sampleCount",schemaPath:"#/properties/sampleCount/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000},message:"must be <= 1000"}];
return false;
}
else {
if(data7 < 1 || isNaN(data7)){
validate36.errors = [{instancePath:instancePath+"/sampleCount",schemaPath:"#/properties/sampleCount/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs20 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.elapsedMs !== undefined){
let data8 = data.elapsedMs;
const _errs22 = errors;
if(!(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8)))){
validate36.errors = [{instancePath:instancePath+"/elapsedMs",schemaPath:"#/properties/elapsedMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs22){
if((typeof data8 == "number") && (isFinite(data8))){
if(data8 > 86400000 || isNaN(data8)){
validate36.errors = [{instancePath:instancePath+"/elapsedMs",schemaPath:"#/properties/elapsedMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 86400000},message:"must be <= 86400000"}];
return false;
}
else {
if(data8 < 1 || isNaN(data8)){
validate36.errors = [{instancePath:instancePath+"/elapsedMs",schemaPath:"#/properties/elapsedMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs22 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.passed !== undefined){
const _errs24 = errors;
if(typeof data.passed !== "boolean"){
validate36.errors = [{instancePath:instancePath+"/passed",schemaPath:"#/properties/passed/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs24 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.recordedAt !== undefined){
let data10 = data.recordedAt;
const _errs26 = errors;
if(!(((typeof data10 == "number") && (!(data10 % 1) && !isNaN(data10))) && (isFinite(data10)))){
validate36.errors = [{instancePath:instancePath+"/recordedAt",schemaPath:"#/properties/recordedAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs26){
if((typeof data10 == "number") && (isFinite(data10))){
if(data10 > 9007199254740991 || isNaN(data10)){
validate36.errors = [{instancePath:instancePath+"/recordedAt",schemaPath:"#/properties/recordedAt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data10 < 0 || isNaN(data10)){
validate36.errors = [{instancePath:instancePath+"/recordedAt",schemaPath:"#/properties/recordedAt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs26 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.freshUntil !== undefined){
let data11 = data.freshUntil;
const _errs28 = errors;
if(!(((typeof data11 == "number") && (!(data11 % 1) && !isNaN(data11))) && (isFinite(data11)))){
validate36.errors = [{instancePath:instancePath+"/freshUntil",schemaPath:"#/properties/freshUntil/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs28){
if((typeof data11 == "number") && (isFinite(data11))){
if(data11 > 9007199254740991 || isNaN(data11)){
validate36.errors = [{instancePath:instancePath+"/freshUntil",schemaPath:"#/properties/freshUntil/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data11 < 1 || isNaN(data11)){
validate36.errors = [{instancePath:instancePath+"/freshUntil",schemaPath:"#/properties/freshUntil/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs28 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.checks !== undefined){
let data12 = data.checks;
const _errs30 = errors;
if(errors === _errs30){
if(data12 && typeof data12 == "object" && !Array.isArray(data12)){
let missing1;
if((((((data12.format === undefined) && (missing1 = "format")) || ((data12.tools === undefined) && (missing1 = "tools"))) || ((data12.usage === undefined) && (missing1 = "usage"))) || ((data12.cancellation === undefined) && (missing1 = "cancellation"))) || ((data12.offlineExecution === undefined) && (missing1 = "offlineExecution"))){
validate36.errors = [{instancePath:instancePath+"/checks",schemaPath:"#/properties/checks/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs32 = errors;
for(const key1 in data12){
if(!(((((key1 === "format") || (key1 === "tools")) || (key1 === "usage")) || (key1 === "cancellation")) || (key1 === "offlineExecution"))){
validate36.errors = [{instancePath:instancePath+"/checks",schemaPath:"#/properties/checks/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs32 === errors){
if(data12.format !== undefined){
const _errs33 = errors;
if(typeof data12.format !== "boolean"){
validate36.errors = [{instancePath:instancePath+"/checks/format",schemaPath:"#/properties/checks/properties/format/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid2 = _errs33 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data12.tools !== undefined){
const _errs35 = errors;
if(typeof data12.tools !== "boolean"){
validate36.errors = [{instancePath:instancePath+"/checks/tools",schemaPath:"#/properties/checks/properties/tools/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid2 = _errs35 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data12.usage !== undefined){
const _errs37 = errors;
if(typeof data12.usage !== "boolean"){
validate36.errors = [{instancePath:instancePath+"/checks/usage",schemaPath:"#/properties/checks/properties/usage/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid2 = _errs37 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data12.cancellation !== undefined){
const _errs39 = errors;
if(typeof data12.cancellation !== "boolean"){
validate36.errors = [{instancePath:instancePath+"/checks/cancellation",schemaPath:"#/properties/checks/properties/cancellation/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid2 = _errs39 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data12.offlineExecution !== undefined){
const _errs41 = errors;
if(typeof data12.offlineExecution !== "boolean"){
validate36.errors = [{instancePath:instancePath+"/checks/offlineExecution",schemaPath:"#/properties/checks/properties/offlineExecution/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid2 = _errs41 === errors;
}
else {
var valid2 = true;
}
}
}
}
}
}
}
}
else {
validate36.errors = [{instancePath:instancePath+"/checks",schemaPath:"#/properties/checks/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs30 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate36.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate36.errors = vErrors;
return errors === 0;
}

export const EvaluationResult = validate37;
const schema40 = {"type":"object","additionalProperties":false,"properties":{"sessionId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"listingId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"listingRevision":{"type":"integer","minimum":1,"maximum":2147483647},"version":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"sampleCount":{"type":"integer","minimum":1,"maximum":1000},"elapsedMs":{"type":"integer","minimum":1,"maximum":86400000},"freshUntil":{"type":"integer","minimum":1,"maximum":9007199254740991},"evidenceReference":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"checks":{"type":"object","additionalProperties":false,"properties":{"format":{"type":"boolean"},"tools":{"type":"boolean"},"usage":{"type":"boolean"},"cancellation":{"const":false},"offlineExecution":{"type":"boolean"}},"required":["format","tools","usage","cancellation","offlineExecution"]}},"required":["sessionId","listingId","listingRevision","version","sampleCount","elapsedMs","freshUntil","evidenceReference","checks"]};

function validate37(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((((data.sessionId === undefined) && (missing0 = "sessionId")) || ((data.listingId === undefined) && (missing0 = "listingId"))) || ((data.listingRevision === undefined) && (missing0 = "listingRevision"))) || ((data.version === undefined) && (missing0 = "version"))) || ((data.sampleCount === undefined) && (missing0 = "sampleCount"))) || ((data.elapsedMs === undefined) && (missing0 = "elapsedMs"))) || ((data.freshUntil === undefined) && (missing0 = "freshUntil"))) || ((data.evidenceReference === undefined) && (missing0 = "evidenceReference"))) || ((data.checks === undefined) && (missing0 = "checks"))){
validate37.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema40.properties, key0))){
validate37.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.sessionId !== undefined){
let data0 = data.sessionId;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(!pattern67.test(data0)){
validate37.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate37.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.listingId !== undefined){
let data1 = data.listingId;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data1 === "string"){
if(!pattern67.test(data1)){
validate37.errors = [{instancePath:instancePath+"/listingId",schemaPath:"#/properties/listingId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate37.errors = [{instancePath:instancePath+"/listingId",schemaPath:"#/properties/listingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.listingRevision !== undefined){
let data2 = data.listingRevision;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate37.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 2147483647 || isNaN(data2)){
validate37.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data2 < 1 || isNaN(data2)){
validate37.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.version !== undefined){
let data3 = data.version;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data3 === "string"){
if(func2(data3) > 120){
validate37.errors = [{instancePath:instancePath+"/version",schemaPath:"#/properties/version/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data3) < 1){
validate37.errors = [{instancePath:instancePath+"/version",schemaPath:"#/properties/version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data3)){
validate37.errors = [{instancePath:instancePath+"/version",schemaPath:"#/properties/version/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate37.errors = [{instancePath:instancePath+"/version",schemaPath:"#/properties/version/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sampleCount !== undefined){
let data4 = data.sampleCount;
const _errs10 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
validate37.errors = [{instancePath:instancePath+"/sampleCount",schemaPath:"#/properties/sampleCount/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs10){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 1000 || isNaN(data4)){
validate37.errors = [{instancePath:instancePath+"/sampleCount",schemaPath:"#/properties/sampleCount/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000},message:"must be <= 1000"}];
return false;
}
else {
if(data4 < 1 || isNaN(data4)){
validate37.errors = [{instancePath:instancePath+"/sampleCount",schemaPath:"#/properties/sampleCount/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.elapsedMs !== undefined){
let data5 = data.elapsedMs;
const _errs12 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
validate37.errors = [{instancePath:instancePath+"/elapsedMs",schemaPath:"#/properties/elapsedMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs12){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 86400000 || isNaN(data5)){
validate37.errors = [{instancePath:instancePath+"/elapsedMs",schemaPath:"#/properties/elapsedMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 86400000},message:"must be <= 86400000"}];
return false;
}
else {
if(data5 < 1 || isNaN(data5)){
validate37.errors = [{instancePath:instancePath+"/elapsedMs",schemaPath:"#/properties/elapsedMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.freshUntil !== undefined){
let data6 = data.freshUntil;
const _errs14 = errors;
if(!(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6)))){
validate37.errors = [{instancePath:instancePath+"/freshUntil",schemaPath:"#/properties/freshUntil/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs14){
if((typeof data6 == "number") && (isFinite(data6))){
if(data6 > 9007199254740991 || isNaN(data6)){
validate37.errors = [{instancePath:instancePath+"/freshUntil",schemaPath:"#/properties/freshUntil/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data6 < 1 || isNaN(data6)){
validate37.errors = [{instancePath:instancePath+"/freshUntil",schemaPath:"#/properties/freshUntil/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.evidenceReference !== undefined){
let data7 = data.evidenceReference;
const _errs16 = errors;
if(errors === _errs16){
if(typeof data7 === "string"){
if(func2(data7) > 120){
validate37.errors = [{instancePath:instancePath+"/evidenceReference",schemaPath:"#/properties/evidenceReference/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data7) < 1){
validate37.errors = [{instancePath:instancePath+"/evidenceReference",schemaPath:"#/properties/evidenceReference/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data7)){
validate37.errors = [{instancePath:instancePath+"/evidenceReference",schemaPath:"#/properties/evidenceReference/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate37.errors = [{instancePath:instancePath+"/evidenceReference",schemaPath:"#/properties/evidenceReference/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.checks !== undefined){
let data8 = data.checks;
const _errs18 = errors;
if(errors === _errs18){
if(data8 && typeof data8 == "object" && !Array.isArray(data8)){
let missing1;
if((((((data8.format === undefined) && (missing1 = "format")) || ((data8.tools === undefined) && (missing1 = "tools"))) || ((data8.usage === undefined) && (missing1 = "usage"))) || ((data8.cancellation === undefined) && (missing1 = "cancellation"))) || ((data8.offlineExecution === undefined) && (missing1 = "offlineExecution"))){
validate37.errors = [{instancePath:instancePath+"/checks",schemaPath:"#/properties/checks/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs20 = errors;
for(const key1 in data8){
if(!(((((key1 === "format") || (key1 === "tools")) || (key1 === "usage")) || (key1 === "cancellation")) || (key1 === "offlineExecution"))){
validate37.errors = [{instancePath:instancePath+"/checks",schemaPath:"#/properties/checks/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs20 === errors){
if(data8.format !== undefined){
const _errs21 = errors;
if(typeof data8.format !== "boolean"){
validate37.errors = [{instancePath:instancePath+"/checks/format",schemaPath:"#/properties/checks/properties/format/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid1 = _errs21 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data8.tools !== undefined){
const _errs23 = errors;
if(typeof data8.tools !== "boolean"){
validate37.errors = [{instancePath:instancePath+"/checks/tools",schemaPath:"#/properties/checks/properties/tools/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid1 = _errs23 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data8.usage !== undefined){
const _errs25 = errors;
if(typeof data8.usage !== "boolean"){
validate37.errors = [{instancePath:instancePath+"/checks/usage",schemaPath:"#/properties/checks/properties/usage/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid1 = _errs25 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data8.cancellation !== undefined){
const _errs27 = errors;
if(false !== data8.cancellation){
validate37.errors = [{instancePath:instancePath+"/checks/cancellation",schemaPath:"#/properties/checks/properties/cancellation/const",keyword:"const",params:{allowedValue: false},message:"must be equal to constant"}];
return false;
}
var valid1 = _errs27 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data8.offlineExecution !== undefined){
const _errs28 = errors;
if(typeof data8.offlineExecution !== "boolean"){
validate37.errors = [{instancePath:instancePath+"/checks/offlineExecution",schemaPath:"#/properties/checks/properties/offlineExecution/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid1 = _errs28 === errors;
}
else {
var valid1 = true;
}
}
}
}
}
}
}
}
else {
validate37.errors = [{instancePath:instancePath+"/checks",schemaPath:"#/properties/checks/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs18 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate37.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate37.errors = vErrors;
return errors === 0;
}

export const EvaluationCancellationReview = validate38;
const schema41 = {"type":"object","additionalProperties":false,"properties":{"evaluationId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"sessionId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"requestId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"reviewReference":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"}},"required":["evaluationId","sessionId","requestId","reviewReference"]};

function validate38(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.evaluationId === undefined) && (missing0 = "evaluationId")) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.reviewReference === undefined) && (missing0 = "reviewReference"))){
validate38.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "evaluationId") || (key0 === "sessionId")) || (key0 === "requestId")) || (key0 === "reviewReference"))){
validate38.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.evaluationId !== undefined){
let data0 = data.evaluationId;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(!pattern67.test(data0)){
validate38.errors = [{instancePath:instancePath+"/evaluationId",schemaPath:"#/properties/evaluationId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate38.errors = [{instancePath:instancePath+"/evaluationId",schemaPath:"#/properties/evaluationId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sessionId !== undefined){
let data1 = data.sessionId;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data1 === "string"){
if(!pattern67.test(data1)){
validate38.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate38.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestId !== undefined){
let data2 = data.requestId;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data2 === "string"){
if(!pattern67.test(data2)){
validate38.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate38.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.reviewReference !== undefined){
let data3 = data.reviewReference;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data3 === "string"){
if(func2(data3) > 120){
validate38.errors = [{instancePath:instancePath+"/reviewReference",schemaPath:"#/properties/reviewReference/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data3) < 1){
validate38.errors = [{instancePath:instancePath+"/reviewReference",schemaPath:"#/properties/reviewReference/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data3)){
validate38.errors = [{instancePath:instancePath+"/reviewReference",schemaPath:"#/properties/reviewReference/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate38.errors = [{instancePath:instancePath+"/reviewReference",schemaPath:"#/properties/reviewReference/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
else {
validate38.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate38.errors = vErrors;
return errors === 0;
}

export const ProviderBudgetUpdate = validate39;
const schema42 = {"type":"object","additionalProperties":false,"properties":{"totalMicrousd":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"expectedRevision":{"type":"integer","minimum":0,"maximum":2147483647},"confirmIncrease":{"type":"boolean"}},"required":["totalMicrousd","expectedRevision","confirmIncrease"]};

function validate39(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.totalMicrousd === undefined) && (missing0 = "totalMicrousd")) || ((data.expectedRevision === undefined) && (missing0 = "expectedRevision"))) || ((data.confirmIncrease === undefined) && (missing0 = "confirmIncrease"))){
validate39.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "totalMicrousd") || (key0 === "expectedRevision")) || (key0 === "confirmIncrease"))){
validate39.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.totalMicrousd !== undefined){
let data0 = data.totalMicrousd;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(!pattern0.test(data0)){
validate39.errors = [{instancePath:instancePath+"/totalMicrousd",schemaPath:"#/properties/totalMicrousd/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate39.errors = [{instancePath:instancePath+"/totalMicrousd",schemaPath:"#/properties/totalMicrousd/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.expectedRevision !== undefined){
let data1 = data.expectedRevision;
const _errs4 = errors;
if(!(((typeof data1 == "number") && (!(data1 % 1) && !isNaN(data1))) && (isFinite(data1)))){
validate39.errors = [{instancePath:instancePath+"/expectedRevision",schemaPath:"#/properties/expectedRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs4){
if((typeof data1 == "number") && (isFinite(data1))){
if(data1 > 2147483647 || isNaN(data1)){
validate39.errors = [{instancePath:instancePath+"/expectedRevision",schemaPath:"#/properties/expectedRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data1 < 0 || isNaN(data1)){
validate39.errors = [{instancePath:instancePath+"/expectedRevision",schemaPath:"#/properties/expectedRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.confirmIncrease !== undefined){
const _errs6 = errors;
if(typeof data.confirmIncrease !== "boolean"){
validate39.errors = [{instancePath:instancePath+"/confirmIncrease",schemaPath:"#/properties/confirmIncrease/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
else {
validate39.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate39.errors = vErrors;
return errors === 0;
}

export const AllowanceUpdate = validate40;
const schema43 = {"type":"object","additionalProperties":false,"properties":{"dailyLimit":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"monthlyLimit":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"expectedRevision":{"type":"integer","minimum":0,"maximum":2147483647},"reviewReference":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"}},"required":["dailyLimit","monthlyLimit","expectedRevision","reviewReference"]};

function validate40(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.dailyLimit === undefined) && (missing0 = "dailyLimit")) || ((data.monthlyLimit === undefined) && (missing0 = "monthlyLimit"))) || ((data.expectedRevision === undefined) && (missing0 = "expectedRevision"))) || ((data.reviewReference === undefined) && (missing0 = "reviewReference"))){
validate40.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "dailyLimit") || (key0 === "monthlyLimit")) || (key0 === "expectedRevision")) || (key0 === "reviewReference"))){
validate40.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.dailyLimit !== undefined){
let data0 = data.dailyLimit;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(!pattern0.test(data0)){
validate40.errors = [{instancePath:instancePath+"/dailyLimit",schemaPath:"#/properties/dailyLimit/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate40.errors = [{instancePath:instancePath+"/dailyLimit",schemaPath:"#/properties/dailyLimit/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.monthlyLimit !== undefined){
let data1 = data.monthlyLimit;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data1 === "string"){
if(!pattern0.test(data1)){
validate40.errors = [{instancePath:instancePath+"/monthlyLimit",schemaPath:"#/properties/monthlyLimit/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate40.errors = [{instancePath:instancePath+"/monthlyLimit",schemaPath:"#/properties/monthlyLimit/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.expectedRevision !== undefined){
let data2 = data.expectedRevision;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate40.errors = [{instancePath:instancePath+"/expectedRevision",schemaPath:"#/properties/expectedRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 2147483647 || isNaN(data2)){
validate40.errors = [{instancePath:instancePath+"/expectedRevision",schemaPath:"#/properties/expectedRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate40.errors = [{instancePath:instancePath+"/expectedRevision",schemaPath:"#/properties/expectedRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.reviewReference !== undefined){
let data3 = data.reviewReference;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data3 === "string"){
if(func2(data3) > 120){
validate40.errors = [{instancePath:instancePath+"/reviewReference",schemaPath:"#/properties/reviewReference/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data3) < 1){
validate40.errors = [{instancePath:instancePath+"/reviewReference",schemaPath:"#/properties/reviewReference/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data3)){
validate40.errors = [{instancePath:instancePath+"/reviewReference",schemaPath:"#/properties/reviewReference/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate40.errors = [{instancePath:instancePath+"/reviewReference",schemaPath:"#/properties/reviewReference/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
else {
validate40.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate40.errors = vErrors;
return errors === 0;
}

export const QualifiedTariff = validate41;
const schema44 = {"type":"object","additionalProperties":false,"properties":{"version":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"inputMicrousdPerMillion":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"outputMicrousdPerMillion":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"qualifiedUntil":{"type":"integer","minimum":1,"maximum":9007199254740991},"reviewReference":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"}},"required":["version","inputMicrousdPerMillion","outputMicrousdPerMillion","qualifiedUntil","reviewReference"]};

function validate41(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.version === undefined) && (missing0 = "version")) || ((data.inputMicrousdPerMillion === undefined) && (missing0 = "inputMicrousdPerMillion"))) || ((data.outputMicrousdPerMillion === undefined) && (missing0 = "outputMicrousdPerMillion"))) || ((data.qualifiedUntil === undefined) && (missing0 = "qualifiedUntil"))) || ((data.reviewReference === undefined) && (missing0 = "reviewReference"))){
validate41.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "version") || (key0 === "inputMicrousdPerMillion")) || (key0 === "outputMicrousdPerMillion")) || (key0 === "qualifiedUntil")) || (key0 === "reviewReference"))){
validate41.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.version !== undefined){
let data0 = data.version;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(func2(data0) > 120){
validate41.errors = [{instancePath:instancePath+"/version",schemaPath:"#/properties/version/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data0) < 1){
validate41.errors = [{instancePath:instancePath+"/version",schemaPath:"#/properties/version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data0)){
validate41.errors = [{instancePath:instancePath+"/version",schemaPath:"#/properties/version/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate41.errors = [{instancePath:instancePath+"/version",schemaPath:"#/properties/version/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.inputMicrousdPerMillion !== undefined){
let data1 = data.inputMicrousdPerMillion;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data1 === "string"){
if(!pattern0.test(data1)){
validate41.errors = [{instancePath:instancePath+"/inputMicrousdPerMillion",schemaPath:"#/properties/inputMicrousdPerMillion/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate41.errors = [{instancePath:instancePath+"/inputMicrousdPerMillion",schemaPath:"#/properties/inputMicrousdPerMillion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.outputMicrousdPerMillion !== undefined){
let data2 = data.outputMicrousdPerMillion;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data2 === "string"){
if(!pattern0.test(data2)){
validate41.errors = [{instancePath:instancePath+"/outputMicrousdPerMillion",schemaPath:"#/properties/outputMicrousdPerMillion/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate41.errors = [{instancePath:instancePath+"/outputMicrousdPerMillion",schemaPath:"#/properties/outputMicrousdPerMillion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.qualifiedUntil !== undefined){
let data3 = data.qualifiedUntil;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate41.errors = [{instancePath:instancePath+"/qualifiedUntil",schemaPath:"#/properties/qualifiedUntil/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate41.errors = [{instancePath:instancePath+"/qualifiedUntil",schemaPath:"#/properties/qualifiedUntil/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 1 || isNaN(data3)){
validate41.errors = [{instancePath:instancePath+"/qualifiedUntil",schemaPath:"#/properties/qualifiedUntil/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.reviewReference !== undefined){
let data4 = data.reviewReference;
const _errs10 = errors;
if(errors === _errs10){
if(typeof data4 === "string"){
if(func2(data4) > 120){
validate41.errors = [{instancePath:instancePath+"/reviewReference",schemaPath:"#/properties/reviewReference/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data4) < 1){
validate41.errors = [{instancePath:instancePath+"/reviewReference",schemaPath:"#/properties/reviewReference/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data4)){
validate41.errors = [{instancePath:instancePath+"/reviewReference",schemaPath:"#/properties/reviewReference/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate41.errors = [{instancePath:instancePath+"/reviewReference",schemaPath:"#/properties/reviewReference/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate41.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate41.errors = vErrors;
return errors === 0;
}

export const MarketplaceDraft = validate42;
const schema45 = {"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"model":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"endpoint":{"type":"string","minLength":1,"maxLength":2048},"supplyClass":{"$ref":"#/$defs/SupplyClass"},"rightsReference":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$","deprecated":true,"description":"Optional historical compatibility metadata; never used for eligibility."},"availability":{"enum":["hot","cold"]},"inputRate":{"type":"string","pattern":"^(0|[1-9][0-9]{0,8})$"},"outputRate":{"type":"string","pattern":"^(0|[1-9][0-9]{0,8})$"},"capabilities":{"type":"array","uniqueItems":true,"maxItems":5,"items":{"enum":["coding_v1","streaming_v1","tools_v1","thinking_v1","images_v1"]}},"contextWindowTokens":{"type":"integer","minimum":4096,"maximum":131072}},"required":["name","model","endpoint","supplyClass","availability","inputRate","outputRate"]};
const pattern91 = new RegExp("^(0|[1-9][0-9]{0,8})$", "u");

function validate42(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((data.name === undefined) && (missing0 = "name")) || ((data.model === undefined) && (missing0 = "model"))) || ((data.endpoint === undefined) && (missing0 = "endpoint"))) || ((data.supplyClass === undefined) && (missing0 = "supplyClass"))) || ((data.availability === undefined) && (missing0 = "availability"))) || ((data.inputRate === undefined) && (missing0 = "inputRate"))) || ((data.outputRate === undefined) && (missing0 = "outputRate"))){
validate42.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema45.properties, key0))){
validate42.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.name !== undefined){
let data0 = data.name;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(func2(data0) > 120){
validate42.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data0) < 1){
validate42.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data0)){
validate42.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate42.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.model !== undefined){
let data1 = data.model;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data1 === "string"){
if(func2(data1) > 120){
validate42.errors = [{instancePath:instancePath+"/model",schemaPath:"#/properties/model/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data1) < 1){
validate42.errors = [{instancePath:instancePath+"/model",schemaPath:"#/properties/model/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data1)){
validate42.errors = [{instancePath:instancePath+"/model",schemaPath:"#/properties/model/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate42.errors = [{instancePath:instancePath+"/model",schemaPath:"#/properties/model/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.endpoint !== undefined){
let data2 = data.endpoint;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data2 === "string"){
if(func2(data2) > 2048){
validate42.errors = [{instancePath:instancePath+"/endpoint",schemaPath:"#/properties/endpoint/maxLength",keyword:"maxLength",params:{limit: 2048},message:"must NOT have more than 2048 characters"}];
return false;
}
else {
if(func2(data2) < 1){
validate42.errors = [{instancePath:instancePath+"/endpoint",schemaPath:"#/properties/endpoint/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate42.errors = [{instancePath:instancePath+"/endpoint",schemaPath:"#/properties/endpoint/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.supplyClass !== undefined){
let data3 = data.supplyClass;
const _errs8 = errors;
if(!((data3 === "authorized_api") || (data3 === "self_hosted"))){
validate42.errors = [{instancePath:instancePath+"/supplyClass",schemaPath:"#/$defs/SupplyClass/enum",keyword:"enum",params:{allowedValues: schema12.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.rightsReference !== undefined){
let data4 = data.rightsReference;
const _errs10 = errors;
if(errors === _errs10){
if(typeof data4 === "string"){
if(func2(data4) > 120){
validate42.errors = [{instancePath:instancePath+"/rightsReference",schemaPath:"#/properties/rightsReference/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data4) < 1){
validate42.errors = [{instancePath:instancePath+"/rightsReference",schemaPath:"#/properties/rightsReference/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data4)){
validate42.errors = [{instancePath:instancePath+"/rightsReference",schemaPath:"#/properties/rightsReference/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate42.errors = [{instancePath:instancePath+"/rightsReference",schemaPath:"#/properties/rightsReference/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.availability !== undefined){
let data5 = data.availability;
const _errs12 = errors;
if(!((data5 === "hot") || (data5 === "cold"))){
validate42.errors = [{instancePath:instancePath+"/availability",schemaPath:"#/properties/availability/enum",keyword:"enum",params:{allowedValues: schema45.properties.availability.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.inputRate !== undefined){
let data6 = data.inputRate;
const _errs13 = errors;
if(errors === _errs13){
if(typeof data6 === "string"){
if(!pattern91.test(data6)){
validate42.errors = [{instancePath:instancePath+"/inputRate",schemaPath:"#/properties/inputRate/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,8})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,8})$"+"\""}];
return false;
}
}
else {
validate42.errors = [{instancePath:instancePath+"/inputRate",schemaPath:"#/properties/inputRate/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.outputRate !== undefined){
let data7 = data.outputRate;
const _errs15 = errors;
if(errors === _errs15){
if(typeof data7 === "string"){
if(!pattern91.test(data7)){
validate42.errors = [{instancePath:instancePath+"/outputRate",schemaPath:"#/properties/outputRate/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,8})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,8})$"+"\""}];
return false;
}
}
else {
validate42.errors = [{instancePath:instancePath+"/outputRate",schemaPath:"#/properties/outputRate/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs15 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.capabilities !== undefined){
let data8 = data.capabilities;
const _errs17 = errors;
if(errors === _errs17){
if(Array.isArray(data8)){
if(data8.length > 5){
validate42.errors = [{instancePath:instancePath+"/capabilities",schemaPath:"#/properties/capabilities/maxItems",keyword:"maxItems",params:{limit: 5},message:"must NOT have more than 5 items"}];
return false;
}
else {
var valid2 = true;
const len0 = data8.length;
for(let i0=0; i0<len0; i0++){
let data9 = data8[i0];
const _errs19 = errors;
if(!(((((data9 === "coding_v1") || (data9 === "streaming_v1")) || (data9 === "tools_v1")) || (data9 === "thinking_v1")) || (data9 === "images_v1"))){
validate42.errors = [{instancePath:instancePath+"/capabilities/" + i0,schemaPath:"#/properties/capabilities/items/enum",keyword:"enum",params:{allowedValues: schema45.properties.capabilities.items.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid2 = _errs19 === errors;
if(!valid2){
break;
}
}
if(valid2){
let i1 = data8.length;
let j0;
if(i1 > 1){
outer0:
for(;i1--;){
for(j0 = i1; j0--;){
if(func0(data8[i1], data8[j0])){
validate42.errors = [{instancePath:instancePath+"/capabilities",schemaPath:"#/properties/capabilities/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"}];
return false;
break outer0;
}
}
}
}
}
}
}
else {
validate42.errors = [{instancePath:instancePath+"/capabilities",schemaPath:"#/properties/capabilities/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs17 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.contextWindowTokens !== undefined){
let data10 = data.contextWindowTokens;
const _errs20 = errors;
if(!(((typeof data10 == "number") && (!(data10 % 1) && !isNaN(data10))) && (isFinite(data10)))){
validate42.errors = [{instancePath:instancePath+"/contextWindowTokens",schemaPath:"#/properties/contextWindowTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs20){
if((typeof data10 == "number") && (isFinite(data10))){
if(data10 > 131072 || isNaN(data10)){
validate42.errors = [{instancePath:instancePath+"/contextWindowTokens",schemaPath:"#/properties/contextWindowTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 131072},message:"must be <= 131072"}];
return false;
}
else {
if(data10 < 4096 || isNaN(data10)){
validate42.errors = [{instancePath:instancePath+"/contextWindowTokens",schemaPath:"#/properties/contextWindowTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 4096},message:"must be >= 4096"}];
return false;
}
}
}
}
var valid0 = _errs20 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate42.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate42.errors = vErrors;
return errors === 0;
}

export const NodeSuspension = validate43;
const schema47 = {"type":"object","additionalProperties":false,"properties":{"suspended":{"type":"boolean"},"reason":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"}},"required":["suspended","reason"]};

function validate43(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.suspended === undefined) && (missing0 = "suspended")) || ((data.reason === undefined) && (missing0 = "reason"))){
validate43.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "suspended") || (key0 === "reason"))){
validate43.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.suspended !== undefined){
const _errs2 = errors;
if(typeof data.suspended !== "boolean"){
validate43.errors = [{instancePath:instancePath+"/suspended",schemaPath:"#/properties/suspended/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.reason !== undefined){
let data1 = data.reason;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data1 === "string"){
if(func2(data1) > 120){
validate43.errors = [{instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data1) < 1){
validate43.errors = [{instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data1)){
validate43.errors = [{instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate43.errors = [{instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate43.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate43.errors = vErrors;
return errors === 0;
}

export const ProviderNodeDeletionRequest = validate44;
const schema48 = {"type":"object","additionalProperties":false,"properties":{"confirm":{"const":true}},"required":["confirm"]};

function validate44(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.confirm === undefined) && (missing0 = "confirm")){
validate44.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "confirm")){
validate44.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.confirm !== undefined){
if(true !== data.confirm){
validate44.errors = [{instancePath:instancePath+"/confirm",schemaPath:"#/properties/confirm/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
return false;
}
}
}
}
}
else {
validate44.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate44.errors = vErrors;
return errors === 0;
}

export const ProviderRunRequest = validate45;
const schema49 = {"type":"object","additionalProperties":false,"properties":{"providerRunId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"}},"required":["providerRunId"]};

function validate45(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.providerRunId === undefined) && (missing0 = "providerRunId")){
validate45.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "providerRunId")){
validate45.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.providerRunId !== undefined){
let data0 = data.providerRunId;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(!pattern67.test(data0)){
validate45.errors = [{instancePath:instancePath+"/providerRunId",schemaPath:"#/properties/providerRunId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate45.errors = [{instancePath:instancePath+"/providerRunId",schemaPath:"#/properties/providerRunId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
}
}
}
else {
validate45.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate45.errors = vErrors;
return errors === 0;
}

export const ProviderStopRequest = validate46;
const schema50 = {"oneOf":[{"type":"object","additionalProperties":false,"properties":{"scope":{"const":"run"},"providerRunId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"trigger":{"type":"string","pattern":"^[a-z][a-z0-9_]{0,79}$"}},"required":["scope","providerRunId","trigger"]},{"type":"object","additionalProperties":false,"properties":{"scope":{"const":"node"},"trigger":{"const":"operator_stop"}},"required":["scope","trigger"]}]};
const pattern96 = new RegExp("^[a-z][a-z0-9_]{0,79}$", "u");

function validate46(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
const _errs0 = errors;
let valid0 = false;
let passing0 = null;
const _errs1 = errors;
if(errors === _errs1){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.scope === undefined) && (missing0 = "scope")) || ((data.providerRunId === undefined) && (missing0 = "providerRunId"))) || ((data.trigger === undefined) && (missing0 = "trigger"))){
const err0 = {instancePath,schemaPath:"#/oneOf/0/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
const _errs3 = errors;
for(const key0 in data){
if(!(((key0 === "scope") || (key0 === "providerRunId")) || (key0 === "trigger"))){
const err1 = {instancePath,schemaPath:"#/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
break;
}
}
if(_errs3 === errors){
if(data.scope !== undefined){
const _errs4 = errors;
if("run" !== data.scope){
const err2 = {instancePath:instancePath+"/scope",schemaPath:"#/oneOf/0/properties/scope/const",keyword:"const",params:{allowedValue: "run"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var valid1 = _errs4 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.providerRunId !== undefined){
let data1 = data.providerRunId;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data1 === "string"){
if(!pattern67.test(data1)){
const err3 = {instancePath:instancePath+"/providerRunId",schemaPath:"#/oneOf/0/properties/providerRunId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
else {
const err4 = {instancePath:instancePath+"/providerRunId",schemaPath:"#/oneOf/0/properties/providerRunId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
var valid1 = _errs5 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.trigger !== undefined){
let data2 = data.trigger;
const _errs7 = errors;
if(errors === _errs7){
if(typeof data2 === "string"){
if(!pattern96.test(data2)){
const err5 = {instancePath:instancePath+"/trigger",schemaPath:"#/oneOf/0/properties/trigger/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-z0-9_]{0,79}$"},message:"must match pattern \""+"^[a-z][a-z0-9_]{0,79}$"+"\""};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
else {
const err6 = {instancePath:instancePath+"/trigger",schemaPath:"#/oneOf/0/properties/trigger/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
var valid1 = _errs7 === errors;
}
else {
var valid1 = true;
}
}
}
}
}
}
else {
const err7 = {instancePath,schemaPath:"#/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
var _valid0 = _errs1 === errors;
if(_valid0){
valid0 = true;
passing0 = 0;
}
const _errs9 = errors;
if(errors === _errs9){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing1;
if(((data.scope === undefined) && (missing1 = "scope")) || ((data.trigger === undefined) && (missing1 = "trigger"))){
const err8 = {instancePath,schemaPath:"#/oneOf/1/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
else {
const _errs11 = errors;
for(const key1 in data){
if(!((key1 === "scope") || (key1 === "trigger"))){
const err9 = {instancePath,schemaPath:"#/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
break;
}
}
if(_errs11 === errors){
if(data.scope !== undefined){
const _errs12 = errors;
if("node" !== data.scope){
const err10 = {instancePath:instancePath+"/scope",schemaPath:"#/oneOf/1/properties/scope/const",keyword:"const",params:{allowedValue: "node"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
var valid2 = _errs12 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data.trigger !== undefined){
const _errs13 = errors;
if("operator_stop" !== data.trigger){
const err11 = {instancePath:instancePath+"/trigger",schemaPath:"#/oneOf/1/properties/trigger/const",keyword:"const",params:{allowedValue: "operator_stop"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
var valid2 = _errs13 === errors;
}
else {
var valid2 = true;
}
}
}
}
}
else {
const err12 = {instancePath,schemaPath:"#/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
var _valid0 = _errs9 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid0 = true;
passing0 = 1;
}
}
if(!valid0){
const err13 = {instancePath,schemaPath:"#/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
validate46.errors = vErrors;
return false;
}
else {
errors = _errs0;
if(vErrors !== null){
if(_errs0){
vErrors.length = _errs0;
}
else {
vErrors = null;
}
}
}
validate46.errors = vErrors;
return errors === 0;
}

export const ProviderRelayReady = validate47;
const schema51 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"ready"},"providerRunId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"relayGeneration":{"type":"integer","minimum":1,"maximum":9007199254740991},"leaseUntil":{"type":"integer","minimum":1,"maximum":9007199254740991}},"required":["type","providerRunId","relayGeneration","leaseUntil"]};

function validate47(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.type === undefined) && (missing0 = "type")) || ((data.providerRunId === undefined) && (missing0 = "providerRunId"))) || ((data.relayGeneration === undefined) && (missing0 = "relayGeneration"))) || ((data.leaseUntil === undefined) && (missing0 = "leaseUntil"))){
validate47.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "type") || (key0 === "providerRunId")) || (key0 === "relayGeneration")) || (key0 === "leaseUntil"))){
validate47.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("ready" !== data.type){
validate47.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "ready"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.providerRunId !== undefined){
let data1 = data.providerRunId;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data1 === "string"){
if(!pattern67.test(data1)){
validate47.errors = [{instancePath:instancePath+"/providerRunId",schemaPath:"#/properties/providerRunId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate47.errors = [{instancePath:instancePath+"/providerRunId",schemaPath:"#/properties/providerRunId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.relayGeneration !== undefined){
let data2 = data.relayGeneration;
const _errs5 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate47.errors = [{instancePath:instancePath+"/relayGeneration",schemaPath:"#/properties/relayGeneration/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs5){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate47.errors = [{instancePath:instancePath+"/relayGeneration",schemaPath:"#/properties/relayGeneration/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 1 || isNaN(data2)){
validate47.errors = [{instancePath:instancePath+"/relayGeneration",schemaPath:"#/properties/relayGeneration/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.leaseUntil !== undefined){
let data3 = data.leaseUntil;
const _errs7 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate47.errors = [{instancePath:instancePath+"/leaseUntil",schemaPath:"#/properties/leaseUntil/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs7){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate47.errors = [{instancePath:instancePath+"/leaseUntil",schemaPath:"#/properties/leaseUntil/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 1 || isNaN(data3)){
validate47.errors = [{instancePath:instancePath+"/leaseUntil",schemaPath:"#/properties/leaseUntil/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
else {
validate47.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate47.errors = vErrors;
return errors === 0;
}

export const ProviderRequestFailure = validate48;
const schema52 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"request_failed"},"requestId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"sessionId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"bindingRevision":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"sequence":{"type":"integer","minimum":1,"maximum":2147483647},"code":{"const":"provider_outcome_unknown"}},"required":["type","requestId","sessionId","bindingRevision","sequence","code"]};

function validate48(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.type === undefined) && (missing0 = "type")) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.bindingRevision === undefined) && (missing0 = "bindingRevision"))) || ((data.sequence === undefined) && (missing0 = "sequence"))) || ((data.code === undefined) && (missing0 = "code"))){
validate48.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "type") || (key0 === "requestId")) || (key0 === "sessionId")) || (key0 === "bindingRevision")) || (key0 === "sequence")) || (key0 === "code"))){
validate48.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("request_failed" !== data.type){
validate48.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "request_failed"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestId !== undefined){
let data1 = data.requestId;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data1 === "string"){
if(!pattern67.test(data1)){
validate48.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate48.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sessionId !== undefined){
let data2 = data.sessionId;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data2 === "string"){
if(!pattern67.test(data2)){
validate48.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate48.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.bindingRevision !== undefined){
let data3 = data.bindingRevision;
const _errs7 = errors;
if(errors === _errs7){
if(typeof data3 === "string"){
if(!pattern67.test(data3)){
validate48.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate48.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sequence !== undefined){
let data4 = data.sequence;
const _errs9 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
validate48.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 2147483647 || isNaN(data4)){
validate48.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data4 < 1 || isNaN(data4)){
validate48.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.code !== undefined){
const _errs11 = errors;
if("provider_outcome_unknown" !== data.code){
validate48.errors = [{instancePath:instancePath+"/code",schemaPath:"#/properties/code/const",keyword:"const",params:{allowedValue: "provider_outcome_unknown"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate48.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate48.errors = vErrors;
return errors === 0;
}

export const ProviderNodeDeletion = validate49;
const schema53 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"status":{"const":"deleted"},"deletedAt":{"type":"integer","minimum":0,"maximum":9007199254740991}},"required":["id","status","deletedAt"]};

function validate49(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.id === undefined) && (missing0 = "id")) || ((data.status === undefined) && (missing0 = "status"))) || ((data.deletedAt === undefined) && (missing0 = "deletedAt"))){
validate49.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "id") || (key0 === "status")) || (key0 === "deletedAt"))){
validate49.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(!pattern67.test(data0)){
validate49.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate49.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.status !== undefined){
const _errs4 = errors;
if("deleted" !== data.status){
validate49.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/const",keyword:"const",params:{allowedValue: "deleted"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.deletedAt !== undefined){
let data2 = data.deletedAt;
const _errs5 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate49.errors = [{instancePath:instancePath+"/deletedAt",schemaPath:"#/properties/deletedAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs5){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate49.errors = [{instancePath:instancePath+"/deletedAt",schemaPath:"#/properties/deletedAt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate49.errors = [{instancePath:instancePath+"/deletedAt",schemaPath:"#/properties/deletedAt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
else {
validate49.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate49.errors = vErrors;
return errors === 0;
}

export const MarketplaceListing = validate50;
const schema54 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"nodeId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"name":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"model":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"supplyClass":{"$ref":"#/$defs/SupplyClass"},"availability":{"enum":["hot","cold"]},"inputRate":{"type":"string","pattern":"^(0|[1-9][0-9]{0,8})$"},"outputRate":{"type":"string","pattern":"^(0|[1-9][0-9]{0,8})$"},"rateDenominator":{"const":"1000000"},"connectorProfile":{"$ref":"#/$defs/ConnectorProfile"},"capabilities":{"type":"array","uniqueItems":true,"maxItems":5,"items":{"enum":["coding_v1","streaming_v1","tools_v1","thinking_v1","images_v1"]}},"contextWindowTokens":{"type":"integer","minimum":4096,"maximum":131072},"revision":{"type":"integer","minimum":1,"maximum":2147483647},"publishedAt":{"type":"integer","minimum":0,"maximum":9007199254740991},"ready":{"type":"boolean"},"evaluation":{"anyOf":[{"type":"null"},{"$ref":"#/$defs/EvaluationSummary"}]},"controlOnline":{"type":"boolean"},"activationDeadlineSeconds":{"const":120},"maxOutputTokens":{"type":"integer","minimum":1,"maximum":8192}},"required":["id","nodeId","name","model","supplyClass","availability","inputRate","outputRate","rateDenominator","connectorProfile","revision","publishedAt","ready","evaluation","controlOnline","activationDeadlineSeconds"]};

function validate50(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((((((((((((data.id === undefined) && (missing0 = "id")) || ((data.nodeId === undefined) && (missing0 = "nodeId"))) || ((data.name === undefined) && (missing0 = "name"))) || ((data.model === undefined) && (missing0 = "model"))) || ((data.supplyClass === undefined) && (missing0 = "supplyClass"))) || ((data.availability === undefined) && (missing0 = "availability"))) || ((data.inputRate === undefined) && (missing0 = "inputRate"))) || ((data.outputRate === undefined) && (missing0 = "outputRate"))) || ((data.rateDenominator === undefined) && (missing0 = "rateDenominator"))) || ((data.connectorProfile === undefined) && (missing0 = "connectorProfile"))) || ((data.revision === undefined) && (missing0 = "revision"))) || ((data.publishedAt === undefined) && (missing0 = "publishedAt"))) || ((data.ready === undefined) && (missing0 = "ready"))) || ((data.evaluation === undefined) && (missing0 = "evaluation"))) || ((data.controlOnline === undefined) && (missing0 = "controlOnline"))) || ((data.activationDeadlineSeconds === undefined) && (missing0 = "activationDeadlineSeconds"))){
validate50.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema54.properties, key0))){
validate50.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(!pattern67.test(data0)){
validate50.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate50.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nodeId !== undefined){
let data1 = data.nodeId;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data1 === "string"){
if(!pattern67.test(data1)){
validate50.errors = [{instancePath:instancePath+"/nodeId",schemaPath:"#/properties/nodeId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate50.errors = [{instancePath:instancePath+"/nodeId",schemaPath:"#/properties/nodeId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.name !== undefined){
let data2 = data.name;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data2 === "string"){
if(func2(data2) > 120){
validate50.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data2) < 1){
validate50.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data2)){
validate50.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate50.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.model !== undefined){
let data3 = data.model;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data3 === "string"){
if(func2(data3) > 120){
validate50.errors = [{instancePath:instancePath+"/model",schemaPath:"#/properties/model/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data3) < 1){
validate50.errors = [{instancePath:instancePath+"/model",schemaPath:"#/properties/model/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data3)){
validate50.errors = [{instancePath:instancePath+"/model",schemaPath:"#/properties/model/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate50.errors = [{instancePath:instancePath+"/model",schemaPath:"#/properties/model/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.supplyClass !== undefined){
let data4 = data.supplyClass;
const _errs10 = errors;
if(!((data4 === "authorized_api") || (data4 === "self_hosted"))){
validate50.errors = [{instancePath:instancePath+"/supplyClass",schemaPath:"#/$defs/SupplyClass/enum",keyword:"enum",params:{allowedValues: schema12.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.availability !== undefined){
let data5 = data.availability;
const _errs12 = errors;
if(!((data5 === "hot") || (data5 === "cold"))){
validate50.errors = [{instancePath:instancePath+"/availability",schemaPath:"#/properties/availability/enum",keyword:"enum",params:{allowedValues: schema54.properties.availability.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.inputRate !== undefined){
let data6 = data.inputRate;
const _errs13 = errors;
if(errors === _errs13){
if(typeof data6 === "string"){
if(!pattern91.test(data6)){
validate50.errors = [{instancePath:instancePath+"/inputRate",schemaPath:"#/properties/inputRate/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,8})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,8})$"+"\""}];
return false;
}
}
else {
validate50.errors = [{instancePath:instancePath+"/inputRate",schemaPath:"#/properties/inputRate/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.outputRate !== undefined){
let data7 = data.outputRate;
const _errs15 = errors;
if(errors === _errs15){
if(typeof data7 === "string"){
if(!pattern91.test(data7)){
validate50.errors = [{instancePath:instancePath+"/outputRate",schemaPath:"#/properties/outputRate/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,8})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,8})$"+"\""}];
return false;
}
}
else {
validate50.errors = [{instancePath:instancePath+"/outputRate",schemaPath:"#/properties/outputRate/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs15 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.rateDenominator !== undefined){
const _errs17 = errors;
if("1000000" !== data.rateDenominator){
validate50.errors = [{instancePath:instancePath+"/rateDenominator",schemaPath:"#/properties/rateDenominator/const",keyword:"const",params:{allowedValue: "1000000"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs17 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.connectorProfile !== undefined){
const _errs18 = errors;
if("inference_connector_v1" !== data.connectorProfile){
validate50.errors = [{instancePath:instancePath+"/connectorProfile",schemaPath:"#/$defs/ConnectorProfile/const",keyword:"const",params:{allowedValue: "inference_connector_v1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs18 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.capabilities !== undefined){
let data10 = data.capabilities;
const _errs20 = errors;
if(errors === _errs20){
if(Array.isArray(data10)){
if(data10.length > 5){
validate50.errors = [{instancePath:instancePath+"/capabilities",schemaPath:"#/properties/capabilities/maxItems",keyword:"maxItems",params:{limit: 5},message:"must NOT have more than 5 items"}];
return false;
}
else {
var valid3 = true;
const len0 = data10.length;
for(let i0=0; i0<len0; i0++){
let data11 = data10[i0];
const _errs22 = errors;
if(!(((((data11 === "coding_v1") || (data11 === "streaming_v1")) || (data11 === "tools_v1")) || (data11 === "thinking_v1")) || (data11 === "images_v1"))){
validate50.errors = [{instancePath:instancePath+"/capabilities/" + i0,schemaPath:"#/properties/capabilities/items/enum",keyword:"enum",params:{allowedValues: schema54.properties.capabilities.items.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid3 = _errs22 === errors;
if(!valid3){
break;
}
}
if(valid3){
let i1 = data10.length;
let j0;
if(i1 > 1){
outer0:
for(;i1--;){
for(j0 = i1; j0--;){
if(func0(data10[i1], data10[j0])){
validate50.errors = [{instancePath:instancePath+"/capabilities",schemaPath:"#/properties/capabilities/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"}];
return false;
break outer0;
}
}
}
}
}
}
}
else {
validate50.errors = [{instancePath:instancePath+"/capabilities",schemaPath:"#/properties/capabilities/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs20 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.contextWindowTokens !== undefined){
let data12 = data.contextWindowTokens;
const _errs23 = errors;
if(!(((typeof data12 == "number") && (!(data12 % 1) && !isNaN(data12))) && (isFinite(data12)))){
validate50.errors = [{instancePath:instancePath+"/contextWindowTokens",schemaPath:"#/properties/contextWindowTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs23){
if((typeof data12 == "number") && (isFinite(data12))){
if(data12 > 131072 || isNaN(data12)){
validate50.errors = [{instancePath:instancePath+"/contextWindowTokens",schemaPath:"#/properties/contextWindowTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 131072},message:"must be <= 131072"}];
return false;
}
else {
if(data12 < 4096 || isNaN(data12)){
validate50.errors = [{instancePath:instancePath+"/contextWindowTokens",schemaPath:"#/properties/contextWindowTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 4096},message:"must be >= 4096"}];
return false;
}
}
}
}
var valid0 = _errs23 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.revision !== undefined){
let data13 = data.revision;
const _errs25 = errors;
if(!(((typeof data13 == "number") && (!(data13 % 1) && !isNaN(data13))) && (isFinite(data13)))){
validate50.errors = [{instancePath:instancePath+"/revision",schemaPath:"#/properties/revision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs25){
if((typeof data13 == "number") && (isFinite(data13))){
if(data13 > 2147483647 || isNaN(data13)){
validate50.errors = [{instancePath:instancePath+"/revision",schemaPath:"#/properties/revision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data13 < 1 || isNaN(data13)){
validate50.errors = [{instancePath:instancePath+"/revision",schemaPath:"#/properties/revision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs25 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.publishedAt !== undefined){
let data14 = data.publishedAt;
const _errs27 = errors;
if(!(((typeof data14 == "number") && (!(data14 % 1) && !isNaN(data14))) && (isFinite(data14)))){
validate50.errors = [{instancePath:instancePath+"/publishedAt",schemaPath:"#/properties/publishedAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs27){
if((typeof data14 == "number") && (isFinite(data14))){
if(data14 > 9007199254740991 || isNaN(data14)){
validate50.errors = [{instancePath:instancePath+"/publishedAt",schemaPath:"#/properties/publishedAt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data14 < 0 || isNaN(data14)){
validate50.errors = [{instancePath:instancePath+"/publishedAt",schemaPath:"#/properties/publishedAt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs27 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ready !== undefined){
const _errs29 = errors;
if(typeof data.ready !== "boolean"){
validate50.errors = [{instancePath:instancePath+"/ready",schemaPath:"#/properties/ready/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs29 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.evaluation !== undefined){
let data16 = data.evaluation;
const _errs31 = errors;
const _errs32 = errors;
let valid5 = false;
const _errs33 = errors;
if(data16 !== null){
const err0 = {instancePath:instancePath+"/evaluation",schemaPath:"#/properties/evaluation/anyOf/0/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
var _valid0 = _errs33 === errors;
valid5 = valid5 || _valid0;
if(!valid5){
const _errs35 = errors;
const _errs36 = errors;
if(errors === _errs36){
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
let missing1;
if((((((((((((((data16.cancellationRequestId === undefined) && (missing1 = "cancellationRequestId")) || ((data16.id === undefined) && (missing1 = "id"))) || ((data16.sessionId === undefined) && (missing1 = "sessionId"))) || ((data16.listingId === undefined) && (missing1 = "listingId"))) || ((data16.listingRevision === undefined) && (missing1 = "listingRevision"))) || ((data16.provisional === undefined) && (missing1 = "provisional"))) || ((data16.version === undefined) && (missing1 = "version"))) || ((data16.sampleCount === undefined) && (missing1 = "sampleCount"))) || ((data16.elapsedMs === undefined) && (missing1 = "elapsedMs"))) || ((data16.passed === undefined) && (missing1 = "passed"))) || ((data16.recordedAt === undefined) && (missing1 = "recordedAt"))) || ((data16.freshUntil === undefined) && (missing1 = "freshUntil"))) || ((data16.checks === undefined) && (missing1 = "checks"))){
const err1 = {instancePath:instancePath+"/evaluation",schemaPath:"#/$defs/EvaluationSummary/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
else {
const _errs38 = errors;
for(const key1 in data16){
if(!(func7.call(schema39.properties, key1))){
const err2 = {instancePath:instancePath+"/evaluation",schemaPath:"#/$defs/EvaluationSummary/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
break;
}
}
if(_errs38 === errors){
if(data16.cancellationRequestId !== undefined){
let data17 = data16.cancellationRequestId;
const _errs39 = errors;
const _errs40 = errors;
let valid8 = false;
const _errs41 = errors;
if(errors === _errs41){
if(typeof data17 === "string"){
if(!pattern67.test(data17)){
const err3 = {instancePath:instancePath+"/evaluation/cancellationRequestId",schemaPath:"#/$defs/EvaluationSummary/properties/cancellationRequestId/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
else {
const err4 = {instancePath:instancePath+"/evaluation/cancellationRequestId",schemaPath:"#/$defs/EvaluationSummary/properties/cancellationRequestId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
var _valid1 = _errs41 === errors;
valid8 = valid8 || _valid1;
if(!valid8){
const _errs43 = errors;
if(data17 !== null){
const err5 = {instancePath:instancePath+"/evaluation/cancellationRequestId",schemaPath:"#/$defs/EvaluationSummary/properties/cancellationRequestId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
var _valid1 = _errs43 === errors;
valid8 = valid8 || _valid1;
}
if(!valid8){
const err6 = {instancePath:instancePath+"/evaluation/cancellationRequestId",schemaPath:"#/$defs/EvaluationSummary/properties/cancellationRequestId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
else {
errors = _errs40;
if(vErrors !== null){
if(_errs40){
vErrors.length = _errs40;
}
else {
vErrors = null;
}
}
}
var valid7 = _errs39 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data16.id !== undefined){
let data18 = data16.id;
const _errs45 = errors;
if(errors === _errs45){
if(typeof data18 === "string"){
if(!pattern67.test(data18)){
const err7 = {instancePath:instancePath+"/evaluation/id",schemaPath:"#/$defs/EvaluationSummary/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
else {
const err8 = {instancePath:instancePath+"/evaluation/id",schemaPath:"#/$defs/EvaluationSummary/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
var valid7 = _errs45 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data16.sessionId !== undefined){
let data19 = data16.sessionId;
const _errs47 = errors;
if(errors === _errs47){
if(typeof data19 === "string"){
if(!pattern67.test(data19)){
const err9 = {instancePath:instancePath+"/evaluation/sessionId",schemaPath:"#/$defs/EvaluationSummary/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/evaluation/sessionId",schemaPath:"#/$defs/EvaluationSummary/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
var valid7 = _errs47 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data16.listingId !== undefined){
let data20 = data16.listingId;
const _errs49 = errors;
if(errors === _errs49){
if(typeof data20 === "string"){
if(!pattern67.test(data20)){
const err11 = {instancePath:instancePath+"/evaluation/listingId",schemaPath:"#/$defs/EvaluationSummary/properties/listingId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/evaluation/listingId",schemaPath:"#/$defs/EvaluationSummary/properties/listingId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
var valid7 = _errs49 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data16.listingRevision !== undefined){
let data21 = data16.listingRevision;
const _errs51 = errors;
if(!(((typeof data21 == "number") && (!(data21 % 1) && !isNaN(data21))) && (isFinite(data21)))){
const err13 = {instancePath:instancePath+"/evaluation/listingRevision",schemaPath:"#/$defs/EvaluationSummary/properties/listingRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(errors === _errs51){
if((typeof data21 == "number") && (isFinite(data21))){
if(data21 > 2147483647 || isNaN(data21)){
const err14 = {instancePath:instancePath+"/evaluation/listingRevision",schemaPath:"#/$defs/EvaluationSummary/properties/listingRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
else {
if(data21 < 1 || isNaN(data21)){
const err15 = {instancePath:instancePath+"/evaluation/listingRevision",schemaPath:"#/$defs/EvaluationSummary/properties/listingRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
}
}
var valid7 = _errs51 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data16.provisional !== undefined){
const _errs53 = errors;
if(typeof data16.provisional !== "boolean"){
const err16 = {instancePath:instancePath+"/evaluation/provisional",schemaPath:"#/$defs/EvaluationSummary/properties/provisional/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
var valid7 = _errs53 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data16.version !== undefined){
let data23 = data16.version;
const _errs55 = errors;
if(errors === _errs55){
if(typeof data23 === "string"){
if(func2(data23) > 120){
const err17 = {instancePath:instancePath+"/evaluation/version",schemaPath:"#/$defs/EvaluationSummary/properties/version/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
else {
if(func2(data23) < 1){
const err18 = {instancePath:instancePath+"/evaluation/version",schemaPath:"#/$defs/EvaluationSummary/properties/version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
else {
if(!pattern71.test(data23)){
const err19 = {instancePath:instancePath+"/evaluation/version",schemaPath:"#/$defs/EvaluationSummary/properties/version/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
}
}
else {
const err20 = {instancePath:instancePath+"/evaluation/version",schemaPath:"#/$defs/EvaluationSummary/properties/version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
var valid7 = _errs55 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data16.sampleCount !== undefined){
let data24 = data16.sampleCount;
const _errs57 = errors;
if(!(((typeof data24 == "number") && (!(data24 % 1) && !isNaN(data24))) && (isFinite(data24)))){
const err21 = {instancePath:instancePath+"/evaluation/sampleCount",schemaPath:"#/$defs/EvaluationSummary/properties/sampleCount/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(errors === _errs57){
if((typeof data24 == "number") && (isFinite(data24))){
if(data24 > 1000 || isNaN(data24)){
const err22 = {instancePath:instancePath+"/evaluation/sampleCount",schemaPath:"#/$defs/EvaluationSummary/properties/sampleCount/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000},message:"must be <= 1000"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
else {
if(data24 < 1 || isNaN(data24)){
const err23 = {instancePath:instancePath+"/evaluation/sampleCount",schemaPath:"#/$defs/EvaluationSummary/properties/sampleCount/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
}
}
var valid7 = _errs57 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data16.elapsedMs !== undefined){
let data25 = data16.elapsedMs;
const _errs59 = errors;
if(!(((typeof data25 == "number") && (!(data25 % 1) && !isNaN(data25))) && (isFinite(data25)))){
const err24 = {instancePath:instancePath+"/evaluation/elapsedMs",schemaPath:"#/$defs/EvaluationSummary/properties/elapsedMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
if(errors === _errs59){
if((typeof data25 == "number") && (isFinite(data25))){
if(data25 > 86400000 || isNaN(data25)){
const err25 = {instancePath:instancePath+"/evaluation/elapsedMs",schemaPath:"#/$defs/EvaluationSummary/properties/elapsedMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 86400000},message:"must be <= 86400000"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
else {
if(data25 < 1 || isNaN(data25)){
const err26 = {instancePath:instancePath+"/evaluation/elapsedMs",schemaPath:"#/$defs/EvaluationSummary/properties/elapsedMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
}
}
var valid7 = _errs59 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data16.passed !== undefined){
const _errs61 = errors;
if(typeof data16.passed !== "boolean"){
const err27 = {instancePath:instancePath+"/evaluation/passed",schemaPath:"#/$defs/EvaluationSummary/properties/passed/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
var valid7 = _errs61 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data16.recordedAt !== undefined){
let data27 = data16.recordedAt;
const _errs63 = errors;
if(!(((typeof data27 == "number") && (!(data27 % 1) && !isNaN(data27))) && (isFinite(data27)))){
const err28 = {instancePath:instancePath+"/evaluation/recordedAt",schemaPath:"#/$defs/EvaluationSummary/properties/recordedAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
if(errors === _errs63){
if((typeof data27 == "number") && (isFinite(data27))){
if(data27 > 9007199254740991 || isNaN(data27)){
const err29 = {instancePath:instancePath+"/evaluation/recordedAt",schemaPath:"#/$defs/EvaluationSummary/properties/recordedAt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
else {
if(data27 < 0 || isNaN(data27)){
const err30 = {instancePath:instancePath+"/evaluation/recordedAt",schemaPath:"#/$defs/EvaluationSummary/properties/recordedAt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
}
}
var valid7 = _errs63 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data16.freshUntil !== undefined){
let data28 = data16.freshUntil;
const _errs65 = errors;
if(!(((typeof data28 == "number") && (!(data28 % 1) && !isNaN(data28))) && (isFinite(data28)))){
const err31 = {instancePath:instancePath+"/evaluation/freshUntil",schemaPath:"#/$defs/EvaluationSummary/properties/freshUntil/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if(errors === _errs65){
if((typeof data28 == "number") && (isFinite(data28))){
if(data28 > 9007199254740991 || isNaN(data28)){
const err32 = {instancePath:instancePath+"/evaluation/freshUntil",schemaPath:"#/$defs/EvaluationSummary/properties/freshUntil/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
else {
if(data28 < 1 || isNaN(data28)){
const err33 = {instancePath:instancePath+"/evaluation/freshUntil",schemaPath:"#/$defs/EvaluationSummary/properties/freshUntil/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
}
}
var valid7 = _errs65 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data16.checks !== undefined){
let data29 = data16.checks;
const _errs67 = errors;
if(errors === _errs67){
if(data29 && typeof data29 == "object" && !Array.isArray(data29)){
let missing2;
if((((((data29.format === undefined) && (missing2 = "format")) || ((data29.tools === undefined) && (missing2 = "tools"))) || ((data29.usage === undefined) && (missing2 = "usage"))) || ((data29.cancellation === undefined) && (missing2 = "cancellation"))) || ((data29.offlineExecution === undefined) && (missing2 = "offlineExecution"))){
const err34 = {instancePath:instancePath+"/evaluation/checks",schemaPath:"#/$defs/EvaluationSummary/properties/checks/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
else {
const _errs69 = errors;
for(const key2 in data29){
if(!(((((key2 === "format") || (key2 === "tools")) || (key2 === "usage")) || (key2 === "cancellation")) || (key2 === "offlineExecution"))){
const err35 = {instancePath:instancePath+"/evaluation/checks",schemaPath:"#/$defs/EvaluationSummary/properties/checks/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
break;
}
}
if(_errs69 === errors){
if(data29.format !== undefined){
const _errs70 = errors;
if(typeof data29.format !== "boolean"){
const err36 = {instancePath:instancePath+"/evaluation/checks/format",schemaPath:"#/$defs/EvaluationSummary/properties/checks/properties/format/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
var valid9 = _errs70 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data29.tools !== undefined){
const _errs72 = errors;
if(typeof data29.tools !== "boolean"){
const err37 = {instancePath:instancePath+"/evaluation/checks/tools",schemaPath:"#/$defs/EvaluationSummary/properties/checks/properties/tools/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
var valid9 = _errs72 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data29.usage !== undefined){
const _errs74 = errors;
if(typeof data29.usage !== "boolean"){
const err38 = {instancePath:instancePath+"/evaluation/checks/usage",schemaPath:"#/$defs/EvaluationSummary/properties/checks/properties/usage/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
var valid9 = _errs74 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data29.cancellation !== undefined){
const _errs76 = errors;
if(typeof data29.cancellation !== "boolean"){
const err39 = {instancePath:instancePath+"/evaluation/checks/cancellation",schemaPath:"#/$defs/EvaluationSummary/properties/checks/properties/cancellation/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
var valid9 = _errs76 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data29.offlineExecution !== undefined){
const _errs78 = errors;
if(typeof data29.offlineExecution !== "boolean"){
const err40 = {instancePath:instancePath+"/evaluation/checks/offlineExecution",schemaPath:"#/$defs/EvaluationSummary/properties/checks/properties/offlineExecution/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
var valid9 = _errs78 === errors;
}
else {
var valid9 = true;
}
}
}
}
}
}
}
}
else {
const err41 = {instancePath:instancePath+"/evaluation/checks",schemaPath:"#/$defs/EvaluationSummary/properties/checks/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
var valid7 = _errs67 === errors;
}
else {
var valid7 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
else {
const err42 = {instancePath:instancePath+"/evaluation",schemaPath:"#/$defs/EvaluationSummary/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
var _valid0 = _errs35 === errors;
valid5 = valid5 || _valid0;
}
if(!valid5){
const err43 = {instancePath:instancePath+"/evaluation",schemaPath:"#/properties/evaluation/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
validate50.errors = vErrors;
return false;
}
else {
errors = _errs32;
if(vErrors !== null){
if(_errs32){
vErrors.length = _errs32;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs31 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.controlOnline !== undefined){
const _errs80 = errors;
if(typeof data.controlOnline !== "boolean"){
validate50.errors = [{instancePath:instancePath+"/controlOnline",schemaPath:"#/properties/controlOnline/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs80 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.activationDeadlineSeconds !== undefined){
const _errs82 = errors;
if(120 !== data.activationDeadlineSeconds){
validate50.errors = [{instancePath:instancePath+"/activationDeadlineSeconds",schemaPath:"#/properties/activationDeadlineSeconds/const",keyword:"const",params:{allowedValue: 120},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs82 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.maxOutputTokens !== undefined){
let data37 = data.maxOutputTokens;
const _errs83 = errors;
if(!(((typeof data37 == "number") && (!(data37 % 1) && !isNaN(data37))) && (isFinite(data37)))){
validate50.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs83){
if((typeof data37 == "number") && (isFinite(data37))){
if(data37 > 8192 || isNaN(data37)){
validate50.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 8192},message:"must be <= 8192"}];
return false;
}
else {
if(data37 < 1 || isNaN(data37)){
validate50.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs83 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate50.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate50.errors = vErrors;
return errors === 0;
}

export const MarketplaceQuoteRequest = validate51;
const schema58 = {"type":"object","additionalProperties":false,"properties":{"listingId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"maximumCharge":{"type":"string","pattern":"^(0|[1-9][0-9]{0,8})$"},"maxOutputTokens":{"type":"integer","minimum":1,"maximum":8192},"durationSeconds":{"type":"integer","minimum":60,"maximum":3600},"protocol":{"const":"coding_v1"},"requestLimit":{"type":"integer","minimum":1,"maximum":100},"mode":{"enum":["purchase","private_rehearsal"]},"acknowledgeProvisional":{"type":"boolean"}},"required":["listingId","maximumCharge","maxOutputTokens","durationSeconds"]};

function validate51(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.listingId === undefined) && (missing0 = "listingId")) || ((data.maximumCharge === undefined) && (missing0 = "maximumCharge"))) || ((data.maxOutputTokens === undefined) && (missing0 = "maxOutputTokens"))) || ((data.durationSeconds === undefined) && (missing0 = "durationSeconds"))){
validate51.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((((key0 === "listingId") || (key0 === "maximumCharge")) || (key0 === "maxOutputTokens")) || (key0 === "durationSeconds")) || (key0 === "protocol")) || (key0 === "requestLimit")) || (key0 === "mode")) || (key0 === "acknowledgeProvisional"))){
validate51.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.listingId !== undefined){
let data0 = data.listingId;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(!pattern67.test(data0)){
validate51.errors = [{instancePath:instancePath+"/listingId",schemaPath:"#/properties/listingId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate51.errors = [{instancePath:instancePath+"/listingId",schemaPath:"#/properties/listingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.maximumCharge !== undefined){
let data1 = data.maximumCharge;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data1 === "string"){
if(!pattern91.test(data1)){
validate51.errors = [{instancePath:instancePath+"/maximumCharge",schemaPath:"#/properties/maximumCharge/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,8})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,8})$"+"\""}];
return false;
}
}
else {
validate51.errors = [{instancePath:instancePath+"/maximumCharge",schemaPath:"#/properties/maximumCharge/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.maxOutputTokens !== undefined){
let data2 = data.maxOutputTokens;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate51.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 8192 || isNaN(data2)){
validate51.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 8192},message:"must be <= 8192"}];
return false;
}
else {
if(data2 < 1 || isNaN(data2)){
validate51.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.durationSeconds !== undefined){
let data3 = data.durationSeconds;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate51.errors = [{instancePath:instancePath+"/durationSeconds",schemaPath:"#/properties/durationSeconds/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 3600 || isNaN(data3)){
validate51.errors = [{instancePath:instancePath+"/durationSeconds",schemaPath:"#/properties/durationSeconds/maximum",keyword:"maximum",params:{comparison: "<=", limit: 3600},message:"must be <= 3600"}];
return false;
}
else {
if(data3 < 60 || isNaN(data3)){
validate51.errors = [{instancePath:instancePath+"/durationSeconds",schemaPath:"#/properties/durationSeconds/minimum",keyword:"minimum",params:{comparison: ">=", limit: 60},message:"must be >= 60"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.protocol !== undefined){
const _errs10 = errors;
if("coding_v1" !== data.protocol){
validate51.errors = [{instancePath:instancePath+"/protocol",schemaPath:"#/properties/protocol/const",keyword:"const",params:{allowedValue: "coding_v1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestLimit !== undefined){
let data5 = data.requestLimit;
const _errs11 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
validate51.errors = [{instancePath:instancePath+"/requestLimit",schemaPath:"#/properties/requestLimit/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs11){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 100 || isNaN(data5)){
validate51.errors = [{instancePath:instancePath+"/requestLimit",schemaPath:"#/properties/requestLimit/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100},message:"must be <= 100"}];
return false;
}
else {
if(data5 < 1 || isNaN(data5)){
validate51.errors = [{instancePath:instancePath+"/requestLimit",schemaPath:"#/properties/requestLimit/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.mode !== undefined){
let data6 = data.mode;
const _errs13 = errors;
if(!((data6 === "purchase") || (data6 === "private_rehearsal"))){
validate51.errors = [{instancePath:instancePath+"/mode",schemaPath:"#/properties/mode/enum",keyword:"enum",params:{allowedValues: schema58.properties.mode.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.acknowledgeProvisional !== undefined){
const _errs14 = errors;
if(typeof data.acknowledgeProvisional !== "boolean"){
validate51.errors = [{instancePath:instancePath+"/acknowledgeProvisional",schemaPath:"#/properties/acknowledgeProvisional/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
else {
validate51.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate51.errors = vErrors;
return errors === 0;
}

export const MarketplaceSessionAcceptance = validate52;
const schema59 = {"type":"object","additionalProperties":false,"properties":{"quoteId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"accept":{"const":true},"mode":{"enum":["purchase","private_rehearsal"]},"acknowledgeProvisional":{"type":"boolean"}},"required":["quoteId","accept"]};

function validate52(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.quoteId === undefined) && (missing0 = "quoteId")) || ((data.accept === undefined) && (missing0 = "accept"))){
validate52.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "quoteId") || (key0 === "accept")) || (key0 === "mode")) || (key0 === "acknowledgeProvisional"))){
validate52.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.quoteId !== undefined){
let data0 = data.quoteId;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(!pattern67.test(data0)){
validate52.errors = [{instancePath:instancePath+"/quoteId",schemaPath:"#/properties/quoteId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate52.errors = [{instancePath:instancePath+"/quoteId",schemaPath:"#/properties/quoteId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.accept !== undefined){
const _errs4 = errors;
if(true !== data.accept){
validate52.errors = [{instancePath:instancePath+"/accept",schemaPath:"#/properties/accept/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.mode !== undefined){
let data2 = data.mode;
const _errs5 = errors;
if(!((data2 === "purchase") || (data2 === "private_rehearsal"))){
validate52.errors = [{instancePath:instancePath+"/mode",schemaPath:"#/properties/mode/enum",keyword:"enum",params:{allowedValues: schema59.properties.mode.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.acknowledgeProvisional !== undefined){
const _errs6 = errors;
if(typeof data.acknowledgeProvisional !== "boolean"){
validate52.errors = [{instancePath:instancePath+"/acknowledgeProvisional",schemaPath:"#/properties/acknowledgeProvisional/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
else {
validate52.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate52.errors = vErrors;
return errors === 0;
}

export const ExecutionRelease = validate53;
const schema60 = {"type":"object","additionalProperties":false,"properties":{"teardownEvidenceReference":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"guestTeardownVerified":{"const":true}},"required":["teardownEvidenceReference","guestTeardownVerified"]};

function validate53(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.teardownEvidenceReference === undefined) && (missing0 = "teardownEvidenceReference")) || ((data.guestTeardownVerified === undefined) && (missing0 = "guestTeardownVerified"))){
validate53.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "teardownEvidenceReference") || (key0 === "guestTeardownVerified"))){
validate53.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.teardownEvidenceReference !== undefined){
let data0 = data.teardownEvidenceReference;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(func2(data0) > 120){
validate53.errors = [{instancePath:instancePath+"/teardownEvidenceReference",schemaPath:"#/properties/teardownEvidenceReference/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data0) < 1){
validate53.errors = [{instancePath:instancePath+"/teardownEvidenceReference",schemaPath:"#/properties/teardownEvidenceReference/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data0)){
validate53.errors = [{instancePath:instancePath+"/teardownEvidenceReference",schemaPath:"#/properties/teardownEvidenceReference/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate53.errors = [{instancePath:instancePath+"/teardownEvidenceReference",schemaPath:"#/properties/teardownEvidenceReference/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.guestTeardownVerified !== undefined){
const _errs4 = errors;
if(true !== data.guestTeardownVerified){
validate53.errors = [{instancePath:instancePath+"/guestTeardownVerified",schemaPath:"#/properties/guestTeardownVerified/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate53.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate53.errors = vErrors;
return errors === 0;
}

export const MarketplaceSessionStatus = validate54;
const schema61 = {"type":"object","properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"mode":{"enum":["purchase","private_rehearsal","evaluation"]},"requestLimit":{"type":"integer","minimum":1,"maximum":100},"requestSequence":{"type":"integer","minimum":0,"maximum":100},"handshakeStatus":{"enum":["not_required","required","pending","succeeded","failed"]},"executionReleasedAt":{"anyOf":[{"type":"integer","minimum":1,"maximum":9007199254740991},{"type":"null"}]}},"required":["id","mode","requestLimit","handshakeStatus","executionReleasedAt"]};

function validate54(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.id === undefined) && (missing0 = "id")) || ((data.mode === undefined) && (missing0 = "mode"))) || ((data.requestLimit === undefined) && (missing0 = "requestLimit"))) || ((data.handshakeStatus === undefined) && (missing0 = "handshakeStatus"))) || ((data.executionReleasedAt === undefined) && (missing0 = "executionReleasedAt"))){
validate54.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.id !== undefined){
let data0 = data.id;
const _errs1 = errors;
if(errors === _errs1){
if(typeof data0 === "string"){
if(!pattern67.test(data0)){
validate54.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate54.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.mode !== undefined){
let data1 = data.mode;
const _errs3 = errors;
if(!(((data1 === "purchase") || (data1 === "private_rehearsal")) || (data1 === "evaluation"))){
validate54.errors = [{instancePath:instancePath+"/mode",schemaPath:"#/properties/mode/enum",keyword:"enum",params:{allowedValues: schema61.properties.mode.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestLimit !== undefined){
let data2 = data.requestLimit;
const _errs4 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate54.errors = [{instancePath:instancePath+"/requestLimit",schemaPath:"#/properties/requestLimit/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs4){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 100 || isNaN(data2)){
validate54.errors = [{instancePath:instancePath+"/requestLimit",schemaPath:"#/properties/requestLimit/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100},message:"must be <= 100"}];
return false;
}
else {
if(data2 < 1 || isNaN(data2)){
validate54.errors = [{instancePath:instancePath+"/requestLimit",schemaPath:"#/properties/requestLimit/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestSequence !== undefined){
let data3 = data.requestSequence;
const _errs6 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate54.errors = [{instancePath:instancePath+"/requestSequence",schemaPath:"#/properties/requestSequence/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 100 || isNaN(data3)){
validate54.errors = [{instancePath:instancePath+"/requestSequence",schemaPath:"#/properties/requestSequence/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100},message:"must be <= 100"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate54.errors = [{instancePath:instancePath+"/requestSequence",schemaPath:"#/properties/requestSequence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.handshakeStatus !== undefined){
let data4 = data.handshakeStatus;
const _errs8 = errors;
if(!(((((data4 === "not_required") || (data4 === "required")) || (data4 === "pending")) || (data4 === "succeeded")) || (data4 === "failed"))){
validate54.errors = [{instancePath:instancePath+"/handshakeStatus",schemaPath:"#/properties/handshakeStatus/enum",keyword:"enum",params:{allowedValues: schema61.properties.handshakeStatus.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.executionReleasedAt !== undefined){
let data5 = data.executionReleasedAt;
const _errs9 = errors;
const _errs10 = errors;
let valid1 = false;
const _errs11 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
const err0 = {instancePath:instancePath+"/executionReleasedAt",schemaPath:"#/properties/executionReleasedAt/anyOf/0/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(errors === _errs11){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 9007199254740991 || isNaN(data5)){
const err1 = {instancePath:instancePath+"/executionReleasedAt",schemaPath:"#/properties/executionReleasedAt/anyOf/0/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
else {
if(data5 < 1 || isNaN(data5)){
const err2 = {instancePath:instancePath+"/executionReleasedAt",schemaPath:"#/properties/executionReleasedAt/anyOf/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
}
}
var _valid0 = _errs11 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs13 = errors;
if(data5 !== null){
const err3 = {instancePath:instancePath+"/executionReleasedAt",schemaPath:"#/properties/executionReleasedAt/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
var _valid0 = _errs13 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err4 = {instancePath:instancePath+"/executionReleasedAt",schemaPath:"#/properties/executionReleasedAt/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
validate54.errors = vErrors;
return false;
}
else {
errors = _errs10;
if(vErrors !== null){
if(_errs10){
vErrors.length = _errs10;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate54.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate54.errors = vErrors;
return errors === 0;
}

export const MarketplaceRoles = validate55;
const schema62 = {"type":"array","minItems":1,"maxItems":2,"uniqueItems":true,"items":{"enum":["marketplace:buyer","marketplace:provider"]}};

function validate55(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(Array.isArray(data)){
if(data.length > 2){
validate55.errors = [{instancePath,schemaPath:"#/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"}];
return false;
}
else {
if(data.length < 1){
validate55.errors = [{instancePath,schemaPath:"#/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid0 = true;
const len0 = data.length;
for(let i0=0; i0<len0; i0++){
let data0 = data[i0];
const _errs1 = errors;
if(!((data0 === "marketplace:buyer") || (data0 === "marketplace:provider"))){
validate55.errors = [{instancePath:instancePath+"/" + i0,schemaPath:"#/items/enum",keyword:"enum",params:{allowedValues: schema62.items.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs1 === errors;
if(!valid0){
break;
}
}
if(valid0){
let i1 = data.length;
let j0;
if(i1 > 1){
outer0:
for(;i1--;){
for(j0 = i1; j0--;){
if(func0(data[i1], data[j0])){
validate55.errors = [{instancePath,schemaPath:"#/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"}];
return false;
break outer0;
}
}
}
}
}
}
}
}
else {
validate55.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
validate55.errors = vErrors;
return errors === 0;
}

export const MarketplaceNetworkConfig = validate56;
const schema63 = {"type":"object","additionalProperties":false,"properties":{"protocol":{"const":"2.0.0"},"product":{"const":"adr-v2"},"settlement":{"const":"test_credits"},"cashValue":{"const":false},"admissions":{"type":"boolean"},"privateOwnerEvaluation":{"type":"boolean"},"privateRehearsal":{"type":"boolean"},"supplyClasses":{"type":"array","minItems":2,"maxItems":2,"uniqueItems":true,"items":{"$ref":"#/$defs/SupplyClass"}},"connectorProfile":{"$ref":"#/$defs/ConnectorProfile"},"maxNodeSessions":{"const":1},"relay":{"enum":["not_enabled","wss_single_instance"]},"agentExecution":{"const":"buyer_vm_v1"},"capabilities":{"type":"array","uniqueItems":true,"items":{"enum":["allowance_v1","provider_budget_v1","cold_activation_v1","private_owner_evaluation_v1","private_rehearsal_v1","session_handshake_v1","coding_v1"]}},"activationDeadlineSeconds":{"const":120},"codingLimits":{"type":"object","additionalProperties":false,"properties":{"durationSeconds":{"const":3600},"requestLimit":{"const":100}},"required":["durationSeconds","requestLimit"]}},"required":["protocol","product","settlement","cashValue","admissions","privateOwnerEvaluation","privateRehearsal","supplyClasses","connectorProfile","maxNodeSessions","relay","agentExecution","capabilities","activationDeadlineSeconds"]};

function validate56(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((((((((((data.protocol === undefined) && (missing0 = "protocol")) || ((data.product === undefined) && (missing0 = "product"))) || ((data.settlement === undefined) && (missing0 = "settlement"))) || ((data.cashValue === undefined) && (missing0 = "cashValue"))) || ((data.admissions === undefined) && (missing0 = "admissions"))) || ((data.privateOwnerEvaluation === undefined) && (missing0 = "privateOwnerEvaluation"))) || ((data.privateRehearsal === undefined) && (missing0 = "privateRehearsal"))) || ((data.supplyClasses === undefined) && (missing0 = "supplyClasses"))) || ((data.connectorProfile === undefined) && (missing0 = "connectorProfile"))) || ((data.maxNodeSessions === undefined) && (missing0 = "maxNodeSessions"))) || ((data.relay === undefined) && (missing0 = "relay"))) || ((data.agentExecution === undefined) && (missing0 = "agentExecution"))) || ((data.capabilities === undefined) && (missing0 = "capabilities"))) || ((data.activationDeadlineSeconds === undefined) && (missing0 = "activationDeadlineSeconds"))){
validate56.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema63.properties, key0))){
validate56.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.protocol !== undefined){
const _errs2 = errors;
if("2.0.0" !== data.protocol){
validate56.errors = [{instancePath:instancePath+"/protocol",schemaPath:"#/properties/protocol/const",keyword:"const",params:{allowedValue: "2.0.0"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.product !== undefined){
const _errs3 = errors;
if("adr-v2" !== data.product){
validate56.errors = [{instancePath:instancePath+"/product",schemaPath:"#/properties/product/const",keyword:"const",params:{allowedValue: "adr-v2"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.settlement !== undefined){
const _errs4 = errors;
if("test_credits" !== data.settlement){
validate56.errors = [{instancePath:instancePath+"/settlement",schemaPath:"#/properties/settlement/const",keyword:"const",params:{allowedValue: "test_credits"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.cashValue !== undefined){
const _errs5 = errors;
if(false !== data.cashValue){
validate56.errors = [{instancePath:instancePath+"/cashValue",schemaPath:"#/properties/cashValue/const",keyword:"const",params:{allowedValue: false},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.admissions !== undefined){
const _errs6 = errors;
if(typeof data.admissions !== "boolean"){
validate56.errors = [{instancePath:instancePath+"/admissions",schemaPath:"#/properties/admissions/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.privateOwnerEvaluation !== undefined){
const _errs8 = errors;
if(typeof data.privateOwnerEvaluation !== "boolean"){
validate56.errors = [{instancePath:instancePath+"/privateOwnerEvaluation",schemaPath:"#/properties/privateOwnerEvaluation/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.privateRehearsal !== undefined){
const _errs10 = errors;
if(typeof data.privateRehearsal !== "boolean"){
validate56.errors = [{instancePath:instancePath+"/privateRehearsal",schemaPath:"#/properties/privateRehearsal/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.supplyClasses !== undefined){
let data7 = data.supplyClasses;
const _errs12 = errors;
if(errors === _errs12){
if(Array.isArray(data7)){
if(data7.length > 2){
validate56.errors = [{instancePath:instancePath+"/supplyClasses",schemaPath:"#/properties/supplyClasses/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"}];
return false;
}
else {
if(data7.length < 2){
validate56.errors = [{instancePath:instancePath+"/supplyClasses",schemaPath:"#/properties/supplyClasses/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"}];
return false;
}
else {
var valid1 = true;
const len0 = data7.length;
for(let i0=0; i0<len0; i0++){
let data8 = data7[i0];
const _errs14 = errors;
if(!((data8 === "authorized_api") || (data8 === "self_hosted"))){
validate56.errors = [{instancePath:instancePath+"/supplyClasses/" + i0,schemaPath:"#/$defs/SupplyClass/enum",keyword:"enum",params:{allowedValues: schema12.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid1 = _errs14 === errors;
if(!valid1){
break;
}
}
if(valid1){
let i1 = data7.length;
let j0;
if(i1 > 1){
outer0:
for(;i1--;){
for(j0 = i1; j0--;){
if(func0(data7[i1], data7[j0])){
validate56.errors = [{instancePath:instancePath+"/supplyClasses",schemaPath:"#/properties/supplyClasses/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"}];
return false;
break outer0;
}
}
}
}
}
}
}
}
else {
validate56.errors = [{instancePath:instancePath+"/supplyClasses",schemaPath:"#/properties/supplyClasses/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.connectorProfile !== undefined){
const _errs16 = errors;
if("inference_connector_v1" !== data.connectorProfile){
validate56.errors = [{instancePath:instancePath+"/connectorProfile",schemaPath:"#/$defs/ConnectorProfile/const",keyword:"const",params:{allowedValue: "inference_connector_v1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.maxNodeSessions !== undefined){
const _errs18 = errors;
if(1 !== data.maxNodeSessions){
validate56.errors = [{instancePath:instancePath+"/maxNodeSessions",schemaPath:"#/properties/maxNodeSessions/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs18 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.relay !== undefined){
let data11 = data.relay;
const _errs19 = errors;
if(!((data11 === "not_enabled") || (data11 === "wss_single_instance"))){
validate56.errors = [{instancePath:instancePath+"/relay",schemaPath:"#/properties/relay/enum",keyword:"enum",params:{allowedValues: schema63.properties.relay.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs19 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.agentExecution !== undefined){
const _errs20 = errors;
if("buyer_vm_v1" !== data.agentExecution){
validate56.errors = [{instancePath:instancePath+"/agentExecution",schemaPath:"#/properties/agentExecution/const",keyword:"const",params:{allowedValue: "buyer_vm_v1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs20 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.capabilities !== undefined){
let data13 = data.capabilities;
const _errs21 = errors;
if(errors === _errs21){
if(Array.isArray(data13)){
var valid5 = true;
const len1 = data13.length;
for(let i2=0; i2<len1; i2++){
let data14 = data13[i2];
const _errs23 = errors;
if(!(((((((data14 === "allowance_v1") || (data14 === "provider_budget_v1")) || (data14 === "cold_activation_v1")) || (data14 === "private_owner_evaluation_v1")) || (data14 === "private_rehearsal_v1")) || (data14 === "session_handshake_v1")) || (data14 === "coding_v1"))){
validate56.errors = [{instancePath:instancePath+"/capabilities/" + i2,schemaPath:"#/properties/capabilities/items/enum",keyword:"enum",params:{allowedValues: schema63.properties.capabilities.items.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid5 = _errs23 === errors;
if(!valid5){
break;
}
}
if(valid5){
let i3 = data13.length;
let j1;
if(i3 > 1){
outer1:
for(;i3--;){
for(j1 = i3; j1--;){
if(func0(data13[i3], data13[j1])){
validate56.errors = [{instancePath:instancePath+"/capabilities",schemaPath:"#/properties/capabilities/uniqueItems",keyword:"uniqueItems",params:{i: i3, j: j1},message:"must NOT have duplicate items (items ## "+j1+" and "+i3+" are identical)"}];
return false;
break outer1;
}
}
}
}
}
}
else {
validate56.errors = [{instancePath:instancePath+"/capabilities",schemaPath:"#/properties/capabilities/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs21 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.activationDeadlineSeconds !== undefined){
const _errs24 = errors;
if(120 !== data.activationDeadlineSeconds){
validate56.errors = [{instancePath:instancePath+"/activationDeadlineSeconds",schemaPath:"#/properties/activationDeadlineSeconds/const",keyword:"const",params:{allowedValue: 120},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs24 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.codingLimits !== undefined){
let data16 = data.codingLimits;
const _errs25 = errors;
if(errors === _errs25){
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
let missing1;
if(((data16.durationSeconds === undefined) && (missing1 = "durationSeconds")) || ((data16.requestLimit === undefined) && (missing1 = "requestLimit"))){
validate56.errors = [{instancePath:instancePath+"/codingLimits",schemaPath:"#/properties/codingLimits/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs27 = errors;
for(const key1 in data16){
if(!((key1 === "durationSeconds") || (key1 === "requestLimit"))){
validate56.errors = [{instancePath:instancePath+"/codingLimits",schemaPath:"#/properties/codingLimits/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs27 === errors){
if(data16.durationSeconds !== undefined){
const _errs28 = errors;
if(3600 !== data16.durationSeconds){
validate56.errors = [{instancePath:instancePath+"/codingLimits/durationSeconds",schemaPath:"#/properties/codingLimits/properties/durationSeconds/const",keyword:"const",params:{allowedValue: 3600},message:"must be equal to constant"}];
return false;
}
var valid7 = _errs28 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data16.requestLimit !== undefined){
const _errs29 = errors;
if(100 !== data16.requestLimit){
validate56.errors = [{instancePath:instancePath+"/codingLimits/requestLimit",schemaPath:"#/properties/codingLimits/properties/requestLimit/const",keyword:"const",params:{allowedValue: 100},message:"must be equal to constant"}];
return false;
}
var valid7 = _errs29 === errors;
}
else {
var valid7 = true;
}
}
}
}
}
else {
validate56.errors = [{instancePath:instancePath+"/codingLimits",schemaPath:"#/properties/codingLimits/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs25 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate56.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate56.errors = vErrors;
return errors === 0;
}

export const MarketplaceSessionReceipt = validate57;
const schema66 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"ownerId":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"sessionId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"evaluation":{"type":"boolean"},"listingId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"funded":{"type":"string","pattern":"^(0|[1-9][0-9]{0,8})$"},"charged":{"type":"string","pattern":"^(0|[1-9][0-9]{0,8})$"},"refunded":{"type":"string","pattern":"^(0|[1-9][0-9]{0,8})$"},"state":{"enum":["settled","refunded"]},"reason":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"at":{"type":"integer","minimum":0,"maximum":9007199254740991},"settlement":{"const":"test_credits"},"cashValue":{"const":false}},"required":["id","ownerId","sessionId","evaluation","listingId","funded","charged","refunded","state","reason","at","settlement","cashValue"]};

function validate57(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((((((((data.id === undefined) && (missing0 = "id")) || ((data.ownerId === undefined) && (missing0 = "ownerId"))) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.evaluation === undefined) && (missing0 = "evaluation"))) || ((data.listingId === undefined) && (missing0 = "listingId"))) || ((data.funded === undefined) && (missing0 = "funded"))) || ((data.charged === undefined) && (missing0 = "charged"))) || ((data.refunded === undefined) && (missing0 = "refunded"))) || ((data.state === undefined) && (missing0 = "state"))) || ((data.reason === undefined) && (missing0 = "reason"))) || ((data.at === undefined) && (missing0 = "at"))) || ((data.settlement === undefined) && (missing0 = "settlement"))) || ((data.cashValue === undefined) && (missing0 = "cashValue"))){
validate57.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema66.properties, key0))){
validate57.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(!pattern67.test(data0)){
validate57.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate57.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ownerId !== undefined){
let data1 = data.ownerId;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data1 === "string"){
if(func2(data1) > 120){
validate57.errors = [{instancePath:instancePath+"/ownerId",schemaPath:"#/properties/ownerId/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data1) < 1){
validate57.errors = [{instancePath:instancePath+"/ownerId",schemaPath:"#/properties/ownerId/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data1)){
validate57.errors = [{instancePath:instancePath+"/ownerId",schemaPath:"#/properties/ownerId/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate57.errors = [{instancePath:instancePath+"/ownerId",schemaPath:"#/properties/ownerId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sessionId !== undefined){
let data2 = data.sessionId;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data2 === "string"){
if(!pattern67.test(data2)){
validate57.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate57.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.evaluation !== undefined){
const _errs8 = errors;
if(typeof data.evaluation !== "boolean"){
validate57.errors = [{instancePath:instancePath+"/evaluation",schemaPath:"#/properties/evaluation/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.listingId !== undefined){
let data4 = data.listingId;
const _errs10 = errors;
if(errors === _errs10){
if(typeof data4 === "string"){
if(!pattern67.test(data4)){
validate57.errors = [{instancePath:instancePath+"/listingId",schemaPath:"#/properties/listingId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate57.errors = [{instancePath:instancePath+"/listingId",schemaPath:"#/properties/listingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.funded !== undefined){
let data5 = data.funded;
const _errs12 = errors;
if(errors === _errs12){
if(typeof data5 === "string"){
if(!pattern91.test(data5)){
validate57.errors = [{instancePath:instancePath+"/funded",schemaPath:"#/properties/funded/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,8})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,8})$"+"\""}];
return false;
}
}
else {
validate57.errors = [{instancePath:instancePath+"/funded",schemaPath:"#/properties/funded/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.charged !== undefined){
let data6 = data.charged;
const _errs14 = errors;
if(errors === _errs14){
if(typeof data6 === "string"){
if(!pattern91.test(data6)){
validate57.errors = [{instancePath:instancePath+"/charged",schemaPath:"#/properties/charged/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,8})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,8})$"+"\""}];
return false;
}
}
else {
validate57.errors = [{instancePath:instancePath+"/charged",schemaPath:"#/properties/charged/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.refunded !== undefined){
let data7 = data.refunded;
const _errs16 = errors;
if(errors === _errs16){
if(typeof data7 === "string"){
if(!pattern91.test(data7)){
validate57.errors = [{instancePath:instancePath+"/refunded",schemaPath:"#/properties/refunded/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,8})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,8})$"+"\""}];
return false;
}
}
else {
validate57.errors = [{instancePath:instancePath+"/refunded",schemaPath:"#/properties/refunded/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.state !== undefined){
let data8 = data.state;
const _errs18 = errors;
if(!((data8 === "settled") || (data8 === "refunded"))){
validate57.errors = [{instancePath:instancePath+"/state",schemaPath:"#/properties/state/enum",keyword:"enum",params:{allowedValues: schema66.properties.state.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs18 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.reason !== undefined){
let data9 = data.reason;
const _errs19 = errors;
if(errors === _errs19){
if(typeof data9 === "string"){
if(func2(data9) > 120){
validate57.errors = [{instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data9) < 1){
validate57.errors = [{instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data9)){
validate57.errors = [{instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate57.errors = [{instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs19 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.at !== undefined){
let data10 = data.at;
const _errs21 = errors;
if(!(((typeof data10 == "number") && (!(data10 % 1) && !isNaN(data10))) && (isFinite(data10)))){
validate57.errors = [{instancePath:instancePath+"/at",schemaPath:"#/properties/at/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs21){
if((typeof data10 == "number") && (isFinite(data10))){
if(data10 > 9007199254740991 || isNaN(data10)){
validate57.errors = [{instancePath:instancePath+"/at",schemaPath:"#/properties/at/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data10 < 0 || isNaN(data10)){
validate57.errors = [{instancePath:instancePath+"/at",schemaPath:"#/properties/at/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs21 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.settlement !== undefined){
const _errs23 = errors;
if("test_credits" !== data.settlement){
validate57.errors = [{instancePath:instancePath+"/settlement",schemaPath:"#/properties/settlement/const",keyword:"const",params:{allowedValue: "test_credits"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs23 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.cashValue !== undefined){
const _errs24 = errors;
if(false !== data.cashValue){
validate57.errors = [{instancePath:instancePath+"/cashValue",schemaPath:"#/properties/cashValue/const",keyword:"const",params:{allowedValue: false},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs24 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate57.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate57.errors = vErrors;
return errors === 0;
}

export const GuestApprovalRequest = validate58;
const schema67 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"guest_approval"},"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"sessionId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"action":{"enum":["write_file","delete_file","run_command","export_workspace"]},"digest":{"type":"string","pattern":"^[0-9a-f]{64}$"},"expiresUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991}},"required":["type","id","sessionId","action","digest","expiresUnixMs"]};
const pattern128 = new RegExp("^[0-9a-f]{64}$", "u");

function validate58(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.action === undefined) && (missing0 = "action"))) || ((data.digest === undefined) && (missing0 = "digest"))) || ((data.expiresUnixMs === undefined) && (missing0 = "expiresUnixMs"))){
validate58.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "type") || (key0 === "id")) || (key0 === "sessionId")) || (key0 === "action")) || (key0 === "digest")) || (key0 === "expiresUnixMs"))){
validate58.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("guest_approval" !== data.type){
validate58.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "guest_approval"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data1 === "string"){
if(!pattern67.test(data1)){
validate58.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate58.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sessionId !== undefined){
let data2 = data.sessionId;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data2 === "string"){
if(!pattern67.test(data2)){
validate58.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate58.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.action !== undefined){
let data3 = data.action;
const _errs7 = errors;
if(!((((data3 === "write_file") || (data3 === "delete_file")) || (data3 === "run_command")) || (data3 === "export_workspace"))){
validate58.errors = [{instancePath:instancePath+"/action",schemaPath:"#/properties/action/enum",keyword:"enum",params:{allowedValues: schema67.properties.action.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.digest !== undefined){
let data4 = data.digest;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data4 === "string"){
if(!pattern128.test(data4)){
validate58.errors = [{instancePath:instancePath+"/digest",schemaPath:"#/properties/digest/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""}];
return false;
}
}
else {
validate58.errors = [{instancePath:instancePath+"/digest",schemaPath:"#/properties/digest/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.expiresUnixMs !== undefined){
let data5 = data.expiresUnixMs;
const _errs10 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
validate58.errors = [{instancePath:instancePath+"/expiresUnixMs",schemaPath:"#/properties/expiresUnixMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs10){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 9007199254740991 || isNaN(data5)){
validate58.errors = [{instancePath:instancePath+"/expiresUnixMs",schemaPath:"#/properties/expiresUnixMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data5 < 1 || isNaN(data5)){
validate58.errors = [{instancePath:instancePath+"/expiresUnixMs",schemaPath:"#/properties/expiresUnixMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate58.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate58.errors = vErrors;
return errors === 0;
}

export const GuestApprovalDecision = validate59;
const schema68 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"guest_approval_decision"},"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"digest":{"type":"string","pattern":"^[0-9a-f]{64}$"},"allowOnce":{"type":"boolean"}},"required":["type","id","digest","allowOnce"]};

function validate59(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.digest === undefined) && (missing0 = "digest"))) || ((data.allowOnce === undefined) && (missing0 = "allowOnce"))){
validate59.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "type") || (key0 === "id")) || (key0 === "digest")) || (key0 === "allowOnce"))){
validate59.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("guest_approval_decision" !== data.type){
validate59.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "guest_approval_decision"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data1 = data.id;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data1 === "string"){
if(!pattern67.test(data1)){
validate59.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate59.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.digest !== undefined){
let data2 = data.digest;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data2 === "string"){
if(!pattern128.test(data2)){
validate59.errors = [{instancePath:instancePath+"/digest",schemaPath:"#/properties/digest/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""}];
return false;
}
}
else {
validate59.errors = [{instancePath:instancePath+"/digest",schemaPath:"#/properties/digest/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.allowOnce !== undefined){
const _errs7 = errors;
if(typeof data.allowOnce !== "boolean"){
validate59.errors = [{instancePath:instancePath+"/allowOnce",schemaPath:"#/properties/allowOnce/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
else {
validate59.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate59.errors = vErrors;
return errors === 0;
}

export const CodingDelta = validate60;
const schema69 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"coding_delta"},"requestId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"sequence":{"type":"integer","minimum":1,"maximum":8192},"kind":{"enum":["text","thinking","tool"]},"text":{"type":"string","maxLength":8192},"index":{"type":"integer","minimum":0,"maximum":7},"id":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"name":{"type":"string","pattern":"^[A-Za-z_][A-Za-z0-9_-]{0,63}$"}},"required":["type","requestId","sequence","kind","text"]};
const pattern133 = new RegExp("^[A-Za-z_][A-Za-z0-9_-]{0,63}$", "u");

function validate60(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.type === undefined) && (missing0 = "type")) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.sequence === undefined) && (missing0 = "sequence"))) || ((data.kind === undefined) && (missing0 = "kind"))) || ((data.text === undefined) && (missing0 = "text"))){
validate60.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((((key0 === "type") || (key0 === "requestId")) || (key0 === "sequence")) || (key0 === "kind")) || (key0 === "text")) || (key0 === "index")) || (key0 === "id")) || (key0 === "name"))){
validate60.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("coding_delta" !== data.type){
validate60.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "coding_delta"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestId !== undefined){
let data1 = data.requestId;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data1 === "string"){
if(!pattern67.test(data1)){
validate60.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate60.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sequence !== undefined){
let data2 = data.sequence;
const _errs5 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate60.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs5){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 8192 || isNaN(data2)){
validate60.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/maximum",keyword:"maximum",params:{comparison: "<=", limit: 8192},message:"must be <= 8192"}];
return false;
}
else {
if(data2 < 1 || isNaN(data2)){
validate60.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.kind !== undefined){
let data3 = data.kind;
const _errs7 = errors;
if(!(((data3 === "text") || (data3 === "thinking")) || (data3 === "tool"))){
validate60.errors = [{instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/enum",keyword:"enum",params:{allowedValues: schema69.properties.kind.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.text !== undefined){
let data4 = data.text;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data4 === "string"){
if(func2(data4) > 8192){
validate60.errors = [{instancePath:instancePath+"/text",schemaPath:"#/properties/text/maxLength",keyword:"maxLength",params:{limit: 8192},message:"must NOT have more than 8192 characters"}];
return false;
}
}
else {
validate60.errors = [{instancePath:instancePath+"/text",schemaPath:"#/properties/text/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.index !== undefined){
let data5 = data.index;
const _errs10 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
validate60.errors = [{instancePath:instancePath+"/index",schemaPath:"#/properties/index/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs10){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 7 || isNaN(data5)){
validate60.errors = [{instancePath:instancePath+"/index",schemaPath:"#/properties/index/maximum",keyword:"maximum",params:{comparison: "<=", limit: 7},message:"must be <= 7"}];
return false;
}
else {
if(data5 < 0 || isNaN(data5)){
validate60.errors = [{instancePath:instancePath+"/index",schemaPath:"#/properties/index/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
let data6 = data.id;
const _errs12 = errors;
if(errors === _errs12){
if(typeof data6 === "string"){
if(!pattern1.test(data6)){
validate60.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate60.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.name !== undefined){
let data7 = data.name;
const _errs14 = errors;
if(errors === _errs14){
if(typeof data7 === "string"){
if(!pattern133.test(data7)){
validate60.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z_][A-Za-z0-9_-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z_][A-Za-z0-9_-]{0,63}$"+"\""}];
return false;
}
}
else {
validate60.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
else {
validate60.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate60.errors = vErrors;
return errors === 0;
}

export const CodingToolCall = validate61;
const schema70 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"type":{"const":"function"},"function":{"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","pattern":"^[A-Za-z_][A-Za-z0-9_-]{0,63}$"},"arguments":{"type":"string","maxLength":65536}},"required":["name","arguments"]}},"required":["id","type","function"]};

function validate61(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.id === undefined) && (missing0 = "id")) || ((data.type === undefined) && (missing0 = "type"))) || ((data.function === undefined) && (missing0 = "function"))){
validate61.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "id") || (key0 === "type")) || (key0 === "function"))){
validate61.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(!pattern1.test(data0)){
validate61.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate61.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
const _errs4 = errors;
if("function" !== data.type){
validate61.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "function"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.function !== undefined){
let data2 = data.function;
const _errs5 = errors;
if(errors === _errs5){
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
let missing1;
if(((data2.name === undefined) && (missing1 = "name")) || ((data2.arguments === undefined) && (missing1 = "arguments"))){
validate61.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs7 = errors;
for(const key1 in data2){
if(!((key1 === "name") || (key1 === "arguments"))){
validate61.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs7 === errors){
if(data2.name !== undefined){
let data3 = data2.name;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data3 === "string"){
if(!pattern133.test(data3)){
validate61.errors = [{instancePath:instancePath+"/function/name",schemaPath:"#/properties/function/properties/name/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z_][A-Za-z0-9_-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z_][A-Za-z0-9_-]{0,63}$"+"\""}];
return false;
}
}
else {
validate61.errors = [{instancePath:instancePath+"/function/name",schemaPath:"#/properties/function/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid1 = _errs8 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data2.arguments !== undefined){
let data4 = data2.arguments;
const _errs10 = errors;
if(errors === _errs10){
if(typeof data4 === "string"){
if(func2(data4) > 65536){
validate61.errors = [{instancePath:instancePath+"/function/arguments",schemaPath:"#/properties/function/properties/arguments/maxLength",keyword:"maxLength",params:{limit: 65536},message:"must NOT have more than 65536 characters"}];
return false;
}
}
else {
validate61.errors = [{instancePath:instancePath+"/function/arguments",schemaPath:"#/properties/function/properties/arguments/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid1 = _errs10 === errors;
}
else {
var valid1 = true;
}
}
}
}
}
else {
validate61.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
else {
validate61.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate61.errors = vErrors;
return errors === 0;
}

export const CodingToolDefinition = validate62;
const schema71 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"function"},"function":{"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","pattern":"^[A-Za-z_][A-Za-z0-9_-]{0,63}$"},"description":{"type":"string","maxLength":8192},"parameters":{"type":"object"}},"required":["name","description","parameters"]}},"required":["type","function"]};

function validate62(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.function === undefined) && (missing0 = "function"))){
validate62.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "function"))){
validate62.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("function" !== data.type){
validate62.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "function"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.function !== undefined){
let data1 = data.function;
const _errs3 = errors;
if(errors === _errs3){
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
let missing1;
if((((data1.name === undefined) && (missing1 = "name")) || ((data1.description === undefined) && (missing1 = "description"))) || ((data1.parameters === undefined) && (missing1 = "parameters"))){
validate62.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs5 = errors;
for(const key1 in data1){
if(!(((key1 === "name") || (key1 === "description")) || (key1 === "parameters"))){
validate62.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs5 === errors){
if(data1.name !== undefined){
let data2 = data1.name;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data2 === "string"){
if(!pattern133.test(data2)){
validate62.errors = [{instancePath:instancePath+"/function/name",schemaPath:"#/properties/function/properties/name/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z_][A-Za-z0-9_-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z_][A-Za-z0-9_-]{0,63}$"+"\""}];
return false;
}
}
else {
validate62.errors = [{instancePath:instancePath+"/function/name",schemaPath:"#/properties/function/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid1 = _errs6 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data1.description !== undefined){
let data3 = data1.description;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data3 === "string"){
if(func2(data3) > 8192){
validate62.errors = [{instancePath:instancePath+"/function/description",schemaPath:"#/properties/function/properties/description/maxLength",keyword:"maxLength",params:{limit: 8192},message:"must NOT have more than 8192 characters"}];
return false;
}
}
else {
validate62.errors = [{instancePath:instancePath+"/function/description",schemaPath:"#/properties/function/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid1 = _errs8 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data1.parameters !== undefined){
let data4 = data1.parameters;
const _errs10 = errors;
if(!(data4 && typeof data4 == "object" && !Array.isArray(data4))){
validate62.errors = [{instancePath:instancePath+"/function/parameters",schemaPath:"#/properties/function/properties/parameters/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
var valid1 = _errs10 === errors;
}
else {
var valid1 = true;
}
}
}
}
}
}
else {
validate62.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate62.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate62.errors = vErrors;
return errors === 0;
}

export const CodingMessage = validate63;
const schema72 = {"type":"object","additionalProperties":false,"properties":{"role":{"enum":["system","user","assistant","tool"]},"content":{"type":"string","maxLength":131072},"reasoning_content":{"type":"string","maxLength":131072},"tool_call_id":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"tool_calls":{"type":"array","maxItems":8,"items":{"$ref":"#/$defs/CodingToolCall"}}},"required":["role","content"]};

function validate63(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.role === undefined) && (missing0 = "role")) || ((data.content === undefined) && (missing0 = "content"))){
validate63.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "role") || (key0 === "content")) || (key0 === "reasoning_content")) || (key0 === "tool_call_id")) || (key0 === "tool_calls"))){
validate63.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.role !== undefined){
let data0 = data.role;
const _errs2 = errors;
if(!((((data0 === "system") || (data0 === "user")) || (data0 === "assistant")) || (data0 === "tool"))){
validate63.errors = [{instancePath:instancePath+"/role",schemaPath:"#/properties/role/enum",keyword:"enum",params:{allowedValues: schema72.properties.role.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.content !== undefined){
let data1 = data.content;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data1 === "string"){
if(func2(data1) > 131072){
validate63.errors = [{instancePath:instancePath+"/content",schemaPath:"#/properties/content/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"}];
return false;
}
}
else {
validate63.errors = [{instancePath:instancePath+"/content",schemaPath:"#/properties/content/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.reasoning_content !== undefined){
let data2 = data.reasoning_content;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data2 === "string"){
if(func2(data2) > 131072){
validate63.errors = [{instancePath:instancePath+"/reasoning_content",schemaPath:"#/properties/reasoning_content/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"}];
return false;
}
}
else {
validate63.errors = [{instancePath:instancePath+"/reasoning_content",schemaPath:"#/properties/reasoning_content/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.tool_call_id !== undefined){
let data3 = data.tool_call_id;
const _errs7 = errors;
if(errors === _errs7){
if(typeof data3 === "string"){
if(!pattern1.test(data3)){
validate63.errors = [{instancePath:instancePath+"/tool_call_id",schemaPath:"#/properties/tool_call_id/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate63.errors = [{instancePath:instancePath+"/tool_call_id",schemaPath:"#/properties/tool_call_id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.tool_calls !== undefined){
let data4 = data.tool_calls;
const _errs9 = errors;
if(errors === _errs9){
if(Array.isArray(data4)){
if(data4.length > 8){
validate63.errors = [{instancePath:instancePath+"/tool_calls",schemaPath:"#/properties/tool_calls/maxItems",keyword:"maxItems",params:{limit: 8},message:"must NOT have more than 8 items"}];
return false;
}
else {
var valid1 = true;
const len0 = data4.length;
for(let i0=0; i0<len0; i0++){
let data5 = data4[i0];
const _errs11 = errors;
const _errs12 = errors;
if(errors === _errs12){
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
let missing1;
if((((data5.id === undefined) && (missing1 = "id")) || ((data5.type === undefined) && (missing1 = "type"))) || ((data5.function === undefined) && (missing1 = "function"))){
validate63.errors = [{instancePath:instancePath+"/tool_calls/" + i0,schemaPath:"#/$defs/CodingToolCall/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs14 = errors;
for(const key1 in data5){
if(!(((key1 === "id") || (key1 === "type")) || (key1 === "function"))){
validate63.errors = [{instancePath:instancePath+"/tool_calls/" + i0,schemaPath:"#/$defs/CodingToolCall/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs14 === errors){
if(data5.id !== undefined){
let data6 = data5.id;
const _errs15 = errors;
if(errors === _errs15){
if(typeof data6 === "string"){
if(!pattern1.test(data6)){
validate63.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/id",schemaPath:"#/$defs/CodingToolCall/properties/id/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate63.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/id",schemaPath:"#/$defs/CodingToolCall/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid3 = _errs15 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data5.type !== undefined){
const _errs17 = errors;
if("function" !== data5.type){
validate63.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/type",schemaPath:"#/$defs/CodingToolCall/properties/type/const",keyword:"const",params:{allowedValue: "function"},message:"must be equal to constant"}];
return false;
}
var valid3 = _errs17 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data5.function !== undefined){
let data8 = data5.function;
const _errs18 = errors;
if(errors === _errs18){
if(data8 && typeof data8 == "object" && !Array.isArray(data8)){
let missing2;
if(((data8.name === undefined) && (missing2 = "name")) || ((data8.arguments === undefined) && (missing2 = "arguments"))){
validate63.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/function",schemaPath:"#/$defs/CodingToolCall/properties/function/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];
return false;
}
else {
const _errs20 = errors;
for(const key2 in data8){
if(!((key2 === "name") || (key2 === "arguments"))){
validate63.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/function",schemaPath:"#/$defs/CodingToolCall/properties/function/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs20 === errors){
if(data8.name !== undefined){
let data9 = data8.name;
const _errs21 = errors;
if(errors === _errs21){
if(typeof data9 === "string"){
if(!pattern133.test(data9)){
validate63.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/function/name",schemaPath:"#/$defs/CodingToolCall/properties/function/properties/name/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z_][A-Za-z0-9_-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z_][A-Za-z0-9_-]{0,63}$"+"\""}];
return false;
}
}
else {
validate63.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/function/name",schemaPath:"#/$defs/CodingToolCall/properties/function/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid4 = _errs21 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data8.arguments !== undefined){
let data10 = data8.arguments;
const _errs23 = errors;
if(errors === _errs23){
if(typeof data10 === "string"){
if(func2(data10) > 65536){
validate63.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/function/arguments",schemaPath:"#/$defs/CodingToolCall/properties/function/properties/arguments/maxLength",keyword:"maxLength",params:{limit: 65536},message:"must NOT have more than 65536 characters"}];
return false;
}
}
else {
validate63.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/function/arguments",schemaPath:"#/$defs/CodingToolCall/properties/function/properties/arguments/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid4 = _errs23 === errors;
}
else {
var valid4 = true;
}
}
}
}
}
else {
validate63.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/function",schemaPath:"#/$defs/CodingToolCall/properties/function/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid3 = _errs18 === errors;
}
else {
var valid3 = true;
}
}
}
}
}
}
else {
validate63.errors = [{instancePath:instancePath+"/tool_calls/" + i0,schemaPath:"#/$defs/CodingToolCall/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid1 = _errs11 === errors;
if(!valid1){
break;
}
}
}
}
else {
validate63.errors = [{instancePath:instancePath+"/tool_calls",schemaPath:"#/properties/tool_calls/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate63.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate63.errors = vErrors;
return errors === 0;
}

export const CodingInferenceRequest = validate64;
const schema74 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"inference"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"requestId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"sequence":{"type":"integer","minimum":1,"maximum":2147483647},"deadlineUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991},"messages":{"type":"array","minItems":1,"maxItems":128,"items":{"$ref":"#/$defs/CodingMessage"}},"maxOutputTokens":{"type":"integer","minimum":1,"maximum":8192},"upstreamBudget":{"$ref":"#/$defs/UpstreamBudget"},"tools":{"type":"array","maxItems":64,"items":{"$ref":"#/$defs/CodingToolDefinition"}},"protocol":{"const":"coding_v1"},"thinking":{"type":"boolean"},"purpose":{"enum":["main","compaction","btw","subagent"]},"capabilities":{"type":"array","uniqueItems":true,"maxItems":5,"items":{"enum":["coding_v1","streaming_v1","tools_v1","thinking_v1","images_v1"]}}},"required":["type","sessionId","requestId","bindingRevision","sequence","deadlineUnixMs","messages","maxOutputTokens","upstreamBudget","tools","protocol","thinking","purpose","capabilities"]};

function validate64(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((((((((((data.type === undefined) && (missing0 = "type")) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.bindingRevision === undefined) && (missing0 = "bindingRevision"))) || ((data.sequence === undefined) && (missing0 = "sequence"))) || ((data.deadlineUnixMs === undefined) && (missing0 = "deadlineUnixMs"))) || ((data.messages === undefined) && (missing0 = "messages"))) || ((data.maxOutputTokens === undefined) && (missing0 = "maxOutputTokens"))) || ((data.upstreamBudget === undefined) && (missing0 = "upstreamBudget"))) || ((data.tools === undefined) && (missing0 = "tools"))) || ((data.protocol === undefined) && (missing0 = "protocol"))) || ((data.thinking === undefined) && (missing0 = "thinking"))) || ((data.purpose === undefined) && (missing0 = "purpose"))) || ((data.capabilities === undefined) && (missing0 = "capabilities"))){
validate64.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema74.properties, key0))){
validate64.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("inference" !== data.type){
validate64.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "inference"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sessionId !== undefined){
let data1 = data.sessionId;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data1 === "string"){
if(!pattern1.test(data1)){
validate64.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate64.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestId !== undefined){
let data2 = data.requestId;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data2 === "string"){
if(!pattern1.test(data2)){
validate64.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate64.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.bindingRevision !== undefined){
let data3 = data.bindingRevision;
const _errs7 = errors;
if(errors === _errs7){
if(typeof data3 === "string"){
if(!pattern1.test(data3)){
validate64.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate64.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sequence !== undefined){
let data4 = data.sequence;
const _errs9 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
validate64.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 2147483647 || isNaN(data4)){
validate64.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data4 < 1 || isNaN(data4)){
validate64.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.deadlineUnixMs !== undefined){
let data5 = data.deadlineUnixMs;
const _errs11 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
validate64.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs11){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 9007199254740991 || isNaN(data5)){
validate64.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data5 < 1 || isNaN(data5)){
validate64.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.messages !== undefined){
let data6 = data.messages;
const _errs13 = errors;
if(errors === _errs13){
if(Array.isArray(data6)){
if(data6.length > 128){
validate64.errors = [{instancePath:instancePath+"/messages",schemaPath:"#/properties/messages/maxItems",keyword:"maxItems",params:{limit: 128},message:"must NOT have more than 128 items"}];
return false;
}
else {
if(data6.length < 1){
validate64.errors = [{instancePath:instancePath+"/messages",schemaPath:"#/properties/messages/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid1 = true;
const len0 = data6.length;
for(let i0=0; i0<len0; i0++){
const _errs15 = errors;
if(!(validate63(data6[i0], {instancePath:instancePath+"/messages/" + i0,parentData:data6,parentDataProperty:i0,rootData}))){
vErrors = vErrors === null ? validate63.errors : vErrors.concat(validate63.errors);
errors = vErrors.length;
}
var valid1 = _errs15 === errors;
if(!valid1){
break;
}
}
}
}
}
else {
validate64.errors = [{instancePath:instancePath+"/messages",schemaPath:"#/properties/messages/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.maxOutputTokens !== undefined){
let data8 = data.maxOutputTokens;
const _errs16 = errors;
if(!(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8)))){
validate64.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs16){
if((typeof data8 == "number") && (isFinite(data8))){
if(data8 > 8192 || isNaN(data8)){
validate64.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 8192},message:"must be <= 8192"}];
return false;
}
else {
if(data8 < 1 || isNaN(data8)){
validate64.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.upstreamBudget !== undefined){
let data9 = data.upstreamBudget;
const _errs18 = errors;
const _errs19 = errors;
if(errors === _errs19){
if(data9 && typeof data9 == "object" && !Array.isArray(data9)){
let missing1;
if((((((data9.reservedMicrousd === undefined) && (missing1 = "reservedMicrousd")) || ((data9.inputBound === undefined) && (missing1 = "inputBound"))) || ((data9.tariffVersion === undefined) && (missing1 = "tariffVersion"))) || ((data9.inputMicrousdPerMillion === undefined) && (missing1 = "inputMicrousdPerMillion"))) || ((data9.outputMicrousdPerMillion === undefined) && (missing1 = "outputMicrousdPerMillion"))){
validate64.errors = [{instancePath:instancePath+"/upstreamBudget",schemaPath:"#/$defs/UpstreamBudget/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs21 = errors;
for(const key1 in data9){
if(!(((((key1 === "reservedMicrousd") || (key1 === "inputBound")) || (key1 === "tariffVersion")) || (key1 === "inputMicrousdPerMillion")) || (key1 === "outputMicrousdPerMillion"))){
validate64.errors = [{instancePath:instancePath+"/upstreamBudget",schemaPath:"#/$defs/UpstreamBudget/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs21 === errors){
if(data9.reservedMicrousd !== undefined){
let data10 = data9.reservedMicrousd;
const _errs22 = errors;
if(errors === _errs22){
if(typeof data10 === "string"){
if(!pattern0.test(data10)){
validate64.errors = [{instancePath:instancePath+"/upstreamBudget/reservedMicrousd",schemaPath:"#/$defs/UpstreamBudget/properties/reservedMicrousd/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate64.errors = [{instancePath:instancePath+"/upstreamBudget/reservedMicrousd",schemaPath:"#/$defs/UpstreamBudget/properties/reservedMicrousd/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid3 = _errs22 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data9.inputBound !== undefined){
let data11 = data9.inputBound;
const _errs24 = errors;
if(!(((typeof data11 == "number") && (!(data11 % 1) && !isNaN(data11))) && (isFinite(data11)))){
validate64.errors = [{instancePath:instancePath+"/upstreamBudget/inputBound",schemaPath:"#/$defs/UpstreamBudget/properties/inputBound/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs24){
if((typeof data11 == "number") && (isFinite(data11))){
if(data11 > 262144 || isNaN(data11)){
validate64.errors = [{instancePath:instancePath+"/upstreamBudget/inputBound",schemaPath:"#/$defs/UpstreamBudget/properties/inputBound/maximum",keyword:"maximum",params:{comparison: "<=", limit: 262144},message:"must be <= 262144"}];
return false;
}
else {
if(data11 < 1 || isNaN(data11)){
validate64.errors = [{instancePath:instancePath+"/upstreamBudget/inputBound",schemaPath:"#/$defs/UpstreamBudget/properties/inputBound/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid3 = _errs24 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data9.tariffVersion !== undefined){
let data12 = data9.tariffVersion;
const _errs26 = errors;
if(errors === _errs26){
if(typeof data12 === "string"){
if(func2(data12) > 120){
validate64.errors = [{instancePath:instancePath+"/upstreamBudget/tariffVersion",schemaPath:"#/$defs/UpstreamBudget/properties/tariffVersion/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
}
else {
validate64.errors = [{instancePath:instancePath+"/upstreamBudget/tariffVersion",schemaPath:"#/$defs/UpstreamBudget/properties/tariffVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid3 = _errs26 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data9.inputMicrousdPerMillion !== undefined){
let data13 = data9.inputMicrousdPerMillion;
const _errs28 = errors;
if(errors === _errs28){
if(typeof data13 === "string"){
if(!pattern0.test(data13)){
validate64.errors = [{instancePath:instancePath+"/upstreamBudget/inputMicrousdPerMillion",schemaPath:"#/$defs/UpstreamBudget/properties/inputMicrousdPerMillion/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate64.errors = [{instancePath:instancePath+"/upstreamBudget/inputMicrousdPerMillion",schemaPath:"#/$defs/UpstreamBudget/properties/inputMicrousdPerMillion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid3 = _errs28 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data9.outputMicrousdPerMillion !== undefined){
let data14 = data9.outputMicrousdPerMillion;
const _errs30 = errors;
if(errors === _errs30){
if(typeof data14 === "string"){
if(!pattern0.test(data14)){
validate64.errors = [{instancePath:instancePath+"/upstreamBudget/outputMicrousdPerMillion",schemaPath:"#/$defs/UpstreamBudget/properties/outputMicrousdPerMillion/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate64.errors = [{instancePath:instancePath+"/upstreamBudget/outputMicrousdPerMillion",schemaPath:"#/$defs/UpstreamBudget/properties/outputMicrousdPerMillion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid3 = _errs30 === errors;
}
else {
var valid3 = true;
}
}
}
}
}
}
}
}
else {
validate64.errors = [{instancePath:instancePath+"/upstreamBudget",schemaPath:"#/$defs/UpstreamBudget/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs18 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.tools !== undefined){
let data15 = data.tools;
const _errs32 = errors;
if(errors === _errs32){
if(Array.isArray(data15)){
if(data15.length > 64){
validate64.errors = [{instancePath:instancePath+"/tools",schemaPath:"#/properties/tools/maxItems",keyword:"maxItems",params:{limit: 64},message:"must NOT have more than 64 items"}];
return false;
}
else {
var valid4 = true;
const len1 = data15.length;
for(let i1=0; i1<len1; i1++){
let data16 = data15[i1];
const _errs34 = errors;
const _errs35 = errors;
if(errors === _errs35){
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
let missing2;
if(((data16.type === undefined) && (missing2 = "type")) || ((data16.function === undefined) && (missing2 = "function"))){
validate64.errors = [{instancePath:instancePath+"/tools/" + i1,schemaPath:"#/$defs/CodingToolDefinition/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];
return false;
}
else {
const _errs37 = errors;
for(const key2 in data16){
if(!((key2 === "type") || (key2 === "function"))){
validate64.errors = [{instancePath:instancePath+"/tools/" + i1,schemaPath:"#/$defs/CodingToolDefinition/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs37 === errors){
if(data16.type !== undefined){
const _errs38 = errors;
if("function" !== data16.type){
validate64.errors = [{instancePath:instancePath+"/tools/" + i1+"/type",schemaPath:"#/$defs/CodingToolDefinition/properties/type/const",keyword:"const",params:{allowedValue: "function"},message:"must be equal to constant"}];
return false;
}
var valid6 = _errs38 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data16.function !== undefined){
let data18 = data16.function;
const _errs39 = errors;
if(errors === _errs39){
if(data18 && typeof data18 == "object" && !Array.isArray(data18)){
let missing3;
if((((data18.name === undefined) && (missing3 = "name")) || ((data18.description === undefined) && (missing3 = "description"))) || ((data18.parameters === undefined) && (missing3 = "parameters"))){
validate64.errors = [{instancePath:instancePath+"/tools/" + i1+"/function",schemaPath:"#/$defs/CodingToolDefinition/properties/function/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"}];
return false;
}
else {
const _errs41 = errors;
for(const key3 in data18){
if(!(((key3 === "name") || (key3 === "description")) || (key3 === "parameters"))){
validate64.errors = [{instancePath:instancePath+"/tools/" + i1+"/function",schemaPath:"#/$defs/CodingToolDefinition/properties/function/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs41 === errors){
if(data18.name !== undefined){
let data19 = data18.name;
const _errs42 = errors;
if(errors === _errs42){
if(typeof data19 === "string"){
if(!pattern133.test(data19)){
validate64.errors = [{instancePath:instancePath+"/tools/" + i1+"/function/name",schemaPath:"#/$defs/CodingToolDefinition/properties/function/properties/name/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z_][A-Za-z0-9_-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z_][A-Za-z0-9_-]{0,63}$"+"\""}];
return false;
}
}
else {
validate64.errors = [{instancePath:instancePath+"/tools/" + i1+"/function/name",schemaPath:"#/$defs/CodingToolDefinition/properties/function/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid7 = _errs42 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data18.description !== undefined){
let data20 = data18.description;
const _errs44 = errors;
if(errors === _errs44){
if(typeof data20 === "string"){
if(func2(data20) > 8192){
validate64.errors = [{instancePath:instancePath+"/tools/" + i1+"/function/description",schemaPath:"#/$defs/CodingToolDefinition/properties/function/properties/description/maxLength",keyword:"maxLength",params:{limit: 8192},message:"must NOT have more than 8192 characters"}];
return false;
}
}
else {
validate64.errors = [{instancePath:instancePath+"/tools/" + i1+"/function/description",schemaPath:"#/$defs/CodingToolDefinition/properties/function/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid7 = _errs44 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data18.parameters !== undefined){
let data21 = data18.parameters;
const _errs46 = errors;
if(!(data21 && typeof data21 == "object" && !Array.isArray(data21))){
validate64.errors = [{instancePath:instancePath+"/tools/" + i1+"/function/parameters",schemaPath:"#/$defs/CodingToolDefinition/properties/function/properties/parameters/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
var valid7 = _errs46 === errors;
}
else {
var valid7 = true;
}
}
}
}
}
}
else {
validate64.errors = [{instancePath:instancePath+"/tools/" + i1+"/function",schemaPath:"#/$defs/CodingToolDefinition/properties/function/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid6 = _errs39 === errors;
}
else {
var valid6 = true;
}
}
}
}
}
else {
validate64.errors = [{instancePath:instancePath+"/tools/" + i1,schemaPath:"#/$defs/CodingToolDefinition/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid4 = _errs34 === errors;
if(!valid4){
break;
}
}
}
}
else {
validate64.errors = [{instancePath:instancePath+"/tools",schemaPath:"#/properties/tools/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs32 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.protocol !== undefined){
const _errs48 = errors;
if("coding_v1" !== data.protocol){
validate64.errors = [{instancePath:instancePath+"/protocol",schemaPath:"#/properties/protocol/const",keyword:"const",params:{allowedValue: "coding_v1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs48 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.thinking !== undefined){
const _errs49 = errors;
if(typeof data.thinking !== "boolean"){
validate64.errors = [{instancePath:instancePath+"/thinking",schemaPath:"#/properties/thinking/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs49 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.purpose !== undefined){
let data24 = data.purpose;
const _errs51 = errors;
if(!((((data24 === "main") || (data24 === "compaction")) || (data24 === "btw")) || (data24 === "subagent"))){
validate64.errors = [{instancePath:instancePath+"/purpose",schemaPath:"#/properties/purpose/enum",keyword:"enum",params:{allowedValues: schema74.properties.purpose.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs51 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.capabilities !== undefined){
let data25 = data.capabilities;
const _errs52 = errors;
if(errors === _errs52){
if(Array.isArray(data25)){
if(data25.length > 5){
validate64.errors = [{instancePath:instancePath+"/capabilities",schemaPath:"#/properties/capabilities/maxItems",keyword:"maxItems",params:{limit: 5},message:"must NOT have more than 5 items"}];
return false;
}
else {
var valid8 = true;
const len2 = data25.length;
for(let i2=0; i2<len2; i2++){
let data26 = data25[i2];
const _errs54 = errors;
if(!(((((data26 === "coding_v1") || (data26 === "streaming_v1")) || (data26 === "tools_v1")) || (data26 === "thinking_v1")) || (data26 === "images_v1"))){
validate64.errors = [{instancePath:instancePath+"/capabilities/" + i2,schemaPath:"#/properties/capabilities/items/enum",keyword:"enum",params:{allowedValues: schema74.properties.capabilities.items.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid8 = _errs54 === errors;
if(!valid8){
break;
}
}
if(valid8){
let i3 = data25.length;
let j0;
if(i3 > 1){
outer0:
for(;i3--;){
for(j0 = i3; j0--;){
if(func0(data25[i3], data25[j0])){
validate64.errors = [{instancePath:instancePath+"/capabilities",schemaPath:"#/properties/capabilities/uniqueItems",keyword:"uniqueItems",params:{i: i3, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i3+" are identical)"}];
return false;
break outer0;
}
}
}
}
}
}
}
else {
validate64.errors = [{instancePath:instancePath+"/capabilities",schemaPath:"#/properties/capabilities/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs52 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate64.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate64.errors = vErrors;
return errors === 0;
}

export const MarketplaceListingSummary = validate66;
const schema77 = {"type":"object","additionalProperties":false,"properties":{"at":{"type":"integer","minimum":0,"maximum":9007199254740991},"totals":{"type":"object","additionalProperties":false,"properties":{"published":{"type":"integer","minimum":0,"maximum":9007199254740991},"hot":{"type":"integer","minimum":0,"maximum":9007199254740991},"cold":{"type":"integer","minimum":0,"maximum":9007199254740991},"immediateHot":{"type":"integer","minimum":0,"maximum":9007199254740991},"coldControlReady":{"type":"integer","minimum":0,"maximum":9007199254740991},"activeServing":{"type":"integer","minimum":0,"maximum":9007199254740991},"capacityHeld":{"type":"integer","minimum":0,"maximum":9007199254740991},"occupied":{"type":"integer","minimum":0,"maximum":9007199254740991},"qualified":{"type":"integer","minimum":0,"maximum":9007199254740991}},"required":["published","hot","cold","immediateHot","coldControlReady","activeServing","capacityHeld","occupied","qualified"]},"listings":{"type":"array","maxItems":12,"items":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"name":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"model":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"availability":{"enum":["hot","cold"]},"immediateHot":{"type":"boolean"},"coldControlReady":{"type":"boolean"},"activeServing":{"type":"boolean"},"capacityHeld":{"type":"boolean"},"occupied":{"type":"boolean"},"qualified":{"type":"boolean"}},"required":["id","name","model","availability","immediateHot","coldControlReady","activeServing","capacityHeld","occupied","qualified"]}}},"required":["at","totals","listings"]};

function validate66(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.at === undefined) && (missing0 = "at")) || ((data.totals === undefined) && (missing0 = "totals"))) || ((data.listings === undefined) && (missing0 = "listings"))){
validate66.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "at") || (key0 === "totals")) || (key0 === "listings"))){
validate66.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.at !== undefined){
let data0 = data.at;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate66.errors = [{instancePath:instancePath+"/at",schemaPath:"#/properties/at/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs2){
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 > 9007199254740991 || isNaN(data0)){
validate66.errors = [{instancePath:instancePath+"/at",schemaPath:"#/properties/at/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data0 < 0 || isNaN(data0)){
validate66.errors = [{instancePath:instancePath+"/at",schemaPath:"#/properties/at/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.totals !== undefined){
let data1 = data.totals;
const _errs4 = errors;
if(errors === _errs4){
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
let missing1;
if((((((((((data1.published === undefined) && (missing1 = "published")) || ((data1.hot === undefined) && (missing1 = "hot"))) || ((data1.cold === undefined) && (missing1 = "cold"))) || ((data1.immediateHot === undefined) && (missing1 = "immediateHot"))) || ((data1.coldControlReady === undefined) && (missing1 = "coldControlReady"))) || ((data1.activeServing === undefined) && (missing1 = "activeServing"))) || ((data1.capacityHeld === undefined) && (missing1 = "capacityHeld"))) || ((data1.occupied === undefined) && (missing1 = "occupied"))) || ((data1.qualified === undefined) && (missing1 = "qualified"))){
validate66.errors = [{instancePath:instancePath+"/totals",schemaPath:"#/properties/totals/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs6 = errors;
for(const key1 in data1){
if(!(func7.call(schema77.properties.totals.properties, key1))){
validate66.errors = [{instancePath:instancePath+"/totals",schemaPath:"#/properties/totals/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs6 === errors){
if(data1.published !== undefined){
let data2 = data1.published;
const _errs7 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate66.errors = [{instancePath:instancePath+"/totals/published",schemaPath:"#/properties/totals/properties/published/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs7){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate66.errors = [{instancePath:instancePath+"/totals/published",schemaPath:"#/properties/totals/properties/published/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate66.errors = [{instancePath:instancePath+"/totals/published",schemaPath:"#/properties/totals/properties/published/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid1 = _errs7 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data1.hot !== undefined){
let data3 = data1.hot;
const _errs9 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate66.errors = [{instancePath:instancePath+"/totals/hot",schemaPath:"#/properties/totals/properties/hot/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate66.errors = [{instancePath:instancePath+"/totals/hot",schemaPath:"#/properties/totals/properties/hot/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate66.errors = [{instancePath:instancePath+"/totals/hot",schemaPath:"#/properties/totals/properties/hot/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid1 = _errs9 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data1.cold !== undefined){
let data4 = data1.cold;
const _errs11 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
validate66.errors = [{instancePath:instancePath+"/totals/cold",schemaPath:"#/properties/totals/properties/cold/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs11){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 9007199254740991 || isNaN(data4)){
validate66.errors = [{instancePath:instancePath+"/totals/cold",schemaPath:"#/properties/totals/properties/cold/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data4 < 0 || isNaN(data4)){
validate66.errors = [{instancePath:instancePath+"/totals/cold",schemaPath:"#/properties/totals/properties/cold/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid1 = _errs11 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data1.immediateHot !== undefined){
let data5 = data1.immediateHot;
const _errs13 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
validate66.errors = [{instancePath:instancePath+"/totals/immediateHot",schemaPath:"#/properties/totals/properties/immediateHot/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs13){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 9007199254740991 || isNaN(data5)){
validate66.errors = [{instancePath:instancePath+"/totals/immediateHot",schemaPath:"#/properties/totals/properties/immediateHot/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data5 < 0 || isNaN(data5)){
validate66.errors = [{instancePath:instancePath+"/totals/immediateHot",schemaPath:"#/properties/totals/properties/immediateHot/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid1 = _errs13 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data1.coldControlReady !== undefined){
let data6 = data1.coldControlReady;
const _errs15 = errors;
if(!(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6)))){
validate66.errors = [{instancePath:instancePath+"/totals/coldControlReady",schemaPath:"#/properties/totals/properties/coldControlReady/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs15){
if((typeof data6 == "number") && (isFinite(data6))){
if(data6 > 9007199254740991 || isNaN(data6)){
validate66.errors = [{instancePath:instancePath+"/totals/coldControlReady",schemaPath:"#/properties/totals/properties/coldControlReady/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data6 < 0 || isNaN(data6)){
validate66.errors = [{instancePath:instancePath+"/totals/coldControlReady",schemaPath:"#/properties/totals/properties/coldControlReady/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid1 = _errs15 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data1.activeServing !== undefined){
let data7 = data1.activeServing;
const _errs17 = errors;
if(!(((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7)))){
validate66.errors = [{instancePath:instancePath+"/totals/activeServing",schemaPath:"#/properties/totals/properties/activeServing/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs17){
if((typeof data7 == "number") && (isFinite(data7))){
if(data7 > 9007199254740991 || isNaN(data7)){
validate66.errors = [{instancePath:instancePath+"/totals/activeServing",schemaPath:"#/properties/totals/properties/activeServing/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data7 < 0 || isNaN(data7)){
validate66.errors = [{instancePath:instancePath+"/totals/activeServing",schemaPath:"#/properties/totals/properties/activeServing/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid1 = _errs17 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data1.capacityHeld !== undefined){
let data8 = data1.capacityHeld;
const _errs19 = errors;
if(!(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8)))){
validate66.errors = [{instancePath:instancePath+"/totals/capacityHeld",schemaPath:"#/properties/totals/properties/capacityHeld/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs19){
if((typeof data8 == "number") && (isFinite(data8))){
if(data8 > 9007199254740991 || isNaN(data8)){
validate66.errors = [{instancePath:instancePath+"/totals/capacityHeld",schemaPath:"#/properties/totals/properties/capacityHeld/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data8 < 0 || isNaN(data8)){
validate66.errors = [{instancePath:instancePath+"/totals/capacityHeld",schemaPath:"#/properties/totals/properties/capacityHeld/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid1 = _errs19 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data1.occupied !== undefined){
let data9 = data1.occupied;
const _errs21 = errors;
if(!(((typeof data9 == "number") && (!(data9 % 1) && !isNaN(data9))) && (isFinite(data9)))){
validate66.errors = [{instancePath:instancePath+"/totals/occupied",schemaPath:"#/properties/totals/properties/occupied/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs21){
if((typeof data9 == "number") && (isFinite(data9))){
if(data9 > 9007199254740991 || isNaN(data9)){
validate66.errors = [{instancePath:instancePath+"/totals/occupied",schemaPath:"#/properties/totals/properties/occupied/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data9 < 0 || isNaN(data9)){
validate66.errors = [{instancePath:instancePath+"/totals/occupied",schemaPath:"#/properties/totals/properties/occupied/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid1 = _errs21 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data1.qualified !== undefined){
let data10 = data1.qualified;
const _errs23 = errors;
if(!(((typeof data10 == "number") && (!(data10 % 1) && !isNaN(data10))) && (isFinite(data10)))){
validate66.errors = [{instancePath:instancePath+"/totals/qualified",schemaPath:"#/properties/totals/properties/qualified/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs23){
if((typeof data10 == "number") && (isFinite(data10))){
if(data10 > 9007199254740991 || isNaN(data10)){
validate66.errors = [{instancePath:instancePath+"/totals/qualified",schemaPath:"#/properties/totals/properties/qualified/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data10 < 0 || isNaN(data10)){
validate66.errors = [{instancePath:instancePath+"/totals/qualified",schemaPath:"#/properties/totals/properties/qualified/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid1 = _errs23 === errors;
}
else {
var valid1 = true;
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate66.errors = [{instancePath:instancePath+"/totals",schemaPath:"#/properties/totals/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.listings !== undefined){
let data11 = data.listings;
const _errs25 = errors;
if(errors === _errs25){
if(Array.isArray(data11)){
if(data11.length > 12){
validate66.errors = [{instancePath:instancePath+"/listings",schemaPath:"#/properties/listings/maxItems",keyword:"maxItems",params:{limit: 12},message:"must NOT have more than 12 items"}];
return false;
}
else {
var valid2 = true;
const len0 = data11.length;
for(let i0=0; i0<len0; i0++){
let data12 = data11[i0];
const _errs27 = errors;
if(errors === _errs27){
if(data12 && typeof data12 == "object" && !Array.isArray(data12)){
let missing2;
if(((((((((((data12.id === undefined) && (missing2 = "id")) || ((data12.name === undefined) && (missing2 = "name"))) || ((data12.model === undefined) && (missing2 = "model"))) || ((data12.availability === undefined) && (missing2 = "availability"))) || ((data12.immediateHot === undefined) && (missing2 = "immediateHot"))) || ((data12.coldControlReady === undefined) && (missing2 = "coldControlReady"))) || ((data12.activeServing === undefined) && (missing2 = "activeServing"))) || ((data12.capacityHeld === undefined) && (missing2 = "capacityHeld"))) || ((data12.occupied === undefined) && (missing2 = "occupied"))) || ((data12.qualified === undefined) && (missing2 = "qualified"))){
validate66.errors = [{instancePath:instancePath+"/listings/" + i0,schemaPath:"#/properties/listings/items/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];
return false;
}
else {
const _errs29 = errors;
for(const key2 in data12){
if(!(func7.call(schema77.properties.listings.items.properties, key2))){
validate66.errors = [{instancePath:instancePath+"/listings/" + i0,schemaPath:"#/properties/listings/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs29 === errors){
if(data12.id !== undefined){
let data13 = data12.id;
const _errs30 = errors;
if(errors === _errs30){
if(typeof data13 === "string"){
if(!pattern67.test(data13)){
validate66.errors = [{instancePath:instancePath+"/listings/" + i0+"/id",schemaPath:"#/properties/listings/items/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate66.errors = [{instancePath:instancePath+"/listings/" + i0+"/id",schemaPath:"#/properties/listings/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid3 = _errs30 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data12.name !== undefined){
let data14 = data12.name;
const _errs32 = errors;
if(errors === _errs32){
if(typeof data14 === "string"){
if(func2(data14) > 120){
validate66.errors = [{instancePath:instancePath+"/listings/" + i0+"/name",schemaPath:"#/properties/listings/items/properties/name/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data14) < 1){
validate66.errors = [{instancePath:instancePath+"/listings/" + i0+"/name",schemaPath:"#/properties/listings/items/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data14)){
validate66.errors = [{instancePath:instancePath+"/listings/" + i0+"/name",schemaPath:"#/properties/listings/items/properties/name/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate66.errors = [{instancePath:instancePath+"/listings/" + i0+"/name",schemaPath:"#/properties/listings/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid3 = _errs32 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data12.model !== undefined){
let data15 = data12.model;
const _errs34 = errors;
if(errors === _errs34){
if(typeof data15 === "string"){
if(func2(data15) > 120){
validate66.errors = [{instancePath:instancePath+"/listings/" + i0+"/model",schemaPath:"#/properties/listings/items/properties/model/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data15) < 1){
validate66.errors = [{instancePath:instancePath+"/listings/" + i0+"/model",schemaPath:"#/properties/listings/items/properties/model/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data15)){
validate66.errors = [{instancePath:instancePath+"/listings/" + i0+"/model",schemaPath:"#/properties/listings/items/properties/model/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate66.errors = [{instancePath:instancePath+"/listings/" + i0+"/model",schemaPath:"#/properties/listings/items/properties/model/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid3 = _errs34 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data12.availability !== undefined){
let data16 = data12.availability;
const _errs36 = errors;
if(!((data16 === "hot") || (data16 === "cold"))){
validate66.errors = [{instancePath:instancePath+"/listings/" + i0+"/availability",schemaPath:"#/properties/listings/items/properties/availability/enum",keyword:"enum",params:{allowedValues: schema77.properties.listings.items.properties.availability.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid3 = _errs36 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data12.immediateHot !== undefined){
const _errs37 = errors;
if(typeof data12.immediateHot !== "boolean"){
validate66.errors = [{instancePath:instancePath+"/listings/" + i0+"/immediateHot",schemaPath:"#/properties/listings/items/properties/immediateHot/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid3 = _errs37 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data12.coldControlReady !== undefined){
const _errs39 = errors;
if(typeof data12.coldControlReady !== "boolean"){
validate66.errors = [{instancePath:instancePath+"/listings/" + i0+"/coldControlReady",schemaPath:"#/properties/listings/items/properties/coldControlReady/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid3 = _errs39 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data12.activeServing !== undefined){
const _errs41 = errors;
if(typeof data12.activeServing !== "boolean"){
validate66.errors = [{instancePath:instancePath+"/listings/" + i0+"/activeServing",schemaPath:"#/properties/listings/items/properties/activeServing/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid3 = _errs41 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data12.capacityHeld !== undefined){
const _errs43 = errors;
if(typeof data12.capacityHeld !== "boolean"){
validate66.errors = [{instancePath:instancePath+"/listings/" + i0+"/capacityHeld",schemaPath:"#/properties/listings/items/properties/capacityHeld/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid3 = _errs43 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data12.occupied !== undefined){
const _errs45 = errors;
if(typeof data12.occupied !== "boolean"){
validate66.errors = [{instancePath:instancePath+"/listings/" + i0+"/occupied",schemaPath:"#/properties/listings/items/properties/occupied/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid3 = _errs45 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data12.qualified !== undefined){
const _errs47 = errors;
if(typeof data12.qualified !== "boolean"){
validate66.errors = [{instancePath:instancePath+"/listings/" + i0+"/qualified",schemaPath:"#/properties/listings/items/properties/qualified/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid3 = _errs47 === errors;
}
else {
var valid3 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate66.errors = [{instancePath:instancePath+"/listings/" + i0,schemaPath:"#/properties/listings/items/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid2 = _errs27 === errors;
if(!valid2){
break;
}
}
}
}
else {
validate66.errors = [{instancePath:instancePath+"/listings",schemaPath:"#/properties/listings/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs25 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
else {
validate66.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate66.errors = vErrors;
return errors === 0;
}

export const MarketplaceProfile = validate67;
const schema78 = {"type":"object","additionalProperties":false,"properties":{"userId":{"type":"string","maxLength":120},"email":{"anyOf":[{"type":"string","maxLength":320},{"type":"null"}]},"roles":{"type":"array","items":{"enum":["buyer","provider","admin"]}},"account":{"type":"object"},"settlement":{"const":"test_credits"},"cashValue":{"const":false}},"required":["userId","email","roles","account","settlement","cashValue"]};

function validate67(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.userId === undefined) && (missing0 = "userId")) || ((data.email === undefined) && (missing0 = "email"))) || ((data.roles === undefined) && (missing0 = "roles"))) || ((data.account === undefined) && (missing0 = "account"))) || ((data.settlement === undefined) && (missing0 = "settlement"))) || ((data.cashValue === undefined) && (missing0 = "cashValue"))){
validate67.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "userId") || (key0 === "email")) || (key0 === "roles")) || (key0 === "account")) || (key0 === "settlement")) || (key0 === "cashValue"))){
validate67.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.userId !== undefined){
let data0 = data.userId;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(func2(data0) > 120){
validate67.errors = [{instancePath:instancePath+"/userId",schemaPath:"#/properties/userId/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
}
else {
validate67.errors = [{instancePath:instancePath+"/userId",schemaPath:"#/properties/userId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.email !== undefined){
let data1 = data.email;
const _errs4 = errors;
const _errs5 = errors;
let valid1 = false;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data1 === "string"){
if(func2(data1) > 320){
const err0 = {instancePath:instancePath+"/email",schemaPath:"#/properties/email/anyOf/0/maxLength",keyword:"maxLength",params:{limit: 320},message:"must NOT have more than 320 characters"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
else {
const err1 = {instancePath:instancePath+"/email",schemaPath:"#/properties/email/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var _valid0 = _errs6 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs8 = errors;
if(data1 !== null){
const err2 = {instancePath:instancePath+"/email",schemaPath:"#/properties/email/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var _valid0 = _errs8 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err3 = {instancePath:instancePath+"/email",schemaPath:"#/properties/email/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
validate67.errors = vErrors;
return false;
}
else {
errors = _errs5;
if(vErrors !== null){
if(_errs5){
vErrors.length = _errs5;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.roles !== undefined){
let data2 = data.roles;
const _errs10 = errors;
if(errors === _errs10){
if(Array.isArray(data2)){
var valid2 = true;
const len0 = data2.length;
for(let i0=0; i0<len0; i0++){
let data3 = data2[i0];
const _errs12 = errors;
if(!(((data3 === "buyer") || (data3 === "provider")) || (data3 === "admin"))){
validate67.errors = [{instancePath:instancePath+"/roles/" + i0,schemaPath:"#/properties/roles/items/enum",keyword:"enum",params:{allowedValues: schema78.properties.roles.items.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid2 = _errs12 === errors;
if(!valid2){
break;
}
}
}
else {
validate67.errors = [{instancePath:instancePath+"/roles",schemaPath:"#/properties/roles/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.account !== undefined){
let data4 = data.account;
const _errs13 = errors;
if(!(data4 && typeof data4 == "object" && !Array.isArray(data4))){
validate67.errors = [{instancePath:instancePath+"/account",schemaPath:"#/properties/account/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.settlement !== undefined){
const _errs15 = errors;
if("test_credits" !== data.settlement){
validate67.errors = [{instancePath:instancePath+"/settlement",schemaPath:"#/properties/settlement/const",keyword:"const",params:{allowedValue: "test_credits"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs15 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.cashValue !== undefined){
const _errs16 = errors;
if(false !== data.cashValue){
validate67.errors = [{instancePath:instancePath+"/cashValue",schemaPath:"#/properties/cashValue/const",keyword:"const",params:{allowedValue: false},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate67.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate67.errors = vErrors;
return errors === 0;
}
