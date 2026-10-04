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
const schema24 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"inference"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"requestId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"sequence":{"type":"integer","minimum":1,"maximum":2147483647},"deadlineUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991},"messages":{"type":"array","minItems":1,"maxItems":128,"items":{"$ref":"#/$defs/Message"}},"maxOutputTokens":{"type":"integer","minimum":1,"maximum":8192},"upstreamBudget":{"$ref":"#/$defs/UpstreamBudget"},"tools":{"type":"array","maxItems":5,"items":{"$ref":"#/$defs/ToolDefinition"}},"connector":{"$ref":"#/$defs/ConnectorDescriptor"}},"required":["type","sessionId","requestId","bindingRevision","sequence","deadlineUnixMs","messages","maxOutputTokens","upstreamBudget","tools"]};
const schema27 = {"type":"object","additionalProperties":false,"properties":{"id":{"enum":["openai-compatible-v1","deepseek-v1","mimo-v1"]},"version":{"const":1},"authentication":{"enum":["bearer","api_key","x_api_key","none"]},"outputTokenParameter":{"enum":["max_tokens","max_completion_tokens"]},"streamingUsage":{"enum":["include_usage","native"]},"thinking":{"enum":["none","type","reasoning_effort"]},"reasoningHistory":{"type":"boolean"}},"required":["id","version","authentication","outputTokenParameter","streamingUsage","thinking","reasoningHistory"],"allOf":[{"if":{"properties":{"id":{"const":"deepseek-v1"}},"required":["id"]},"then":{"properties":{"id":{"const":"deepseek-v1"},"version":{"const":1},"authentication":{"const":"bearer"},"outputTokenParameter":{"const":"max_tokens"},"streamingUsage":{"const":"include_usage"},"thinking":{"const":"type"},"reasoningHistory":{"const":true}}}},{"if":{"properties":{"id":{"const":"mimo-v1"}},"required":["id"]},"then":{"properties":{"id":{"const":"mimo-v1"},"version":{"const":1},"authentication":{"const":"api_key"},"outputTokenParameter":{"const":"max_completion_tokens"},"streamingUsage":{"const":"include_usage"},"thinking":{"const":"type"},"reasoningHistory":{"const":true}}}}]};
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
if(valid0){
if(data.connector !== undefined){
let data22 = data.connector;
const _errs47 = errors;
const _errs48 = errors;
const _errs50 = errors;
const _errs51 = errors;
let valid10 = true;
const _errs52 = errors;
if(data22 && typeof data22 == "object" && !Array.isArray(data22)){
let missing4;
if((data22.id === undefined) && (missing4 = "id")){
const err0 = {};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
if(data22.id !== undefined){
if("deepseek-v1" !== data22.id){
const err1 = {};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
}
var _valid0 = _errs52 === errors;
errors = _errs51;
if(vErrors !== null){
if(_errs51){
vErrors.length = _errs51;
}
else {
vErrors = null;
}
}
if(_valid0){
const _errs54 = errors;
if(data22 && typeof data22 == "object" && !Array.isArray(data22)){
if(data22.id !== undefined){
const _errs55 = errors;
if("deepseek-v1" !== data22.id){
validate21.errors = [{instancePath:instancePath+"/connector/id",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/id/const",keyword:"const",params:{allowedValue: "deepseek-v1"},message:"must be equal to constant"}];
return false;
}
var valid12 = _errs55 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data22.version !== undefined){
const _errs56 = errors;
if(1 !== data22.version){
validate21.errors = [{instancePath:instancePath+"/connector/version",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid12 = _errs56 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data22.authentication !== undefined){
const _errs57 = errors;
if("bearer" !== data22.authentication){
validate21.errors = [{instancePath:instancePath+"/connector/authentication",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/authentication/const",keyword:"const",params:{allowedValue: "bearer"},message:"must be equal to constant"}];
return false;
}
var valid12 = _errs57 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data22.outputTokenParameter !== undefined){
const _errs58 = errors;
if("max_tokens" !== data22.outputTokenParameter){
validate21.errors = [{instancePath:instancePath+"/connector/outputTokenParameter",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/outputTokenParameter/const",keyword:"const",params:{allowedValue: "max_tokens"},message:"must be equal to constant"}];
return false;
}
var valid12 = _errs58 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data22.streamingUsage !== undefined){
const _errs59 = errors;
if("include_usage" !== data22.streamingUsage){
validate21.errors = [{instancePath:instancePath+"/connector/streamingUsage",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/streamingUsage/const",keyword:"const",params:{allowedValue: "include_usage"},message:"must be equal to constant"}];
return false;
}
var valid12 = _errs59 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data22.thinking !== undefined){
const _errs60 = errors;
if("type" !== data22.thinking){
validate21.errors = [{instancePath:instancePath+"/connector/thinking",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/thinking/const",keyword:"const",params:{allowedValue: "type"},message:"must be equal to constant"}];
return false;
}
var valid12 = _errs60 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data22.reasoningHistory !== undefined){
const _errs61 = errors;
if(true !== data22.reasoningHistory){
validate21.errors = [{instancePath:instancePath+"/connector/reasoningHistory",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/reasoningHistory/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
return false;
}
var valid12 = _errs61 === errors;
}
else {
var valid12 = true;
}
}
}
}
}
}
}
}
var _valid0 = _errs54 === errors;
valid10 = _valid0;
}
if(!valid10){
const err2 = {instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
validate21.errors = vErrors;
return false;
}
var valid9 = _errs50 === errors;
if(valid9){
const _errs62 = errors;
const _errs63 = errors;
let valid13 = true;
const _errs64 = errors;
if(data22 && typeof data22 == "object" && !Array.isArray(data22)){
let missing5;
if((data22.id === undefined) && (missing5 = "id")){
const err3 = {};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
else {
if(data22.id !== undefined){
if("mimo-v1" !== data22.id){
const err4 = {};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
}
var _valid1 = _errs64 === errors;
errors = _errs63;
if(vErrors !== null){
if(_errs63){
vErrors.length = _errs63;
}
else {
vErrors = null;
}
}
if(_valid1){
const _errs66 = errors;
if(data22 && typeof data22 == "object" && !Array.isArray(data22)){
if(data22.id !== undefined){
const _errs67 = errors;
if("mimo-v1" !== data22.id){
validate21.errors = [{instancePath:instancePath+"/connector/id",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/id/const",keyword:"const",params:{allowedValue: "mimo-v1"},message:"must be equal to constant"}];
return false;
}
var valid15 = _errs67 === errors;
}
else {
var valid15 = true;
}
if(valid15){
if(data22.version !== undefined){
const _errs68 = errors;
if(1 !== data22.version){
validate21.errors = [{instancePath:instancePath+"/connector/version",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid15 = _errs68 === errors;
}
else {
var valid15 = true;
}
if(valid15){
if(data22.authentication !== undefined){
const _errs69 = errors;
if("api_key" !== data22.authentication){
validate21.errors = [{instancePath:instancePath+"/connector/authentication",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/authentication/const",keyword:"const",params:{allowedValue: "api_key"},message:"must be equal to constant"}];
return false;
}
var valid15 = _errs69 === errors;
}
else {
var valid15 = true;
}
if(valid15){
if(data22.outputTokenParameter !== undefined){
const _errs70 = errors;
if("max_completion_tokens" !== data22.outputTokenParameter){
validate21.errors = [{instancePath:instancePath+"/connector/outputTokenParameter",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/outputTokenParameter/const",keyword:"const",params:{allowedValue: "max_completion_tokens"},message:"must be equal to constant"}];
return false;
}
var valid15 = _errs70 === errors;
}
else {
var valid15 = true;
}
if(valid15){
if(data22.streamingUsage !== undefined){
const _errs71 = errors;
if("include_usage" !== data22.streamingUsage){
validate21.errors = [{instancePath:instancePath+"/connector/streamingUsage",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/streamingUsage/const",keyword:"const",params:{allowedValue: "include_usage"},message:"must be equal to constant"}];
return false;
}
var valid15 = _errs71 === errors;
}
else {
var valid15 = true;
}
if(valid15){
if(data22.thinking !== undefined){
const _errs72 = errors;
if("type" !== data22.thinking){
validate21.errors = [{instancePath:instancePath+"/connector/thinking",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/thinking/const",keyword:"const",params:{allowedValue: "type"},message:"must be equal to constant"}];
return false;
}
var valid15 = _errs72 === errors;
}
else {
var valid15 = true;
}
if(valid15){
if(data22.reasoningHistory !== undefined){
const _errs73 = errors;
if(true !== data22.reasoningHistory){
validate21.errors = [{instancePath:instancePath+"/connector/reasoningHistory",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/reasoningHistory/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
return false;
}
var valid15 = _errs73 === errors;
}
else {
var valid15 = true;
}
}
}
}
}
}
}
}
var _valid1 = _errs66 === errors;
valid13 = _valid1;
}
if(!valid13){
const err5 = {instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
validate21.errors = vErrors;
return false;
}
var valid9 = _errs62 === errors;
}
if(errors === _errs48){
if(data22 && typeof data22 == "object" && !Array.isArray(data22)){
let missing6;
if((((((((data22.id === undefined) && (missing6 = "id")) || ((data22.version === undefined) && (missing6 = "version"))) || ((data22.authentication === undefined) && (missing6 = "authentication"))) || ((data22.outputTokenParameter === undefined) && (missing6 = "outputTokenParameter"))) || ((data22.streamingUsage === undefined) && (missing6 = "streamingUsage"))) || ((data22.thinking === undefined) && (missing6 = "thinking"))) || ((data22.reasoningHistory === undefined) && (missing6 = "reasoningHistory"))){
validate21.errors = [{instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/required",keyword:"required",params:{missingProperty: missing6},message:"must have required property '"+missing6+"'"}];
return false;
}
else {
const _errs74 = errors;
for(const key4 in data22){
if(!(((((((key4 === "id") || (key4 === "version")) || (key4 === "authentication")) || (key4 === "outputTokenParameter")) || (key4 === "streamingUsage")) || (key4 === "thinking")) || (key4 === "reasoningHistory"))){
validate21.errors = [{instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs74 === errors){
if(data22.id !== undefined){
let data39 = data22.id;
const _errs75 = errors;
if(!(((data39 === "openai-compatible-v1") || (data39 === "deepseek-v1")) || (data39 === "mimo-v1"))){
validate21.errors = [{instancePath:instancePath+"/connector/id",schemaPath:"#/$defs/ConnectorDescriptor/properties/id/enum",keyword:"enum",params:{allowedValues: schema27.properties.id.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid16 = _errs75 === errors;
}
else {
var valid16 = true;
}
if(valid16){
if(data22.version !== undefined){
const _errs76 = errors;
if(1 !== data22.version){
validate21.errors = [{instancePath:instancePath+"/connector/version",schemaPath:"#/$defs/ConnectorDescriptor/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid16 = _errs76 === errors;
}
else {
var valid16 = true;
}
if(valid16){
if(data22.authentication !== undefined){
let data41 = data22.authentication;
const _errs77 = errors;
if(!((((data41 === "bearer") || (data41 === "api_key")) || (data41 === "x_api_key")) || (data41 === "none"))){
validate21.errors = [{instancePath:instancePath+"/connector/authentication",schemaPath:"#/$defs/ConnectorDescriptor/properties/authentication/enum",keyword:"enum",params:{allowedValues: schema27.properties.authentication.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid16 = _errs77 === errors;
}
else {
var valid16 = true;
}
if(valid16){
if(data22.outputTokenParameter !== undefined){
let data42 = data22.outputTokenParameter;
const _errs78 = errors;
if(!((data42 === "max_tokens") || (data42 === "max_completion_tokens"))){
validate21.errors = [{instancePath:instancePath+"/connector/outputTokenParameter",schemaPath:"#/$defs/ConnectorDescriptor/properties/outputTokenParameter/enum",keyword:"enum",params:{allowedValues: schema27.properties.outputTokenParameter.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid16 = _errs78 === errors;
}
else {
var valid16 = true;
}
if(valid16){
if(data22.streamingUsage !== undefined){
let data43 = data22.streamingUsage;
const _errs79 = errors;
if(!((data43 === "include_usage") || (data43 === "native"))){
validate21.errors = [{instancePath:instancePath+"/connector/streamingUsage",schemaPath:"#/$defs/ConnectorDescriptor/properties/streamingUsage/enum",keyword:"enum",params:{allowedValues: schema27.properties.streamingUsage.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid16 = _errs79 === errors;
}
else {
var valid16 = true;
}
if(valid16){
if(data22.thinking !== undefined){
let data44 = data22.thinking;
const _errs80 = errors;
if(!(((data44 === "none") || (data44 === "type")) || (data44 === "reasoning_effort"))){
validate21.errors = [{instancePath:instancePath+"/connector/thinking",schemaPath:"#/$defs/ConnectorDescriptor/properties/thinking/enum",keyword:"enum",params:{allowedValues: schema27.properties.thinking.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid16 = _errs80 === errors;
}
else {
var valid16 = true;
}
if(valid16){
if(data22.reasoningHistory !== undefined){
const _errs81 = errors;
if(typeof data22.reasoningHistory !== "boolean"){
validate21.errors = [{instancePath:instancePath+"/connector/reasoningHistory",schemaPath:"#/$defs/ConnectorDescriptor/properties/reasoningHistory/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid16 = _errs81 === errors;
}
else {
var valid16 = true;
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
validate21.errors = [{instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs47 === errors;
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
else {
validate21.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate21.errors = vErrors;
return errors === 0;
}

export const Handshake = validate23;
const schema28 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"handshake"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"installationId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"providerInstallationId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"listingRevision":{"type":"integer","minimum":1,"maximum":2147483647},"challengeId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"deadlineUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991}},"required":["type","sessionId","installationId","providerInstallationId","bindingRevision","listingRevision","challengeId","deadlineUnixMs"]};

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
const schema29 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"handshake_result"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"installationId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"providerInstallationId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"listingRevision":{"type":"integer","minimum":1,"maximum":2147483647},"challengeId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"deadlineUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991}},"required":["type","sessionId","installationId","providerInstallationId","bindingRevision","listingRevision","challengeId","deadlineUnixMs"]};

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
const schema30 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"cancel"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"requestId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"sequence":{"type":"integer","minimum":1,"maximum":2147483647}},"required":["type","sessionId","requestId","bindingRevision","sequence"]};

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
const schema31 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"activate"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"sequence":{"type":"integer","minimum":1,"maximum":2147483647},"deadlineUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991}},"required":["type","sessionId","bindingRevision","sequence","deadlineUnixMs"]};

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
const schema32 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"health"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"ready":{"type":"boolean"}},"required":["type","bindingRevision","ready"]};

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
const schema33 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"delta"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"requestId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"sequence":{"type":"integer","minimum":1,"maximum":2147483647},"text":{"type":"string","maxLength":8192}},"required":["type","sessionId","requestId","bindingRevision","sequence","text"]};

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
const schema34 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"usage"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"requestId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"inputTokens":{"type":"integer","minimum":0,"maximum":1048576},"outputTokens":{"type":"integer","minimum":0,"maximum":8192},"meteringProfile":{"const":"observable_io_v1"}},"required":["type","sessionId","requestId","bindingRevision","inputTokens","outputTokens","meteringProfile"]};

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
const schema35 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"listingId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"binding":{"$ref":"#/$defs/ApprovedBinding"},"availability":{"enum":["hot","cold"]},"inputRate":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"outputRate":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"rateDenominator":{"type":"string","pattern":"^[1-9][0-9]{0,18}$"},"capacity":{"type":"integer","minimum":1,"maximum":1048576},"concurrency":{"type":"integer","minimum":1,"maximum":128}},"required":["id","listingId","binding","availability","inputRate","outputRate","rateDenominator","capacity","concurrency"]};
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
if(!(func7.call(schema35.properties, key0))){
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
validate30.errors = [{instancePath:instancePath+"/availability",schemaPath:"#/properties/availability/enum",keyword:"enum",params:{allowedValues: schema35.properties.availability.enum},message:"must be equal to one of the allowed values"}];
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
const schema36 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"listingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"buyerId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"expiresUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991},"maximumCharge":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"outputQuota":{"type":"integer","minimum":1,"maximum":1048576},"concurrency":{"type":"integer","minimum":1,"maximum":128},"providerBond":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"}},"required":["id","listingRevision","buyerId","expiresUnixMs","maximumCharge","outputQuota","concurrency","providerBond"]};

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
const schema37 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"quoteId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"listingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"state":{"enum":["reserved","funding","funded","activating","verifying","ready","active","stopping","settlement_pending","settled","refunded","disputed"]},"funded":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"reserved":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"charged":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"}},"required":["id","quoteId","listingRevision","state","funded","reserved","charged"]};

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
validate33.errors = [{instancePath:instancePath+"/state",schemaPath:"#/properties/state/enum",keyword:"enum",params:{allowedValues: schema37.properties.state.enum},message:"must be equal to one of the allowed values"}];
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
const schema38 = {"type":"object","additionalProperties":false,"properties":{"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"requestId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"listingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"providerNodeId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"sequence":{"type":"integer","minimum":1,"maximum":2147483647},"timestampUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991},"inputTokens":{"type":"integer","minimum":0,"maximum":1048576},"outputTokens":{"type":"integer","minimum":0,"maximum":8192},"cumulativeCharge":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"cumulativeFee":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"meteringProfile":{"const":"observable_io_v1"},"signerId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"signature":{"type":"string","pattern":"^[A-Za-z0-9_-]{86}$"}},"required":["sessionId","requestId","bindingRevision","listingRevision","providerNodeId","sequence","timestampUnixMs","inputTokens","outputTokens","cumulativeCharge","cumulativeFee","meteringProfile","signerId","signature"]};
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
if(!(func7.call(schema38.properties, key0))){
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
const schema39 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"expiresUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991},"maximumCharge":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"maxOutputTokens":{"type":"integer","minimum":1,"maximum":8192},"concurrency":{"type":"integer","minimum":1,"maximum":128},"scopes":{"type":"array","minItems":1,"maxItems":2,"uniqueItems":true,"items":{"enum":["marketplace:infer","marketplace:stop"]}}},"required":["id","sessionId","expiresUnixMs","maximumCharge","maxOutputTokens","concurrency","scopes"]};
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
validate35.errors = [{instancePath:instancePath+"/scopes/" + i0,schemaPath:"#/properties/scopes/items/enum",keyword:"enum",params:{allowedValues: schema39.properties.scopes.items.enum},message:"must be equal to one of the allowed values"}];
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
const schema40 = {"type":"object","additionalProperties":false,"properties":{"cancellationRequestId":{"anyOf":[{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},{"type":"null"}]},"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"sessionId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"listingId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"listingRevision":{"type":"integer","minimum":1,"maximum":2147483647},"provisional":{"type":"boolean"},"version":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"sampleCount":{"type":"integer","minimum":1,"maximum":1000},"elapsedMs":{"type":"integer","minimum":1,"maximum":86400000},"passed":{"type":"boolean"},"recordedAt":{"type":"integer","minimum":0,"maximum":9007199254740991},"freshUntil":{"type":"integer","minimum":1,"maximum":9007199254740991},"checks":{"type":"object","additionalProperties":false,"properties":{"format":{"type":"boolean"},"tools":{"type":"boolean"},"usage":{"type":"boolean"},"cancellation":{"type":"boolean"},"offlineExecution":{"type":"boolean"}},"required":["format","tools","usage","cancellation","offlineExecution"]}},"required":["cancellationRequestId","id","sessionId","listingId","listingRevision","provisional","version","sampleCount","elapsedMs","passed","recordedAt","freshUntil","checks"]};
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
if(!(func7.call(schema40.properties, key0))){
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
const schema41 = {"type":"object","additionalProperties":false,"properties":{"sessionId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"listingId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"listingRevision":{"type":"integer","minimum":1,"maximum":2147483647},"version":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"sampleCount":{"type":"integer","minimum":1,"maximum":1000},"elapsedMs":{"type":"integer","minimum":1,"maximum":86400000},"freshUntil":{"type":"integer","minimum":1,"maximum":9007199254740991},"evidenceReference":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"checks":{"type":"object","additionalProperties":false,"properties":{"format":{"type":"boolean"},"tools":{"type":"boolean"},"usage":{"type":"boolean"},"cancellation":{"const":false},"offlineExecution":{"type":"boolean"}},"required":["format","tools","usage","cancellation","offlineExecution"]}},"required":["sessionId","listingId","listingRevision","version","sampleCount","elapsedMs","freshUntil","evidenceReference","checks"]};

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
if(!(func7.call(schema41.properties, key0))){
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
const schema42 = {"type":"object","additionalProperties":false,"properties":{"evaluationId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"sessionId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"requestId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"reviewReference":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"}},"required":["evaluationId","sessionId","requestId","reviewReference"]};

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
const schema43 = {"type":"object","additionalProperties":false,"properties":{"totalMicrousd":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"expectedRevision":{"type":"integer","minimum":0,"maximum":2147483647},"confirmIncrease":{"type":"boolean"}},"required":["totalMicrousd","expectedRevision","confirmIncrease"]};

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
const schema44 = {"type":"object","additionalProperties":false,"properties":{"dailyLimit":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"monthlyLimit":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"expectedRevision":{"type":"integer","minimum":0,"maximum":2147483647},"reviewReference":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"}},"required":["dailyLimit","monthlyLimit","expectedRevision","reviewReference"]};

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
const schema45 = {"type":"object","additionalProperties":false,"properties":{"version":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"inputMicrousdPerMillion":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"outputMicrousdPerMillion":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"qualifiedUntil":{"type":"integer","minimum":1,"maximum":9007199254740991},"reviewReference":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"}},"required":["version","inputMicrousdPerMillion","outputMicrousdPerMillion","qualifiedUntil","reviewReference"]};

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
const schema46 = {"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"model":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"endpoint":{"type":"string","minLength":1,"maxLength":2048},"supplyClass":{"$ref":"#/$defs/SupplyClass"},"rightsReference":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$","deprecated":true,"description":"Optional historical compatibility metadata; never used for eligibility."},"availability":{"enum":["hot","cold"]},"inputRate":{"type":"string","pattern":"^(0|[1-9][0-9]{0,8})$"},"outputRate":{"type":"string","pattern":"^(0|[1-9][0-9]{0,8})$"},"capabilities":{"type":"array","uniqueItems":true,"maxItems":5,"items":{"enum":["coding_v1","streaming_v1","tools_v1","thinking_v1","images_v1"]}},"contextWindowTokens":{"type":"integer","minimum":4096,"maximum":131072},"connector":{"$ref":"#/$defs/ConnectorDescriptor"}},"required":["name","model","endpoint","supplyClass","availability","inputRate","outputRate"]};
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
if(!(func7.call(schema46.properties, key0))){
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
validate42.errors = [{instancePath:instancePath+"/availability",schemaPath:"#/properties/availability/enum",keyword:"enum",params:{allowedValues: schema46.properties.availability.enum},message:"must be equal to one of the allowed values"}];
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
validate42.errors = [{instancePath:instancePath+"/capabilities/" + i0,schemaPath:"#/properties/capabilities/items/enum",keyword:"enum",params:{allowedValues: schema46.properties.capabilities.items.enum},message:"must be equal to one of the allowed values"}];
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
if(valid0){
if(data.connector !== undefined){
let data11 = data.connector;
const _errs22 = errors;
const _errs23 = errors;
const _errs25 = errors;
const _errs26 = errors;
let valid6 = true;
const _errs27 = errors;
if(data11 && typeof data11 == "object" && !Array.isArray(data11)){
let missing1;
if((data11.id === undefined) && (missing1 = "id")){
const err0 = {};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
if(data11.id !== undefined){
if("deepseek-v1" !== data11.id){
const err1 = {};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
}
var _valid0 = _errs27 === errors;
errors = _errs26;
if(vErrors !== null){
if(_errs26){
vErrors.length = _errs26;
}
else {
vErrors = null;
}
}
if(_valid0){
const _errs29 = errors;
if(data11 && typeof data11 == "object" && !Array.isArray(data11)){
if(data11.id !== undefined){
const _errs30 = errors;
if("deepseek-v1" !== data11.id){
validate42.errors = [{instancePath:instancePath+"/connector/id",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/id/const",keyword:"const",params:{allowedValue: "deepseek-v1"},message:"must be equal to constant"}];
return false;
}
var valid8 = _errs30 === errors;
}
else {
var valid8 = true;
}
if(valid8){
if(data11.version !== undefined){
const _errs31 = errors;
if(1 !== data11.version){
validate42.errors = [{instancePath:instancePath+"/connector/version",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid8 = _errs31 === errors;
}
else {
var valid8 = true;
}
if(valid8){
if(data11.authentication !== undefined){
const _errs32 = errors;
if("bearer" !== data11.authentication){
validate42.errors = [{instancePath:instancePath+"/connector/authentication",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/authentication/const",keyword:"const",params:{allowedValue: "bearer"},message:"must be equal to constant"}];
return false;
}
var valid8 = _errs32 === errors;
}
else {
var valid8 = true;
}
if(valid8){
if(data11.outputTokenParameter !== undefined){
const _errs33 = errors;
if("max_tokens" !== data11.outputTokenParameter){
validate42.errors = [{instancePath:instancePath+"/connector/outputTokenParameter",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/outputTokenParameter/const",keyword:"const",params:{allowedValue: "max_tokens"},message:"must be equal to constant"}];
return false;
}
var valid8 = _errs33 === errors;
}
else {
var valid8 = true;
}
if(valid8){
if(data11.streamingUsage !== undefined){
const _errs34 = errors;
if("include_usage" !== data11.streamingUsage){
validate42.errors = [{instancePath:instancePath+"/connector/streamingUsage",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/streamingUsage/const",keyword:"const",params:{allowedValue: "include_usage"},message:"must be equal to constant"}];
return false;
}
var valid8 = _errs34 === errors;
}
else {
var valid8 = true;
}
if(valid8){
if(data11.thinking !== undefined){
const _errs35 = errors;
if("type" !== data11.thinking){
validate42.errors = [{instancePath:instancePath+"/connector/thinking",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/thinking/const",keyword:"const",params:{allowedValue: "type"},message:"must be equal to constant"}];
return false;
}
var valid8 = _errs35 === errors;
}
else {
var valid8 = true;
}
if(valid8){
if(data11.reasoningHistory !== undefined){
const _errs36 = errors;
if(true !== data11.reasoningHistory){
validate42.errors = [{instancePath:instancePath+"/connector/reasoningHistory",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/reasoningHistory/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
return false;
}
var valid8 = _errs36 === errors;
}
else {
var valid8 = true;
}
}
}
}
}
}
}
}
var _valid0 = _errs29 === errors;
valid6 = _valid0;
}
if(!valid6){
const err2 = {instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
validate42.errors = vErrors;
return false;
}
var valid5 = _errs25 === errors;
if(valid5){
const _errs37 = errors;
const _errs38 = errors;
let valid9 = true;
const _errs39 = errors;
if(data11 && typeof data11 == "object" && !Array.isArray(data11)){
let missing2;
if((data11.id === undefined) && (missing2 = "id")){
const err3 = {};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
else {
if(data11.id !== undefined){
if("mimo-v1" !== data11.id){
const err4 = {};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
}
var _valid1 = _errs39 === errors;
errors = _errs38;
if(vErrors !== null){
if(_errs38){
vErrors.length = _errs38;
}
else {
vErrors = null;
}
}
if(_valid1){
const _errs41 = errors;
if(data11 && typeof data11 == "object" && !Array.isArray(data11)){
if(data11.id !== undefined){
const _errs42 = errors;
if("mimo-v1" !== data11.id){
validate42.errors = [{instancePath:instancePath+"/connector/id",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/id/const",keyword:"const",params:{allowedValue: "mimo-v1"},message:"must be equal to constant"}];
return false;
}
var valid11 = _errs42 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data11.version !== undefined){
const _errs43 = errors;
if(1 !== data11.version){
validate42.errors = [{instancePath:instancePath+"/connector/version",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid11 = _errs43 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data11.authentication !== undefined){
const _errs44 = errors;
if("api_key" !== data11.authentication){
validate42.errors = [{instancePath:instancePath+"/connector/authentication",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/authentication/const",keyword:"const",params:{allowedValue: "api_key"},message:"must be equal to constant"}];
return false;
}
var valid11 = _errs44 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data11.outputTokenParameter !== undefined){
const _errs45 = errors;
if("max_completion_tokens" !== data11.outputTokenParameter){
validate42.errors = [{instancePath:instancePath+"/connector/outputTokenParameter",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/outputTokenParameter/const",keyword:"const",params:{allowedValue: "max_completion_tokens"},message:"must be equal to constant"}];
return false;
}
var valid11 = _errs45 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data11.streamingUsage !== undefined){
const _errs46 = errors;
if("include_usage" !== data11.streamingUsage){
validate42.errors = [{instancePath:instancePath+"/connector/streamingUsage",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/streamingUsage/const",keyword:"const",params:{allowedValue: "include_usage"},message:"must be equal to constant"}];
return false;
}
var valid11 = _errs46 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data11.thinking !== undefined){
const _errs47 = errors;
if("type" !== data11.thinking){
validate42.errors = [{instancePath:instancePath+"/connector/thinking",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/thinking/const",keyword:"const",params:{allowedValue: "type"},message:"must be equal to constant"}];
return false;
}
var valid11 = _errs47 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data11.reasoningHistory !== undefined){
const _errs48 = errors;
if(true !== data11.reasoningHistory){
validate42.errors = [{instancePath:instancePath+"/connector/reasoningHistory",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/reasoningHistory/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
return false;
}
var valid11 = _errs48 === errors;
}
else {
var valid11 = true;
}
}
}
}
}
}
}
}
var _valid1 = _errs41 === errors;
valid9 = _valid1;
}
if(!valid9){
const err5 = {instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
validate42.errors = vErrors;
return false;
}
var valid5 = _errs37 === errors;
}
if(errors === _errs23){
if(data11 && typeof data11 == "object" && !Array.isArray(data11)){
let missing3;
if((((((((data11.id === undefined) && (missing3 = "id")) || ((data11.version === undefined) && (missing3 = "version"))) || ((data11.authentication === undefined) && (missing3 = "authentication"))) || ((data11.outputTokenParameter === undefined) && (missing3 = "outputTokenParameter"))) || ((data11.streamingUsage === undefined) && (missing3 = "streamingUsage"))) || ((data11.thinking === undefined) && (missing3 = "thinking"))) || ((data11.reasoningHistory === undefined) && (missing3 = "reasoningHistory"))){
validate42.errors = [{instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"}];
return false;
}
else {
const _errs49 = errors;
for(const key1 in data11){
if(!(((((((key1 === "id") || (key1 === "version")) || (key1 === "authentication")) || (key1 === "outputTokenParameter")) || (key1 === "streamingUsage")) || (key1 === "thinking")) || (key1 === "reasoningHistory"))){
validate42.errors = [{instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs49 === errors){
if(data11.id !== undefined){
let data28 = data11.id;
const _errs50 = errors;
if(!(((data28 === "openai-compatible-v1") || (data28 === "deepseek-v1")) || (data28 === "mimo-v1"))){
validate42.errors = [{instancePath:instancePath+"/connector/id",schemaPath:"#/$defs/ConnectorDescriptor/properties/id/enum",keyword:"enum",params:{allowedValues: schema27.properties.id.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid12 = _errs50 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data11.version !== undefined){
const _errs51 = errors;
if(1 !== data11.version){
validate42.errors = [{instancePath:instancePath+"/connector/version",schemaPath:"#/$defs/ConnectorDescriptor/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid12 = _errs51 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data11.authentication !== undefined){
let data30 = data11.authentication;
const _errs52 = errors;
if(!((((data30 === "bearer") || (data30 === "api_key")) || (data30 === "x_api_key")) || (data30 === "none"))){
validate42.errors = [{instancePath:instancePath+"/connector/authentication",schemaPath:"#/$defs/ConnectorDescriptor/properties/authentication/enum",keyword:"enum",params:{allowedValues: schema27.properties.authentication.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid12 = _errs52 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data11.outputTokenParameter !== undefined){
let data31 = data11.outputTokenParameter;
const _errs53 = errors;
if(!((data31 === "max_tokens") || (data31 === "max_completion_tokens"))){
validate42.errors = [{instancePath:instancePath+"/connector/outputTokenParameter",schemaPath:"#/$defs/ConnectorDescriptor/properties/outputTokenParameter/enum",keyword:"enum",params:{allowedValues: schema27.properties.outputTokenParameter.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid12 = _errs53 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data11.streamingUsage !== undefined){
let data32 = data11.streamingUsage;
const _errs54 = errors;
if(!((data32 === "include_usage") || (data32 === "native"))){
validate42.errors = [{instancePath:instancePath+"/connector/streamingUsage",schemaPath:"#/$defs/ConnectorDescriptor/properties/streamingUsage/enum",keyword:"enum",params:{allowedValues: schema27.properties.streamingUsage.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid12 = _errs54 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data11.thinking !== undefined){
let data33 = data11.thinking;
const _errs55 = errors;
if(!(((data33 === "none") || (data33 === "type")) || (data33 === "reasoning_effort"))){
validate42.errors = [{instancePath:instancePath+"/connector/thinking",schemaPath:"#/$defs/ConnectorDescriptor/properties/thinking/enum",keyword:"enum",params:{allowedValues: schema27.properties.thinking.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid12 = _errs55 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data11.reasoningHistory !== undefined){
const _errs56 = errors;
if(typeof data11.reasoningHistory !== "boolean"){
validate42.errors = [{instancePath:instancePath+"/connector/reasoningHistory",schemaPath:"#/$defs/ConnectorDescriptor/properties/reasoningHistory/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid12 = _errs56 === errors;
}
else {
var valid12 = true;
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
validate42.errors = [{instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs22 === errors;
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
else {
validate42.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate42.errors = vErrors;
return errors === 0;
}

export const NodeSuspension = validate43;
const schema49 = {"type":"object","additionalProperties":false,"properties":{"suspended":{"type":"boolean"},"reason":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"}},"required":["suspended","reason"]};

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

export const ProviderCapabilityUpdate = validate44;
const schema50 = {"type":"object","additionalProperties":false,"properties":{"thinkingEnabled":{"type":"boolean"}},"required":["thinkingEnabled"]};

function validate44(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.thinkingEnabled === undefined) && (missing0 = "thinkingEnabled")){
validate44.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "thinkingEnabled")){
validate44.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.thinkingEnabled !== undefined){
if(typeof data.thinkingEnabled !== "boolean"){
validate44.errors = [{instancePath:instancePath+"/thinkingEnabled",schemaPath:"#/properties/thinkingEnabled/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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

export const ProviderNodeActivity = validate45;
const schema51 = {"type":"object","properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"activeSessionId":{"anyOf":[{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},{"type":"null"}]}},"required":["id","activeSessionId"]};

function validate45(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.id === undefined) && (missing0 = "id")) || ((data.activeSessionId === undefined) && (missing0 = "activeSessionId"))){
validate45.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.id !== undefined){
let data0 = data.id;
const _errs1 = errors;
if(errors === _errs1){
if(typeof data0 === "string"){
if(!pattern67.test(data0)){
validate45.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate45.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.activeSessionId !== undefined){
let data1 = data.activeSessionId;
const _errs3 = errors;
const _errs4 = errors;
let valid1 = false;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data1 === "string"){
if(!pattern67.test(data1)){
const err0 = {instancePath:instancePath+"/activeSessionId",schemaPath:"#/properties/activeSessionId/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""};
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
const err1 = {instancePath:instancePath+"/activeSessionId",schemaPath:"#/properties/activeSessionId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var _valid0 = _errs5 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs7 = errors;
if(data1 !== null){
const err2 = {instancePath:instancePath+"/activeSessionId",schemaPath:"#/properties/activeSessionId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var _valid0 = _errs7 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err3 = {instancePath:instancePath+"/activeSessionId",schemaPath:"#/properties/activeSessionId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
validate45.errors = vErrors;
return false;
}
else {
errors = _errs4;
if(vErrors !== null){
if(_errs4){
vErrors.length = _errs4;
}
else {
vErrors = null;
}
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
else {
validate45.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate45.errors = vErrors;
return errors === 0;
}

export const ProviderNodeDeletionRequest = validate46;
const schema52 = {"type":"object","additionalProperties":false,"properties":{"confirm":{"const":true}},"required":["confirm"]};

function validate46(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.confirm === undefined) && (missing0 = "confirm")){
validate46.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "confirm")){
validate46.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.confirm !== undefined){
if(true !== data.confirm){
validate46.errors = [{instancePath:instancePath+"/confirm",schemaPath:"#/properties/confirm/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
return false;
}
}
}
}
}
else {
validate46.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate46.errors = vErrors;
return errors === 0;
}

export const ProviderRunRequest = validate47;
const schema53 = {"type":"object","additionalProperties":false,"properties":{"providerRunId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"connectorProtocol":{"enum":["openai_compatible_v1","pi_native_v1","pi_native_v2","pi_native_v3"]}},"required":["providerRunId"]};

function validate47(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.providerRunId === undefined) && (missing0 = "providerRunId")){
validate47.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "providerRunId") || (key0 === "connectorProtocol"))){
validate47.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate47.errors = [{instancePath:instancePath+"/providerRunId",schemaPath:"#/properties/providerRunId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate47.errors = [{instancePath:instancePath+"/providerRunId",schemaPath:"#/properties/providerRunId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.connectorProtocol !== undefined){
let data1 = data.connectorProtocol;
const _errs4 = errors;
if(!((((data1 === "openai_compatible_v1") || (data1 === "pi_native_v1")) || (data1 === "pi_native_v2")) || (data1 === "pi_native_v3"))){
validate47.errors = [{instancePath:instancePath+"/connectorProtocol",schemaPath:"#/properties/connectorProtocol/enum",keyword:"enum",params:{allowedValues: schema53.properties.connectorProtocol.enum},message:"must be equal to one of the allowed values"}];
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
validate47.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate47.errors = vErrors;
return errors === 0;
}

export const ProviderStopRequest = validate48;
const schema54 = {"oneOf":[{"type":"object","additionalProperties":false,"properties":{"scope":{"const":"run"},"providerRunId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"trigger":{"type":"string","pattern":"^[a-z][a-z0-9_]{0,79}$"}},"required":["scope","providerRunId","trigger"]},{"type":"object","additionalProperties":false,"properties":{"scope":{"const":"node"},"trigger":{"const":"operator_stop"}},"required":["scope","trigger"]}]};
const pattern98 = new RegExp("^[a-z][a-z0-9_]{0,79}$", "u");

function validate48(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
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
if(!pattern98.test(data2)){
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
validate48.errors = vErrors;
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
validate48.errors = vErrors;
return errors === 0;
}

export const ProviderRelayReady = validate49;
const schema55 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"ready"},"providerRunId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"relayGeneration":{"type":"integer","minimum":1,"maximum":9007199254740991},"leaseUntil":{"type":"integer","minimum":1,"maximum":9007199254740991}},"required":["type","providerRunId","relayGeneration","leaseUntil"]};

function validate49(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.type === undefined) && (missing0 = "type")) || ((data.providerRunId === undefined) && (missing0 = "providerRunId"))) || ((data.relayGeneration === undefined) && (missing0 = "relayGeneration"))) || ((data.leaseUntil === undefined) && (missing0 = "leaseUntil"))){
validate49.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "type") || (key0 === "providerRunId")) || (key0 === "relayGeneration")) || (key0 === "leaseUntil"))){
validate49.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("ready" !== data.type){
validate49.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "ready"},message:"must be equal to constant"}];
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
validate49.errors = [{instancePath:instancePath+"/providerRunId",schemaPath:"#/properties/providerRunId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate49.errors = [{instancePath:instancePath+"/providerRunId",schemaPath:"#/properties/providerRunId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate49.errors = [{instancePath:instancePath+"/relayGeneration",schemaPath:"#/properties/relayGeneration/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs5){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate49.errors = [{instancePath:instancePath+"/relayGeneration",schemaPath:"#/properties/relayGeneration/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 1 || isNaN(data2)){
validate49.errors = [{instancePath:instancePath+"/relayGeneration",schemaPath:"#/properties/relayGeneration/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate49.errors = [{instancePath:instancePath+"/leaseUntil",schemaPath:"#/properties/leaseUntil/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs7){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate49.errors = [{instancePath:instancePath+"/leaseUntil",schemaPath:"#/properties/leaseUntil/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 1 || isNaN(data3)){
validate49.errors = [{instancePath:instancePath+"/leaseUntil",schemaPath:"#/properties/leaseUntil/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate49.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate49.errors = vErrors;
return errors === 0;
}

export const ProviderRequestFailure = validate50;
const schema56 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"request_failed"},"requestId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"sessionId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"bindingRevision":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"sequence":{"type":"integer","minimum":1,"maximum":2147483647},"code":{"enum":["provider_outcome_unknown","upstream_authentication_failed","upstream_invalid_model","upstream_rate_limited","upstream_malformed_response","upstream_timeout","upstream_failed_outcome_unknown","upstream_usage_missing","upstream_usage_invalid","upstream_parameter_rejected","pi_model_fallback_rejected","pi_thinking_off_unsupported","pi_model_binding_mismatch"]}},"required":["type","requestId","sessionId","bindingRevision","sequence","code"]};

function validate50(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.type === undefined) && (missing0 = "type")) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.bindingRevision === undefined) && (missing0 = "bindingRevision"))) || ((data.sequence === undefined) && (missing0 = "sequence"))) || ((data.code === undefined) && (missing0 = "code"))){
validate50.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "type") || (key0 === "requestId")) || (key0 === "sessionId")) || (key0 === "bindingRevision")) || (key0 === "sequence")) || (key0 === "code"))){
validate50.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("request_failed" !== data.type){
validate50.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "request_failed"},message:"must be equal to constant"}];
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
validate50.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate50.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate50.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate50.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate50.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate50.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate50.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 2147483647 || isNaN(data4)){
validate50.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data4 < 1 || isNaN(data4)){
validate50.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
let data5 = data.code;
const _errs11 = errors;
if(!(((((((((((((data5 === "provider_outcome_unknown") || (data5 === "upstream_authentication_failed")) || (data5 === "upstream_invalid_model")) || (data5 === "upstream_rate_limited")) || (data5 === "upstream_malformed_response")) || (data5 === "upstream_timeout")) || (data5 === "upstream_failed_outcome_unknown")) || (data5 === "upstream_usage_missing")) || (data5 === "upstream_usage_invalid")) || (data5 === "upstream_parameter_rejected")) || (data5 === "pi_model_fallback_rejected")) || (data5 === "pi_thinking_off_unsupported")) || (data5 === "pi_model_binding_mismatch"))){
validate50.errors = [{instancePath:instancePath+"/code",schemaPath:"#/properties/code/enum",keyword:"enum",params:{allowedValues: schema56.properties.code.enum},message:"must be equal to one of the allowed values"}];
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
validate50.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate50.errors = vErrors;
return errors === 0;
}

export const ProviderNodeDeletion = validate51;
const schema57 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"status":{"enum":["paused","deleted"]},"deletedAt":{"type":"integer","minimum":0,"maximum":9007199254740991},"cleanupState":{"enum":["pending","succeeded","failed"]}},"required":["id","status"]};

function validate51(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.id === undefined) && (missing0 = "id")) || ((data.status === undefined) && (missing0 = "status"))){
validate51.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "id") || (key0 === "status")) || (key0 === "deletedAt")) || (key0 === "cleanupState"))){
validate51.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate51.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate51.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
let data1 = data.status;
const _errs4 = errors;
if(!((data1 === "paused") || (data1 === "deleted"))){
validate51.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema57.properties.status.enum},message:"must be equal to one of the allowed values"}];
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
validate51.errors = [{instancePath:instancePath+"/deletedAt",schemaPath:"#/properties/deletedAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs5){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate51.errors = [{instancePath:instancePath+"/deletedAt",schemaPath:"#/properties/deletedAt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate51.errors = [{instancePath:instancePath+"/deletedAt",schemaPath:"#/properties/deletedAt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
if(data.cleanupState !== undefined){
let data3 = data.cleanupState;
const _errs7 = errors;
if(!(((data3 === "pending") || (data3 === "succeeded")) || (data3 === "failed"))){
validate51.errors = [{instancePath:instancePath+"/cleanupState",schemaPath:"#/properties/cleanupState/enum",keyword:"enum",params:{allowedValues: schema57.properties.cleanupState.enum},message:"must be equal to one of the allowed values"}];
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
validate51.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate51.errors = vErrors;
return errors === 0;
}

export const MarketplaceListing = validate52;
const schema58 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"nodeId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"name":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"model":{"type":"string","maxLength":256},"supplyClass":{"$ref":"#/$defs/SupplyClass"},"availability":{"enum":["hot","cold"]},"inputRate":{"type":"string","pattern":"^(0|[1-9][0-9]{0,8})$"},"outputRate":{"type":"string","pattern":"^(0|[1-9][0-9]{0,8})$"},"rateDenominator":{"const":"1000000"},"connectorProfile":{"$ref":"#/$defs/ConnectorProfile"},"capabilities":{"type":"array","uniqueItems":true,"maxItems":5,"items":{"enum":["coding_v1","streaming_v1","tools_v1","thinking_v1","images_v1"]}},"contextWindowTokens":{"type":"integer","minimum":4096,"maximum":131072},"revision":{"type":"integer","minimum":1,"maximum":2147483647},"publishedAt":{"type":"integer","minimum":0,"maximum":9007199254740991},"ready":{"type":"boolean"},"evaluation":{"anyOf":[{"type":"null"},{"$ref":"#/$defs/EvaluationSummary"}]},"controlOnline":{"type":"boolean"},"activationDeadlineSeconds":{"const":120},"maxOutputTokens":{"type":"integer","minimum":1,"maximum":8192},"connector":{"$ref":"#/$defs/ConnectorDescriptor"},"connectorProtocol":{"enum":["pi_native_v1","pi_native_v2","pi_native_v3"]},"messageFormat":{"const":"pi_context_v1"},"provider":{"type":"string","maxLength":256},"api":{"type":"string","maxLength":256},"price":{"type":"object"},"priceVersion":{"type":"string","maxLength":64},"endpoint":{"type":"string","maxLength":2048},"tariffId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"nativeQualified":{"type":"boolean"},"nativeRevision":{"type":"integer","minimum":0,"maximum":9007199254740991},"configurationDigest":{"type":"string","pattern":"^[a-f0-9]{64}$"},"compat":{"type":"object"},"modelSettings":{"$ref":"#/$defs/ModelSettings"},"defaultSettings":{"$ref":"#/$defs/ModelSettings"},"supportedSettings":{"type":"object","additionalProperties":false,"properties":{"reasoning":{"type":"array","minItems":1,"maxItems":7,"uniqueItems":true,"items":{"enum":["off","minimal","low","medium","high","xhigh","max"]}}},"required":["reasoning"]},"nativeLimits":{"type":"object","additionalProperties":false,"properties":{"contextWindowTokens":{"type":"integer","minimum":1,"maximum":9007199254740991},"maxOutputTokens":{"type":"integer","minimum":1,"maximum":9007199254740991}},"required":["contextWindowTokens","maxOutputTokens"]},"adapter":{"type":"object"},"authentication":{"type":"string","maxLength":120},"metadataProvenance":{"type":"object"}},"required":["id","nodeId","name","model","supplyClass","availability","inputRate","outputRate","rateDenominator","connectorProfile","revision","publishedAt","ready","evaluation","controlOnline","activationDeadlineSeconds"]};
const schema63 = {"type":"object","additionalProperties":false,"properties":{"reasoning":{"enum":["off","minimal","low","medium","high","xhigh","max"]}},"required":["reasoning"]};
const pattern115 = new RegExp("^[a-f0-9]{64}$", "u");

function validate52(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((((((((((((data.id === undefined) && (missing0 = "id")) || ((data.nodeId === undefined) && (missing0 = "nodeId"))) || ((data.name === undefined) && (missing0 = "name"))) || ((data.model === undefined) && (missing0 = "model"))) || ((data.supplyClass === undefined) && (missing0 = "supplyClass"))) || ((data.availability === undefined) && (missing0 = "availability"))) || ((data.inputRate === undefined) && (missing0 = "inputRate"))) || ((data.outputRate === undefined) && (missing0 = "outputRate"))) || ((data.rateDenominator === undefined) && (missing0 = "rateDenominator"))) || ((data.connectorProfile === undefined) && (missing0 = "connectorProfile"))) || ((data.revision === undefined) && (missing0 = "revision"))) || ((data.publishedAt === undefined) && (missing0 = "publishedAt"))) || ((data.ready === undefined) && (missing0 = "ready"))) || ((data.evaluation === undefined) && (missing0 = "evaluation"))) || ((data.controlOnline === undefined) && (missing0 = "controlOnline"))) || ((data.activationDeadlineSeconds === undefined) && (missing0 = "activationDeadlineSeconds"))){
validate52.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema58.properties, key0))){
validate52.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate52.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate52.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate52.errors = [{instancePath:instancePath+"/nodeId",schemaPath:"#/properties/nodeId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate52.errors = [{instancePath:instancePath+"/nodeId",schemaPath:"#/properties/nodeId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate52.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data2) < 1){
validate52.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data2)){
validate52.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate52.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
if(func2(data3) > 256){
validate52.errors = [{instancePath:instancePath+"/model",schemaPath:"#/properties/model/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate52.errors = [{instancePath:instancePath+"/model",schemaPath:"#/properties/model/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate52.errors = [{instancePath:instancePath+"/supplyClass",schemaPath:"#/$defs/SupplyClass/enum",keyword:"enum",params:{allowedValues: schema12.enum},message:"must be equal to one of the allowed values"}];
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
validate52.errors = [{instancePath:instancePath+"/availability",schemaPath:"#/properties/availability/enum",keyword:"enum",params:{allowedValues: schema58.properties.availability.enum},message:"must be equal to one of the allowed values"}];
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
validate52.errors = [{instancePath:instancePath+"/inputRate",schemaPath:"#/properties/inputRate/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,8})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,8})$"+"\""}];
return false;
}
}
else {
validate52.errors = [{instancePath:instancePath+"/inputRate",schemaPath:"#/properties/inputRate/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate52.errors = [{instancePath:instancePath+"/outputRate",schemaPath:"#/properties/outputRate/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,8})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,8})$"+"\""}];
return false;
}
}
else {
validate52.errors = [{instancePath:instancePath+"/outputRate",schemaPath:"#/properties/outputRate/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate52.errors = [{instancePath:instancePath+"/rateDenominator",schemaPath:"#/properties/rateDenominator/const",keyword:"const",params:{allowedValue: "1000000"},message:"must be equal to constant"}];
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
validate52.errors = [{instancePath:instancePath+"/connectorProfile",schemaPath:"#/$defs/ConnectorProfile/const",keyword:"const",params:{allowedValue: "inference_connector_v1"},message:"must be equal to constant"}];
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
validate52.errors = [{instancePath:instancePath+"/capabilities",schemaPath:"#/properties/capabilities/maxItems",keyword:"maxItems",params:{limit: 5},message:"must NOT have more than 5 items"}];
return false;
}
else {
var valid3 = true;
const len0 = data10.length;
for(let i0=0; i0<len0; i0++){
let data11 = data10[i0];
const _errs22 = errors;
if(!(((((data11 === "coding_v1") || (data11 === "streaming_v1")) || (data11 === "tools_v1")) || (data11 === "thinking_v1")) || (data11 === "images_v1"))){
validate52.errors = [{instancePath:instancePath+"/capabilities/" + i0,schemaPath:"#/properties/capabilities/items/enum",keyword:"enum",params:{allowedValues: schema58.properties.capabilities.items.enum},message:"must be equal to one of the allowed values"}];
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
validate52.errors = [{instancePath:instancePath+"/capabilities",schemaPath:"#/properties/capabilities/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"}];
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
validate52.errors = [{instancePath:instancePath+"/capabilities",schemaPath:"#/properties/capabilities/type",keyword:"type",params:{type: "array"},message:"must be array"}];
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
validate52.errors = [{instancePath:instancePath+"/contextWindowTokens",schemaPath:"#/properties/contextWindowTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs23){
if((typeof data12 == "number") && (isFinite(data12))){
if(data12 > 131072 || isNaN(data12)){
validate52.errors = [{instancePath:instancePath+"/contextWindowTokens",schemaPath:"#/properties/contextWindowTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 131072},message:"must be <= 131072"}];
return false;
}
else {
if(data12 < 4096 || isNaN(data12)){
validate52.errors = [{instancePath:instancePath+"/contextWindowTokens",schemaPath:"#/properties/contextWindowTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 4096},message:"must be >= 4096"}];
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
validate52.errors = [{instancePath:instancePath+"/revision",schemaPath:"#/properties/revision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs25){
if((typeof data13 == "number") && (isFinite(data13))){
if(data13 > 2147483647 || isNaN(data13)){
validate52.errors = [{instancePath:instancePath+"/revision",schemaPath:"#/properties/revision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data13 < 1 || isNaN(data13)){
validate52.errors = [{instancePath:instancePath+"/revision",schemaPath:"#/properties/revision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate52.errors = [{instancePath:instancePath+"/publishedAt",schemaPath:"#/properties/publishedAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs27){
if((typeof data14 == "number") && (isFinite(data14))){
if(data14 > 9007199254740991 || isNaN(data14)){
validate52.errors = [{instancePath:instancePath+"/publishedAt",schemaPath:"#/properties/publishedAt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data14 < 0 || isNaN(data14)){
validate52.errors = [{instancePath:instancePath+"/publishedAt",schemaPath:"#/properties/publishedAt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate52.errors = [{instancePath:instancePath+"/ready",schemaPath:"#/properties/ready/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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
if(!(func7.call(schema40.properties, key1))){
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
validate52.errors = vErrors;
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
validate52.errors = [{instancePath:instancePath+"/controlOnline",schemaPath:"#/properties/controlOnline/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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
validate52.errors = [{instancePath:instancePath+"/activationDeadlineSeconds",schemaPath:"#/properties/activationDeadlineSeconds/const",keyword:"const",params:{allowedValue: 120},message:"must be equal to constant"}];
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
validate52.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs83){
if((typeof data37 == "number") && (isFinite(data37))){
if(data37 > 8192 || isNaN(data37)){
validate52.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 8192},message:"must be <= 8192"}];
return false;
}
else {
if(data37 < 1 || isNaN(data37)){
validate52.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
if(valid0){
if(data.connector !== undefined){
let data38 = data.connector;
const _errs85 = errors;
const _errs86 = errors;
const _errs88 = errors;
const _errs89 = errors;
let valid12 = true;
const _errs90 = errors;
if(data38 && typeof data38 == "object" && !Array.isArray(data38)){
let missing3;
if((data38.id === undefined) && (missing3 = "id")){
const err44 = {};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
else {
if(data38.id !== undefined){
if("deepseek-v1" !== data38.id){
const err45 = {};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
}
}
var _valid2 = _errs90 === errors;
errors = _errs89;
if(vErrors !== null){
if(_errs89){
vErrors.length = _errs89;
}
else {
vErrors = null;
}
}
if(_valid2){
const _errs92 = errors;
if(data38 && typeof data38 == "object" && !Array.isArray(data38)){
if(data38.id !== undefined){
const _errs93 = errors;
if("deepseek-v1" !== data38.id){
validate52.errors = [{instancePath:instancePath+"/connector/id",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/id/const",keyword:"const",params:{allowedValue: "deepseek-v1"},message:"must be equal to constant"}];
return false;
}
var valid14 = _errs93 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data38.version !== undefined){
const _errs94 = errors;
if(1 !== data38.version){
validate52.errors = [{instancePath:instancePath+"/connector/version",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid14 = _errs94 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data38.authentication !== undefined){
const _errs95 = errors;
if("bearer" !== data38.authentication){
validate52.errors = [{instancePath:instancePath+"/connector/authentication",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/authentication/const",keyword:"const",params:{allowedValue: "bearer"},message:"must be equal to constant"}];
return false;
}
var valid14 = _errs95 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data38.outputTokenParameter !== undefined){
const _errs96 = errors;
if("max_tokens" !== data38.outputTokenParameter){
validate52.errors = [{instancePath:instancePath+"/connector/outputTokenParameter",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/outputTokenParameter/const",keyword:"const",params:{allowedValue: "max_tokens"},message:"must be equal to constant"}];
return false;
}
var valid14 = _errs96 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data38.streamingUsage !== undefined){
const _errs97 = errors;
if("include_usage" !== data38.streamingUsage){
validate52.errors = [{instancePath:instancePath+"/connector/streamingUsage",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/streamingUsage/const",keyword:"const",params:{allowedValue: "include_usage"},message:"must be equal to constant"}];
return false;
}
var valid14 = _errs97 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data38.thinking !== undefined){
const _errs98 = errors;
if("type" !== data38.thinking){
validate52.errors = [{instancePath:instancePath+"/connector/thinking",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/thinking/const",keyword:"const",params:{allowedValue: "type"},message:"must be equal to constant"}];
return false;
}
var valid14 = _errs98 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data38.reasoningHistory !== undefined){
const _errs99 = errors;
if(true !== data38.reasoningHistory){
validate52.errors = [{instancePath:instancePath+"/connector/reasoningHistory",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/reasoningHistory/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
return false;
}
var valid14 = _errs99 === errors;
}
else {
var valid14 = true;
}
}
}
}
}
}
}
}
var _valid2 = _errs92 === errors;
valid12 = _valid2;
}
if(!valid12){
const err46 = {instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
validate52.errors = vErrors;
return false;
}
var valid11 = _errs88 === errors;
if(valid11){
const _errs100 = errors;
const _errs101 = errors;
let valid15 = true;
const _errs102 = errors;
if(data38 && typeof data38 == "object" && !Array.isArray(data38)){
let missing4;
if((data38.id === undefined) && (missing4 = "id")){
const err47 = {};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
else {
if(data38.id !== undefined){
if("mimo-v1" !== data38.id){
const err48 = {};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
}
}
var _valid3 = _errs102 === errors;
errors = _errs101;
if(vErrors !== null){
if(_errs101){
vErrors.length = _errs101;
}
else {
vErrors = null;
}
}
if(_valid3){
const _errs104 = errors;
if(data38 && typeof data38 == "object" && !Array.isArray(data38)){
if(data38.id !== undefined){
const _errs105 = errors;
if("mimo-v1" !== data38.id){
validate52.errors = [{instancePath:instancePath+"/connector/id",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/id/const",keyword:"const",params:{allowedValue: "mimo-v1"},message:"must be equal to constant"}];
return false;
}
var valid17 = _errs105 === errors;
}
else {
var valid17 = true;
}
if(valid17){
if(data38.version !== undefined){
const _errs106 = errors;
if(1 !== data38.version){
validate52.errors = [{instancePath:instancePath+"/connector/version",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid17 = _errs106 === errors;
}
else {
var valid17 = true;
}
if(valid17){
if(data38.authentication !== undefined){
const _errs107 = errors;
if("api_key" !== data38.authentication){
validate52.errors = [{instancePath:instancePath+"/connector/authentication",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/authentication/const",keyword:"const",params:{allowedValue: "api_key"},message:"must be equal to constant"}];
return false;
}
var valid17 = _errs107 === errors;
}
else {
var valid17 = true;
}
if(valid17){
if(data38.outputTokenParameter !== undefined){
const _errs108 = errors;
if("max_completion_tokens" !== data38.outputTokenParameter){
validate52.errors = [{instancePath:instancePath+"/connector/outputTokenParameter",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/outputTokenParameter/const",keyword:"const",params:{allowedValue: "max_completion_tokens"},message:"must be equal to constant"}];
return false;
}
var valid17 = _errs108 === errors;
}
else {
var valid17 = true;
}
if(valid17){
if(data38.streamingUsage !== undefined){
const _errs109 = errors;
if("include_usage" !== data38.streamingUsage){
validate52.errors = [{instancePath:instancePath+"/connector/streamingUsage",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/streamingUsage/const",keyword:"const",params:{allowedValue: "include_usage"},message:"must be equal to constant"}];
return false;
}
var valid17 = _errs109 === errors;
}
else {
var valid17 = true;
}
if(valid17){
if(data38.thinking !== undefined){
const _errs110 = errors;
if("type" !== data38.thinking){
validate52.errors = [{instancePath:instancePath+"/connector/thinking",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/thinking/const",keyword:"const",params:{allowedValue: "type"},message:"must be equal to constant"}];
return false;
}
var valid17 = _errs110 === errors;
}
else {
var valid17 = true;
}
if(valid17){
if(data38.reasoningHistory !== undefined){
const _errs111 = errors;
if(true !== data38.reasoningHistory){
validate52.errors = [{instancePath:instancePath+"/connector/reasoningHistory",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/reasoningHistory/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
return false;
}
var valid17 = _errs111 === errors;
}
else {
var valid17 = true;
}
}
}
}
}
}
}
}
var _valid3 = _errs104 === errors;
valid15 = _valid3;
}
if(!valid15){
const err49 = {instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
validate52.errors = vErrors;
return false;
}
var valid11 = _errs100 === errors;
}
if(errors === _errs86){
if(data38 && typeof data38 == "object" && !Array.isArray(data38)){
let missing5;
if((((((((data38.id === undefined) && (missing5 = "id")) || ((data38.version === undefined) && (missing5 = "version"))) || ((data38.authentication === undefined) && (missing5 = "authentication"))) || ((data38.outputTokenParameter === undefined) && (missing5 = "outputTokenParameter"))) || ((data38.streamingUsage === undefined) && (missing5 = "streamingUsage"))) || ((data38.thinking === undefined) && (missing5 = "thinking"))) || ((data38.reasoningHistory === undefined) && (missing5 = "reasoningHistory"))){
validate52.errors = [{instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/required",keyword:"required",params:{missingProperty: missing5},message:"must have required property '"+missing5+"'"}];
return false;
}
else {
const _errs112 = errors;
for(const key3 in data38){
if(!(((((((key3 === "id") || (key3 === "version")) || (key3 === "authentication")) || (key3 === "outputTokenParameter")) || (key3 === "streamingUsage")) || (key3 === "thinking")) || (key3 === "reasoningHistory"))){
validate52.errors = [{instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs112 === errors){
if(data38.id !== undefined){
let data55 = data38.id;
const _errs113 = errors;
if(!(((data55 === "openai-compatible-v1") || (data55 === "deepseek-v1")) || (data55 === "mimo-v1"))){
validate52.errors = [{instancePath:instancePath+"/connector/id",schemaPath:"#/$defs/ConnectorDescriptor/properties/id/enum",keyword:"enum",params:{allowedValues: schema27.properties.id.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid18 = _errs113 === errors;
}
else {
var valid18 = true;
}
if(valid18){
if(data38.version !== undefined){
const _errs114 = errors;
if(1 !== data38.version){
validate52.errors = [{instancePath:instancePath+"/connector/version",schemaPath:"#/$defs/ConnectorDescriptor/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid18 = _errs114 === errors;
}
else {
var valid18 = true;
}
if(valid18){
if(data38.authentication !== undefined){
let data57 = data38.authentication;
const _errs115 = errors;
if(!((((data57 === "bearer") || (data57 === "api_key")) || (data57 === "x_api_key")) || (data57 === "none"))){
validate52.errors = [{instancePath:instancePath+"/connector/authentication",schemaPath:"#/$defs/ConnectorDescriptor/properties/authentication/enum",keyword:"enum",params:{allowedValues: schema27.properties.authentication.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid18 = _errs115 === errors;
}
else {
var valid18 = true;
}
if(valid18){
if(data38.outputTokenParameter !== undefined){
let data58 = data38.outputTokenParameter;
const _errs116 = errors;
if(!((data58 === "max_tokens") || (data58 === "max_completion_tokens"))){
validate52.errors = [{instancePath:instancePath+"/connector/outputTokenParameter",schemaPath:"#/$defs/ConnectorDescriptor/properties/outputTokenParameter/enum",keyword:"enum",params:{allowedValues: schema27.properties.outputTokenParameter.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid18 = _errs116 === errors;
}
else {
var valid18 = true;
}
if(valid18){
if(data38.streamingUsage !== undefined){
let data59 = data38.streamingUsage;
const _errs117 = errors;
if(!((data59 === "include_usage") || (data59 === "native"))){
validate52.errors = [{instancePath:instancePath+"/connector/streamingUsage",schemaPath:"#/$defs/ConnectorDescriptor/properties/streamingUsage/enum",keyword:"enum",params:{allowedValues: schema27.properties.streamingUsage.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid18 = _errs117 === errors;
}
else {
var valid18 = true;
}
if(valid18){
if(data38.thinking !== undefined){
let data60 = data38.thinking;
const _errs118 = errors;
if(!(((data60 === "none") || (data60 === "type")) || (data60 === "reasoning_effort"))){
validate52.errors = [{instancePath:instancePath+"/connector/thinking",schemaPath:"#/$defs/ConnectorDescriptor/properties/thinking/enum",keyword:"enum",params:{allowedValues: schema27.properties.thinking.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid18 = _errs118 === errors;
}
else {
var valid18 = true;
}
if(valid18){
if(data38.reasoningHistory !== undefined){
const _errs119 = errors;
if(typeof data38.reasoningHistory !== "boolean"){
validate52.errors = [{instancePath:instancePath+"/connector/reasoningHistory",schemaPath:"#/$defs/ConnectorDescriptor/properties/reasoningHistory/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid18 = _errs119 === errors;
}
else {
var valid18 = true;
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
validate52.errors = [{instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs85 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.connectorProtocol !== undefined){
let data62 = data.connectorProtocol;
const _errs121 = errors;
if(!(((data62 === "pi_native_v1") || (data62 === "pi_native_v2")) || (data62 === "pi_native_v3"))){
validate52.errors = [{instancePath:instancePath+"/connectorProtocol",schemaPath:"#/properties/connectorProtocol/enum",keyword:"enum",params:{allowedValues: schema58.properties.connectorProtocol.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs121 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.messageFormat !== undefined){
const _errs122 = errors;
if("pi_context_v1" !== data.messageFormat){
validate52.errors = [{instancePath:instancePath+"/messageFormat",schemaPath:"#/properties/messageFormat/const",keyword:"const",params:{allowedValue: "pi_context_v1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs122 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.provider !== undefined){
let data64 = data.provider;
const _errs123 = errors;
if(errors === _errs123){
if(typeof data64 === "string"){
if(func2(data64) > 256){
validate52.errors = [{instancePath:instancePath+"/provider",schemaPath:"#/properties/provider/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate52.errors = [{instancePath:instancePath+"/provider",schemaPath:"#/properties/provider/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs123 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.api !== undefined){
let data65 = data.api;
const _errs125 = errors;
if(errors === _errs125){
if(typeof data65 === "string"){
if(func2(data65) > 256){
validate52.errors = [{instancePath:instancePath+"/api",schemaPath:"#/properties/api/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate52.errors = [{instancePath:instancePath+"/api",schemaPath:"#/properties/api/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs125 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.price !== undefined){
let data66 = data.price;
const _errs127 = errors;
if(!(data66 && typeof data66 == "object" && !Array.isArray(data66))){
validate52.errors = [{instancePath:instancePath+"/price",schemaPath:"#/properties/price/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
var valid0 = _errs127 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.priceVersion !== undefined){
let data67 = data.priceVersion;
const _errs129 = errors;
if(errors === _errs129){
if(typeof data67 === "string"){
if(func2(data67) > 64){
validate52.errors = [{instancePath:instancePath+"/priceVersion",schemaPath:"#/properties/priceVersion/maxLength",keyword:"maxLength",params:{limit: 64},message:"must NOT have more than 64 characters"}];
return false;
}
}
else {
validate52.errors = [{instancePath:instancePath+"/priceVersion",schemaPath:"#/properties/priceVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs129 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.endpoint !== undefined){
let data68 = data.endpoint;
const _errs131 = errors;
if(errors === _errs131){
if(typeof data68 === "string"){
if(func2(data68) > 2048){
validate52.errors = [{instancePath:instancePath+"/endpoint",schemaPath:"#/properties/endpoint/maxLength",keyword:"maxLength",params:{limit: 2048},message:"must NOT have more than 2048 characters"}];
return false;
}
}
else {
validate52.errors = [{instancePath:instancePath+"/endpoint",schemaPath:"#/properties/endpoint/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs131 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.tariffId !== undefined){
let data69 = data.tariffId;
const _errs133 = errors;
if(errors === _errs133){
if(typeof data69 === "string"){
if(!pattern67.test(data69)){
validate52.errors = [{instancePath:instancePath+"/tariffId",schemaPath:"#/properties/tariffId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate52.errors = [{instancePath:instancePath+"/tariffId",schemaPath:"#/properties/tariffId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs133 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nativeQualified !== undefined){
const _errs135 = errors;
if(typeof data.nativeQualified !== "boolean"){
validate52.errors = [{instancePath:instancePath+"/nativeQualified",schemaPath:"#/properties/nativeQualified/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs135 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nativeRevision !== undefined){
let data71 = data.nativeRevision;
const _errs137 = errors;
if(!(((typeof data71 == "number") && (!(data71 % 1) && !isNaN(data71))) && (isFinite(data71)))){
validate52.errors = [{instancePath:instancePath+"/nativeRevision",schemaPath:"#/properties/nativeRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs137){
if((typeof data71 == "number") && (isFinite(data71))){
if(data71 > 9007199254740991 || isNaN(data71)){
validate52.errors = [{instancePath:instancePath+"/nativeRevision",schemaPath:"#/properties/nativeRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data71 < 0 || isNaN(data71)){
validate52.errors = [{instancePath:instancePath+"/nativeRevision",schemaPath:"#/properties/nativeRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs137 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.configurationDigest !== undefined){
let data72 = data.configurationDigest;
const _errs139 = errors;
if(errors === _errs139){
if(typeof data72 === "string"){
if(!pattern115.test(data72)){
validate52.errors = [{instancePath:instancePath+"/configurationDigest",schemaPath:"#/properties/configurationDigest/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""}];
return false;
}
}
else {
validate52.errors = [{instancePath:instancePath+"/configurationDigest",schemaPath:"#/properties/configurationDigest/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs139 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.compat !== undefined){
let data73 = data.compat;
const _errs141 = errors;
if(!(data73 && typeof data73 == "object" && !Array.isArray(data73))){
validate52.errors = [{instancePath:instancePath+"/compat",schemaPath:"#/properties/compat/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
var valid0 = _errs141 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.modelSettings !== undefined){
let data74 = data.modelSettings;
const _errs143 = errors;
const _errs144 = errors;
if(errors === _errs144){
if(data74 && typeof data74 == "object" && !Array.isArray(data74)){
let missing6;
if((data74.reasoning === undefined) && (missing6 = "reasoning")){
validate52.errors = [{instancePath:instancePath+"/modelSettings",schemaPath:"#/$defs/ModelSettings/required",keyword:"required",params:{missingProperty: missing6},message:"must have required property '"+missing6+"'"}];
return false;
}
else {
const _errs146 = errors;
for(const key4 in data74){
if(!(key4 === "reasoning")){
validate52.errors = [{instancePath:instancePath+"/modelSettings",schemaPath:"#/$defs/ModelSettings/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs146 === errors){
if(data74.reasoning !== undefined){
let data75 = data74.reasoning;
if(!(((((((data75 === "off") || (data75 === "minimal")) || (data75 === "low")) || (data75 === "medium")) || (data75 === "high")) || (data75 === "xhigh")) || (data75 === "max"))){
validate52.errors = [{instancePath:instancePath+"/modelSettings/reasoning",schemaPath:"#/$defs/ModelSettings/properties/reasoning/enum",keyword:"enum",params:{allowedValues: schema63.properties.reasoning.enum},message:"must be equal to one of the allowed values"}];
return false;
}
}
}
}
}
else {
validate52.errors = [{instancePath:instancePath+"/modelSettings",schemaPath:"#/$defs/ModelSettings/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs143 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.defaultSettings !== undefined){
let data76 = data.defaultSettings;
const _errs148 = errors;
const _errs149 = errors;
if(errors === _errs149){
if(data76 && typeof data76 == "object" && !Array.isArray(data76)){
let missing7;
if((data76.reasoning === undefined) && (missing7 = "reasoning")){
validate52.errors = [{instancePath:instancePath+"/defaultSettings",schemaPath:"#/$defs/ModelSettings/required",keyword:"required",params:{missingProperty: missing7},message:"must have required property '"+missing7+"'"}];
return false;
}
else {
const _errs151 = errors;
for(const key5 in data76){
if(!(key5 === "reasoning")){
validate52.errors = [{instancePath:instancePath+"/defaultSettings",schemaPath:"#/$defs/ModelSettings/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs151 === errors){
if(data76.reasoning !== undefined){
let data77 = data76.reasoning;
if(!(((((((data77 === "off") || (data77 === "minimal")) || (data77 === "low")) || (data77 === "medium")) || (data77 === "high")) || (data77 === "xhigh")) || (data77 === "max"))){
validate52.errors = [{instancePath:instancePath+"/defaultSettings/reasoning",schemaPath:"#/$defs/ModelSettings/properties/reasoning/enum",keyword:"enum",params:{allowedValues: schema63.properties.reasoning.enum},message:"must be equal to one of the allowed values"}];
return false;
}
}
}
}
}
else {
validate52.errors = [{instancePath:instancePath+"/defaultSettings",schemaPath:"#/$defs/ModelSettings/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs148 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.supportedSettings !== undefined){
let data78 = data.supportedSettings;
const _errs153 = errors;
if(errors === _errs153){
if(data78 && typeof data78 == "object" && !Array.isArray(data78)){
let missing8;
if((data78.reasoning === undefined) && (missing8 = "reasoning")){
validate52.errors = [{instancePath:instancePath+"/supportedSettings",schemaPath:"#/properties/supportedSettings/required",keyword:"required",params:{missingProperty: missing8},message:"must have required property '"+missing8+"'"}];
return false;
}
else {
const _errs155 = errors;
for(const key6 in data78){
if(!(key6 === "reasoning")){
validate52.errors = [{instancePath:instancePath+"/supportedSettings",schemaPath:"#/properties/supportedSettings/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs155 === errors){
if(data78.reasoning !== undefined){
let data79 = data78.reasoning;
const _errs156 = errors;
if(errors === _errs156){
if(Array.isArray(data79)){
if(data79.length > 7){
validate52.errors = [{instancePath:instancePath+"/supportedSettings/reasoning",schemaPath:"#/properties/supportedSettings/properties/reasoning/maxItems",keyword:"maxItems",params:{limit: 7},message:"must NOT have more than 7 items"}];
return false;
}
else {
if(data79.length < 1){
validate52.errors = [{instancePath:instancePath+"/supportedSettings/reasoning",schemaPath:"#/properties/supportedSettings/properties/reasoning/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid24 = true;
const len1 = data79.length;
for(let i2=0; i2<len1; i2++){
let data80 = data79[i2];
const _errs158 = errors;
if(!(((((((data80 === "off") || (data80 === "minimal")) || (data80 === "low")) || (data80 === "medium")) || (data80 === "high")) || (data80 === "xhigh")) || (data80 === "max"))){
validate52.errors = [{instancePath:instancePath+"/supportedSettings/reasoning/" + i2,schemaPath:"#/properties/supportedSettings/properties/reasoning/items/enum",keyword:"enum",params:{allowedValues: schema58.properties.supportedSettings.properties.reasoning.items.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid24 = _errs158 === errors;
if(!valid24){
break;
}
}
if(valid24){
let i3 = data79.length;
let j1;
if(i3 > 1){
outer1:
for(;i3--;){
for(j1 = i3; j1--;){
if(func0(data79[i3], data79[j1])){
validate52.errors = [{instancePath:instancePath+"/supportedSettings/reasoning",schemaPath:"#/properties/supportedSettings/properties/reasoning/uniqueItems",keyword:"uniqueItems",params:{i: i3, j: j1},message:"must NOT have duplicate items (items ## "+j1+" and "+i3+" are identical)"}];
return false;
break outer1;
}
}
}
}
}
}
}
}
else {
validate52.errors = [{instancePath:instancePath+"/supportedSettings/reasoning",schemaPath:"#/properties/supportedSettings/properties/reasoning/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
}
}
}
}
else {
validate52.errors = [{instancePath:instancePath+"/supportedSettings",schemaPath:"#/properties/supportedSettings/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs153 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nativeLimits !== undefined){
let data81 = data.nativeLimits;
const _errs159 = errors;
if(errors === _errs159){
if(data81 && typeof data81 == "object" && !Array.isArray(data81)){
let missing9;
if(((data81.contextWindowTokens === undefined) && (missing9 = "contextWindowTokens")) || ((data81.maxOutputTokens === undefined) && (missing9 = "maxOutputTokens"))){
validate52.errors = [{instancePath:instancePath+"/nativeLimits",schemaPath:"#/properties/nativeLimits/required",keyword:"required",params:{missingProperty: missing9},message:"must have required property '"+missing9+"'"}];
return false;
}
else {
const _errs161 = errors;
for(const key7 in data81){
if(!((key7 === "contextWindowTokens") || (key7 === "maxOutputTokens"))){
validate52.errors = [{instancePath:instancePath+"/nativeLimits",schemaPath:"#/properties/nativeLimits/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs161 === errors){
if(data81.contextWindowTokens !== undefined){
let data82 = data81.contextWindowTokens;
const _errs162 = errors;
if(!(((typeof data82 == "number") && (!(data82 % 1) && !isNaN(data82))) && (isFinite(data82)))){
validate52.errors = [{instancePath:instancePath+"/nativeLimits/contextWindowTokens",schemaPath:"#/properties/nativeLimits/properties/contextWindowTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs162){
if((typeof data82 == "number") && (isFinite(data82))){
if(data82 > 9007199254740991 || isNaN(data82)){
validate52.errors = [{instancePath:instancePath+"/nativeLimits/contextWindowTokens",schemaPath:"#/properties/nativeLimits/properties/contextWindowTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data82 < 1 || isNaN(data82)){
validate52.errors = [{instancePath:instancePath+"/nativeLimits/contextWindowTokens",schemaPath:"#/properties/nativeLimits/properties/contextWindowTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid26 = _errs162 === errors;
}
else {
var valid26 = true;
}
if(valid26){
if(data81.maxOutputTokens !== undefined){
let data83 = data81.maxOutputTokens;
const _errs164 = errors;
if(!(((typeof data83 == "number") && (!(data83 % 1) && !isNaN(data83))) && (isFinite(data83)))){
validate52.errors = [{instancePath:instancePath+"/nativeLimits/maxOutputTokens",schemaPath:"#/properties/nativeLimits/properties/maxOutputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs164){
if((typeof data83 == "number") && (isFinite(data83))){
if(data83 > 9007199254740991 || isNaN(data83)){
validate52.errors = [{instancePath:instancePath+"/nativeLimits/maxOutputTokens",schemaPath:"#/properties/nativeLimits/properties/maxOutputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data83 < 1 || isNaN(data83)){
validate52.errors = [{instancePath:instancePath+"/nativeLimits/maxOutputTokens",schemaPath:"#/properties/nativeLimits/properties/maxOutputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid26 = _errs164 === errors;
}
else {
var valid26 = true;
}
}
}
}
}
else {
validate52.errors = [{instancePath:instancePath+"/nativeLimits",schemaPath:"#/properties/nativeLimits/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs159 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.adapter !== undefined){
let data84 = data.adapter;
const _errs166 = errors;
if(!(data84 && typeof data84 == "object" && !Array.isArray(data84))){
validate52.errors = [{instancePath:instancePath+"/adapter",schemaPath:"#/properties/adapter/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
var valid0 = _errs166 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.authentication !== undefined){
let data85 = data.authentication;
const _errs168 = errors;
if(errors === _errs168){
if(typeof data85 === "string"){
if(func2(data85) > 120){
validate52.errors = [{instancePath:instancePath+"/authentication",schemaPath:"#/properties/authentication/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
}
else {
validate52.errors = [{instancePath:instancePath+"/authentication",schemaPath:"#/properties/authentication/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs168 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.metadataProvenance !== undefined){
let data86 = data.metadataProvenance;
const _errs170 = errors;
if(!(data86 && typeof data86 == "object" && !Array.isArray(data86))){
validate52.errors = [{instancePath:instancePath+"/metadataProvenance",schemaPath:"#/properties/metadataProvenance/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
var valid0 = _errs170 === errors;
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
validate52.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate52.errors = vErrors;
return errors === 0;
}

export const MarketplaceQuoteRequest = validate53;
const schema65 = {"type":"object","additionalProperties":false,"properties":{"listingId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"maximumCharge":{"type":"string","pattern":"^(0|[1-9][0-9]{0,8})$"},"maxOutputTokens":{"type":"integer","minimum":1,"maximum":8192},"durationSeconds":{"type":"integer","minimum":60,"maximum":3600},"protocol":{"const":"coding_v1"},"requestLimit":{"type":"integer","minimum":1,"maximum":100},"mode":{"enum":["purchase","private_rehearsal"]},"acknowledgeProvisional":{"type":"boolean"},"connectorProtocol":{"enum":["openai_compatible_v1","pi_native_v1","pi_native_v2","pi_native_v3"]},"modelSettings":{"$ref":"#/$defs/ModelSettings"}},"required":["listingId","maximumCharge","maxOutputTokens","durationSeconds"]};

function validate53(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.listingId === undefined) && (missing0 = "listingId")) || ((data.maximumCharge === undefined) && (missing0 = "maximumCharge"))) || ((data.maxOutputTokens === undefined) && (missing0 = "maxOutputTokens"))) || ((data.durationSeconds === undefined) && (missing0 = "durationSeconds"))){
validate53.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema65.properties, key0))){
validate53.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate53.errors = [{instancePath:instancePath+"/listingId",schemaPath:"#/properties/listingId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate53.errors = [{instancePath:instancePath+"/listingId",schemaPath:"#/properties/listingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate53.errors = [{instancePath:instancePath+"/maximumCharge",schemaPath:"#/properties/maximumCharge/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,8})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,8})$"+"\""}];
return false;
}
}
else {
validate53.errors = [{instancePath:instancePath+"/maximumCharge",schemaPath:"#/properties/maximumCharge/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate53.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 8192 || isNaN(data2)){
validate53.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 8192},message:"must be <= 8192"}];
return false;
}
else {
if(data2 < 1 || isNaN(data2)){
validate53.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate53.errors = [{instancePath:instancePath+"/durationSeconds",schemaPath:"#/properties/durationSeconds/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 3600 || isNaN(data3)){
validate53.errors = [{instancePath:instancePath+"/durationSeconds",schemaPath:"#/properties/durationSeconds/maximum",keyword:"maximum",params:{comparison: "<=", limit: 3600},message:"must be <= 3600"}];
return false;
}
else {
if(data3 < 60 || isNaN(data3)){
validate53.errors = [{instancePath:instancePath+"/durationSeconds",schemaPath:"#/properties/durationSeconds/minimum",keyword:"minimum",params:{comparison: ">=", limit: 60},message:"must be >= 60"}];
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
validate53.errors = [{instancePath:instancePath+"/protocol",schemaPath:"#/properties/protocol/const",keyword:"const",params:{allowedValue: "coding_v1"},message:"must be equal to constant"}];
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
validate53.errors = [{instancePath:instancePath+"/requestLimit",schemaPath:"#/properties/requestLimit/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs11){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 100 || isNaN(data5)){
validate53.errors = [{instancePath:instancePath+"/requestLimit",schemaPath:"#/properties/requestLimit/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100},message:"must be <= 100"}];
return false;
}
else {
if(data5 < 1 || isNaN(data5)){
validate53.errors = [{instancePath:instancePath+"/requestLimit",schemaPath:"#/properties/requestLimit/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate53.errors = [{instancePath:instancePath+"/mode",schemaPath:"#/properties/mode/enum",keyword:"enum",params:{allowedValues: schema65.properties.mode.enum},message:"must be equal to one of the allowed values"}];
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
validate53.errors = [{instancePath:instancePath+"/acknowledgeProvisional",schemaPath:"#/properties/acknowledgeProvisional/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.connectorProtocol !== undefined){
let data8 = data.connectorProtocol;
const _errs16 = errors;
if(!((((data8 === "openai_compatible_v1") || (data8 === "pi_native_v1")) || (data8 === "pi_native_v2")) || (data8 === "pi_native_v3"))){
validate53.errors = [{instancePath:instancePath+"/connectorProtocol",schemaPath:"#/properties/connectorProtocol/enum",keyword:"enum",params:{allowedValues: schema65.properties.connectorProtocol.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.modelSettings !== undefined){
let data9 = data.modelSettings;
const _errs17 = errors;
const _errs18 = errors;
if(errors === _errs18){
if(data9 && typeof data9 == "object" && !Array.isArray(data9)){
let missing1;
if((data9.reasoning === undefined) && (missing1 = "reasoning")){
validate53.errors = [{instancePath:instancePath+"/modelSettings",schemaPath:"#/$defs/ModelSettings/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs20 = errors;
for(const key1 in data9){
if(!(key1 === "reasoning")){
validate53.errors = [{instancePath:instancePath+"/modelSettings",schemaPath:"#/$defs/ModelSettings/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs20 === errors){
if(data9.reasoning !== undefined){
let data10 = data9.reasoning;
if(!(((((((data10 === "off") || (data10 === "minimal")) || (data10 === "low")) || (data10 === "medium")) || (data10 === "high")) || (data10 === "xhigh")) || (data10 === "max"))){
validate53.errors = [{instancePath:instancePath+"/modelSettings/reasoning",schemaPath:"#/$defs/ModelSettings/properties/reasoning/enum",keyword:"enum",params:{allowedValues: schema63.properties.reasoning.enum},message:"must be equal to one of the allowed values"}];
return false;
}
}
}
}
}
else {
validate53.errors = [{instancePath:instancePath+"/modelSettings",schemaPath:"#/$defs/ModelSettings/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs17 === errors;
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
validate53.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate53.errors = vErrors;
return errors === 0;
}

export const MarketplaceSessionAcceptance = validate54;
const schema67 = {"type":"object","additionalProperties":false,"properties":{"quoteId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"accept":{"const":true},"mode":{"enum":["purchase","private_rehearsal"]},"acknowledgeProvisional":{"type":"boolean"}},"required":["quoteId","accept"]};

function validate54(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.quoteId === undefined) && (missing0 = "quoteId")) || ((data.accept === undefined) && (missing0 = "accept"))){
validate54.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "quoteId") || (key0 === "accept")) || (key0 === "mode")) || (key0 === "acknowledgeProvisional"))){
validate54.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate54.errors = [{instancePath:instancePath+"/quoteId",schemaPath:"#/properties/quoteId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate54.errors = [{instancePath:instancePath+"/quoteId",schemaPath:"#/properties/quoteId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate54.errors = [{instancePath:instancePath+"/accept",schemaPath:"#/properties/accept/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
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
validate54.errors = [{instancePath:instancePath+"/mode",schemaPath:"#/properties/mode/enum",keyword:"enum",params:{allowedValues: schema67.properties.mode.enum},message:"must be equal to one of the allowed values"}];
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
validate54.errors = [{instancePath:instancePath+"/acknowledgeProvisional",schemaPath:"#/properties/acknowledgeProvisional/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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
validate54.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate54.errors = vErrors;
return errors === 0;
}

export const ExecutionRelease = validate55;
const schema68 = {"type":"object","additionalProperties":false,"properties":{"teardownEvidenceReference":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"guestTeardownVerified":{"const":true}},"required":["teardownEvidenceReference","guestTeardownVerified"]};

function validate55(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.teardownEvidenceReference === undefined) && (missing0 = "teardownEvidenceReference")) || ((data.guestTeardownVerified === undefined) && (missing0 = "guestTeardownVerified"))){
validate55.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "teardownEvidenceReference") || (key0 === "guestTeardownVerified"))){
validate55.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate55.errors = [{instancePath:instancePath+"/teardownEvidenceReference",schemaPath:"#/properties/teardownEvidenceReference/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data0) < 1){
validate55.errors = [{instancePath:instancePath+"/teardownEvidenceReference",schemaPath:"#/properties/teardownEvidenceReference/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data0)){
validate55.errors = [{instancePath:instancePath+"/teardownEvidenceReference",schemaPath:"#/properties/teardownEvidenceReference/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate55.errors = [{instancePath:instancePath+"/teardownEvidenceReference",schemaPath:"#/properties/teardownEvidenceReference/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate55.errors = [{instancePath:instancePath+"/guestTeardownVerified",schemaPath:"#/properties/guestTeardownVerified/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
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
validate55.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate55.errors = vErrors;
return errors === 0;
}

export const MarketplaceSessionStatus = validate56;
const schema69 = {"type":"object","properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"mode":{"enum":["purchase","private_rehearsal","evaluation"]},"requestLimit":{"type":"integer","minimum":1,"maximum":100},"requestSequence":{"type":"integer","minimum":0,"maximum":100},"handshakeStatus":{"enum":["not_required","required","pending","succeeded","failed"]},"executionReleasedAt":{"anyOf":[{"type":"integer","minimum":1,"maximum":9007199254740991},{"type":"null"}]},"thinkingModelSupport":{"anyOf":[{"type":"boolean"},{"type":"null"}]},"connector":{"$ref":"#/$defs/ConnectorDescriptor"},"connectorProtocol":{"enum":["pi_native_v1","pi_native_v2","pi_native_v3"]},"messageFormat":{"const":"pi_context_v1"},"provider":{"type":"string","maxLength":256},"api":{"type":"string","maxLength":256},"price":{"type":"object"},"priceVersion":{"type":"string","maxLength":64},"endpoint":{"type":"string","maxLength":2048},"tariffId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"nativeQualified":{"type":"boolean"},"nativeRevision":{"type":"integer","minimum":0,"maximum":9007199254740991},"configurationDigest":{"type":"string","pattern":"^[a-f0-9]{64}$"},"executionState":{"enum":["preparing","active","paused","stopping","stopped"]},"cleanupState":{"enum":["pending","succeeded","failed"]},"accountingState":{"enum":["open","pending_reconciliation","settled"]},"stopReason":{"type":"string","maxLength":120},"statusAsOf":{"type":"integer","minimum":0,"maximum":9007199254740991},"modelSettings":{"$ref":"#/$defs/ModelSettings"},"defaultSettings":{"$ref":"#/$defs/ModelSettings"},"supportedSettings":{"type":"object","additionalProperties":false,"properties":{"reasoning":{"type":"array","minItems":1,"maxItems":7,"uniqueItems":true,"items":{"enum":["off","minimal","low","medium","high","xhigh","max"]}}},"required":["reasoning"]},"nativeLimits":{"type":"object","additionalProperties":false,"properties":{"contextWindowTokens":{"type":"integer","minimum":1,"maximum":9007199254740991},"maxOutputTokens":{"type":"integer","minimum":1,"maximum":9007199254740991}},"required":["contextWindowTokens","maxOutputTokens"]},"adapter":{"type":"object"},"authentication":{"type":"string","maxLength":120},"compat":{"type":"object"},"metadataProvenance":{"type":"object"}},"required":["id","mode","requestLimit","handshakeStatus","executionReleasedAt"]};

function validate56(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.id === undefined) && (missing0 = "id")) || ((data.mode === undefined) && (missing0 = "mode"))) || ((data.requestLimit === undefined) && (missing0 = "requestLimit"))) || ((data.handshakeStatus === undefined) && (missing0 = "handshakeStatus"))) || ((data.executionReleasedAt === undefined) && (missing0 = "executionReleasedAt"))){
validate56.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.id !== undefined){
let data0 = data.id;
const _errs1 = errors;
if(errors === _errs1){
if(typeof data0 === "string"){
if(!pattern67.test(data0)){
validate56.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate56.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate56.errors = [{instancePath:instancePath+"/mode",schemaPath:"#/properties/mode/enum",keyword:"enum",params:{allowedValues: schema69.properties.mode.enum},message:"must be equal to one of the allowed values"}];
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
validate56.errors = [{instancePath:instancePath+"/requestLimit",schemaPath:"#/properties/requestLimit/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs4){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 100 || isNaN(data2)){
validate56.errors = [{instancePath:instancePath+"/requestLimit",schemaPath:"#/properties/requestLimit/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100},message:"must be <= 100"}];
return false;
}
else {
if(data2 < 1 || isNaN(data2)){
validate56.errors = [{instancePath:instancePath+"/requestLimit",schemaPath:"#/properties/requestLimit/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate56.errors = [{instancePath:instancePath+"/requestSequence",schemaPath:"#/properties/requestSequence/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 100 || isNaN(data3)){
validate56.errors = [{instancePath:instancePath+"/requestSequence",schemaPath:"#/properties/requestSequence/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100},message:"must be <= 100"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate56.errors = [{instancePath:instancePath+"/requestSequence",schemaPath:"#/properties/requestSequence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate56.errors = [{instancePath:instancePath+"/handshakeStatus",schemaPath:"#/properties/handshakeStatus/enum",keyword:"enum",params:{allowedValues: schema69.properties.handshakeStatus.enum},message:"must be equal to one of the allowed values"}];
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
validate56.errors = vErrors;
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
if(valid0){
if(data.thinkingModelSupport !== undefined){
let data6 = data.thinkingModelSupport;
const _errs15 = errors;
const _errs16 = errors;
let valid2 = false;
const _errs17 = errors;
if(typeof data6 !== "boolean"){
const err5 = {instancePath:instancePath+"/thinkingModelSupport",schemaPath:"#/properties/thinkingModelSupport/anyOf/0/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
var _valid1 = _errs17 === errors;
valid2 = valid2 || _valid1;
if(!valid2){
const _errs19 = errors;
if(data6 !== null){
const err6 = {instancePath:instancePath+"/thinkingModelSupport",schemaPath:"#/properties/thinkingModelSupport/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
var _valid1 = _errs19 === errors;
valid2 = valid2 || _valid1;
}
if(!valid2){
const err7 = {instancePath:instancePath+"/thinkingModelSupport",schemaPath:"#/properties/thinkingModelSupport/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
validate56.errors = vErrors;
return false;
}
else {
errors = _errs16;
if(vErrors !== null){
if(_errs16){
vErrors.length = _errs16;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs15 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.connector !== undefined){
let data7 = data.connector;
const _errs21 = errors;
const _errs22 = errors;
const _errs24 = errors;
const _errs25 = errors;
let valid5 = true;
const _errs26 = errors;
if(data7 && typeof data7 == "object" && !Array.isArray(data7)){
let missing1;
if((data7.id === undefined) && (missing1 = "id")){
const err8 = {};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
else {
if(data7.id !== undefined){
if("deepseek-v1" !== data7.id){
const err9 = {};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
}
}
var _valid2 = _errs26 === errors;
errors = _errs25;
if(vErrors !== null){
if(_errs25){
vErrors.length = _errs25;
}
else {
vErrors = null;
}
}
if(_valid2){
const _errs28 = errors;
if(data7 && typeof data7 == "object" && !Array.isArray(data7)){
if(data7.id !== undefined){
const _errs29 = errors;
if("deepseek-v1" !== data7.id){
validate56.errors = [{instancePath:instancePath+"/connector/id",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/id/const",keyword:"const",params:{allowedValue: "deepseek-v1"},message:"must be equal to constant"}];
return false;
}
var valid7 = _errs29 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data7.version !== undefined){
const _errs30 = errors;
if(1 !== data7.version){
validate56.errors = [{instancePath:instancePath+"/connector/version",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid7 = _errs30 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data7.authentication !== undefined){
const _errs31 = errors;
if("bearer" !== data7.authentication){
validate56.errors = [{instancePath:instancePath+"/connector/authentication",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/authentication/const",keyword:"const",params:{allowedValue: "bearer"},message:"must be equal to constant"}];
return false;
}
var valid7 = _errs31 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data7.outputTokenParameter !== undefined){
const _errs32 = errors;
if("max_tokens" !== data7.outputTokenParameter){
validate56.errors = [{instancePath:instancePath+"/connector/outputTokenParameter",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/outputTokenParameter/const",keyword:"const",params:{allowedValue: "max_tokens"},message:"must be equal to constant"}];
return false;
}
var valid7 = _errs32 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data7.streamingUsage !== undefined){
const _errs33 = errors;
if("include_usage" !== data7.streamingUsage){
validate56.errors = [{instancePath:instancePath+"/connector/streamingUsage",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/streamingUsage/const",keyword:"const",params:{allowedValue: "include_usage"},message:"must be equal to constant"}];
return false;
}
var valid7 = _errs33 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data7.thinking !== undefined){
const _errs34 = errors;
if("type" !== data7.thinking){
validate56.errors = [{instancePath:instancePath+"/connector/thinking",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/thinking/const",keyword:"const",params:{allowedValue: "type"},message:"must be equal to constant"}];
return false;
}
var valid7 = _errs34 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data7.reasoningHistory !== undefined){
const _errs35 = errors;
if(true !== data7.reasoningHistory){
validate56.errors = [{instancePath:instancePath+"/connector/reasoningHistory",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/reasoningHistory/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
return false;
}
var valid7 = _errs35 === errors;
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
var _valid2 = _errs28 === errors;
valid5 = _valid2;
}
if(!valid5){
const err10 = {instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
validate56.errors = vErrors;
return false;
}
var valid4 = _errs24 === errors;
if(valid4){
const _errs36 = errors;
const _errs37 = errors;
let valid8 = true;
const _errs38 = errors;
if(data7 && typeof data7 == "object" && !Array.isArray(data7)){
let missing2;
if((data7.id === undefined) && (missing2 = "id")){
const err11 = {};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
else {
if(data7.id !== undefined){
if("mimo-v1" !== data7.id){
const err12 = {};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
}
}
var _valid3 = _errs38 === errors;
errors = _errs37;
if(vErrors !== null){
if(_errs37){
vErrors.length = _errs37;
}
else {
vErrors = null;
}
}
if(_valid3){
const _errs40 = errors;
if(data7 && typeof data7 == "object" && !Array.isArray(data7)){
if(data7.id !== undefined){
const _errs41 = errors;
if("mimo-v1" !== data7.id){
validate56.errors = [{instancePath:instancePath+"/connector/id",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/id/const",keyword:"const",params:{allowedValue: "mimo-v1"},message:"must be equal to constant"}];
return false;
}
var valid10 = _errs41 === errors;
}
else {
var valid10 = true;
}
if(valid10){
if(data7.version !== undefined){
const _errs42 = errors;
if(1 !== data7.version){
validate56.errors = [{instancePath:instancePath+"/connector/version",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid10 = _errs42 === errors;
}
else {
var valid10 = true;
}
if(valid10){
if(data7.authentication !== undefined){
const _errs43 = errors;
if("api_key" !== data7.authentication){
validate56.errors = [{instancePath:instancePath+"/connector/authentication",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/authentication/const",keyword:"const",params:{allowedValue: "api_key"},message:"must be equal to constant"}];
return false;
}
var valid10 = _errs43 === errors;
}
else {
var valid10 = true;
}
if(valid10){
if(data7.outputTokenParameter !== undefined){
const _errs44 = errors;
if("max_completion_tokens" !== data7.outputTokenParameter){
validate56.errors = [{instancePath:instancePath+"/connector/outputTokenParameter",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/outputTokenParameter/const",keyword:"const",params:{allowedValue: "max_completion_tokens"},message:"must be equal to constant"}];
return false;
}
var valid10 = _errs44 === errors;
}
else {
var valid10 = true;
}
if(valid10){
if(data7.streamingUsage !== undefined){
const _errs45 = errors;
if("include_usage" !== data7.streamingUsage){
validate56.errors = [{instancePath:instancePath+"/connector/streamingUsage",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/streamingUsage/const",keyword:"const",params:{allowedValue: "include_usage"},message:"must be equal to constant"}];
return false;
}
var valid10 = _errs45 === errors;
}
else {
var valid10 = true;
}
if(valid10){
if(data7.thinking !== undefined){
const _errs46 = errors;
if("type" !== data7.thinking){
validate56.errors = [{instancePath:instancePath+"/connector/thinking",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/thinking/const",keyword:"const",params:{allowedValue: "type"},message:"must be equal to constant"}];
return false;
}
var valid10 = _errs46 === errors;
}
else {
var valid10 = true;
}
if(valid10){
if(data7.reasoningHistory !== undefined){
const _errs47 = errors;
if(true !== data7.reasoningHistory){
validate56.errors = [{instancePath:instancePath+"/connector/reasoningHistory",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/reasoningHistory/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
return false;
}
var valid10 = _errs47 === errors;
}
else {
var valid10 = true;
}
}
}
}
}
}
}
}
var _valid3 = _errs40 === errors;
valid8 = _valid3;
}
if(!valid8){
const err13 = {instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
validate56.errors = vErrors;
return false;
}
var valid4 = _errs36 === errors;
}
if(errors === _errs22){
if(data7 && typeof data7 == "object" && !Array.isArray(data7)){
let missing3;
if((((((((data7.id === undefined) && (missing3 = "id")) || ((data7.version === undefined) && (missing3 = "version"))) || ((data7.authentication === undefined) && (missing3 = "authentication"))) || ((data7.outputTokenParameter === undefined) && (missing3 = "outputTokenParameter"))) || ((data7.streamingUsage === undefined) && (missing3 = "streamingUsage"))) || ((data7.thinking === undefined) && (missing3 = "thinking"))) || ((data7.reasoningHistory === undefined) && (missing3 = "reasoningHistory"))){
validate56.errors = [{instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"}];
return false;
}
else {
const _errs48 = errors;
for(const key0 in data7){
if(!(((((((key0 === "id") || (key0 === "version")) || (key0 === "authentication")) || (key0 === "outputTokenParameter")) || (key0 === "streamingUsage")) || (key0 === "thinking")) || (key0 === "reasoningHistory"))){
validate56.errors = [{instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs48 === errors){
if(data7.id !== undefined){
let data24 = data7.id;
const _errs49 = errors;
if(!(((data24 === "openai-compatible-v1") || (data24 === "deepseek-v1")) || (data24 === "mimo-v1"))){
validate56.errors = [{instancePath:instancePath+"/connector/id",schemaPath:"#/$defs/ConnectorDescriptor/properties/id/enum",keyword:"enum",params:{allowedValues: schema27.properties.id.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid11 = _errs49 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data7.version !== undefined){
const _errs50 = errors;
if(1 !== data7.version){
validate56.errors = [{instancePath:instancePath+"/connector/version",schemaPath:"#/$defs/ConnectorDescriptor/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid11 = _errs50 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data7.authentication !== undefined){
let data26 = data7.authentication;
const _errs51 = errors;
if(!((((data26 === "bearer") || (data26 === "api_key")) || (data26 === "x_api_key")) || (data26 === "none"))){
validate56.errors = [{instancePath:instancePath+"/connector/authentication",schemaPath:"#/$defs/ConnectorDescriptor/properties/authentication/enum",keyword:"enum",params:{allowedValues: schema27.properties.authentication.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid11 = _errs51 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data7.outputTokenParameter !== undefined){
let data27 = data7.outputTokenParameter;
const _errs52 = errors;
if(!((data27 === "max_tokens") || (data27 === "max_completion_tokens"))){
validate56.errors = [{instancePath:instancePath+"/connector/outputTokenParameter",schemaPath:"#/$defs/ConnectorDescriptor/properties/outputTokenParameter/enum",keyword:"enum",params:{allowedValues: schema27.properties.outputTokenParameter.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid11 = _errs52 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data7.streamingUsage !== undefined){
let data28 = data7.streamingUsage;
const _errs53 = errors;
if(!((data28 === "include_usage") || (data28 === "native"))){
validate56.errors = [{instancePath:instancePath+"/connector/streamingUsage",schemaPath:"#/$defs/ConnectorDescriptor/properties/streamingUsage/enum",keyword:"enum",params:{allowedValues: schema27.properties.streamingUsage.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid11 = _errs53 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data7.thinking !== undefined){
let data29 = data7.thinking;
const _errs54 = errors;
if(!(((data29 === "none") || (data29 === "type")) || (data29 === "reasoning_effort"))){
validate56.errors = [{instancePath:instancePath+"/connector/thinking",schemaPath:"#/$defs/ConnectorDescriptor/properties/thinking/enum",keyword:"enum",params:{allowedValues: schema27.properties.thinking.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid11 = _errs54 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data7.reasoningHistory !== undefined){
const _errs55 = errors;
if(typeof data7.reasoningHistory !== "boolean"){
validate56.errors = [{instancePath:instancePath+"/connector/reasoningHistory",schemaPath:"#/$defs/ConnectorDescriptor/properties/reasoningHistory/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid11 = _errs55 === errors;
}
else {
var valid11 = true;
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
validate56.errors = [{instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs21 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.connectorProtocol !== undefined){
let data31 = data.connectorProtocol;
const _errs57 = errors;
if(!(((data31 === "pi_native_v1") || (data31 === "pi_native_v2")) || (data31 === "pi_native_v3"))){
validate56.errors = [{instancePath:instancePath+"/connectorProtocol",schemaPath:"#/properties/connectorProtocol/enum",keyword:"enum",params:{allowedValues: schema69.properties.connectorProtocol.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs57 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.messageFormat !== undefined){
const _errs58 = errors;
if("pi_context_v1" !== data.messageFormat){
validate56.errors = [{instancePath:instancePath+"/messageFormat",schemaPath:"#/properties/messageFormat/const",keyword:"const",params:{allowedValue: "pi_context_v1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs58 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.provider !== undefined){
let data33 = data.provider;
const _errs59 = errors;
if(errors === _errs59){
if(typeof data33 === "string"){
if(func2(data33) > 256){
validate56.errors = [{instancePath:instancePath+"/provider",schemaPath:"#/properties/provider/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate56.errors = [{instancePath:instancePath+"/provider",schemaPath:"#/properties/provider/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs59 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.api !== undefined){
let data34 = data.api;
const _errs61 = errors;
if(errors === _errs61){
if(typeof data34 === "string"){
if(func2(data34) > 256){
validate56.errors = [{instancePath:instancePath+"/api",schemaPath:"#/properties/api/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate56.errors = [{instancePath:instancePath+"/api",schemaPath:"#/properties/api/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs61 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.price !== undefined){
let data35 = data.price;
const _errs63 = errors;
if(!(data35 && typeof data35 == "object" && !Array.isArray(data35))){
validate56.errors = [{instancePath:instancePath+"/price",schemaPath:"#/properties/price/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
var valid0 = _errs63 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.priceVersion !== undefined){
let data36 = data.priceVersion;
const _errs65 = errors;
if(errors === _errs65){
if(typeof data36 === "string"){
if(func2(data36) > 64){
validate56.errors = [{instancePath:instancePath+"/priceVersion",schemaPath:"#/properties/priceVersion/maxLength",keyword:"maxLength",params:{limit: 64},message:"must NOT have more than 64 characters"}];
return false;
}
}
else {
validate56.errors = [{instancePath:instancePath+"/priceVersion",schemaPath:"#/properties/priceVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs65 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.endpoint !== undefined){
let data37 = data.endpoint;
const _errs67 = errors;
if(errors === _errs67){
if(typeof data37 === "string"){
if(func2(data37) > 2048){
validate56.errors = [{instancePath:instancePath+"/endpoint",schemaPath:"#/properties/endpoint/maxLength",keyword:"maxLength",params:{limit: 2048},message:"must NOT have more than 2048 characters"}];
return false;
}
}
else {
validate56.errors = [{instancePath:instancePath+"/endpoint",schemaPath:"#/properties/endpoint/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs67 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.tariffId !== undefined){
let data38 = data.tariffId;
const _errs69 = errors;
if(errors === _errs69){
if(typeof data38 === "string"){
if(!pattern67.test(data38)){
validate56.errors = [{instancePath:instancePath+"/tariffId",schemaPath:"#/properties/tariffId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate56.errors = [{instancePath:instancePath+"/tariffId",schemaPath:"#/properties/tariffId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs69 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nativeQualified !== undefined){
const _errs71 = errors;
if(typeof data.nativeQualified !== "boolean"){
validate56.errors = [{instancePath:instancePath+"/nativeQualified",schemaPath:"#/properties/nativeQualified/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs71 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nativeRevision !== undefined){
let data40 = data.nativeRevision;
const _errs73 = errors;
if(!(((typeof data40 == "number") && (!(data40 % 1) && !isNaN(data40))) && (isFinite(data40)))){
validate56.errors = [{instancePath:instancePath+"/nativeRevision",schemaPath:"#/properties/nativeRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs73){
if((typeof data40 == "number") && (isFinite(data40))){
if(data40 > 9007199254740991 || isNaN(data40)){
validate56.errors = [{instancePath:instancePath+"/nativeRevision",schemaPath:"#/properties/nativeRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data40 < 0 || isNaN(data40)){
validate56.errors = [{instancePath:instancePath+"/nativeRevision",schemaPath:"#/properties/nativeRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs73 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.configurationDigest !== undefined){
let data41 = data.configurationDigest;
const _errs75 = errors;
if(errors === _errs75){
if(typeof data41 === "string"){
if(!pattern115.test(data41)){
validate56.errors = [{instancePath:instancePath+"/configurationDigest",schemaPath:"#/properties/configurationDigest/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""}];
return false;
}
}
else {
validate56.errors = [{instancePath:instancePath+"/configurationDigest",schemaPath:"#/properties/configurationDigest/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs75 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.executionState !== undefined){
let data42 = data.executionState;
const _errs77 = errors;
if(!(((((data42 === "preparing") || (data42 === "active")) || (data42 === "paused")) || (data42 === "stopping")) || (data42 === "stopped"))){
validate56.errors = [{instancePath:instancePath+"/executionState",schemaPath:"#/properties/executionState/enum",keyword:"enum",params:{allowedValues: schema69.properties.executionState.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs77 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.cleanupState !== undefined){
let data43 = data.cleanupState;
const _errs78 = errors;
if(!(((data43 === "pending") || (data43 === "succeeded")) || (data43 === "failed"))){
validate56.errors = [{instancePath:instancePath+"/cleanupState",schemaPath:"#/properties/cleanupState/enum",keyword:"enum",params:{allowedValues: schema69.properties.cleanupState.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs78 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.accountingState !== undefined){
let data44 = data.accountingState;
const _errs79 = errors;
if(!(((data44 === "open") || (data44 === "pending_reconciliation")) || (data44 === "settled"))){
validate56.errors = [{instancePath:instancePath+"/accountingState",schemaPath:"#/properties/accountingState/enum",keyword:"enum",params:{allowedValues: schema69.properties.accountingState.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs79 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.stopReason !== undefined){
let data45 = data.stopReason;
const _errs80 = errors;
if(errors === _errs80){
if(typeof data45 === "string"){
if(func2(data45) > 120){
validate56.errors = [{instancePath:instancePath+"/stopReason",schemaPath:"#/properties/stopReason/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
}
else {
validate56.errors = [{instancePath:instancePath+"/stopReason",schemaPath:"#/properties/stopReason/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs80 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.statusAsOf !== undefined){
let data46 = data.statusAsOf;
const _errs82 = errors;
if(!(((typeof data46 == "number") && (!(data46 % 1) && !isNaN(data46))) && (isFinite(data46)))){
validate56.errors = [{instancePath:instancePath+"/statusAsOf",schemaPath:"#/properties/statusAsOf/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs82){
if((typeof data46 == "number") && (isFinite(data46))){
if(data46 > 9007199254740991 || isNaN(data46)){
validate56.errors = [{instancePath:instancePath+"/statusAsOf",schemaPath:"#/properties/statusAsOf/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data46 < 0 || isNaN(data46)){
validate56.errors = [{instancePath:instancePath+"/statusAsOf",schemaPath:"#/properties/statusAsOf/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs82 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.modelSettings !== undefined){
let data47 = data.modelSettings;
const _errs84 = errors;
const _errs85 = errors;
if(errors === _errs85){
if(data47 && typeof data47 == "object" && !Array.isArray(data47)){
let missing4;
if((data47.reasoning === undefined) && (missing4 = "reasoning")){
validate56.errors = [{instancePath:instancePath+"/modelSettings",schemaPath:"#/$defs/ModelSettings/required",keyword:"required",params:{missingProperty: missing4},message:"must have required property '"+missing4+"'"}];
return false;
}
else {
const _errs87 = errors;
for(const key1 in data47){
if(!(key1 === "reasoning")){
validate56.errors = [{instancePath:instancePath+"/modelSettings",schemaPath:"#/$defs/ModelSettings/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs87 === errors){
if(data47.reasoning !== undefined){
let data48 = data47.reasoning;
if(!(((((((data48 === "off") || (data48 === "minimal")) || (data48 === "low")) || (data48 === "medium")) || (data48 === "high")) || (data48 === "xhigh")) || (data48 === "max"))){
validate56.errors = [{instancePath:instancePath+"/modelSettings/reasoning",schemaPath:"#/$defs/ModelSettings/properties/reasoning/enum",keyword:"enum",params:{allowedValues: schema63.properties.reasoning.enum},message:"must be equal to one of the allowed values"}];
return false;
}
}
}
}
}
else {
validate56.errors = [{instancePath:instancePath+"/modelSettings",schemaPath:"#/$defs/ModelSettings/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs84 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.defaultSettings !== undefined){
let data49 = data.defaultSettings;
const _errs89 = errors;
const _errs90 = errors;
if(errors === _errs90){
if(data49 && typeof data49 == "object" && !Array.isArray(data49)){
let missing5;
if((data49.reasoning === undefined) && (missing5 = "reasoning")){
validate56.errors = [{instancePath:instancePath+"/defaultSettings",schemaPath:"#/$defs/ModelSettings/required",keyword:"required",params:{missingProperty: missing5},message:"must have required property '"+missing5+"'"}];
return false;
}
else {
const _errs92 = errors;
for(const key2 in data49){
if(!(key2 === "reasoning")){
validate56.errors = [{instancePath:instancePath+"/defaultSettings",schemaPath:"#/$defs/ModelSettings/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs92 === errors){
if(data49.reasoning !== undefined){
let data50 = data49.reasoning;
if(!(((((((data50 === "off") || (data50 === "minimal")) || (data50 === "low")) || (data50 === "medium")) || (data50 === "high")) || (data50 === "xhigh")) || (data50 === "max"))){
validate56.errors = [{instancePath:instancePath+"/defaultSettings/reasoning",schemaPath:"#/$defs/ModelSettings/properties/reasoning/enum",keyword:"enum",params:{allowedValues: schema63.properties.reasoning.enum},message:"must be equal to one of the allowed values"}];
return false;
}
}
}
}
}
else {
validate56.errors = [{instancePath:instancePath+"/defaultSettings",schemaPath:"#/$defs/ModelSettings/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs89 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.supportedSettings !== undefined){
let data51 = data.supportedSettings;
const _errs94 = errors;
if(errors === _errs94){
if(data51 && typeof data51 == "object" && !Array.isArray(data51)){
let missing6;
if((data51.reasoning === undefined) && (missing6 = "reasoning")){
validate56.errors = [{instancePath:instancePath+"/supportedSettings",schemaPath:"#/properties/supportedSettings/required",keyword:"required",params:{missingProperty: missing6},message:"must have required property '"+missing6+"'"}];
return false;
}
else {
const _errs96 = errors;
for(const key3 in data51){
if(!(key3 === "reasoning")){
validate56.errors = [{instancePath:instancePath+"/supportedSettings",schemaPath:"#/properties/supportedSettings/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs96 === errors){
if(data51.reasoning !== undefined){
let data52 = data51.reasoning;
const _errs97 = errors;
if(errors === _errs97){
if(Array.isArray(data52)){
if(data52.length > 7){
validate56.errors = [{instancePath:instancePath+"/supportedSettings/reasoning",schemaPath:"#/properties/supportedSettings/properties/reasoning/maxItems",keyword:"maxItems",params:{limit: 7},message:"must NOT have more than 7 items"}];
return false;
}
else {
if(data52.length < 1){
validate56.errors = [{instancePath:instancePath+"/supportedSettings/reasoning",schemaPath:"#/properties/supportedSettings/properties/reasoning/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid17 = true;
const len0 = data52.length;
for(let i0=0; i0<len0; i0++){
let data53 = data52[i0];
const _errs99 = errors;
if(!(((((((data53 === "off") || (data53 === "minimal")) || (data53 === "low")) || (data53 === "medium")) || (data53 === "high")) || (data53 === "xhigh")) || (data53 === "max"))){
validate56.errors = [{instancePath:instancePath+"/supportedSettings/reasoning/" + i0,schemaPath:"#/properties/supportedSettings/properties/reasoning/items/enum",keyword:"enum",params:{allowedValues: schema69.properties.supportedSettings.properties.reasoning.items.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid17 = _errs99 === errors;
if(!valid17){
break;
}
}
if(valid17){
let i1 = data52.length;
let j0;
if(i1 > 1){
outer0:
for(;i1--;){
for(j0 = i1; j0--;){
if(func0(data52[i1], data52[j0])){
validate56.errors = [{instancePath:instancePath+"/supportedSettings/reasoning",schemaPath:"#/properties/supportedSettings/properties/reasoning/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"}];
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
validate56.errors = [{instancePath:instancePath+"/supportedSettings/reasoning",schemaPath:"#/properties/supportedSettings/properties/reasoning/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
}
}
}
}
else {
validate56.errors = [{instancePath:instancePath+"/supportedSettings",schemaPath:"#/properties/supportedSettings/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs94 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nativeLimits !== undefined){
let data54 = data.nativeLimits;
const _errs100 = errors;
if(errors === _errs100){
if(data54 && typeof data54 == "object" && !Array.isArray(data54)){
let missing7;
if(((data54.contextWindowTokens === undefined) && (missing7 = "contextWindowTokens")) || ((data54.maxOutputTokens === undefined) && (missing7 = "maxOutputTokens"))){
validate56.errors = [{instancePath:instancePath+"/nativeLimits",schemaPath:"#/properties/nativeLimits/required",keyword:"required",params:{missingProperty: missing7},message:"must have required property '"+missing7+"'"}];
return false;
}
else {
const _errs102 = errors;
for(const key4 in data54){
if(!((key4 === "contextWindowTokens") || (key4 === "maxOutputTokens"))){
validate56.errors = [{instancePath:instancePath+"/nativeLimits",schemaPath:"#/properties/nativeLimits/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs102 === errors){
if(data54.contextWindowTokens !== undefined){
let data55 = data54.contextWindowTokens;
const _errs103 = errors;
if(!(((typeof data55 == "number") && (!(data55 % 1) && !isNaN(data55))) && (isFinite(data55)))){
validate56.errors = [{instancePath:instancePath+"/nativeLimits/contextWindowTokens",schemaPath:"#/properties/nativeLimits/properties/contextWindowTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs103){
if((typeof data55 == "number") && (isFinite(data55))){
if(data55 > 9007199254740991 || isNaN(data55)){
validate56.errors = [{instancePath:instancePath+"/nativeLimits/contextWindowTokens",schemaPath:"#/properties/nativeLimits/properties/contextWindowTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data55 < 1 || isNaN(data55)){
validate56.errors = [{instancePath:instancePath+"/nativeLimits/contextWindowTokens",schemaPath:"#/properties/nativeLimits/properties/contextWindowTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid19 = _errs103 === errors;
}
else {
var valid19 = true;
}
if(valid19){
if(data54.maxOutputTokens !== undefined){
let data56 = data54.maxOutputTokens;
const _errs105 = errors;
if(!(((typeof data56 == "number") && (!(data56 % 1) && !isNaN(data56))) && (isFinite(data56)))){
validate56.errors = [{instancePath:instancePath+"/nativeLimits/maxOutputTokens",schemaPath:"#/properties/nativeLimits/properties/maxOutputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs105){
if((typeof data56 == "number") && (isFinite(data56))){
if(data56 > 9007199254740991 || isNaN(data56)){
validate56.errors = [{instancePath:instancePath+"/nativeLimits/maxOutputTokens",schemaPath:"#/properties/nativeLimits/properties/maxOutputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data56 < 1 || isNaN(data56)){
validate56.errors = [{instancePath:instancePath+"/nativeLimits/maxOutputTokens",schemaPath:"#/properties/nativeLimits/properties/maxOutputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
return false;
}
}
}
}
var valid19 = _errs105 === errors;
}
else {
var valid19 = true;
}
}
}
}
}
else {
validate56.errors = [{instancePath:instancePath+"/nativeLimits",schemaPath:"#/properties/nativeLimits/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs100 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.adapter !== undefined){
let data57 = data.adapter;
const _errs107 = errors;
if(!(data57 && typeof data57 == "object" && !Array.isArray(data57))){
validate56.errors = [{instancePath:instancePath+"/adapter",schemaPath:"#/properties/adapter/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
var valid0 = _errs107 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.authentication !== undefined){
let data58 = data.authentication;
const _errs109 = errors;
if(errors === _errs109){
if(typeof data58 === "string"){
if(func2(data58) > 120){
validate56.errors = [{instancePath:instancePath+"/authentication",schemaPath:"#/properties/authentication/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
}
else {
validate56.errors = [{instancePath:instancePath+"/authentication",schemaPath:"#/properties/authentication/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs109 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.compat !== undefined){
let data59 = data.compat;
const _errs111 = errors;
if(!(data59 && typeof data59 == "object" && !Array.isArray(data59))){
validate56.errors = [{instancePath:instancePath+"/compat",schemaPath:"#/properties/compat/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
var valid0 = _errs111 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.metadataProvenance !== undefined){
let data60 = data.metadataProvenance;
const _errs113 = errors;
if(!(data60 && typeof data60 == "object" && !Array.isArray(data60))){
validate56.errors = [{instancePath:instancePath+"/metadataProvenance",schemaPath:"#/properties/metadataProvenance/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
var valid0 = _errs113 === errors;
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

export const MarketplaceRoles = validate57;
const schema73 = {"type":"array","minItems":1,"maxItems":2,"uniqueItems":true,"items":{"enum":["marketplace:buyer","marketplace:provider"]}};

function validate57(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(Array.isArray(data)){
if(data.length > 2){
validate57.errors = [{instancePath,schemaPath:"#/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"}];
return false;
}
else {
if(data.length < 1){
validate57.errors = [{instancePath,schemaPath:"#/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid0 = true;
const len0 = data.length;
for(let i0=0; i0<len0; i0++){
let data0 = data[i0];
const _errs1 = errors;
if(!((data0 === "marketplace:buyer") || (data0 === "marketplace:provider"))){
validate57.errors = [{instancePath:instancePath+"/" + i0,schemaPath:"#/items/enum",keyword:"enum",params:{allowedValues: schema73.items.enum},message:"must be equal to one of the allowed values"}];
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
validate57.errors = [{instancePath,schemaPath:"#/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"}];
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
validate57.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
validate57.errors = vErrors;
return errors === 0;
}

export const MarketplaceNetworkConfig = validate58;
const schema74 = {"type":"object","additionalProperties":false,"properties":{"protocol":{"const":"2.0.0"},"product":{"const":"adr-v2"},"settlement":{"const":"test_credits"},"cashValue":{"const":false},"admissions":{"type":"boolean"},"privateOwnerEvaluation":{"type":"boolean"},"privateRehearsal":{"type":"boolean"},"supplyClasses":{"type":"array","minItems":2,"maxItems":2,"uniqueItems":true,"items":{"$ref":"#/$defs/SupplyClass"}},"connectorProfile":{"$ref":"#/$defs/ConnectorProfile"},"maxNodeSessions":{"const":1},"relay":{"enum":["not_enabled","wss_single_instance"]},"agentExecution":{"const":"buyer_vm_v1"},"capabilities":{"type":"array","uniqueItems":true,"items":{"enum":["allowance_v1","provider_budget_v1","cold_activation_v1","private_owner_evaluation_v1","private_rehearsal_v1","session_handshake_v1","coding_v1","pi_native_v1","pi_native_v2","pi_native_v3"]}},"activationDeadlineSeconds":{"const":120},"codingLimits":{"type":"object","additionalProperties":false,"properties":{"durationSeconds":{"const":3600},"requestLimit":{"const":100}},"required":["durationSeconds","requestLimit"]}},"required":["protocol","product","settlement","cashValue","admissions","privateOwnerEvaluation","privateRehearsal","supplyClasses","connectorProfile","maxNodeSessions","relay","agentExecution","capabilities","activationDeadlineSeconds"]};

function validate58(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((((((((((data.protocol === undefined) && (missing0 = "protocol")) || ((data.product === undefined) && (missing0 = "product"))) || ((data.settlement === undefined) && (missing0 = "settlement"))) || ((data.cashValue === undefined) && (missing0 = "cashValue"))) || ((data.admissions === undefined) && (missing0 = "admissions"))) || ((data.privateOwnerEvaluation === undefined) && (missing0 = "privateOwnerEvaluation"))) || ((data.privateRehearsal === undefined) && (missing0 = "privateRehearsal"))) || ((data.supplyClasses === undefined) && (missing0 = "supplyClasses"))) || ((data.connectorProfile === undefined) && (missing0 = "connectorProfile"))) || ((data.maxNodeSessions === undefined) && (missing0 = "maxNodeSessions"))) || ((data.relay === undefined) && (missing0 = "relay"))) || ((data.agentExecution === undefined) && (missing0 = "agentExecution"))) || ((data.capabilities === undefined) && (missing0 = "capabilities"))) || ((data.activationDeadlineSeconds === undefined) && (missing0 = "activationDeadlineSeconds"))){
validate58.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema74.properties, key0))){
validate58.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.protocol !== undefined){
const _errs2 = errors;
if("2.0.0" !== data.protocol){
validate58.errors = [{instancePath:instancePath+"/protocol",schemaPath:"#/properties/protocol/const",keyword:"const",params:{allowedValue: "2.0.0"},message:"must be equal to constant"}];
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
validate58.errors = [{instancePath:instancePath+"/product",schemaPath:"#/properties/product/const",keyword:"const",params:{allowedValue: "adr-v2"},message:"must be equal to constant"}];
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
validate58.errors = [{instancePath:instancePath+"/settlement",schemaPath:"#/properties/settlement/const",keyword:"const",params:{allowedValue: "test_credits"},message:"must be equal to constant"}];
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
validate58.errors = [{instancePath:instancePath+"/cashValue",schemaPath:"#/properties/cashValue/const",keyword:"const",params:{allowedValue: false},message:"must be equal to constant"}];
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
validate58.errors = [{instancePath:instancePath+"/admissions",schemaPath:"#/properties/admissions/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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
validate58.errors = [{instancePath:instancePath+"/privateOwnerEvaluation",schemaPath:"#/properties/privateOwnerEvaluation/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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
validate58.errors = [{instancePath:instancePath+"/privateRehearsal",schemaPath:"#/properties/privateRehearsal/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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
validate58.errors = [{instancePath:instancePath+"/supplyClasses",schemaPath:"#/properties/supplyClasses/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"}];
return false;
}
else {
if(data7.length < 2){
validate58.errors = [{instancePath:instancePath+"/supplyClasses",schemaPath:"#/properties/supplyClasses/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"}];
return false;
}
else {
var valid1 = true;
const len0 = data7.length;
for(let i0=0; i0<len0; i0++){
let data8 = data7[i0];
const _errs14 = errors;
if(!((data8 === "authorized_api") || (data8 === "self_hosted"))){
validate58.errors = [{instancePath:instancePath+"/supplyClasses/" + i0,schemaPath:"#/$defs/SupplyClass/enum",keyword:"enum",params:{allowedValues: schema12.enum},message:"must be equal to one of the allowed values"}];
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
validate58.errors = [{instancePath:instancePath+"/supplyClasses",schemaPath:"#/properties/supplyClasses/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"}];
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
validate58.errors = [{instancePath:instancePath+"/supplyClasses",schemaPath:"#/properties/supplyClasses/type",keyword:"type",params:{type: "array"},message:"must be array"}];
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
validate58.errors = [{instancePath:instancePath+"/connectorProfile",schemaPath:"#/$defs/ConnectorProfile/const",keyword:"const",params:{allowedValue: "inference_connector_v1"},message:"must be equal to constant"}];
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
validate58.errors = [{instancePath:instancePath+"/maxNodeSessions",schemaPath:"#/properties/maxNodeSessions/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
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
validate58.errors = [{instancePath:instancePath+"/relay",schemaPath:"#/properties/relay/enum",keyword:"enum",params:{allowedValues: schema74.properties.relay.enum},message:"must be equal to one of the allowed values"}];
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
validate58.errors = [{instancePath:instancePath+"/agentExecution",schemaPath:"#/properties/agentExecution/const",keyword:"const",params:{allowedValue: "buyer_vm_v1"},message:"must be equal to constant"}];
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
if(!((((((((((data14 === "allowance_v1") || (data14 === "provider_budget_v1")) || (data14 === "cold_activation_v1")) || (data14 === "private_owner_evaluation_v1")) || (data14 === "private_rehearsal_v1")) || (data14 === "session_handshake_v1")) || (data14 === "coding_v1")) || (data14 === "pi_native_v1")) || (data14 === "pi_native_v2")) || (data14 === "pi_native_v3"))){
validate58.errors = [{instancePath:instancePath+"/capabilities/" + i2,schemaPath:"#/properties/capabilities/items/enum",keyword:"enum",params:{allowedValues: schema74.properties.capabilities.items.enum},message:"must be equal to one of the allowed values"}];
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
validate58.errors = [{instancePath:instancePath+"/capabilities",schemaPath:"#/properties/capabilities/uniqueItems",keyword:"uniqueItems",params:{i: i3, j: j1},message:"must NOT have duplicate items (items ## "+j1+" and "+i3+" are identical)"}];
return false;
break outer1;
}
}
}
}
}
}
else {
validate58.errors = [{instancePath:instancePath+"/capabilities",schemaPath:"#/properties/capabilities/type",keyword:"type",params:{type: "array"},message:"must be array"}];
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
validate58.errors = [{instancePath:instancePath+"/activationDeadlineSeconds",schemaPath:"#/properties/activationDeadlineSeconds/const",keyword:"const",params:{allowedValue: 120},message:"must be equal to constant"}];
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
validate58.errors = [{instancePath:instancePath+"/codingLimits",schemaPath:"#/properties/codingLimits/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs27 = errors;
for(const key1 in data16){
if(!((key1 === "durationSeconds") || (key1 === "requestLimit"))){
validate58.errors = [{instancePath:instancePath+"/codingLimits",schemaPath:"#/properties/codingLimits/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs27 === errors){
if(data16.durationSeconds !== undefined){
const _errs28 = errors;
if(3600 !== data16.durationSeconds){
validate58.errors = [{instancePath:instancePath+"/codingLimits/durationSeconds",schemaPath:"#/properties/codingLimits/properties/durationSeconds/const",keyword:"const",params:{allowedValue: 3600},message:"must be equal to constant"}];
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
validate58.errors = [{instancePath:instancePath+"/codingLimits/requestLimit",schemaPath:"#/properties/codingLimits/properties/requestLimit/const",keyword:"const",params:{allowedValue: 100},message:"must be equal to constant"}];
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
validate58.errors = [{instancePath:instancePath+"/codingLimits",schemaPath:"#/properties/codingLimits/type",keyword:"type",params:{type: "object"},message:"must be object"}];
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
validate58.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate58.errors = vErrors;
return errors === 0;
}

export const MarketplaceSessionReceipt = validate59;
const schema77 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"ownerId":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"sessionId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"evaluation":{"type":"boolean"},"listingId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"funded":{"type":"string","pattern":"^(0|[1-9][0-9]{0,8})$"},"charged":{"type":"string","pattern":"^(0|[1-9][0-9]{0,8})$"},"refunded":{"type":"string","pattern":"^(0|[1-9][0-9]{0,8})$"},"state":{"enum":["settled","refunded"]},"reason":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"at":{"type":"integer","minimum":0,"maximum":9007199254740991},"settlement":{"const":"test_credits"},"cashValue":{"const":false}},"required":["id","ownerId","sessionId","evaluation","listingId","funded","charged","refunded","state","reason","at","settlement","cashValue"]};

function validate59(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((((((((data.id === undefined) && (missing0 = "id")) || ((data.ownerId === undefined) && (missing0 = "ownerId"))) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.evaluation === undefined) && (missing0 = "evaluation"))) || ((data.listingId === undefined) && (missing0 = "listingId"))) || ((data.funded === undefined) && (missing0 = "funded"))) || ((data.charged === undefined) && (missing0 = "charged"))) || ((data.refunded === undefined) && (missing0 = "refunded"))) || ((data.state === undefined) && (missing0 = "state"))) || ((data.reason === undefined) && (missing0 = "reason"))) || ((data.at === undefined) && (missing0 = "at"))) || ((data.settlement === undefined) && (missing0 = "settlement"))) || ((data.cashValue === undefined) && (missing0 = "cashValue"))){
validate59.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema77.properties, key0))){
validate59.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate59.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate59.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate59.errors = [{instancePath:instancePath+"/ownerId",schemaPath:"#/properties/ownerId/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data1) < 1){
validate59.errors = [{instancePath:instancePath+"/ownerId",schemaPath:"#/properties/ownerId/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data1)){
validate59.errors = [{instancePath:instancePath+"/ownerId",schemaPath:"#/properties/ownerId/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate59.errors = [{instancePath:instancePath+"/ownerId",schemaPath:"#/properties/ownerId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate59.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate59.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate59.errors = [{instancePath:instancePath+"/evaluation",schemaPath:"#/properties/evaluation/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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
validate59.errors = [{instancePath:instancePath+"/listingId",schemaPath:"#/properties/listingId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate59.errors = [{instancePath:instancePath+"/listingId",schemaPath:"#/properties/listingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate59.errors = [{instancePath:instancePath+"/funded",schemaPath:"#/properties/funded/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,8})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,8})$"+"\""}];
return false;
}
}
else {
validate59.errors = [{instancePath:instancePath+"/funded",schemaPath:"#/properties/funded/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate59.errors = [{instancePath:instancePath+"/charged",schemaPath:"#/properties/charged/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,8})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,8})$"+"\""}];
return false;
}
}
else {
validate59.errors = [{instancePath:instancePath+"/charged",schemaPath:"#/properties/charged/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate59.errors = [{instancePath:instancePath+"/refunded",schemaPath:"#/properties/refunded/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,8})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,8})$"+"\""}];
return false;
}
}
else {
validate59.errors = [{instancePath:instancePath+"/refunded",schemaPath:"#/properties/refunded/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate59.errors = [{instancePath:instancePath+"/state",schemaPath:"#/properties/state/enum",keyword:"enum",params:{allowedValues: schema77.properties.state.enum},message:"must be equal to one of the allowed values"}];
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
validate59.errors = [{instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data9) < 1){
validate59.errors = [{instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data9)){
validate59.errors = [{instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate59.errors = [{instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate59.errors = [{instancePath:instancePath+"/at",schemaPath:"#/properties/at/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs21){
if((typeof data10 == "number") && (isFinite(data10))){
if(data10 > 9007199254740991 || isNaN(data10)){
validate59.errors = [{instancePath:instancePath+"/at",schemaPath:"#/properties/at/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data10 < 0 || isNaN(data10)){
validate59.errors = [{instancePath:instancePath+"/at",schemaPath:"#/properties/at/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate59.errors = [{instancePath:instancePath+"/settlement",schemaPath:"#/properties/settlement/const",keyword:"const",params:{allowedValue: "test_credits"},message:"must be equal to constant"}];
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
validate59.errors = [{instancePath:instancePath+"/cashValue",schemaPath:"#/properties/cashValue/const",keyword:"const",params:{allowedValue: false},message:"must be equal to constant"}];
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
validate59.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate59.errors = vErrors;
return errors === 0;
}

export const GuestApprovalRequest = validate60;
const schema78 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"guest_approval"},"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"sessionId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"action":{"enum":["write_file","delete_file","run_command","export_workspace"]},"digest":{"type":"string","pattern":"^[0-9a-f]{64}$"},"expiresUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991}},"required":["type","id","sessionId","action","digest","expiresUnixMs"]};
const pattern133 = new RegExp("^[0-9a-f]{64}$", "u");

function validate60(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.action === undefined) && (missing0 = "action"))) || ((data.digest === undefined) && (missing0 = "digest"))) || ((data.expiresUnixMs === undefined) && (missing0 = "expiresUnixMs"))){
validate60.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "type") || (key0 === "id")) || (key0 === "sessionId")) || (key0 === "action")) || (key0 === "digest")) || (key0 === "expiresUnixMs"))){
validate60.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("guest_approval" !== data.type){
validate60.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "guest_approval"},message:"must be equal to constant"}];
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
validate60.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate60.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate60.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate60.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate60.errors = [{instancePath:instancePath+"/action",schemaPath:"#/properties/action/enum",keyword:"enum",params:{allowedValues: schema78.properties.action.enum},message:"must be equal to one of the allowed values"}];
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
if(!pattern133.test(data4)){
validate60.errors = [{instancePath:instancePath+"/digest",schemaPath:"#/properties/digest/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""}];
return false;
}
}
else {
validate60.errors = [{instancePath:instancePath+"/digest",schemaPath:"#/properties/digest/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate60.errors = [{instancePath:instancePath+"/expiresUnixMs",schemaPath:"#/properties/expiresUnixMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs10){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 9007199254740991 || isNaN(data5)){
validate60.errors = [{instancePath:instancePath+"/expiresUnixMs",schemaPath:"#/properties/expiresUnixMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data5 < 1 || isNaN(data5)){
validate60.errors = [{instancePath:instancePath+"/expiresUnixMs",schemaPath:"#/properties/expiresUnixMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate60.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate60.errors = vErrors;
return errors === 0;
}

export const GuestApprovalDecision = validate61;
const schema79 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"guest_approval_decision"},"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"digest":{"type":"string","pattern":"^[0-9a-f]{64}$"},"allowOnce":{"type":"boolean"}},"required":["type","id","digest","allowOnce"]};

function validate61(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.type === undefined) && (missing0 = "type")) || ((data.id === undefined) && (missing0 = "id"))) || ((data.digest === undefined) && (missing0 = "digest"))) || ((data.allowOnce === undefined) && (missing0 = "allowOnce"))){
validate61.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "type") || (key0 === "id")) || (key0 === "digest")) || (key0 === "allowOnce"))){
validate61.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("guest_approval_decision" !== data.type){
validate61.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "guest_approval_decision"},message:"must be equal to constant"}];
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
validate61.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate61.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
if(!pattern133.test(data2)){
validate61.errors = [{instancePath:instancePath+"/digest",schemaPath:"#/properties/digest/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""}];
return false;
}
}
else {
validate61.errors = [{instancePath:instancePath+"/digest",schemaPath:"#/properties/digest/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate61.errors = [{instancePath:instancePath+"/allowOnce",schemaPath:"#/properties/allowOnce/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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
validate61.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate61.errors = vErrors;
return errors === 0;
}

export const CodingDelta = validate62;
const schema80 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"coding_delta"},"requestId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"sequence":{"type":"integer","minimum":1,"maximum":8192},"kind":{"enum":["text","thinking","tool"]},"text":{"type":"string","maxLength":8192},"index":{"type":"integer","minimum":0,"maximum":7},"id":{"type":"string","pattern":"^[A-Za-z0-9_|:./+=-]{1,2048}$"},"name":{"type":"string","pattern":"^[A-Za-z_][A-Za-z0-9_-]{0,63}$"}},"required":["type","requestId","sequence","kind","text"]};
const pattern137 = new RegExp("^[A-Za-z0-9_|:./+=-]{1,2048}$", "u");
const pattern138 = new RegExp("^[A-Za-z_][A-Za-z0-9_-]{0,63}$", "u");

function validate62(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.type === undefined) && (missing0 = "type")) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.sequence === undefined) && (missing0 = "sequence"))) || ((data.kind === undefined) && (missing0 = "kind"))) || ((data.text === undefined) && (missing0 = "text"))){
validate62.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((((key0 === "type") || (key0 === "requestId")) || (key0 === "sequence")) || (key0 === "kind")) || (key0 === "text")) || (key0 === "index")) || (key0 === "id")) || (key0 === "name"))){
validate62.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("coding_delta" !== data.type){
validate62.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "coding_delta"},message:"must be equal to constant"}];
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
validate62.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate62.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate62.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs5){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 8192 || isNaN(data2)){
validate62.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/maximum",keyword:"maximum",params:{comparison: "<=", limit: 8192},message:"must be <= 8192"}];
return false;
}
else {
if(data2 < 1 || isNaN(data2)){
validate62.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate62.errors = [{instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/enum",keyword:"enum",params:{allowedValues: schema80.properties.kind.enum},message:"must be equal to one of the allowed values"}];
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
validate62.errors = [{instancePath:instancePath+"/text",schemaPath:"#/properties/text/maxLength",keyword:"maxLength",params:{limit: 8192},message:"must NOT have more than 8192 characters"}];
return false;
}
}
else {
validate62.errors = [{instancePath:instancePath+"/text",schemaPath:"#/properties/text/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate62.errors = [{instancePath:instancePath+"/index",schemaPath:"#/properties/index/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs10){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 7 || isNaN(data5)){
validate62.errors = [{instancePath:instancePath+"/index",schemaPath:"#/properties/index/maximum",keyword:"maximum",params:{comparison: "<=", limit: 7},message:"must be <= 7"}];
return false;
}
else {
if(data5 < 0 || isNaN(data5)){
validate62.errors = [{instancePath:instancePath+"/index",schemaPath:"#/properties/index/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
if(!pattern137.test(data6)){
validate62.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z0-9_|:./+=-]{1,2048}$"},message:"must match pattern \""+"^[A-Za-z0-9_|:./+=-]{1,2048}$"+"\""}];
return false;
}
}
else {
validate62.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
if(!pattern138.test(data7)){
validate62.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z_][A-Za-z0-9_-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z_][A-Za-z0-9_-]{0,63}$"+"\""}];
return false;
}
}
else {
validate62.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate62.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate62.errors = vErrors;
return errors === 0;
}

export const CodingToolCall = validate63;
const schema81 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[A-Za-z0-9_|:./+=-]{1,2048}$"},"type":{"const":"function"},"function":{"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","pattern":"^[A-Za-z_][A-Za-z0-9_-]{0,63}$"},"arguments":{"type":"string","maxLength":65536}},"required":["name","arguments"]}},"required":["id","type","function"]};

function validate63(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.id === undefined) && (missing0 = "id")) || ((data.type === undefined) && (missing0 = "type"))) || ((data.function === undefined) && (missing0 = "function"))){
validate63.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "id") || (key0 === "type")) || (key0 === "function"))){
validate63.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
if(!pattern137.test(data0)){
validate63.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z0-9_|:./+=-]{1,2048}$"},message:"must match pattern \""+"^[A-Za-z0-9_|:./+=-]{1,2048}$"+"\""}];
return false;
}
}
else {
validate63.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate63.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "function"},message:"must be equal to constant"}];
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
validate63.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs7 = errors;
for(const key1 in data2){
if(!((key1 === "name") || (key1 === "arguments"))){
validate63.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
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
if(!pattern138.test(data3)){
validate63.errors = [{instancePath:instancePath+"/function/name",schemaPath:"#/properties/function/properties/name/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z_][A-Za-z0-9_-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z_][A-Za-z0-9_-]{0,63}$"+"\""}];
return false;
}
}
else {
validate63.errors = [{instancePath:instancePath+"/function/name",schemaPath:"#/properties/function/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate63.errors = [{instancePath:instancePath+"/function/arguments",schemaPath:"#/properties/function/properties/arguments/maxLength",keyword:"maxLength",params:{limit: 65536},message:"must NOT have more than 65536 characters"}];
return false;
}
}
else {
validate63.errors = [{instancePath:instancePath+"/function/arguments",schemaPath:"#/properties/function/properties/arguments/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate63.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/type",keyword:"type",params:{type: "object"},message:"must be object"}];
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
validate63.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate63.errors = vErrors;
return errors === 0;
}

export const CodingToolDefinition = validate64;
const schema82 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"function"},"function":{"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","pattern":"^[A-Za-z_][A-Za-z0-9_-]{0,63}$"},"description":{"type":"string","maxLength":8192},"parameters":{"type":"object"}},"required":["name","description","parameters"]}},"required":["type","function"]};

function validate64(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.type === undefined) && (missing0 = "type")) || ((data.function === undefined) && (missing0 = "function"))){
validate64.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "type") || (key0 === "function"))){
validate64.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("function" !== data.type){
validate64.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "function"},message:"must be equal to constant"}];
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
validate64.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs5 = errors;
for(const key1 in data1){
if(!(((key1 === "name") || (key1 === "description")) || (key1 === "parameters"))){
validate64.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
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
if(!pattern138.test(data2)){
validate64.errors = [{instancePath:instancePath+"/function/name",schemaPath:"#/properties/function/properties/name/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z_][A-Za-z0-9_-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z_][A-Za-z0-9_-]{0,63}$"+"\""}];
return false;
}
}
else {
validate64.errors = [{instancePath:instancePath+"/function/name",schemaPath:"#/properties/function/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate64.errors = [{instancePath:instancePath+"/function/description",schemaPath:"#/properties/function/properties/description/maxLength",keyword:"maxLength",params:{limit: 8192},message:"must NOT have more than 8192 characters"}];
return false;
}
}
else {
validate64.errors = [{instancePath:instancePath+"/function/description",schemaPath:"#/properties/function/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate64.errors = [{instancePath:instancePath+"/function/parameters",schemaPath:"#/properties/function/properties/parameters/type",keyword:"type",params:{type: "object"},message:"must be object"}];
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
validate64.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/type",keyword:"type",params:{type: "object"},message:"must be object"}];
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
validate64.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate64.errors = vErrors;
return errors === 0;
}

export const CodingMessage = validate65;
const schema83 = {"type":"object","additionalProperties":false,"properties":{"role":{"enum":["system","user","assistant","tool"]},"content":{"type":"string","maxLength":131072},"reasoning_content":{"type":"string","maxLength":131072},"tool_call_id":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"tool_calls":{"type":"array","maxItems":8,"items":{"$ref":"#/$defs/CodingToolCall"}}},"required":["role","content"]};

function validate65(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.role === undefined) && (missing0 = "role")) || ((data.content === undefined) && (missing0 = "content"))){
validate65.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "role") || (key0 === "content")) || (key0 === "reasoning_content")) || (key0 === "tool_call_id")) || (key0 === "tool_calls"))){
validate65.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.role !== undefined){
let data0 = data.role;
const _errs2 = errors;
if(!((((data0 === "system") || (data0 === "user")) || (data0 === "assistant")) || (data0 === "tool"))){
validate65.errors = [{instancePath:instancePath+"/role",schemaPath:"#/properties/role/enum",keyword:"enum",params:{allowedValues: schema83.properties.role.enum},message:"must be equal to one of the allowed values"}];
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
validate65.errors = [{instancePath:instancePath+"/content",schemaPath:"#/properties/content/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"}];
return false;
}
}
else {
validate65.errors = [{instancePath:instancePath+"/content",schemaPath:"#/properties/content/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate65.errors = [{instancePath:instancePath+"/reasoning_content",schemaPath:"#/properties/reasoning_content/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"}];
return false;
}
}
else {
validate65.errors = [{instancePath:instancePath+"/reasoning_content",schemaPath:"#/properties/reasoning_content/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate65.errors = [{instancePath:instancePath+"/tool_call_id",schemaPath:"#/properties/tool_call_id/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate65.errors = [{instancePath:instancePath+"/tool_call_id",schemaPath:"#/properties/tool_call_id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate65.errors = [{instancePath:instancePath+"/tool_calls",schemaPath:"#/properties/tool_calls/maxItems",keyword:"maxItems",params:{limit: 8},message:"must NOT have more than 8 items"}];
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
validate65.errors = [{instancePath:instancePath+"/tool_calls/" + i0,schemaPath:"#/$defs/CodingToolCall/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs14 = errors;
for(const key1 in data5){
if(!(((key1 === "id") || (key1 === "type")) || (key1 === "function"))){
validate65.errors = [{instancePath:instancePath+"/tool_calls/" + i0,schemaPath:"#/$defs/CodingToolCall/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
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
if(!pattern137.test(data6)){
validate65.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/id",schemaPath:"#/$defs/CodingToolCall/properties/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z0-9_|:./+=-]{1,2048}$"},message:"must match pattern \""+"^[A-Za-z0-9_|:./+=-]{1,2048}$"+"\""}];
return false;
}
}
else {
validate65.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/id",schemaPath:"#/$defs/CodingToolCall/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate65.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/type",schemaPath:"#/$defs/CodingToolCall/properties/type/const",keyword:"const",params:{allowedValue: "function"},message:"must be equal to constant"}];
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
validate65.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/function",schemaPath:"#/$defs/CodingToolCall/properties/function/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];
return false;
}
else {
const _errs20 = errors;
for(const key2 in data8){
if(!((key2 === "name") || (key2 === "arguments"))){
validate65.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/function",schemaPath:"#/$defs/CodingToolCall/properties/function/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"}];
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
if(!pattern138.test(data9)){
validate65.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/function/name",schemaPath:"#/$defs/CodingToolCall/properties/function/properties/name/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z_][A-Za-z0-9_-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z_][A-Za-z0-9_-]{0,63}$"+"\""}];
return false;
}
}
else {
validate65.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/function/name",schemaPath:"#/$defs/CodingToolCall/properties/function/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate65.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/function/arguments",schemaPath:"#/$defs/CodingToolCall/properties/function/properties/arguments/maxLength",keyword:"maxLength",params:{limit: 65536},message:"must NOT have more than 65536 characters"}];
return false;
}
}
else {
validate65.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/function/arguments",schemaPath:"#/$defs/CodingToolCall/properties/function/properties/arguments/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate65.errors = [{instancePath:instancePath+"/tool_calls/" + i0+"/function",schemaPath:"#/$defs/CodingToolCall/properties/function/type",keyword:"type",params:{type: "object"},message:"must be object"}];
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
validate65.errors = [{instancePath:instancePath+"/tool_calls/" + i0,schemaPath:"#/$defs/CodingToolCall/type",keyword:"type",params:{type: "object"},message:"must be object"}];
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
validate65.errors = [{instancePath:instancePath+"/tool_calls",schemaPath:"#/properties/tool_calls/type",keyword:"type",params:{type: "array"},message:"must be array"}];
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
validate65.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate65.errors = vErrors;
return errors === 0;
}

export const CodingInferenceRequest = validate66;
const schema85 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"inference"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"requestId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"sequence":{"type":"integer","minimum":1,"maximum":2147483647},"deadlineUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991},"messages":{"type":"array","minItems":1,"maxItems":128,"items":{"$ref":"#/$defs/CodingMessage"}},"maxOutputTokens":{"type":"integer","minimum":1,"maximum":8192},"upstreamBudget":{"$ref":"#/$defs/UpstreamBudget"},"tools":{"type":"array","maxItems":64,"items":{"$ref":"#/$defs/CodingToolDefinition"}},"protocol":{"const":"coding_v1"},"thinking":{"type":"boolean"},"purpose":{"enum":["main","compaction","btw","subagent"]},"capabilities":{"type":"array","uniqueItems":true,"maxItems":5,"items":{"enum":["coding_v1","streaming_v1","tools_v1","thinking_v1","images_v1"]}},"connector":{"$ref":"#/$defs/ConnectorDescriptor"}},"required":["type","sessionId","requestId","bindingRevision","sequence","deadlineUnixMs","messages","maxOutputTokens","upstreamBudget","tools","protocol","thinking","purpose","capabilities"]};

function validate66(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((((((((((data.type === undefined) && (missing0 = "type")) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.bindingRevision === undefined) && (missing0 = "bindingRevision"))) || ((data.sequence === undefined) && (missing0 = "sequence"))) || ((data.deadlineUnixMs === undefined) && (missing0 = "deadlineUnixMs"))) || ((data.messages === undefined) && (missing0 = "messages"))) || ((data.maxOutputTokens === undefined) && (missing0 = "maxOutputTokens"))) || ((data.upstreamBudget === undefined) && (missing0 = "upstreamBudget"))) || ((data.tools === undefined) && (missing0 = "tools"))) || ((data.protocol === undefined) && (missing0 = "protocol"))) || ((data.thinking === undefined) && (missing0 = "thinking"))) || ((data.purpose === undefined) && (missing0 = "purpose"))) || ((data.capabilities === undefined) && (missing0 = "capabilities"))){
validate66.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema85.properties, key0))){
validate66.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("inference" !== data.type){
validate66.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "inference"},message:"must be equal to constant"}];
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
validate66.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate66.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate66.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate66.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate66.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate66.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate66.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 2147483647 || isNaN(data4)){
validate66.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data4 < 1 || isNaN(data4)){
validate66.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate66.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs11){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 9007199254740991 || isNaN(data5)){
validate66.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data5 < 1 || isNaN(data5)){
validate66.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate66.errors = [{instancePath:instancePath+"/messages",schemaPath:"#/properties/messages/maxItems",keyword:"maxItems",params:{limit: 128},message:"must NOT have more than 128 items"}];
return false;
}
else {
if(data6.length < 1){
validate66.errors = [{instancePath:instancePath+"/messages",schemaPath:"#/properties/messages/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid1 = true;
const len0 = data6.length;
for(let i0=0; i0<len0; i0++){
const _errs15 = errors;
if(!(validate65(data6[i0], {instancePath:instancePath+"/messages/" + i0,parentData:data6,parentDataProperty:i0,rootData}))){
vErrors = vErrors === null ? validate65.errors : vErrors.concat(validate65.errors);
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
validate66.errors = [{instancePath:instancePath+"/messages",schemaPath:"#/properties/messages/type",keyword:"type",params:{type: "array"},message:"must be array"}];
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
validate66.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs16){
if((typeof data8 == "number") && (isFinite(data8))){
if(data8 > 8192 || isNaN(data8)){
validate66.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 8192},message:"must be <= 8192"}];
return false;
}
else {
if(data8 < 1 || isNaN(data8)){
validate66.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate66.errors = [{instancePath:instancePath+"/upstreamBudget",schemaPath:"#/$defs/UpstreamBudget/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs21 = errors;
for(const key1 in data9){
if(!(((((key1 === "reservedMicrousd") || (key1 === "inputBound")) || (key1 === "tariffVersion")) || (key1 === "inputMicrousdPerMillion")) || (key1 === "outputMicrousdPerMillion"))){
validate66.errors = [{instancePath:instancePath+"/upstreamBudget",schemaPath:"#/$defs/UpstreamBudget/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
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
validate66.errors = [{instancePath:instancePath+"/upstreamBudget/reservedMicrousd",schemaPath:"#/$defs/UpstreamBudget/properties/reservedMicrousd/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate66.errors = [{instancePath:instancePath+"/upstreamBudget/reservedMicrousd",schemaPath:"#/$defs/UpstreamBudget/properties/reservedMicrousd/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate66.errors = [{instancePath:instancePath+"/upstreamBudget/inputBound",schemaPath:"#/$defs/UpstreamBudget/properties/inputBound/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs24){
if((typeof data11 == "number") && (isFinite(data11))){
if(data11 > 262144 || isNaN(data11)){
validate66.errors = [{instancePath:instancePath+"/upstreamBudget/inputBound",schemaPath:"#/$defs/UpstreamBudget/properties/inputBound/maximum",keyword:"maximum",params:{comparison: "<=", limit: 262144},message:"must be <= 262144"}];
return false;
}
else {
if(data11 < 1 || isNaN(data11)){
validate66.errors = [{instancePath:instancePath+"/upstreamBudget/inputBound",schemaPath:"#/$defs/UpstreamBudget/properties/inputBound/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate66.errors = [{instancePath:instancePath+"/upstreamBudget/tariffVersion",schemaPath:"#/$defs/UpstreamBudget/properties/tariffVersion/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
}
else {
validate66.errors = [{instancePath:instancePath+"/upstreamBudget/tariffVersion",schemaPath:"#/$defs/UpstreamBudget/properties/tariffVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate66.errors = [{instancePath:instancePath+"/upstreamBudget/inputMicrousdPerMillion",schemaPath:"#/$defs/UpstreamBudget/properties/inputMicrousdPerMillion/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate66.errors = [{instancePath:instancePath+"/upstreamBudget/inputMicrousdPerMillion",schemaPath:"#/$defs/UpstreamBudget/properties/inputMicrousdPerMillion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate66.errors = [{instancePath:instancePath+"/upstreamBudget/outputMicrousdPerMillion",schemaPath:"#/$defs/UpstreamBudget/properties/outputMicrousdPerMillion/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate66.errors = [{instancePath:instancePath+"/upstreamBudget/outputMicrousdPerMillion",schemaPath:"#/$defs/UpstreamBudget/properties/outputMicrousdPerMillion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate66.errors = [{instancePath:instancePath+"/upstreamBudget",schemaPath:"#/$defs/UpstreamBudget/type",keyword:"type",params:{type: "object"},message:"must be object"}];
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
validate66.errors = [{instancePath:instancePath+"/tools",schemaPath:"#/properties/tools/maxItems",keyword:"maxItems",params:{limit: 64},message:"must NOT have more than 64 items"}];
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
validate66.errors = [{instancePath:instancePath+"/tools/" + i1,schemaPath:"#/$defs/CodingToolDefinition/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];
return false;
}
else {
const _errs37 = errors;
for(const key2 in data16){
if(!((key2 === "type") || (key2 === "function"))){
validate66.errors = [{instancePath:instancePath+"/tools/" + i1,schemaPath:"#/$defs/CodingToolDefinition/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs37 === errors){
if(data16.type !== undefined){
const _errs38 = errors;
if("function" !== data16.type){
validate66.errors = [{instancePath:instancePath+"/tools/" + i1+"/type",schemaPath:"#/$defs/CodingToolDefinition/properties/type/const",keyword:"const",params:{allowedValue: "function"},message:"must be equal to constant"}];
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
validate66.errors = [{instancePath:instancePath+"/tools/" + i1+"/function",schemaPath:"#/$defs/CodingToolDefinition/properties/function/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"}];
return false;
}
else {
const _errs41 = errors;
for(const key3 in data18){
if(!(((key3 === "name") || (key3 === "description")) || (key3 === "parameters"))){
validate66.errors = [{instancePath:instancePath+"/tools/" + i1+"/function",schemaPath:"#/$defs/CodingToolDefinition/properties/function/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"}];
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
if(!pattern138.test(data19)){
validate66.errors = [{instancePath:instancePath+"/tools/" + i1+"/function/name",schemaPath:"#/$defs/CodingToolDefinition/properties/function/properties/name/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z_][A-Za-z0-9_-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z_][A-Za-z0-9_-]{0,63}$"+"\""}];
return false;
}
}
else {
validate66.errors = [{instancePath:instancePath+"/tools/" + i1+"/function/name",schemaPath:"#/$defs/CodingToolDefinition/properties/function/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate66.errors = [{instancePath:instancePath+"/tools/" + i1+"/function/description",schemaPath:"#/$defs/CodingToolDefinition/properties/function/properties/description/maxLength",keyword:"maxLength",params:{limit: 8192},message:"must NOT have more than 8192 characters"}];
return false;
}
}
else {
validate66.errors = [{instancePath:instancePath+"/tools/" + i1+"/function/description",schemaPath:"#/$defs/CodingToolDefinition/properties/function/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate66.errors = [{instancePath:instancePath+"/tools/" + i1+"/function/parameters",schemaPath:"#/$defs/CodingToolDefinition/properties/function/properties/parameters/type",keyword:"type",params:{type: "object"},message:"must be object"}];
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
validate66.errors = [{instancePath:instancePath+"/tools/" + i1+"/function",schemaPath:"#/$defs/CodingToolDefinition/properties/function/type",keyword:"type",params:{type: "object"},message:"must be object"}];
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
validate66.errors = [{instancePath:instancePath+"/tools/" + i1,schemaPath:"#/$defs/CodingToolDefinition/type",keyword:"type",params:{type: "object"},message:"must be object"}];
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
validate66.errors = [{instancePath:instancePath+"/tools",schemaPath:"#/properties/tools/type",keyword:"type",params:{type: "array"},message:"must be array"}];
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
validate66.errors = [{instancePath:instancePath+"/protocol",schemaPath:"#/properties/protocol/const",keyword:"const",params:{allowedValue: "coding_v1"},message:"must be equal to constant"}];
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
validate66.errors = [{instancePath:instancePath+"/thinking",schemaPath:"#/properties/thinking/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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
validate66.errors = [{instancePath:instancePath+"/purpose",schemaPath:"#/properties/purpose/enum",keyword:"enum",params:{allowedValues: schema85.properties.purpose.enum},message:"must be equal to one of the allowed values"}];
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
validate66.errors = [{instancePath:instancePath+"/capabilities",schemaPath:"#/properties/capabilities/maxItems",keyword:"maxItems",params:{limit: 5},message:"must NOT have more than 5 items"}];
return false;
}
else {
var valid8 = true;
const len2 = data25.length;
for(let i2=0; i2<len2; i2++){
let data26 = data25[i2];
const _errs54 = errors;
if(!(((((data26 === "coding_v1") || (data26 === "streaming_v1")) || (data26 === "tools_v1")) || (data26 === "thinking_v1")) || (data26 === "images_v1"))){
validate66.errors = [{instancePath:instancePath+"/capabilities/" + i2,schemaPath:"#/properties/capabilities/items/enum",keyword:"enum",params:{allowedValues: schema85.properties.capabilities.items.enum},message:"must be equal to one of the allowed values"}];
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
validate66.errors = [{instancePath:instancePath+"/capabilities",schemaPath:"#/properties/capabilities/uniqueItems",keyword:"uniqueItems",params:{i: i3, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i3+" are identical)"}];
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
validate66.errors = [{instancePath:instancePath+"/capabilities",schemaPath:"#/properties/capabilities/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs52 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.connector !== undefined){
let data27 = data.connector;
const _errs55 = errors;
const _errs56 = errors;
const _errs58 = errors;
const _errs59 = errors;
let valid12 = true;
const _errs60 = errors;
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
let missing4;
if((data27.id === undefined) && (missing4 = "id")){
const err0 = {};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
if(data27.id !== undefined){
if("deepseek-v1" !== data27.id){
const err1 = {};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
}
var _valid0 = _errs60 === errors;
errors = _errs59;
if(vErrors !== null){
if(_errs59){
vErrors.length = _errs59;
}
else {
vErrors = null;
}
}
if(_valid0){
const _errs62 = errors;
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
if(data27.id !== undefined){
const _errs63 = errors;
if("deepseek-v1" !== data27.id){
validate66.errors = [{instancePath:instancePath+"/connector/id",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/id/const",keyword:"const",params:{allowedValue: "deepseek-v1"},message:"must be equal to constant"}];
return false;
}
var valid14 = _errs63 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data27.version !== undefined){
const _errs64 = errors;
if(1 !== data27.version){
validate66.errors = [{instancePath:instancePath+"/connector/version",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid14 = _errs64 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data27.authentication !== undefined){
const _errs65 = errors;
if("bearer" !== data27.authentication){
validate66.errors = [{instancePath:instancePath+"/connector/authentication",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/authentication/const",keyword:"const",params:{allowedValue: "bearer"},message:"must be equal to constant"}];
return false;
}
var valid14 = _errs65 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data27.outputTokenParameter !== undefined){
const _errs66 = errors;
if("max_tokens" !== data27.outputTokenParameter){
validate66.errors = [{instancePath:instancePath+"/connector/outputTokenParameter",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/outputTokenParameter/const",keyword:"const",params:{allowedValue: "max_tokens"},message:"must be equal to constant"}];
return false;
}
var valid14 = _errs66 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data27.streamingUsage !== undefined){
const _errs67 = errors;
if("include_usage" !== data27.streamingUsage){
validate66.errors = [{instancePath:instancePath+"/connector/streamingUsage",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/streamingUsage/const",keyword:"const",params:{allowedValue: "include_usage"},message:"must be equal to constant"}];
return false;
}
var valid14 = _errs67 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data27.thinking !== undefined){
const _errs68 = errors;
if("type" !== data27.thinking){
validate66.errors = [{instancePath:instancePath+"/connector/thinking",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/thinking/const",keyword:"const",params:{allowedValue: "type"},message:"must be equal to constant"}];
return false;
}
var valid14 = _errs68 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data27.reasoningHistory !== undefined){
const _errs69 = errors;
if(true !== data27.reasoningHistory){
validate66.errors = [{instancePath:instancePath+"/connector/reasoningHistory",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/reasoningHistory/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
return false;
}
var valid14 = _errs69 === errors;
}
else {
var valid14 = true;
}
}
}
}
}
}
}
}
var _valid0 = _errs62 === errors;
valid12 = _valid0;
}
if(!valid12){
const err2 = {instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
validate66.errors = vErrors;
return false;
}
var valid11 = _errs58 === errors;
if(valid11){
const _errs70 = errors;
const _errs71 = errors;
let valid15 = true;
const _errs72 = errors;
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
let missing5;
if((data27.id === undefined) && (missing5 = "id")){
const err3 = {};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
else {
if(data27.id !== undefined){
if("mimo-v1" !== data27.id){
const err4 = {};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
}
var _valid1 = _errs72 === errors;
errors = _errs71;
if(vErrors !== null){
if(_errs71){
vErrors.length = _errs71;
}
else {
vErrors = null;
}
}
if(_valid1){
const _errs74 = errors;
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
if(data27.id !== undefined){
const _errs75 = errors;
if("mimo-v1" !== data27.id){
validate66.errors = [{instancePath:instancePath+"/connector/id",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/id/const",keyword:"const",params:{allowedValue: "mimo-v1"},message:"must be equal to constant"}];
return false;
}
var valid17 = _errs75 === errors;
}
else {
var valid17 = true;
}
if(valid17){
if(data27.version !== undefined){
const _errs76 = errors;
if(1 !== data27.version){
validate66.errors = [{instancePath:instancePath+"/connector/version",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid17 = _errs76 === errors;
}
else {
var valid17 = true;
}
if(valid17){
if(data27.authentication !== undefined){
const _errs77 = errors;
if("api_key" !== data27.authentication){
validate66.errors = [{instancePath:instancePath+"/connector/authentication",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/authentication/const",keyword:"const",params:{allowedValue: "api_key"},message:"must be equal to constant"}];
return false;
}
var valid17 = _errs77 === errors;
}
else {
var valid17 = true;
}
if(valid17){
if(data27.outputTokenParameter !== undefined){
const _errs78 = errors;
if("max_completion_tokens" !== data27.outputTokenParameter){
validate66.errors = [{instancePath:instancePath+"/connector/outputTokenParameter",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/outputTokenParameter/const",keyword:"const",params:{allowedValue: "max_completion_tokens"},message:"must be equal to constant"}];
return false;
}
var valid17 = _errs78 === errors;
}
else {
var valid17 = true;
}
if(valid17){
if(data27.streamingUsage !== undefined){
const _errs79 = errors;
if("include_usage" !== data27.streamingUsage){
validate66.errors = [{instancePath:instancePath+"/connector/streamingUsage",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/streamingUsage/const",keyword:"const",params:{allowedValue: "include_usage"},message:"must be equal to constant"}];
return false;
}
var valid17 = _errs79 === errors;
}
else {
var valid17 = true;
}
if(valid17){
if(data27.thinking !== undefined){
const _errs80 = errors;
if("type" !== data27.thinking){
validate66.errors = [{instancePath:instancePath+"/connector/thinking",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/thinking/const",keyword:"const",params:{allowedValue: "type"},message:"must be equal to constant"}];
return false;
}
var valid17 = _errs80 === errors;
}
else {
var valid17 = true;
}
if(valid17){
if(data27.reasoningHistory !== undefined){
const _errs81 = errors;
if(true !== data27.reasoningHistory){
validate66.errors = [{instancePath:instancePath+"/connector/reasoningHistory",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/reasoningHistory/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
return false;
}
var valid17 = _errs81 === errors;
}
else {
var valid17 = true;
}
}
}
}
}
}
}
}
var _valid1 = _errs74 === errors;
valid15 = _valid1;
}
if(!valid15){
const err5 = {instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
validate66.errors = vErrors;
return false;
}
var valid11 = _errs70 === errors;
}
if(errors === _errs56){
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
let missing6;
if((((((((data27.id === undefined) && (missing6 = "id")) || ((data27.version === undefined) && (missing6 = "version"))) || ((data27.authentication === undefined) && (missing6 = "authentication"))) || ((data27.outputTokenParameter === undefined) && (missing6 = "outputTokenParameter"))) || ((data27.streamingUsage === undefined) && (missing6 = "streamingUsage"))) || ((data27.thinking === undefined) && (missing6 = "thinking"))) || ((data27.reasoningHistory === undefined) && (missing6 = "reasoningHistory"))){
validate66.errors = [{instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/required",keyword:"required",params:{missingProperty: missing6},message:"must have required property '"+missing6+"'"}];
return false;
}
else {
const _errs82 = errors;
for(const key4 in data27){
if(!(((((((key4 === "id") || (key4 === "version")) || (key4 === "authentication")) || (key4 === "outputTokenParameter")) || (key4 === "streamingUsage")) || (key4 === "thinking")) || (key4 === "reasoningHistory"))){
validate66.errors = [{instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs82 === errors){
if(data27.id !== undefined){
let data44 = data27.id;
const _errs83 = errors;
if(!(((data44 === "openai-compatible-v1") || (data44 === "deepseek-v1")) || (data44 === "mimo-v1"))){
validate66.errors = [{instancePath:instancePath+"/connector/id",schemaPath:"#/$defs/ConnectorDescriptor/properties/id/enum",keyword:"enum",params:{allowedValues: schema27.properties.id.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid18 = _errs83 === errors;
}
else {
var valid18 = true;
}
if(valid18){
if(data27.version !== undefined){
const _errs84 = errors;
if(1 !== data27.version){
validate66.errors = [{instancePath:instancePath+"/connector/version",schemaPath:"#/$defs/ConnectorDescriptor/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid18 = _errs84 === errors;
}
else {
var valid18 = true;
}
if(valid18){
if(data27.authentication !== undefined){
let data46 = data27.authentication;
const _errs85 = errors;
if(!((((data46 === "bearer") || (data46 === "api_key")) || (data46 === "x_api_key")) || (data46 === "none"))){
validate66.errors = [{instancePath:instancePath+"/connector/authentication",schemaPath:"#/$defs/ConnectorDescriptor/properties/authentication/enum",keyword:"enum",params:{allowedValues: schema27.properties.authentication.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid18 = _errs85 === errors;
}
else {
var valid18 = true;
}
if(valid18){
if(data27.outputTokenParameter !== undefined){
let data47 = data27.outputTokenParameter;
const _errs86 = errors;
if(!((data47 === "max_tokens") || (data47 === "max_completion_tokens"))){
validate66.errors = [{instancePath:instancePath+"/connector/outputTokenParameter",schemaPath:"#/$defs/ConnectorDescriptor/properties/outputTokenParameter/enum",keyword:"enum",params:{allowedValues: schema27.properties.outputTokenParameter.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid18 = _errs86 === errors;
}
else {
var valid18 = true;
}
if(valid18){
if(data27.streamingUsage !== undefined){
let data48 = data27.streamingUsage;
const _errs87 = errors;
if(!((data48 === "include_usage") || (data48 === "native"))){
validate66.errors = [{instancePath:instancePath+"/connector/streamingUsage",schemaPath:"#/$defs/ConnectorDescriptor/properties/streamingUsage/enum",keyword:"enum",params:{allowedValues: schema27.properties.streamingUsage.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid18 = _errs87 === errors;
}
else {
var valid18 = true;
}
if(valid18){
if(data27.thinking !== undefined){
let data49 = data27.thinking;
const _errs88 = errors;
if(!(((data49 === "none") || (data49 === "type")) || (data49 === "reasoning_effort"))){
validate66.errors = [{instancePath:instancePath+"/connector/thinking",schemaPath:"#/$defs/ConnectorDescriptor/properties/thinking/enum",keyword:"enum",params:{allowedValues: schema27.properties.thinking.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid18 = _errs88 === errors;
}
else {
var valid18 = true;
}
if(valid18){
if(data27.reasoningHistory !== undefined){
const _errs89 = errors;
if(typeof data27.reasoningHistory !== "boolean"){
validate66.errors = [{instancePath:instancePath+"/connector/reasoningHistory",schemaPath:"#/$defs/ConnectorDescriptor/properties/reasoningHistory/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid18 = _errs89 === errors;
}
else {
var valid18 = true;
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
validate66.errors = [{instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs55 === errors;
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
validate66.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate66.errors = vErrors;
return errors === 0;
}

export const MarketplaceListingSummary = validate68;
const schema89 = {"type":"object","additionalProperties":false,"properties":{"at":{"type":"integer","minimum":0,"maximum":9007199254740991},"totals":{"type":"object","additionalProperties":false,"properties":{"published":{"type":"integer","minimum":0,"maximum":9007199254740991},"hot":{"type":"integer","minimum":0,"maximum":9007199254740991},"cold":{"type":"integer","minimum":0,"maximum":9007199254740991},"immediateHot":{"type":"integer","minimum":0,"maximum":9007199254740991},"coldControlReady":{"type":"integer","minimum":0,"maximum":9007199254740991},"activeServing":{"type":"integer","minimum":0,"maximum":9007199254740991},"capacityHeld":{"type":"integer","minimum":0,"maximum":9007199254740991},"occupied":{"type":"integer","minimum":0,"maximum":9007199254740991},"qualified":{"type":"integer","minimum":0,"maximum":9007199254740991}},"required":["published","hot","cold","immediateHot","coldControlReady","activeServing","capacityHeld","occupied","qualified"]},"listings":{"type":"array","maxItems":12,"items":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"name":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"model":{"type":"string","minLength":1,"maxLength":120,"pattern":"^[\\x20-\\x7e]+$"},"availability":{"enum":["hot","cold"]},"immediateHot":{"type":"boolean"},"coldControlReady":{"type":"boolean"},"activeServing":{"type":"boolean"},"capacityHeld":{"type":"boolean"},"occupied":{"type":"boolean"},"qualified":{"type":"boolean"}},"required":["id","name","model","availability","immediateHot","coldControlReady","activeServing","capacityHeld","occupied","qualified"]}}},"required":["at","totals","listings"]};

function validate68(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.at === undefined) && (missing0 = "at")) || ((data.totals === undefined) && (missing0 = "totals"))) || ((data.listings === undefined) && (missing0 = "listings"))){
validate68.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "at") || (key0 === "totals")) || (key0 === "listings"))){
validate68.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.at !== undefined){
let data0 = data.at;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate68.errors = [{instancePath:instancePath+"/at",schemaPath:"#/properties/at/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs2){
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 > 9007199254740991 || isNaN(data0)){
validate68.errors = [{instancePath:instancePath+"/at",schemaPath:"#/properties/at/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data0 < 0 || isNaN(data0)){
validate68.errors = [{instancePath:instancePath+"/at",schemaPath:"#/properties/at/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate68.errors = [{instancePath:instancePath+"/totals",schemaPath:"#/properties/totals/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs6 = errors;
for(const key1 in data1){
if(!(func7.call(schema89.properties.totals.properties, key1))){
validate68.errors = [{instancePath:instancePath+"/totals",schemaPath:"#/properties/totals/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs6 === errors){
if(data1.published !== undefined){
let data2 = data1.published;
const _errs7 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate68.errors = [{instancePath:instancePath+"/totals/published",schemaPath:"#/properties/totals/properties/published/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs7){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate68.errors = [{instancePath:instancePath+"/totals/published",schemaPath:"#/properties/totals/properties/published/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate68.errors = [{instancePath:instancePath+"/totals/published",schemaPath:"#/properties/totals/properties/published/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate68.errors = [{instancePath:instancePath+"/totals/hot",schemaPath:"#/properties/totals/properties/hot/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate68.errors = [{instancePath:instancePath+"/totals/hot",schemaPath:"#/properties/totals/properties/hot/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate68.errors = [{instancePath:instancePath+"/totals/hot",schemaPath:"#/properties/totals/properties/hot/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate68.errors = [{instancePath:instancePath+"/totals/cold",schemaPath:"#/properties/totals/properties/cold/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs11){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 9007199254740991 || isNaN(data4)){
validate68.errors = [{instancePath:instancePath+"/totals/cold",schemaPath:"#/properties/totals/properties/cold/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data4 < 0 || isNaN(data4)){
validate68.errors = [{instancePath:instancePath+"/totals/cold",schemaPath:"#/properties/totals/properties/cold/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate68.errors = [{instancePath:instancePath+"/totals/immediateHot",schemaPath:"#/properties/totals/properties/immediateHot/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs13){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 9007199254740991 || isNaN(data5)){
validate68.errors = [{instancePath:instancePath+"/totals/immediateHot",schemaPath:"#/properties/totals/properties/immediateHot/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data5 < 0 || isNaN(data5)){
validate68.errors = [{instancePath:instancePath+"/totals/immediateHot",schemaPath:"#/properties/totals/properties/immediateHot/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate68.errors = [{instancePath:instancePath+"/totals/coldControlReady",schemaPath:"#/properties/totals/properties/coldControlReady/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs15){
if((typeof data6 == "number") && (isFinite(data6))){
if(data6 > 9007199254740991 || isNaN(data6)){
validate68.errors = [{instancePath:instancePath+"/totals/coldControlReady",schemaPath:"#/properties/totals/properties/coldControlReady/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data6 < 0 || isNaN(data6)){
validate68.errors = [{instancePath:instancePath+"/totals/coldControlReady",schemaPath:"#/properties/totals/properties/coldControlReady/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate68.errors = [{instancePath:instancePath+"/totals/activeServing",schemaPath:"#/properties/totals/properties/activeServing/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs17){
if((typeof data7 == "number") && (isFinite(data7))){
if(data7 > 9007199254740991 || isNaN(data7)){
validate68.errors = [{instancePath:instancePath+"/totals/activeServing",schemaPath:"#/properties/totals/properties/activeServing/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data7 < 0 || isNaN(data7)){
validate68.errors = [{instancePath:instancePath+"/totals/activeServing",schemaPath:"#/properties/totals/properties/activeServing/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate68.errors = [{instancePath:instancePath+"/totals/capacityHeld",schemaPath:"#/properties/totals/properties/capacityHeld/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs19){
if((typeof data8 == "number") && (isFinite(data8))){
if(data8 > 9007199254740991 || isNaN(data8)){
validate68.errors = [{instancePath:instancePath+"/totals/capacityHeld",schemaPath:"#/properties/totals/properties/capacityHeld/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data8 < 0 || isNaN(data8)){
validate68.errors = [{instancePath:instancePath+"/totals/capacityHeld",schemaPath:"#/properties/totals/properties/capacityHeld/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate68.errors = [{instancePath:instancePath+"/totals/occupied",schemaPath:"#/properties/totals/properties/occupied/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs21){
if((typeof data9 == "number") && (isFinite(data9))){
if(data9 > 9007199254740991 || isNaN(data9)){
validate68.errors = [{instancePath:instancePath+"/totals/occupied",schemaPath:"#/properties/totals/properties/occupied/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data9 < 0 || isNaN(data9)){
validate68.errors = [{instancePath:instancePath+"/totals/occupied",schemaPath:"#/properties/totals/properties/occupied/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate68.errors = [{instancePath:instancePath+"/totals/qualified",schemaPath:"#/properties/totals/properties/qualified/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs23){
if((typeof data10 == "number") && (isFinite(data10))){
if(data10 > 9007199254740991 || isNaN(data10)){
validate68.errors = [{instancePath:instancePath+"/totals/qualified",schemaPath:"#/properties/totals/properties/qualified/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data10 < 0 || isNaN(data10)){
validate68.errors = [{instancePath:instancePath+"/totals/qualified",schemaPath:"#/properties/totals/properties/qualified/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate68.errors = [{instancePath:instancePath+"/totals",schemaPath:"#/properties/totals/type",keyword:"type",params:{type: "object"},message:"must be object"}];
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
validate68.errors = [{instancePath:instancePath+"/listings",schemaPath:"#/properties/listings/maxItems",keyword:"maxItems",params:{limit: 12},message:"must NOT have more than 12 items"}];
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
validate68.errors = [{instancePath:instancePath+"/listings/" + i0,schemaPath:"#/properties/listings/items/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];
return false;
}
else {
const _errs29 = errors;
for(const key2 in data12){
if(!(func7.call(schema89.properties.listings.items.properties, key2))){
validate68.errors = [{instancePath:instancePath+"/listings/" + i0,schemaPath:"#/properties/listings/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"}];
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
validate68.errors = [{instancePath:instancePath+"/listings/" + i0+"/id",schemaPath:"#/properties/listings/items/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate68.errors = [{instancePath:instancePath+"/listings/" + i0+"/id",schemaPath:"#/properties/listings/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate68.errors = [{instancePath:instancePath+"/listings/" + i0+"/name",schemaPath:"#/properties/listings/items/properties/name/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data14) < 1){
validate68.errors = [{instancePath:instancePath+"/listings/" + i0+"/name",schemaPath:"#/properties/listings/items/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data14)){
validate68.errors = [{instancePath:instancePath+"/listings/" + i0+"/name",schemaPath:"#/properties/listings/items/properties/name/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate68.errors = [{instancePath:instancePath+"/listings/" + i0+"/name",schemaPath:"#/properties/listings/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate68.errors = [{instancePath:instancePath+"/listings/" + i0+"/model",schemaPath:"#/properties/listings/items/properties/model/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
else {
if(func2(data15) < 1){
validate68.errors = [{instancePath:instancePath+"/listings/" + i0+"/model",schemaPath:"#/properties/listings/items/properties/model/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern71.test(data15)){
validate68.errors = [{instancePath:instancePath+"/listings/" + i0+"/model",schemaPath:"#/properties/listings/items/properties/model/pattern",keyword:"pattern",params:{pattern: "^[\\x20-\\x7e]+$"},message:"must match pattern \""+"^[\\x20-\\x7e]+$"+"\""}];
return false;
}
}
}
}
else {
validate68.errors = [{instancePath:instancePath+"/listings/" + i0+"/model",schemaPath:"#/properties/listings/items/properties/model/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate68.errors = [{instancePath:instancePath+"/listings/" + i0+"/availability",schemaPath:"#/properties/listings/items/properties/availability/enum",keyword:"enum",params:{allowedValues: schema89.properties.listings.items.properties.availability.enum},message:"must be equal to one of the allowed values"}];
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
validate68.errors = [{instancePath:instancePath+"/listings/" + i0+"/immediateHot",schemaPath:"#/properties/listings/items/properties/immediateHot/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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
validate68.errors = [{instancePath:instancePath+"/listings/" + i0+"/coldControlReady",schemaPath:"#/properties/listings/items/properties/coldControlReady/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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
validate68.errors = [{instancePath:instancePath+"/listings/" + i0+"/activeServing",schemaPath:"#/properties/listings/items/properties/activeServing/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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
validate68.errors = [{instancePath:instancePath+"/listings/" + i0+"/capacityHeld",schemaPath:"#/properties/listings/items/properties/capacityHeld/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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
validate68.errors = [{instancePath:instancePath+"/listings/" + i0+"/occupied",schemaPath:"#/properties/listings/items/properties/occupied/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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
validate68.errors = [{instancePath:instancePath+"/listings/" + i0+"/qualified",schemaPath:"#/properties/listings/items/properties/qualified/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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
validate68.errors = [{instancePath:instancePath+"/listings/" + i0,schemaPath:"#/properties/listings/items/type",keyword:"type",params:{type: "object"},message:"must be object"}];
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
validate68.errors = [{instancePath:instancePath+"/listings",schemaPath:"#/properties/listings/type",keyword:"type",params:{type: "array"},message:"must be array"}];
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
validate68.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate68.errors = vErrors;
return errors === 0;
}

export const MarketplaceProfile = validate69;
const schema90 = {"type":"object","additionalProperties":false,"properties":{"userId":{"type":"string","maxLength":120},"email":{"anyOf":[{"type":"string","maxLength":320},{"type":"null"}]},"roles":{"type":"array","items":{"enum":["buyer","provider","admin"]}},"account":{"type":"object"},"settlement":{"const":"test_credits"},"cashValue":{"const":false}},"required":["userId","email","roles","account","settlement","cashValue"]};

function validate69(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.userId === undefined) && (missing0 = "userId")) || ((data.email === undefined) && (missing0 = "email"))) || ((data.roles === undefined) && (missing0 = "roles"))) || ((data.account === undefined) && (missing0 = "account"))) || ((data.settlement === undefined) && (missing0 = "settlement"))) || ((data.cashValue === undefined) && (missing0 = "cashValue"))){
validate69.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "userId") || (key0 === "email")) || (key0 === "roles")) || (key0 === "account")) || (key0 === "settlement")) || (key0 === "cashValue"))){
validate69.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate69.errors = [{instancePath:instancePath+"/userId",schemaPath:"#/properties/userId/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
}
else {
validate69.errors = [{instancePath:instancePath+"/userId",schemaPath:"#/properties/userId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate69.errors = vErrors;
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
validate69.errors = [{instancePath:instancePath+"/roles/" + i0,schemaPath:"#/properties/roles/items/enum",keyword:"enum",params:{allowedValues: schema90.properties.roles.items.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid2 = _errs12 === errors;
if(!valid2){
break;
}
}
}
else {
validate69.errors = [{instancePath:instancePath+"/roles",schemaPath:"#/properties/roles/type",keyword:"type",params:{type: "array"},message:"must be array"}];
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
validate69.errors = [{instancePath:instancePath+"/account",schemaPath:"#/properties/account/type",keyword:"type",params:{type: "object"},message:"must be object"}];
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
validate69.errors = [{instancePath:instancePath+"/settlement",schemaPath:"#/properties/settlement/const",keyword:"const",params:{allowedValue: "test_credits"},message:"must be equal to constant"}];
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
validate69.errors = [{instancePath:instancePath+"/cashValue",schemaPath:"#/properties/cashValue/const",keyword:"const",params:{allowedValue: false},message:"must be equal to constant"}];
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
validate69.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate69.errors = vErrors;
return errors === 0;
}

export const ProviderTariffRefresh = validate70;
const schema91 = {"type":"object","additionalProperties":false,"properties":{"durationSeconds":{"type":"integer","minimum":60,"maximum":3600}},"required":[]};

function validate70(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "durationSeconds")){
validate70.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.durationSeconds !== undefined){
let data0 = data.durationSeconds;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate70.errors = [{instancePath:instancePath+"/durationSeconds",schemaPath:"#/properties/durationSeconds/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs2){
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 > 3600 || isNaN(data0)){
validate70.errors = [{instancePath:instancePath+"/durationSeconds",schemaPath:"#/properties/durationSeconds/maximum",keyword:"maximum",params:{comparison: "<=", limit: 3600},message:"must be <= 3600"}];
return false;
}
else {
if(data0 < 60 || isNaN(data0)){
validate70.errors = [{instancePath:instancePath+"/durationSeconds",schemaPath:"#/properties/durationSeconds/minimum",keyword:"minimum",params:{comparison: ">=", limit: 60},message:"must be >= 60"}];
return false;
}
}
}
}
}
}
}
else {
validate70.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate70.errors = vErrors;
return errors === 0;
}

export const ProviderTariffRefreshResult = validate71;
const schema92 = {"type":"object","additionalProperties":false,"properties":{"nodeId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"tariffId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"qualifiedUntil":{"type":"integer","minimum":1,"maximum":9007199254740991},"durationSeconds":{"type":"integer","minimum":60,"maximum":3600},"covered":{"type":"boolean"}},"required":["nodeId","tariffId","qualifiedUntil","durationSeconds","covered"]};

function validate71(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.nodeId === undefined) && (missing0 = "nodeId")) || ((data.tariffId === undefined) && (missing0 = "tariffId"))) || ((data.qualifiedUntil === undefined) && (missing0 = "qualifiedUntil"))) || ((data.durationSeconds === undefined) && (missing0 = "durationSeconds"))) || ((data.covered === undefined) && (missing0 = "covered"))){
validate71.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "nodeId") || (key0 === "tariffId")) || (key0 === "qualifiedUntil")) || (key0 === "durationSeconds")) || (key0 === "covered"))){
validate71.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.nodeId !== undefined){
let data0 = data.nodeId;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(!pattern67.test(data0)){
validate71.errors = [{instancePath:instancePath+"/nodeId",schemaPath:"#/properties/nodeId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate71.errors = [{instancePath:instancePath+"/nodeId",schemaPath:"#/properties/nodeId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.tariffId !== undefined){
let data1 = data.tariffId;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data1 === "string"){
if(!pattern67.test(data1)){
validate71.errors = [{instancePath:instancePath+"/tariffId",schemaPath:"#/properties/tariffId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate71.errors = [{instancePath:instancePath+"/tariffId",schemaPath:"#/properties/tariffId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.qualifiedUntil !== undefined){
let data2 = data.qualifiedUntil;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate71.errors = [{instancePath:instancePath+"/qualifiedUntil",schemaPath:"#/properties/qualifiedUntil/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate71.errors = [{instancePath:instancePath+"/qualifiedUntil",schemaPath:"#/properties/qualifiedUntil/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 1 || isNaN(data2)){
validate71.errors = [{instancePath:instancePath+"/qualifiedUntil",schemaPath:"#/properties/qualifiedUntil/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate71.errors = [{instancePath:instancePath+"/durationSeconds",schemaPath:"#/properties/durationSeconds/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 3600 || isNaN(data3)){
validate71.errors = [{instancePath:instancePath+"/durationSeconds",schemaPath:"#/properties/durationSeconds/maximum",keyword:"maximum",params:{comparison: "<=", limit: 3600},message:"must be <= 3600"}];
return false;
}
else {
if(data3 < 60 || isNaN(data3)){
validate71.errors = [{instancePath:instancePath+"/durationSeconds",schemaPath:"#/properties/durationSeconds/minimum",keyword:"minimum",params:{comparison: ">=", limit: 60},message:"must be >= 60"}];
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
if(data.covered !== undefined){
const _errs10 = errors;
if(typeof data.covered !== "boolean"){
validate71.errors = [{instancePath:instancePath+"/covered",schemaPath:"#/properties/covered/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
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
validate71.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate71.errors = vErrors;
return errors === 0;
}

export const ConnectorDescriptor = validate72;

function validate72(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
const _errs1 = errors;
const _errs2 = errors;
let valid1 = true;
const _errs3 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.id === undefined) && (missing0 = "id")){
const err0 = {};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
if(data.id !== undefined){
if("deepseek-v1" !== data.id){
const err1 = {};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
}
var _valid0 = _errs3 === errors;
errors = _errs2;
if(vErrors !== null){
if(_errs2){
vErrors.length = _errs2;
}
else {
vErrors = null;
}
}
if(_valid0){
const _errs5 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id !== undefined){
const _errs6 = errors;
if("deepseek-v1" !== data.id){
validate72.errors = [{instancePath:instancePath+"/id",schemaPath:"#/allOf/0/then/properties/id/const",keyword:"const",params:{allowedValue: "deepseek-v1"},message:"must be equal to constant"}];
return false;
}
var valid3 = _errs6 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data.version !== undefined){
const _errs7 = errors;
if(1 !== data.version){
validate72.errors = [{instancePath:instancePath+"/version",schemaPath:"#/allOf/0/then/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid3 = _errs7 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data.authentication !== undefined){
const _errs8 = errors;
if("bearer" !== data.authentication){
validate72.errors = [{instancePath:instancePath+"/authentication",schemaPath:"#/allOf/0/then/properties/authentication/const",keyword:"const",params:{allowedValue: "bearer"},message:"must be equal to constant"}];
return false;
}
var valid3 = _errs8 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data.outputTokenParameter !== undefined){
const _errs9 = errors;
if("max_tokens" !== data.outputTokenParameter){
validate72.errors = [{instancePath:instancePath+"/outputTokenParameter",schemaPath:"#/allOf/0/then/properties/outputTokenParameter/const",keyword:"const",params:{allowedValue: "max_tokens"},message:"must be equal to constant"}];
return false;
}
var valid3 = _errs9 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data.streamingUsage !== undefined){
const _errs10 = errors;
if("include_usage" !== data.streamingUsage){
validate72.errors = [{instancePath:instancePath+"/streamingUsage",schemaPath:"#/allOf/0/then/properties/streamingUsage/const",keyword:"const",params:{allowedValue: "include_usage"},message:"must be equal to constant"}];
return false;
}
var valid3 = _errs10 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data.thinking !== undefined){
const _errs11 = errors;
if("type" !== data.thinking){
validate72.errors = [{instancePath:instancePath+"/thinking",schemaPath:"#/allOf/0/then/properties/thinking/const",keyword:"const",params:{allowedValue: "type"},message:"must be equal to constant"}];
return false;
}
var valid3 = _errs11 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data.reasoningHistory !== undefined){
const _errs12 = errors;
if(true !== data.reasoningHistory){
validate72.errors = [{instancePath:instancePath+"/reasoningHistory",schemaPath:"#/allOf/0/then/properties/reasoningHistory/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
return false;
}
var valid3 = _errs12 === errors;
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
var _valid0 = _errs5 === errors;
valid1 = _valid0;
}
if(!valid1){
const err2 = {instancePath,schemaPath:"#/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
validate72.errors = vErrors;
return false;
}
var valid0 = _errs1 === errors;
if(valid0){
const _errs13 = errors;
const _errs14 = errors;
let valid4 = true;
const _errs15 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
let missing1;
if((data.id === undefined) && (missing1 = "id")){
const err3 = {};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
else {
if(data.id !== undefined){
if("mimo-v1" !== data.id){
const err4 = {};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
}
var _valid1 = _errs15 === errors;
errors = _errs14;
if(vErrors !== null){
if(_errs14){
vErrors.length = _errs14;
}
else {
vErrors = null;
}
}
if(_valid1){
const _errs17 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id !== undefined){
const _errs18 = errors;
if("mimo-v1" !== data.id){
validate72.errors = [{instancePath:instancePath+"/id",schemaPath:"#/allOf/1/then/properties/id/const",keyword:"const",params:{allowedValue: "mimo-v1"},message:"must be equal to constant"}];
return false;
}
var valid6 = _errs18 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data.version !== undefined){
const _errs19 = errors;
if(1 !== data.version){
validate72.errors = [{instancePath:instancePath+"/version",schemaPath:"#/allOf/1/then/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid6 = _errs19 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data.authentication !== undefined){
const _errs20 = errors;
if("api_key" !== data.authentication){
validate72.errors = [{instancePath:instancePath+"/authentication",schemaPath:"#/allOf/1/then/properties/authentication/const",keyword:"const",params:{allowedValue: "api_key"},message:"must be equal to constant"}];
return false;
}
var valid6 = _errs20 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data.outputTokenParameter !== undefined){
const _errs21 = errors;
if("max_completion_tokens" !== data.outputTokenParameter){
validate72.errors = [{instancePath:instancePath+"/outputTokenParameter",schemaPath:"#/allOf/1/then/properties/outputTokenParameter/const",keyword:"const",params:{allowedValue: "max_completion_tokens"},message:"must be equal to constant"}];
return false;
}
var valid6 = _errs21 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data.streamingUsage !== undefined){
const _errs22 = errors;
if("include_usage" !== data.streamingUsage){
validate72.errors = [{instancePath:instancePath+"/streamingUsage",schemaPath:"#/allOf/1/then/properties/streamingUsage/const",keyword:"const",params:{allowedValue: "include_usage"},message:"must be equal to constant"}];
return false;
}
var valid6 = _errs22 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data.thinking !== undefined){
const _errs23 = errors;
if("type" !== data.thinking){
validate72.errors = [{instancePath:instancePath+"/thinking",schemaPath:"#/allOf/1/then/properties/thinking/const",keyword:"const",params:{allowedValue: "type"},message:"must be equal to constant"}];
return false;
}
var valid6 = _errs23 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data.reasoningHistory !== undefined){
const _errs24 = errors;
if(true !== data.reasoningHistory){
validate72.errors = [{instancePath:instancePath+"/reasoningHistory",schemaPath:"#/allOf/1/then/properties/reasoningHistory/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
return false;
}
var valid6 = _errs24 === errors;
}
else {
var valid6 = true;
}
}
}
}
}
}
}
}
var _valid1 = _errs17 === errors;
valid4 = _valid1;
}
if(!valid4){
const err5 = {instancePath,schemaPath:"#/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
validate72.errors = vErrors;
return false;
}
var valid0 = _errs13 === errors;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing2;
if((((((((data.id === undefined) && (missing2 = "id")) || ((data.version === undefined) && (missing2 = "version"))) || ((data.authentication === undefined) && (missing2 = "authentication"))) || ((data.outputTokenParameter === undefined) && (missing2 = "outputTokenParameter"))) || ((data.streamingUsage === undefined) && (missing2 = "streamingUsage"))) || ((data.thinking === undefined) && (missing2 = "thinking"))) || ((data.reasoningHistory === undefined) && (missing2 = "reasoningHistory"))){
validate72.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];
return false;
}
else {
const _errs25 = errors;
for(const key0 in data){
if(!(((((((key0 === "id") || (key0 === "version")) || (key0 === "authentication")) || (key0 === "outputTokenParameter")) || (key0 === "streamingUsage")) || (key0 === "thinking")) || (key0 === "reasoningHistory"))){
validate72.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs25 === errors){
if(data.id !== undefined){
let data16 = data.id;
const _errs26 = errors;
if(!(((data16 === "openai-compatible-v1") || (data16 === "deepseek-v1")) || (data16 === "mimo-v1"))){
validate72.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/enum",keyword:"enum",params:{allowedValues: schema27.properties.id.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid7 = _errs26 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data.version !== undefined){
const _errs27 = errors;
if(1 !== data.version){
validate72.errors = [{instancePath:instancePath+"/version",schemaPath:"#/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid7 = _errs27 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data.authentication !== undefined){
let data18 = data.authentication;
const _errs28 = errors;
if(!((((data18 === "bearer") || (data18 === "api_key")) || (data18 === "x_api_key")) || (data18 === "none"))){
validate72.errors = [{instancePath:instancePath+"/authentication",schemaPath:"#/properties/authentication/enum",keyword:"enum",params:{allowedValues: schema27.properties.authentication.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid7 = _errs28 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data.outputTokenParameter !== undefined){
let data19 = data.outputTokenParameter;
const _errs29 = errors;
if(!((data19 === "max_tokens") || (data19 === "max_completion_tokens"))){
validate72.errors = [{instancePath:instancePath+"/outputTokenParameter",schemaPath:"#/properties/outputTokenParameter/enum",keyword:"enum",params:{allowedValues: schema27.properties.outputTokenParameter.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid7 = _errs29 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data.streamingUsage !== undefined){
let data20 = data.streamingUsage;
const _errs30 = errors;
if(!((data20 === "include_usage") || (data20 === "native"))){
validate72.errors = [{instancePath:instancePath+"/streamingUsage",schemaPath:"#/properties/streamingUsage/enum",keyword:"enum",params:{allowedValues: schema27.properties.streamingUsage.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid7 = _errs30 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data.thinking !== undefined){
let data21 = data.thinking;
const _errs31 = errors;
if(!(((data21 === "none") || (data21 === "type")) || (data21 === "reasoning_effort"))){
validate72.errors = [{instancePath:instancePath+"/thinking",schemaPath:"#/properties/thinking/enum",keyword:"enum",params:{allowedValues: schema27.properties.thinking.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid7 = _errs31 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data.reasoningHistory !== undefined){
const _errs32 = errors;
if(typeof data.reasoningHistory !== "boolean"){
validate72.errors = [{instancePath:instancePath+"/reasoningHistory",schemaPath:"#/properties/reasoningHistory/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid7 = _errs32 === errors;
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
else {
validate72.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate72.errors = vErrors;
return errors === 0;
}

export const SessionVisibilityRequest = validate73;
const schema94 = {"type":"object","additionalProperties":false,"properties":{},"required":[]};

function validate73(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
for(const key0 in data){
validate73.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
else {
validate73.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate73.errors = vErrors;
return errors === 0;
}

export const SessionVisibilityResult = validate74;
const schema95 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"deleted":{"type":"boolean"},"executionState":{"enum":["preparing","active","paused","stopping","stopped"]},"cleanupState":{"enum":["pending","succeeded","failed"]}},"required":["id","deleted"]};

function validate74(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.id === undefined) && (missing0 = "id")) || ((data.deleted === undefined) && (missing0 = "deleted"))){
validate74.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "id") || (key0 === "deleted")) || (key0 === "executionState")) || (key0 === "cleanupState"))){
validate74.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate74.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate74.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.deleted !== undefined){
const _errs4 = errors;
if(typeof data.deleted !== "boolean"){
validate74.errors = [{instancePath:instancePath+"/deleted",schemaPath:"#/properties/deleted/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.executionState !== undefined){
let data2 = data.executionState;
const _errs6 = errors;
if(!(((((data2 === "preparing") || (data2 === "active")) || (data2 === "paused")) || (data2 === "stopping")) || (data2 === "stopped"))){
validate74.errors = [{instancePath:instancePath+"/executionState",schemaPath:"#/properties/executionState/enum",keyword:"enum",params:{allowedValues: schema95.properties.executionState.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.cleanupState !== undefined){
let data3 = data.cleanupState;
const _errs7 = errors;
if(!(((data3 === "pending") || (data3 === "succeeded")) || (data3 === "failed"))){
validate74.errors = [{instancePath:instancePath+"/cleanupState",schemaPath:"#/properties/cleanupState/enum",keyword:"enum",params:{allowedValues: schema95.properties.cleanupState.enum},message:"must be equal to one of the allowed values"}];
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
validate74.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate74.errors = vErrors;
return errors === 0;
}

export const ProviderActivity = validate75;
const schema96 = {"type":"object","additionalProperties":false,"properties":{"nodeId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"at":{"type":"integer","minimum":0,"maximum":9007199254740991},"providerRunId":{"anyOf":[{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},{"type":"null"}]},"runStartedAt":{"anyOf":[{"type":"integer","minimum":0,"maximum":9007199254740991},{"type":"null"}]},"connectionUpdatedAt":{"anyOf":[{"type":"integer","minimum":0,"maximum":9007199254740991},{"type":"null"}]},"connectionFresh":{"type":"boolean"},"activeSessions":{"type":"array","maxItems":1,"items":{"type":"object","additionalProperties":false,"properties":{"sessionId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"buyerId":{"type":"string","maxLength":120}},"required":["sessionId","buyerId"]}},"completedRequests":{"anyOf":[{"type":"integer","minimum":0,"maximum":9007199254740991},{"type":"null"}]},"inputTokens":{"anyOf":[{"type":"integer","minimum":0,"maximum":9007199254740991},{"type":"null"}]},"outputTokens":{"anyOf":[{"type":"integer","minimum":0,"maximum":9007199254740991},{"type":"null"}]},"totalsSince":{"anyOf":[{"type":"integer","minimum":0,"maximum":9007199254740991},{"type":"null"}]},"pendingRequests":{"type":"integer","minimum":0,"maximum":9007199254740991},"unresolvedRequests":{"type":"integer","minimum":0,"maximum":9007199254740991}},"required":["nodeId","at","providerRunId","runStartedAt","connectionUpdatedAt","connectionFresh","activeSessions","completedRequests","inputTokens","outputTokens","totalsSince","pendingRequests"]};

function validate75(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((((((((data.nodeId === undefined) && (missing0 = "nodeId")) || ((data.at === undefined) && (missing0 = "at"))) || ((data.providerRunId === undefined) && (missing0 = "providerRunId"))) || ((data.runStartedAt === undefined) && (missing0 = "runStartedAt"))) || ((data.connectionUpdatedAt === undefined) && (missing0 = "connectionUpdatedAt"))) || ((data.connectionFresh === undefined) && (missing0 = "connectionFresh"))) || ((data.activeSessions === undefined) && (missing0 = "activeSessions"))) || ((data.completedRequests === undefined) && (missing0 = "completedRequests"))) || ((data.inputTokens === undefined) && (missing0 = "inputTokens"))) || ((data.outputTokens === undefined) && (missing0 = "outputTokens"))) || ((data.totalsSince === undefined) && (missing0 = "totalsSince"))) || ((data.pendingRequests === undefined) && (missing0 = "pendingRequests"))){
validate75.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema96.properties, key0))){
validate75.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.nodeId !== undefined){
let data0 = data.nodeId;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(!pattern67.test(data0)){
validate75.errors = [{instancePath:instancePath+"/nodeId",schemaPath:"#/properties/nodeId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate75.errors = [{instancePath:instancePath+"/nodeId",schemaPath:"#/properties/nodeId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.at !== undefined){
let data1 = data.at;
const _errs4 = errors;
if(!(((typeof data1 == "number") && (!(data1 % 1) && !isNaN(data1))) && (isFinite(data1)))){
validate75.errors = [{instancePath:instancePath+"/at",schemaPath:"#/properties/at/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs4){
if((typeof data1 == "number") && (isFinite(data1))){
if(data1 > 9007199254740991 || isNaN(data1)){
validate75.errors = [{instancePath:instancePath+"/at",schemaPath:"#/properties/at/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data1 < 0 || isNaN(data1)){
validate75.errors = [{instancePath:instancePath+"/at",schemaPath:"#/properties/at/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
if(data.providerRunId !== undefined){
let data2 = data.providerRunId;
const _errs6 = errors;
const _errs7 = errors;
let valid1 = false;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data2 === "string"){
if(!pattern67.test(data2)){
const err0 = {instancePath:instancePath+"/providerRunId",schemaPath:"#/properties/providerRunId/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""};
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
const err1 = {instancePath:instancePath+"/providerRunId",schemaPath:"#/properties/providerRunId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var _valid0 = _errs8 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const _errs10 = errors;
if(data2 !== null){
const err2 = {instancePath:instancePath+"/providerRunId",schemaPath:"#/properties/providerRunId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var _valid0 = _errs10 === errors;
valid1 = valid1 || _valid0;
}
if(!valid1){
const err3 = {instancePath:instancePath+"/providerRunId",schemaPath:"#/properties/providerRunId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
validate75.errors = vErrors;
return false;
}
else {
errors = _errs7;
if(vErrors !== null){
if(_errs7){
vErrors.length = _errs7;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.runStartedAt !== undefined){
let data3 = data.runStartedAt;
const _errs12 = errors;
const _errs13 = errors;
let valid2 = false;
const _errs14 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
const err4 = {instancePath:instancePath+"/runStartedAt",schemaPath:"#/properties/runStartedAt/anyOf/0/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(errors === _errs14){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
const err5 = {instancePath:instancePath+"/runStartedAt",schemaPath:"#/properties/runStartedAt/anyOf/0/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
else {
if(data3 < 0 || isNaN(data3)){
const err6 = {instancePath:instancePath+"/runStartedAt",schemaPath:"#/properties/runStartedAt/anyOf/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
}
}
var _valid1 = _errs14 === errors;
valid2 = valid2 || _valid1;
if(!valid2){
const _errs16 = errors;
if(data3 !== null){
const err7 = {instancePath:instancePath+"/runStartedAt",schemaPath:"#/properties/runStartedAt/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
var _valid1 = _errs16 === errors;
valid2 = valid2 || _valid1;
}
if(!valid2){
const err8 = {instancePath:instancePath+"/runStartedAt",schemaPath:"#/properties/runStartedAt/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
validate75.errors = vErrors;
return false;
}
else {
errors = _errs13;
if(vErrors !== null){
if(_errs13){
vErrors.length = _errs13;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.connectionUpdatedAt !== undefined){
let data4 = data.connectionUpdatedAt;
const _errs18 = errors;
const _errs19 = errors;
let valid3 = false;
const _errs20 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
const err9 = {instancePath:instancePath+"/connectionUpdatedAt",schemaPath:"#/properties/connectionUpdatedAt/anyOf/0/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(errors === _errs20){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 9007199254740991 || isNaN(data4)){
const err10 = {instancePath:instancePath+"/connectionUpdatedAt",schemaPath:"#/properties/connectionUpdatedAt/anyOf/0/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
else {
if(data4 < 0 || isNaN(data4)){
const err11 = {instancePath:instancePath+"/connectionUpdatedAt",schemaPath:"#/properties/connectionUpdatedAt/anyOf/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
}
}
var _valid2 = _errs20 === errors;
valid3 = valid3 || _valid2;
if(!valid3){
const _errs22 = errors;
if(data4 !== null){
const err12 = {instancePath:instancePath+"/connectionUpdatedAt",schemaPath:"#/properties/connectionUpdatedAt/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
var _valid2 = _errs22 === errors;
valid3 = valid3 || _valid2;
}
if(!valid3){
const err13 = {instancePath:instancePath+"/connectionUpdatedAt",schemaPath:"#/properties/connectionUpdatedAt/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
validate75.errors = vErrors;
return false;
}
else {
errors = _errs19;
if(vErrors !== null){
if(_errs19){
vErrors.length = _errs19;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs18 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.connectionFresh !== undefined){
const _errs24 = errors;
if(typeof data.connectionFresh !== "boolean"){
validate75.errors = [{instancePath:instancePath+"/connectionFresh",schemaPath:"#/properties/connectionFresh/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs24 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.activeSessions !== undefined){
let data6 = data.activeSessions;
const _errs26 = errors;
if(errors === _errs26){
if(Array.isArray(data6)){
if(data6.length > 1){
validate75.errors = [{instancePath:instancePath+"/activeSessions",schemaPath:"#/properties/activeSessions/maxItems",keyword:"maxItems",params:{limit: 1},message:"must NOT have more than 1 items"}];
return false;
}
else {
var valid4 = true;
const len0 = data6.length;
for(let i0=0; i0<len0; i0++){
let data7 = data6[i0];
const _errs28 = errors;
if(errors === _errs28){
if(data7 && typeof data7 == "object" && !Array.isArray(data7)){
let missing1;
if(((data7.sessionId === undefined) && (missing1 = "sessionId")) || ((data7.buyerId === undefined) && (missing1 = "buyerId"))){
validate75.errors = [{instancePath:instancePath+"/activeSessions/" + i0,schemaPath:"#/properties/activeSessions/items/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs30 = errors;
for(const key1 in data7){
if(!((key1 === "sessionId") || (key1 === "buyerId"))){
validate75.errors = [{instancePath:instancePath+"/activeSessions/" + i0,schemaPath:"#/properties/activeSessions/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs30 === errors){
if(data7.sessionId !== undefined){
let data8 = data7.sessionId;
const _errs31 = errors;
if(errors === _errs31){
if(typeof data8 === "string"){
if(!pattern67.test(data8)){
validate75.errors = [{instancePath:instancePath+"/activeSessions/" + i0+"/sessionId",schemaPath:"#/properties/activeSessions/items/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate75.errors = [{instancePath:instancePath+"/activeSessions/" + i0+"/sessionId",schemaPath:"#/properties/activeSessions/items/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid5 = _errs31 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data7.buyerId !== undefined){
let data9 = data7.buyerId;
const _errs33 = errors;
if(errors === _errs33){
if(typeof data9 === "string"){
if(func2(data9) > 120){
validate75.errors = [{instancePath:instancePath+"/activeSessions/" + i0+"/buyerId",schemaPath:"#/properties/activeSessions/items/properties/buyerId/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
}
else {
validate75.errors = [{instancePath:instancePath+"/activeSessions/" + i0+"/buyerId",schemaPath:"#/properties/activeSessions/items/properties/buyerId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid5 = _errs33 === errors;
}
else {
var valid5 = true;
}
}
}
}
}
else {
validate75.errors = [{instancePath:instancePath+"/activeSessions/" + i0,schemaPath:"#/properties/activeSessions/items/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid4 = _errs28 === errors;
if(!valid4){
break;
}
}
}
}
else {
validate75.errors = [{instancePath:instancePath+"/activeSessions",schemaPath:"#/properties/activeSessions/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs26 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.completedRequests !== undefined){
let data10 = data.completedRequests;
const _errs35 = errors;
const _errs36 = errors;
let valid6 = false;
const _errs37 = errors;
if(!(((typeof data10 == "number") && (!(data10 % 1) && !isNaN(data10))) && (isFinite(data10)))){
const err14 = {instancePath:instancePath+"/completedRequests",schemaPath:"#/properties/completedRequests/anyOf/0/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(errors === _errs37){
if((typeof data10 == "number") && (isFinite(data10))){
if(data10 > 9007199254740991 || isNaN(data10)){
const err15 = {instancePath:instancePath+"/completedRequests",schemaPath:"#/properties/completedRequests/anyOf/0/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
else {
if(data10 < 0 || isNaN(data10)){
const err16 = {instancePath:instancePath+"/completedRequests",schemaPath:"#/properties/completedRequests/anyOf/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
}
}
var _valid3 = _errs37 === errors;
valid6 = valid6 || _valid3;
if(!valid6){
const _errs39 = errors;
if(data10 !== null){
const err17 = {instancePath:instancePath+"/completedRequests",schemaPath:"#/properties/completedRequests/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
var _valid3 = _errs39 === errors;
valid6 = valid6 || _valid3;
}
if(!valid6){
const err18 = {instancePath:instancePath+"/completedRequests",schemaPath:"#/properties/completedRequests/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
validate75.errors = vErrors;
return false;
}
else {
errors = _errs36;
if(vErrors !== null){
if(_errs36){
vErrors.length = _errs36;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs35 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.inputTokens !== undefined){
let data11 = data.inputTokens;
const _errs41 = errors;
const _errs42 = errors;
let valid7 = false;
const _errs43 = errors;
if(!(((typeof data11 == "number") && (!(data11 % 1) && !isNaN(data11))) && (isFinite(data11)))){
const err19 = {instancePath:instancePath+"/inputTokens",schemaPath:"#/properties/inputTokens/anyOf/0/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(errors === _errs43){
if((typeof data11 == "number") && (isFinite(data11))){
if(data11 > 9007199254740991 || isNaN(data11)){
const err20 = {instancePath:instancePath+"/inputTokens",schemaPath:"#/properties/inputTokens/anyOf/0/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
else {
if(data11 < 0 || isNaN(data11)){
const err21 = {instancePath:instancePath+"/inputTokens",schemaPath:"#/properties/inputTokens/anyOf/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
}
}
var _valid4 = _errs43 === errors;
valid7 = valid7 || _valid4;
if(!valid7){
const _errs45 = errors;
if(data11 !== null){
const err22 = {instancePath:instancePath+"/inputTokens",schemaPath:"#/properties/inputTokens/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
var _valid4 = _errs45 === errors;
valid7 = valid7 || _valid4;
}
if(!valid7){
const err23 = {instancePath:instancePath+"/inputTokens",schemaPath:"#/properties/inputTokens/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
validate75.errors = vErrors;
return false;
}
else {
errors = _errs42;
if(vErrors !== null){
if(_errs42){
vErrors.length = _errs42;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs41 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.outputTokens !== undefined){
let data12 = data.outputTokens;
const _errs47 = errors;
const _errs48 = errors;
let valid8 = false;
const _errs49 = errors;
if(!(((typeof data12 == "number") && (!(data12 % 1) && !isNaN(data12))) && (isFinite(data12)))){
const err24 = {instancePath:instancePath+"/outputTokens",schemaPath:"#/properties/outputTokens/anyOf/0/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
if(errors === _errs49){
if((typeof data12 == "number") && (isFinite(data12))){
if(data12 > 9007199254740991 || isNaN(data12)){
const err25 = {instancePath:instancePath+"/outputTokens",schemaPath:"#/properties/outputTokens/anyOf/0/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
else {
if(data12 < 0 || isNaN(data12)){
const err26 = {instancePath:instancePath+"/outputTokens",schemaPath:"#/properties/outputTokens/anyOf/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
var _valid5 = _errs49 === errors;
valid8 = valid8 || _valid5;
if(!valid8){
const _errs51 = errors;
if(data12 !== null){
const err27 = {instancePath:instancePath+"/outputTokens",schemaPath:"#/properties/outputTokens/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
var _valid5 = _errs51 === errors;
valid8 = valid8 || _valid5;
}
if(!valid8){
const err28 = {instancePath:instancePath+"/outputTokens",schemaPath:"#/properties/outputTokens/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
validate75.errors = vErrors;
return false;
}
else {
errors = _errs48;
if(vErrors !== null){
if(_errs48){
vErrors.length = _errs48;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs47 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.totalsSince !== undefined){
let data13 = data.totalsSince;
const _errs53 = errors;
const _errs54 = errors;
let valid9 = false;
const _errs55 = errors;
if(!(((typeof data13 == "number") && (!(data13 % 1) && !isNaN(data13))) && (isFinite(data13)))){
const err29 = {instancePath:instancePath+"/totalsSince",schemaPath:"#/properties/totalsSince/anyOf/0/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
if(errors === _errs55){
if((typeof data13 == "number") && (isFinite(data13))){
if(data13 > 9007199254740991 || isNaN(data13)){
const err30 = {instancePath:instancePath+"/totalsSince",schemaPath:"#/properties/totalsSince/anyOf/0/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
else {
if(data13 < 0 || isNaN(data13)){
const err31 = {instancePath:instancePath+"/totalsSince",schemaPath:"#/properties/totalsSince/anyOf/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
}
}
var _valid6 = _errs55 === errors;
valid9 = valid9 || _valid6;
if(!valid9){
const _errs57 = errors;
if(data13 !== null){
const err32 = {instancePath:instancePath+"/totalsSince",schemaPath:"#/properties/totalsSince/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
var _valid6 = _errs57 === errors;
valid9 = valid9 || _valid6;
}
if(!valid9){
const err33 = {instancePath:instancePath+"/totalsSince",schemaPath:"#/properties/totalsSince/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
validate75.errors = vErrors;
return false;
}
else {
errors = _errs54;
if(vErrors !== null){
if(_errs54){
vErrors.length = _errs54;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs53 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.pendingRequests !== undefined){
let data14 = data.pendingRequests;
const _errs59 = errors;
if(!(((typeof data14 == "number") && (!(data14 % 1) && !isNaN(data14))) && (isFinite(data14)))){
validate75.errors = [{instancePath:instancePath+"/pendingRequests",schemaPath:"#/properties/pendingRequests/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs59){
if((typeof data14 == "number") && (isFinite(data14))){
if(data14 > 9007199254740991 || isNaN(data14)){
validate75.errors = [{instancePath:instancePath+"/pendingRequests",schemaPath:"#/properties/pendingRequests/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data14 < 0 || isNaN(data14)){
validate75.errors = [{instancePath:instancePath+"/pendingRequests",schemaPath:"#/properties/pendingRequests/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs59 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.unresolvedRequests !== undefined){
let data15 = data.unresolvedRequests;
const _errs61 = errors;
if(!(((typeof data15 == "number") && (!(data15 % 1) && !isNaN(data15))) && (isFinite(data15)))){
validate75.errors = [{instancePath:instancePath+"/unresolvedRequests",schemaPath:"#/properties/unresolvedRequests/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs61){
if((typeof data15 == "number") && (isFinite(data15))){
if(data15 > 9007199254740991 || isNaN(data15)){
validate75.errors = [{instancePath:instancePath+"/unresolvedRequests",schemaPath:"#/properties/unresolvedRequests/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data15 < 0 || isNaN(data15)){
validate75.errors = [{instancePath:instancePath+"/unresolvedRequests",schemaPath:"#/properties/unresolvedRequests/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs61 === errors;
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
validate75.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate75.errors = vErrors;
return errors === 0;
}

export const PiAssistant = validate76;
const schema97 = {"type":"object","additionalProperties":false,"properties":{"role":{"const":"assistant"},"content":{"type":"array","maxItems":64,"items":{"anyOf":[{"type":"object","additionalProperties":false,"properties":{"type":{"const":"text"},"text":{"type":"string","maxLength":131072},"textSignature":{"type":"string","maxLength":131072},"providerMetadata":{"type":"object","propertyNames":{"pattern":"^[a-zA-Z0-9_-]{1,64}$"},"additionalProperties":{"type":"object","additionalProperties":false,"properties":{"signature":{"type":"string","maxLength":131072},"thoughtSignature":{"type":"string","maxLength":131072},"encryptedContent":{"type":"string","maxLength":131072},"reasoningEncryptedContent":{"type":"string","maxLength":131072},"itemId":{"type":"string","maxLength":131072}},"required":[]}}},"required":["type","text"]},{"type":"object","additionalProperties":false,"properties":{"type":{"const":"thinking"},"thinking":{"type":"string","maxLength":131072},"thinkingSignature":{"type":"string","maxLength":131072},"redacted":{"type":"boolean"},"providerMetadata":{"type":"object","propertyNames":{"pattern":"^[a-zA-Z0-9_-]{1,64}$"},"additionalProperties":{"type":"object","additionalProperties":false,"properties":{"signature":{"type":"string","maxLength":131072},"thoughtSignature":{"type":"string","maxLength":131072},"encryptedContent":{"type":"string","maxLength":131072},"reasoningEncryptedContent":{"type":"string","maxLength":131072},"itemId":{"type":"string","maxLength":131072}},"required":[]}}},"required":["type","thinking"]},{"type":"object","additionalProperties":false,"properties":{"type":{"const":"toolCall"},"id":{"type":"string","pattern":"^[A-Za-z0-9_|:./+=-]{1,2048}$"},"name":{"type":"string","pattern":"^[A-Za-z_][A-Za-z0-9_-]{0,63}$"},"arguments":{"type":"object"},"thoughtSignature":{"type":"string","maxLength":131072},"namespace":{"type":"string","maxLength":256},"providerMetadata":{"type":"object","propertyNames":{"pattern":"^[a-zA-Z0-9_-]{1,64}$"},"additionalProperties":{"type":"object","additionalProperties":false,"properties":{"signature":{"type":"string","maxLength":131072},"thoughtSignature":{"type":"string","maxLength":131072},"encryptedContent":{"type":"string","maxLength":131072},"reasoningEncryptedContent":{"type":"string","maxLength":131072},"itemId":{"type":"string","maxLength":131072}},"required":[]}}},"required":["type","id","name","arguments"]}]}},"api":{"type":"string","maxLength":256},"provider":{"type":"string","maxLength":256},"model":{"type":"string","maxLength":256},"responseId":{"type":"string","maxLength":256},"responseModel":{"type":"string","maxLength":256},"providerThinkingLevel":{"type":"string","maxLength":256},"thinkingLevel":{"type":"string","maxLength":256},"stopReason":{"enum":["stop","length","toolUse"]},"timestamp":{"type":"integer","minimum":0,"maximum":9007199254740991}},"required":["role","content","api","provider","model","stopReason","timestamp"]};
const pattern161 = new RegExp("^[a-zA-Z0-9_-]{1,64}$", "u");

function validate76(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((data.role === undefined) && (missing0 = "role")) || ((data.content === undefined) && (missing0 = "content"))) || ((data.api === undefined) && (missing0 = "api"))) || ((data.provider === undefined) && (missing0 = "provider"))) || ((data.model === undefined) && (missing0 = "model"))) || ((data.stopReason === undefined) && (missing0 = "stopReason"))) || ((data.timestamp === undefined) && (missing0 = "timestamp"))){
validate76.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema97.properties, key0))){
validate76.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.role !== undefined){
const _errs2 = errors;
if("assistant" !== data.role){
validate76.errors = [{instancePath:instancePath+"/role",schemaPath:"#/properties/role/const",keyword:"const",params:{allowedValue: "assistant"},message:"must be equal to constant"}];
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
if(Array.isArray(data1)){
if(data1.length > 64){
validate76.errors = [{instancePath:instancePath+"/content",schemaPath:"#/properties/content/maxItems",keyword:"maxItems",params:{limit: 64},message:"must NOT have more than 64 items"}];
return false;
}
else {
var valid1 = true;
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
let data2 = data1[i0];
const _errs5 = errors;
const _errs6 = errors;
let valid2 = false;
const _errs7 = errors;
if(errors === _errs7){
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
let missing1;
if(((data2.type === undefined) && (missing1 = "type")) || ((data2.text === undefined) && (missing1 = "text"))){
const err0 = {instancePath:instancePath+"/content/" + i0,schemaPath:"#/properties/content/items/anyOf/0/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
const _errs9 = errors;
for(const key1 in data2){
if(!((((key1 === "type") || (key1 === "text")) || (key1 === "textSignature")) || (key1 === "providerMetadata"))){
const err1 = {instancePath:instancePath+"/content/" + i0,schemaPath:"#/properties/content/items/anyOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
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
if(_errs9 === errors){
if(data2.type !== undefined){
const _errs10 = errors;
if("text" !== data2.type){
const err2 = {instancePath:instancePath+"/content/" + i0+"/type",schemaPath:"#/properties/content/items/anyOf/0/properties/type/const",keyword:"const",params:{allowedValue: "text"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var valid3 = _errs10 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data2.text !== undefined){
let data4 = data2.text;
const _errs11 = errors;
if(errors === _errs11){
if(typeof data4 === "string"){
if(func2(data4) > 131072){
const err3 = {instancePath:instancePath+"/content/" + i0+"/text",schemaPath:"#/properties/content/items/anyOf/0/properties/text/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
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
const err4 = {instancePath:instancePath+"/content/" + i0+"/text",schemaPath:"#/properties/content/items/anyOf/0/properties/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
var valid3 = _errs11 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data2.textSignature !== undefined){
let data5 = data2.textSignature;
const _errs13 = errors;
if(errors === _errs13){
if(typeof data5 === "string"){
if(func2(data5) > 131072){
const err5 = {instancePath:instancePath+"/content/" + i0+"/textSignature",schemaPath:"#/properties/content/items/anyOf/0/properties/textSignature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
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
const err6 = {instancePath:instancePath+"/content/" + i0+"/textSignature",schemaPath:"#/properties/content/items/anyOf/0/properties/textSignature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
var valid3 = _errs13 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data2.providerMetadata !== undefined){
let data6 = data2.providerMetadata;
const _errs15 = errors;
if(errors === _errs15){
if(data6 && typeof data6 == "object" && !Array.isArray(data6)){
for(const key2 in data6){
const _errs17 = errors;
if(typeof key2 === "string"){
if(!pattern161.test(key2)){
const err7 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata",schemaPath:"#/properties/content/items/anyOf/0/properties/providerMetadata/propertyNames/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,64}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,64}$"+"\"",propertyName:key2};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
var valid4 = _errs17 === errors;
if(!valid4){
const err8 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata",schemaPath:"#/properties/content/items/anyOf/0/properties/providerMetadata/propertyNames",keyword:"propertyNames",params:{propertyName: key2},message:"property name must be valid"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
break;
}
}
if(valid4){
for(const key3 in data6){
let data7 = data6[key3];
const _errs19 = errors;
if(errors === _errs19){
if(data7 && typeof data7 == "object" && !Array.isArray(data7)){
const _errs21 = errors;
for(const key4 in data7){
if(!(((((key4 === "signature") || (key4 === "thoughtSignature")) || (key4 === "encryptedContent")) || (key4 === "reasoningEncryptedContent")) || (key4 === "itemId"))){
const err9 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
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
if(_errs21 === errors){
if(data7.signature !== undefined){
let data8 = data7.signature;
const _errs22 = errors;
if(errors === _errs22){
if(typeof data8 === "string"){
if(func2(data8) > 131072){
const err10 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1")+"/signature",schemaPath:"#/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/properties/signature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
else {
const err11 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1")+"/signature",schemaPath:"#/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/properties/signature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
var valid6 = _errs22 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data7.thoughtSignature !== undefined){
let data9 = data7.thoughtSignature;
const _errs24 = errors;
if(errors === _errs24){
if(typeof data9 === "string"){
if(func2(data9) > 131072){
const err12 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1")+"/thoughtSignature",schemaPath:"#/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/properties/thoughtSignature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
else {
const err13 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1")+"/thoughtSignature",schemaPath:"#/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/properties/thoughtSignature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
var valid6 = _errs24 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data7.encryptedContent !== undefined){
let data10 = data7.encryptedContent;
const _errs26 = errors;
if(errors === _errs26){
if(typeof data10 === "string"){
if(func2(data10) > 131072){
const err14 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1")+"/encryptedContent",schemaPath:"#/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/properties/encryptedContent/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
else {
const err15 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1")+"/encryptedContent",schemaPath:"#/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/properties/encryptedContent/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
var valid6 = _errs26 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data7.reasoningEncryptedContent !== undefined){
let data11 = data7.reasoningEncryptedContent;
const _errs28 = errors;
if(errors === _errs28){
if(typeof data11 === "string"){
if(func2(data11) > 131072){
const err16 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1")+"/reasoningEncryptedContent",schemaPath:"#/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/properties/reasoningEncryptedContent/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
else {
const err17 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1")+"/reasoningEncryptedContent",schemaPath:"#/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/properties/reasoningEncryptedContent/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
var valid6 = _errs28 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data7.itemId !== undefined){
let data12 = data7.itemId;
const _errs30 = errors;
if(errors === _errs30){
if(typeof data12 === "string"){
if(func2(data12) > 131072){
const err18 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1")+"/itemId",schemaPath:"#/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/properties/itemId/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
else {
const err19 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1")+"/itemId",schemaPath:"#/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/properties/itemId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
var valid6 = _errs30 === errors;
}
else {
var valid6 = true;
}
}
}
}
}
}
}
else {
const err20 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
var valid5 = _errs19 === errors;
if(!valid5){
break;
}
}
}
}
else {
const err21 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata",schemaPath:"#/properties/content/items/anyOf/0/properties/providerMetadata/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
var valid3 = _errs15 === errors;
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
else {
const err22 = {instancePath:instancePath+"/content/" + i0,schemaPath:"#/properties/content/items/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
var _valid0 = _errs7 === errors;
valid2 = valid2 || _valid0;
if(!valid2){
const _errs32 = errors;
if(errors === _errs32){
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
let missing2;
if(((data2.type === undefined) && (missing2 = "type")) || ((data2.thinking === undefined) && (missing2 = "thinking"))){
const err23 = {instancePath:instancePath+"/content/" + i0,schemaPath:"#/properties/content/items/anyOf/1/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
else {
const _errs34 = errors;
for(const key5 in data2){
if(!(((((key5 === "type") || (key5 === "thinking")) || (key5 === "thinkingSignature")) || (key5 === "redacted")) || (key5 === "providerMetadata"))){
const err24 = {instancePath:instancePath+"/content/" + i0,schemaPath:"#/properties/content/items/anyOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
break;
}
}
if(_errs34 === errors){
if(data2.type !== undefined){
const _errs35 = errors;
if("thinking" !== data2.type){
const err25 = {instancePath:instancePath+"/content/" + i0+"/type",schemaPath:"#/properties/content/items/anyOf/1/properties/type/const",keyword:"const",params:{allowedValue: "thinking"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
var valid7 = _errs35 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data2.thinking !== undefined){
let data14 = data2.thinking;
const _errs36 = errors;
if(errors === _errs36){
if(typeof data14 === "string"){
if(func2(data14) > 131072){
const err26 = {instancePath:instancePath+"/content/" + i0+"/thinking",schemaPath:"#/properties/content/items/anyOf/1/properties/thinking/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
else {
const err27 = {instancePath:instancePath+"/content/" + i0+"/thinking",schemaPath:"#/properties/content/items/anyOf/1/properties/thinking/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
var valid7 = _errs36 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data2.thinkingSignature !== undefined){
let data15 = data2.thinkingSignature;
const _errs38 = errors;
if(errors === _errs38){
if(typeof data15 === "string"){
if(func2(data15) > 131072){
const err28 = {instancePath:instancePath+"/content/" + i0+"/thinkingSignature",schemaPath:"#/properties/content/items/anyOf/1/properties/thinkingSignature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
else {
const err29 = {instancePath:instancePath+"/content/" + i0+"/thinkingSignature",schemaPath:"#/properties/content/items/anyOf/1/properties/thinkingSignature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
var valid7 = _errs38 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data2.redacted !== undefined){
const _errs40 = errors;
if(typeof data2.redacted !== "boolean"){
const err30 = {instancePath:instancePath+"/content/" + i0+"/redacted",schemaPath:"#/properties/content/items/anyOf/1/properties/redacted/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
var valid7 = _errs40 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data2.providerMetadata !== undefined){
let data17 = data2.providerMetadata;
const _errs42 = errors;
if(errors === _errs42){
if(data17 && typeof data17 == "object" && !Array.isArray(data17)){
for(const key6 in data17){
const _errs44 = errors;
if(typeof key6 === "string"){
if(!pattern161.test(key6)){
const err31 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata",schemaPath:"#/properties/content/items/anyOf/1/properties/providerMetadata/propertyNames/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,64}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,64}$"+"\"",propertyName:key6};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
var valid8 = _errs44 === errors;
if(!valid8){
const err32 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata",schemaPath:"#/properties/content/items/anyOf/1/properties/providerMetadata/propertyNames",keyword:"propertyNames",params:{propertyName: key6},message:"property name must be valid"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
break;
}
}
if(valid8){
for(const key7 in data17){
let data18 = data17[key7];
const _errs46 = errors;
if(errors === _errs46){
if(data18 && typeof data18 == "object" && !Array.isArray(data18)){
const _errs48 = errors;
for(const key8 in data18){
if(!(((((key8 === "signature") || (key8 === "thoughtSignature")) || (key8 === "encryptedContent")) || (key8 === "reasoningEncryptedContent")) || (key8 === "itemId"))){
const err33 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key7.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
break;
}
}
if(_errs48 === errors){
if(data18.signature !== undefined){
let data19 = data18.signature;
const _errs49 = errors;
if(errors === _errs49){
if(typeof data19 === "string"){
if(func2(data19) > 131072){
const err34 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key7.replace(/~/g, "~0").replace(/\//g, "~1")+"/signature",schemaPath:"#/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/properties/signature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
else {
const err35 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key7.replace(/~/g, "~0").replace(/\//g, "~1")+"/signature",schemaPath:"#/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/properties/signature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
var valid10 = _errs49 === errors;
}
else {
var valid10 = true;
}
if(valid10){
if(data18.thoughtSignature !== undefined){
let data20 = data18.thoughtSignature;
const _errs51 = errors;
if(errors === _errs51){
if(typeof data20 === "string"){
if(func2(data20) > 131072){
const err36 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key7.replace(/~/g, "~0").replace(/\//g, "~1")+"/thoughtSignature",schemaPath:"#/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/properties/thoughtSignature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
else {
const err37 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key7.replace(/~/g, "~0").replace(/\//g, "~1")+"/thoughtSignature",schemaPath:"#/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/properties/thoughtSignature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
var valid10 = _errs51 === errors;
}
else {
var valid10 = true;
}
if(valid10){
if(data18.encryptedContent !== undefined){
let data21 = data18.encryptedContent;
const _errs53 = errors;
if(errors === _errs53){
if(typeof data21 === "string"){
if(func2(data21) > 131072){
const err38 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key7.replace(/~/g, "~0").replace(/\//g, "~1")+"/encryptedContent",schemaPath:"#/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/properties/encryptedContent/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
else {
const err39 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key7.replace(/~/g, "~0").replace(/\//g, "~1")+"/encryptedContent",schemaPath:"#/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/properties/encryptedContent/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
var valid10 = _errs53 === errors;
}
else {
var valid10 = true;
}
if(valid10){
if(data18.reasoningEncryptedContent !== undefined){
let data22 = data18.reasoningEncryptedContent;
const _errs55 = errors;
if(errors === _errs55){
if(typeof data22 === "string"){
if(func2(data22) > 131072){
const err40 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key7.replace(/~/g, "~0").replace(/\//g, "~1")+"/reasoningEncryptedContent",schemaPath:"#/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/properties/reasoningEncryptedContent/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
else {
const err41 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key7.replace(/~/g, "~0").replace(/\//g, "~1")+"/reasoningEncryptedContent",schemaPath:"#/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/properties/reasoningEncryptedContent/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
var valid10 = _errs55 === errors;
}
else {
var valid10 = true;
}
if(valid10){
if(data18.itemId !== undefined){
let data23 = data18.itemId;
const _errs57 = errors;
if(errors === _errs57){
if(typeof data23 === "string"){
if(func2(data23) > 131072){
const err42 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key7.replace(/~/g, "~0").replace(/\//g, "~1")+"/itemId",schemaPath:"#/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/properties/itemId/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
else {
const err43 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key7.replace(/~/g, "~0").replace(/\//g, "~1")+"/itemId",schemaPath:"#/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/properties/itemId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
var valid10 = _errs57 === errors;
}
else {
var valid10 = true;
}
}
}
}
}
}
}
else {
const err44 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key7.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
var valid9 = _errs46 === errors;
if(!valid9){
break;
}
}
}
}
else {
const err45 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata",schemaPath:"#/properties/content/items/anyOf/1/properties/providerMetadata/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
var valid7 = _errs42 === errors;
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
else {
const err46 = {instancePath:instancePath+"/content/" + i0,schemaPath:"#/properties/content/items/anyOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
var _valid0 = _errs32 === errors;
valid2 = valid2 || _valid0;
if(!valid2){
const _errs59 = errors;
if(errors === _errs59){
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
let missing3;
if(((((data2.type === undefined) && (missing3 = "type")) || ((data2.id === undefined) && (missing3 = "id"))) || ((data2.name === undefined) && (missing3 = "name"))) || ((data2.arguments === undefined) && (missing3 = "arguments"))){
const err47 = {instancePath:instancePath+"/content/" + i0,schemaPath:"#/properties/content/items/anyOf/2/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
else {
const _errs61 = errors;
for(const key9 in data2){
if(!(((((((key9 === "type") || (key9 === "id")) || (key9 === "name")) || (key9 === "arguments")) || (key9 === "thoughtSignature")) || (key9 === "namespace")) || (key9 === "providerMetadata"))){
const err48 = {instancePath:instancePath+"/content/" + i0,schemaPath:"#/properties/content/items/anyOf/2/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key9},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
break;
}
}
if(_errs61 === errors){
if(data2.type !== undefined){
const _errs62 = errors;
if("toolCall" !== data2.type){
const err49 = {instancePath:instancePath+"/content/" + i0+"/type",schemaPath:"#/properties/content/items/anyOf/2/properties/type/const",keyword:"const",params:{allowedValue: "toolCall"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
var valid11 = _errs62 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data2.id !== undefined){
let data25 = data2.id;
const _errs63 = errors;
if(errors === _errs63){
if(typeof data25 === "string"){
if(!pattern137.test(data25)){
const err50 = {instancePath:instancePath+"/content/" + i0+"/id",schemaPath:"#/properties/content/items/anyOf/2/properties/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z0-9_|:./+=-]{1,2048}$"},message:"must match pattern \""+"^[A-Za-z0-9_|:./+=-]{1,2048}$"+"\""};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
else {
const err51 = {instancePath:instancePath+"/content/" + i0+"/id",schemaPath:"#/properties/content/items/anyOf/2/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
var valid11 = _errs63 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data2.name !== undefined){
let data26 = data2.name;
const _errs65 = errors;
if(errors === _errs65){
if(typeof data26 === "string"){
if(!pattern138.test(data26)){
const err52 = {instancePath:instancePath+"/content/" + i0+"/name",schemaPath:"#/properties/content/items/anyOf/2/properties/name/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z_][A-Za-z0-9_-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z_][A-Za-z0-9_-]{0,63}$"+"\""};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
else {
const err53 = {instancePath:instancePath+"/content/" + i0+"/name",schemaPath:"#/properties/content/items/anyOf/2/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
var valid11 = _errs65 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data2.arguments !== undefined){
let data27 = data2.arguments;
const _errs67 = errors;
if(!(data27 && typeof data27 == "object" && !Array.isArray(data27))){
const err54 = {instancePath:instancePath+"/content/" + i0+"/arguments",schemaPath:"#/properties/content/items/anyOf/2/properties/arguments/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
var valid11 = _errs67 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data2.thoughtSignature !== undefined){
let data28 = data2.thoughtSignature;
const _errs69 = errors;
if(errors === _errs69){
if(typeof data28 === "string"){
if(func2(data28) > 131072){
const err55 = {instancePath:instancePath+"/content/" + i0+"/thoughtSignature",schemaPath:"#/properties/content/items/anyOf/2/properties/thoughtSignature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
else {
const err56 = {instancePath:instancePath+"/content/" + i0+"/thoughtSignature",schemaPath:"#/properties/content/items/anyOf/2/properties/thoughtSignature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
var valid11 = _errs69 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data2.namespace !== undefined){
let data29 = data2.namespace;
const _errs71 = errors;
if(errors === _errs71){
if(typeof data29 === "string"){
if(func2(data29) > 256){
const err57 = {instancePath:instancePath+"/content/" + i0+"/namespace",schemaPath:"#/properties/content/items/anyOf/2/properties/namespace/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
else {
const err58 = {instancePath:instancePath+"/content/" + i0+"/namespace",schemaPath:"#/properties/content/items/anyOf/2/properties/namespace/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
var valid11 = _errs71 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data2.providerMetadata !== undefined){
let data30 = data2.providerMetadata;
const _errs73 = errors;
if(errors === _errs73){
if(data30 && typeof data30 == "object" && !Array.isArray(data30)){
for(const key10 in data30){
const _errs75 = errors;
if(typeof key10 === "string"){
if(!pattern161.test(key10)){
const err59 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata",schemaPath:"#/properties/content/items/anyOf/2/properties/providerMetadata/propertyNames/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,64}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,64}$"+"\"",propertyName:key10};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
var valid12 = _errs75 === errors;
if(!valid12){
const err60 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata",schemaPath:"#/properties/content/items/anyOf/2/properties/providerMetadata/propertyNames",keyword:"propertyNames",params:{propertyName: key10},message:"property name must be valid"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
break;
}
}
if(valid12){
for(const key11 in data30){
let data31 = data30[key11];
const _errs77 = errors;
if(errors === _errs77){
if(data31 && typeof data31 == "object" && !Array.isArray(data31)){
const _errs79 = errors;
for(const key12 in data31){
if(!(((((key12 === "signature") || (key12 === "thoughtSignature")) || (key12 === "encryptedContent")) || (key12 === "reasoningEncryptedContent")) || (key12 === "itemId"))){
const err61 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key11.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key12},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
break;
}
}
if(_errs79 === errors){
if(data31.signature !== undefined){
let data32 = data31.signature;
const _errs80 = errors;
if(errors === _errs80){
if(typeof data32 === "string"){
if(func2(data32) > 131072){
const err62 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key11.replace(/~/g, "~0").replace(/\//g, "~1")+"/signature",schemaPath:"#/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/properties/signature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
}
else {
const err63 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key11.replace(/~/g, "~0").replace(/\//g, "~1")+"/signature",schemaPath:"#/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/properties/signature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
var valid14 = _errs80 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data31.thoughtSignature !== undefined){
let data33 = data31.thoughtSignature;
const _errs82 = errors;
if(errors === _errs82){
if(typeof data33 === "string"){
if(func2(data33) > 131072){
const err64 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key11.replace(/~/g, "~0").replace(/\//g, "~1")+"/thoughtSignature",schemaPath:"#/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/properties/thoughtSignature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
else {
const err65 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key11.replace(/~/g, "~0").replace(/\//g, "~1")+"/thoughtSignature",schemaPath:"#/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/properties/thoughtSignature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
var valid14 = _errs82 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data31.encryptedContent !== undefined){
let data34 = data31.encryptedContent;
const _errs84 = errors;
if(errors === _errs84){
if(typeof data34 === "string"){
if(func2(data34) > 131072){
const err66 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key11.replace(/~/g, "~0").replace(/\//g, "~1")+"/encryptedContent",schemaPath:"#/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/properties/encryptedContent/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
else {
const err67 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key11.replace(/~/g, "~0").replace(/\//g, "~1")+"/encryptedContent",schemaPath:"#/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/properties/encryptedContent/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
}
var valid14 = _errs84 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data31.reasoningEncryptedContent !== undefined){
let data35 = data31.reasoningEncryptedContent;
const _errs86 = errors;
if(errors === _errs86){
if(typeof data35 === "string"){
if(func2(data35) > 131072){
const err68 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key11.replace(/~/g, "~0").replace(/\//g, "~1")+"/reasoningEncryptedContent",schemaPath:"#/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/properties/reasoningEncryptedContent/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
else {
const err69 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key11.replace(/~/g, "~0").replace(/\//g, "~1")+"/reasoningEncryptedContent",schemaPath:"#/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/properties/reasoningEncryptedContent/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
var valid14 = _errs86 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data31.itemId !== undefined){
let data36 = data31.itemId;
const _errs88 = errors;
if(errors === _errs88){
if(typeof data36 === "string"){
if(func2(data36) > 131072){
const err70 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key11.replace(/~/g, "~0").replace(/\//g, "~1")+"/itemId",schemaPath:"#/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/properties/itemId/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
else {
const err71 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key11.replace(/~/g, "~0").replace(/\//g, "~1")+"/itemId",schemaPath:"#/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/properties/itemId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
}
var valid14 = _errs88 === errors;
}
else {
var valid14 = true;
}
}
}
}
}
}
}
else {
const err72 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key11.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
}
var valid13 = _errs77 === errors;
if(!valid13){
break;
}
}
}
}
else {
const err73 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata",schemaPath:"#/properties/content/items/anyOf/2/properties/providerMetadata/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
}
var valid11 = _errs73 === errors;
}
else {
var valid11 = true;
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
const err74 = {instancePath:instancePath+"/content/" + i0,schemaPath:"#/properties/content/items/anyOf/2/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
var _valid0 = _errs59 === errors;
valid2 = valid2 || _valid0;
}
}
if(!valid2){
const err75 = {instancePath:instancePath+"/content/" + i0,schemaPath:"#/properties/content/items/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
validate76.errors = vErrors;
return false;
}
else {
errors = _errs6;
if(vErrors !== null){
if(_errs6){
vErrors.length = _errs6;
}
else {
vErrors = null;
}
}
}
var valid1 = _errs5 === errors;
if(!valid1){
break;
}
}
}
}
else {
validate76.errors = [{instancePath:instancePath+"/content",schemaPath:"#/properties/content/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.api !== undefined){
let data37 = data.api;
const _errs90 = errors;
if(errors === _errs90){
if(typeof data37 === "string"){
if(func2(data37) > 256){
validate76.errors = [{instancePath:instancePath+"/api",schemaPath:"#/properties/api/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate76.errors = [{instancePath:instancePath+"/api",schemaPath:"#/properties/api/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs90 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.provider !== undefined){
let data38 = data.provider;
const _errs92 = errors;
if(errors === _errs92){
if(typeof data38 === "string"){
if(func2(data38) > 256){
validate76.errors = [{instancePath:instancePath+"/provider",schemaPath:"#/properties/provider/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate76.errors = [{instancePath:instancePath+"/provider",schemaPath:"#/properties/provider/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs92 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.model !== undefined){
let data39 = data.model;
const _errs94 = errors;
if(errors === _errs94){
if(typeof data39 === "string"){
if(func2(data39) > 256){
validate76.errors = [{instancePath:instancePath+"/model",schemaPath:"#/properties/model/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate76.errors = [{instancePath:instancePath+"/model",schemaPath:"#/properties/model/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs94 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.responseId !== undefined){
let data40 = data.responseId;
const _errs96 = errors;
if(errors === _errs96){
if(typeof data40 === "string"){
if(func2(data40) > 256){
validate76.errors = [{instancePath:instancePath+"/responseId",schemaPath:"#/properties/responseId/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate76.errors = [{instancePath:instancePath+"/responseId",schemaPath:"#/properties/responseId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs96 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.responseModel !== undefined){
let data41 = data.responseModel;
const _errs98 = errors;
if(errors === _errs98){
if(typeof data41 === "string"){
if(func2(data41) > 256){
validate76.errors = [{instancePath:instancePath+"/responseModel",schemaPath:"#/properties/responseModel/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate76.errors = [{instancePath:instancePath+"/responseModel",schemaPath:"#/properties/responseModel/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs98 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.providerThinkingLevel !== undefined){
let data42 = data.providerThinkingLevel;
const _errs100 = errors;
if(errors === _errs100){
if(typeof data42 === "string"){
if(func2(data42) > 256){
validate76.errors = [{instancePath:instancePath+"/providerThinkingLevel",schemaPath:"#/properties/providerThinkingLevel/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate76.errors = [{instancePath:instancePath+"/providerThinkingLevel",schemaPath:"#/properties/providerThinkingLevel/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs100 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.thinkingLevel !== undefined){
let data43 = data.thinkingLevel;
const _errs102 = errors;
if(errors === _errs102){
if(typeof data43 === "string"){
if(func2(data43) > 256){
validate76.errors = [{instancePath:instancePath+"/thinkingLevel",schemaPath:"#/properties/thinkingLevel/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate76.errors = [{instancePath:instancePath+"/thinkingLevel",schemaPath:"#/properties/thinkingLevel/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs102 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.stopReason !== undefined){
let data44 = data.stopReason;
const _errs104 = errors;
if(!(((data44 === "stop") || (data44 === "length")) || (data44 === "toolUse"))){
validate76.errors = [{instancePath:instancePath+"/stopReason",schemaPath:"#/properties/stopReason/enum",keyword:"enum",params:{allowedValues: schema97.properties.stopReason.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs104 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.timestamp !== undefined){
let data45 = data.timestamp;
const _errs105 = errors;
if(!(((typeof data45 == "number") && (!(data45 % 1) && !isNaN(data45))) && (isFinite(data45)))){
validate76.errors = [{instancePath:instancePath+"/timestamp",schemaPath:"#/properties/timestamp/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs105){
if((typeof data45 == "number") && (isFinite(data45))){
if(data45 > 9007199254740991 || isNaN(data45)){
validate76.errors = [{instancePath:instancePath+"/timestamp",schemaPath:"#/properties/timestamp/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data45 < 0 || isNaN(data45)){
validate76.errors = [{instancePath:instancePath+"/timestamp",schemaPath:"#/properties/timestamp/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs105 === errors;
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
else {
validate76.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate76.errors = vErrors;
return errors === 0;
}

export const PiMessage = validate77;
const schema98 = {"anyOf":[{"type":"object","additionalProperties":false,"properties":{"role":{"enum":["system","user"]},"content":{"anyOf":[{"type":"string","maxLength":131072},{"type":"array","maxItems":64,"items":{"type":"object","additionalProperties":false,"properties":{"type":{"const":"text"},"text":{"type":"string","maxLength":131072},"textSignature":{"type":"string","maxLength":131072},"providerMetadata":{"type":"object","propertyNames":{"pattern":"^[a-zA-Z0-9_-]{1,64}$"},"additionalProperties":{"type":"object","additionalProperties":false,"properties":{"signature":{"type":"string","maxLength":131072},"thoughtSignature":{"type":"string","maxLength":131072},"encryptedContent":{"type":"string","maxLength":131072},"reasoningEncryptedContent":{"type":"string","maxLength":131072},"itemId":{"type":"string","maxLength":131072}},"required":[]}}},"required":["type","text"]}}]},"timestamp":{"type":"integer","minimum":0,"maximum":9007199254740991}},"required":["role","content","timestamp"]},{"$ref":"#/$defs/PiAssistant"},{"type":"object","additionalProperties":false,"properties":{"role":{"const":"toolResult"},"toolCallId":{"type":"string","pattern":"^[A-Za-z0-9_|:./+=-]{1,2048}$"},"toolName":{"type":"string","maxLength":256},"content":{"type":"array","maxItems":64,"items":{"type":"object","additionalProperties":false,"properties":{"type":{"const":"text"},"text":{"type":"string","maxLength":131072},"textSignature":{"type":"string","maxLength":131072},"providerMetadata":{"type":"object","propertyNames":{"pattern":"^[a-zA-Z0-9_-]{1,64}$"},"additionalProperties":{"type":"object","additionalProperties":false,"properties":{"signature":{"type":"string","maxLength":131072},"thoughtSignature":{"type":"string","maxLength":131072},"encryptedContent":{"type":"string","maxLength":131072},"reasoningEncryptedContent":{"type":"string","maxLength":131072},"itemId":{"type":"string","maxLength":131072}},"required":[]}}},"required":["type","text"]}},"isError":{"type":"boolean"},"timestamp":{"type":"integer","minimum":0,"maximum":9007199254740991}},"required":["role","toolCallId","toolName","content","isError","timestamp"]}]};

function validate77(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
const _errs0 = errors;
let valid0 = false;
const _errs1 = errors;
if(errors === _errs1){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.role === undefined) && (missing0 = "role")) || ((data.content === undefined) && (missing0 = "content"))) || ((data.timestamp === undefined) && (missing0 = "timestamp"))){
const err0 = {instancePath,schemaPath:"#/anyOf/0/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"};
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
if(!(((key0 === "role") || (key0 === "content")) || (key0 === "timestamp"))){
const err1 = {instancePath,schemaPath:"#/anyOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
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
if(data.role !== undefined){
let data0 = data.role;
const _errs4 = errors;
if(!((data0 === "system") || (data0 === "user"))){
const err2 = {instancePath:instancePath+"/role",schemaPath:"#/anyOf/0/properties/role/enum",keyword:"enum",params:{allowedValues: schema98.anyOf[0].properties.role.enum},message:"must be equal to one of the allowed values"};
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
if(data.content !== undefined){
let data1 = data.content;
const _errs5 = errors;
const _errs6 = errors;
let valid2 = false;
const _errs7 = errors;
if(errors === _errs7){
if(typeof data1 === "string"){
if(func2(data1) > 131072){
const err3 = {instancePath:instancePath+"/content",schemaPath:"#/anyOf/0/properties/content/anyOf/0/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
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
const err4 = {instancePath:instancePath+"/content",schemaPath:"#/anyOf/0/properties/content/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
var _valid1 = _errs7 === errors;
valid2 = valid2 || _valid1;
if(!valid2){
const _errs9 = errors;
if(errors === _errs9){
if(Array.isArray(data1)){
if(data1.length > 64){
const err5 = {instancePath:instancePath+"/content",schemaPath:"#/anyOf/0/properties/content/anyOf/1/maxItems",keyword:"maxItems",params:{limit: 64},message:"must NOT have more than 64 items"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
else {
var valid3 = true;
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
let data2 = data1[i0];
const _errs11 = errors;
if(errors === _errs11){
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
let missing1;
if(((data2.type === undefined) && (missing1 = "type")) || ((data2.text === undefined) && (missing1 = "text"))){
const err6 = {instancePath:instancePath+"/content/" + i0,schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
else {
const _errs13 = errors;
for(const key1 in data2){
if(!((((key1 === "type") || (key1 === "text")) || (key1 === "textSignature")) || (key1 === "providerMetadata"))){
const err7 = {instancePath:instancePath+"/content/" + i0,schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
break;
}
}
if(_errs13 === errors){
if(data2.type !== undefined){
const _errs14 = errors;
if("text" !== data2.type){
const err8 = {instancePath:instancePath+"/content/" + i0+"/type",schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/properties/type/const",keyword:"const",params:{allowedValue: "text"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
var valid4 = _errs14 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data2.text !== undefined){
let data4 = data2.text;
const _errs15 = errors;
if(errors === _errs15){
if(typeof data4 === "string"){
if(func2(data4) > 131072){
const err9 = {instancePath:instancePath+"/content/" + i0+"/text",schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/properties/text/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
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
const err10 = {instancePath:instancePath+"/content/" + i0+"/text",schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/properties/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
var valid4 = _errs15 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data2.textSignature !== undefined){
let data5 = data2.textSignature;
const _errs17 = errors;
if(errors === _errs17){
if(typeof data5 === "string"){
if(func2(data5) > 131072){
const err11 = {instancePath:instancePath+"/content/" + i0+"/textSignature",schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/properties/textSignature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
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
const err12 = {instancePath:instancePath+"/content/" + i0+"/textSignature",schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/properties/textSignature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
var valid4 = _errs17 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data2.providerMetadata !== undefined){
let data6 = data2.providerMetadata;
const _errs19 = errors;
if(errors === _errs19){
if(data6 && typeof data6 == "object" && !Array.isArray(data6)){
for(const key2 in data6){
const _errs21 = errors;
if(typeof key2 === "string"){
if(!pattern161.test(key2)){
const err13 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata",schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/properties/providerMetadata/propertyNames/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,64}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,64}$"+"\"",propertyName:key2};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
var valid5 = _errs21 === errors;
if(!valid5){
const err14 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata",schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/properties/providerMetadata/propertyNames",keyword:"propertyNames",params:{propertyName: key2},message:"property name must be valid"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
break;
}
}
if(valid5){
for(const key3 in data6){
let data7 = data6[key3];
const _errs23 = errors;
if(errors === _errs23){
if(data7 && typeof data7 == "object" && !Array.isArray(data7)){
const _errs25 = errors;
for(const key4 in data7){
if(!(((((key4 === "signature") || (key4 === "thoughtSignature")) || (key4 === "encryptedContent")) || (key4 === "reasoningEncryptedContent")) || (key4 === "itemId"))){
const err15 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/properties/providerMetadata/additionalProperties/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
break;
}
}
if(_errs25 === errors){
if(data7.signature !== undefined){
let data8 = data7.signature;
const _errs26 = errors;
if(errors === _errs26){
if(typeof data8 === "string"){
if(func2(data8) > 131072){
const err16 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1")+"/signature",schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/properties/providerMetadata/additionalProperties/properties/signature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
else {
const err17 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1")+"/signature",schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/properties/providerMetadata/additionalProperties/properties/signature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
var valid7 = _errs26 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data7.thoughtSignature !== undefined){
let data9 = data7.thoughtSignature;
const _errs28 = errors;
if(errors === _errs28){
if(typeof data9 === "string"){
if(func2(data9) > 131072){
const err18 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1")+"/thoughtSignature",schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/properties/providerMetadata/additionalProperties/properties/thoughtSignature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
else {
const err19 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1")+"/thoughtSignature",schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/properties/providerMetadata/additionalProperties/properties/thoughtSignature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
var valid7 = _errs28 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data7.encryptedContent !== undefined){
let data10 = data7.encryptedContent;
const _errs30 = errors;
if(errors === _errs30){
if(typeof data10 === "string"){
if(func2(data10) > 131072){
const err20 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1")+"/encryptedContent",schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/properties/providerMetadata/additionalProperties/properties/encryptedContent/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
else {
const err21 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1")+"/encryptedContent",schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/properties/providerMetadata/additionalProperties/properties/encryptedContent/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
var valid7 = _errs30 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data7.reasoningEncryptedContent !== undefined){
let data11 = data7.reasoningEncryptedContent;
const _errs32 = errors;
if(errors === _errs32){
if(typeof data11 === "string"){
if(func2(data11) > 131072){
const err22 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1")+"/reasoningEncryptedContent",schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/properties/providerMetadata/additionalProperties/properties/reasoningEncryptedContent/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
else {
const err23 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1")+"/reasoningEncryptedContent",schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/properties/providerMetadata/additionalProperties/properties/reasoningEncryptedContent/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
var valid7 = _errs32 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data7.itemId !== undefined){
let data12 = data7.itemId;
const _errs34 = errors;
if(errors === _errs34){
if(typeof data12 === "string"){
if(func2(data12) > 131072){
const err24 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1")+"/itemId",schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/properties/providerMetadata/additionalProperties/properties/itemId/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
else {
const err25 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1")+"/itemId",schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/properties/providerMetadata/additionalProperties/properties/itemId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
var valid7 = _errs34 === errors;
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
else {
const err26 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata/" + key3.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/properties/providerMetadata/additionalProperties/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
var valid6 = _errs23 === errors;
if(!valid6){
break;
}
}
}
}
else {
const err27 = {instancePath:instancePath+"/content/" + i0+"/providerMetadata",schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/properties/providerMetadata/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
var valid4 = _errs19 === errors;
}
else {
var valid4 = true;
}
}
}
}
}
}
}
else {
const err28 = {instancePath:instancePath+"/content/" + i0,schemaPath:"#/anyOf/0/properties/content/anyOf/1/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
var valid3 = _errs11 === errors;
if(!valid3){
break;
}
}
}
}
else {
const err29 = {instancePath:instancePath+"/content",schemaPath:"#/anyOf/0/properties/content/anyOf/1/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
var _valid1 = _errs9 === errors;
valid2 = valid2 || _valid1;
}
if(!valid2){
const err30 = {instancePath:instancePath+"/content",schemaPath:"#/anyOf/0/properties/content/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
else {
errors = _errs6;
if(vErrors !== null){
if(_errs6){
vErrors.length = _errs6;
}
else {
vErrors = null;
}
}
}
var valid1 = _errs5 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.timestamp !== undefined){
let data13 = data.timestamp;
const _errs36 = errors;
if(!(((typeof data13 == "number") && (!(data13 % 1) && !isNaN(data13))) && (isFinite(data13)))){
const err31 = {instancePath:instancePath+"/timestamp",schemaPath:"#/anyOf/0/properties/timestamp/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if(errors === _errs36){
if((typeof data13 == "number") && (isFinite(data13))){
if(data13 > 9007199254740991 || isNaN(data13)){
const err32 = {instancePath:instancePath+"/timestamp",schemaPath:"#/anyOf/0/properties/timestamp/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
else {
if(data13 < 0 || isNaN(data13)){
const err33 = {instancePath:instancePath+"/timestamp",schemaPath:"#/anyOf/0/properties/timestamp/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
var valid1 = _errs36 === errors;
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
const err34 = {instancePath,schemaPath:"#/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
var _valid0 = _errs1 === errors;
valid0 = valid0 || _valid0;
if(!valid0){
const _errs38 = errors;
const _errs39 = errors;
if(errors === _errs39){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing2;
if((((((((data.role === undefined) && (missing2 = "role")) || ((data.content === undefined) && (missing2 = "content"))) || ((data.api === undefined) && (missing2 = "api"))) || ((data.provider === undefined) && (missing2 = "provider"))) || ((data.model === undefined) && (missing2 = "model"))) || ((data.stopReason === undefined) && (missing2 = "stopReason"))) || ((data.timestamp === undefined) && (missing2 = "timestamp"))){
const err35 = {instancePath,schemaPath:"#/$defs/PiAssistant/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
else {
const _errs41 = errors;
for(const key5 in data){
if(!(func7.call(schema97.properties, key5))){
const err36 = {instancePath,schemaPath:"#/$defs/PiAssistant/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
break;
}
}
if(_errs41 === errors){
if(data.role !== undefined){
const _errs42 = errors;
if("assistant" !== data.role){
const err37 = {instancePath:instancePath+"/role",schemaPath:"#/$defs/PiAssistant/properties/role/const",keyword:"const",params:{allowedValue: "assistant"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
var valid9 = _errs42 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data.content !== undefined){
let data15 = data.content;
const _errs43 = errors;
if(errors === _errs43){
if(Array.isArray(data15)){
if(data15.length > 64){
const err38 = {instancePath:instancePath+"/content",schemaPath:"#/$defs/PiAssistant/properties/content/maxItems",keyword:"maxItems",params:{limit: 64},message:"must NOT have more than 64 items"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
else {
var valid10 = true;
const len1 = data15.length;
for(let i1=0; i1<len1; i1++){
let data16 = data15[i1];
const _errs45 = errors;
const _errs46 = errors;
let valid11 = false;
const _errs47 = errors;
if(errors === _errs47){
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
let missing3;
if(((data16.type === undefined) && (missing3 = "type")) || ((data16.text === undefined) && (missing3 = "text"))){
const err39 = {instancePath:instancePath+"/content/" + i1,schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
else {
const _errs49 = errors;
for(const key6 in data16){
if(!((((key6 === "type") || (key6 === "text")) || (key6 === "textSignature")) || (key6 === "providerMetadata"))){
const err40 = {instancePath:instancePath+"/content/" + i1,schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
break;
}
}
if(_errs49 === errors){
if(data16.type !== undefined){
const _errs50 = errors;
if("text" !== data16.type){
const err41 = {instancePath:instancePath+"/content/" + i1+"/type",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/properties/type/const",keyword:"const",params:{allowedValue: "text"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
var valid12 = _errs50 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data16.text !== undefined){
let data18 = data16.text;
const _errs51 = errors;
if(errors === _errs51){
if(typeof data18 === "string"){
if(func2(data18) > 131072){
const err42 = {instancePath:instancePath+"/content/" + i1+"/text",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/properties/text/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
else {
const err43 = {instancePath:instancePath+"/content/" + i1+"/text",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/properties/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
var valid12 = _errs51 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data16.textSignature !== undefined){
let data19 = data16.textSignature;
const _errs53 = errors;
if(errors === _errs53){
if(typeof data19 === "string"){
if(func2(data19) > 131072){
const err44 = {instancePath:instancePath+"/content/" + i1+"/textSignature",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/properties/textSignature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
else {
const err45 = {instancePath:instancePath+"/content/" + i1+"/textSignature",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/properties/textSignature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
var valid12 = _errs53 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data16.providerMetadata !== undefined){
let data20 = data16.providerMetadata;
const _errs55 = errors;
if(errors === _errs55){
if(data20 && typeof data20 == "object" && !Array.isArray(data20)){
for(const key7 in data20){
const _errs57 = errors;
if(typeof key7 === "string"){
if(!pattern161.test(key7)){
const err46 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/properties/providerMetadata/propertyNames/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,64}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,64}$"+"\"",propertyName:key7};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
var valid13 = _errs57 === errors;
if(!valid13){
const err47 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/properties/providerMetadata/propertyNames",keyword:"propertyNames",params:{propertyName: key7},message:"property name must be valid"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
break;
}
}
if(valid13){
for(const key8 in data20){
let data21 = data20[key8];
const _errs59 = errors;
if(errors === _errs59){
if(data21 && typeof data21 == "object" && !Array.isArray(data21)){
const _errs61 = errors;
for(const key9 in data21){
if(!(((((key9 === "signature") || (key9 === "thoughtSignature")) || (key9 === "encryptedContent")) || (key9 === "reasoningEncryptedContent")) || (key9 === "itemId"))){
const err48 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key8.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key9},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
break;
}
}
if(_errs61 === errors){
if(data21.signature !== undefined){
let data22 = data21.signature;
const _errs62 = errors;
if(errors === _errs62){
if(typeof data22 === "string"){
if(func2(data22) > 131072){
const err49 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key8.replace(/~/g, "~0").replace(/\//g, "~1")+"/signature",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/properties/signature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
else {
const err50 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key8.replace(/~/g, "~0").replace(/\//g, "~1")+"/signature",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/properties/signature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
var valid15 = _errs62 === errors;
}
else {
var valid15 = true;
}
if(valid15){
if(data21.thoughtSignature !== undefined){
let data23 = data21.thoughtSignature;
const _errs64 = errors;
if(errors === _errs64){
if(typeof data23 === "string"){
if(func2(data23) > 131072){
const err51 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key8.replace(/~/g, "~0").replace(/\//g, "~1")+"/thoughtSignature",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/properties/thoughtSignature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
else {
const err52 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key8.replace(/~/g, "~0").replace(/\//g, "~1")+"/thoughtSignature",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/properties/thoughtSignature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
var valid15 = _errs64 === errors;
}
else {
var valid15 = true;
}
if(valid15){
if(data21.encryptedContent !== undefined){
let data24 = data21.encryptedContent;
const _errs66 = errors;
if(errors === _errs66){
if(typeof data24 === "string"){
if(func2(data24) > 131072){
const err53 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key8.replace(/~/g, "~0").replace(/\//g, "~1")+"/encryptedContent",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/properties/encryptedContent/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
else {
const err54 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key8.replace(/~/g, "~0").replace(/\//g, "~1")+"/encryptedContent",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/properties/encryptedContent/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
var valid15 = _errs66 === errors;
}
else {
var valid15 = true;
}
if(valid15){
if(data21.reasoningEncryptedContent !== undefined){
let data25 = data21.reasoningEncryptedContent;
const _errs68 = errors;
if(errors === _errs68){
if(typeof data25 === "string"){
if(func2(data25) > 131072){
const err55 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key8.replace(/~/g, "~0").replace(/\//g, "~1")+"/reasoningEncryptedContent",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/properties/reasoningEncryptedContent/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
else {
const err56 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key8.replace(/~/g, "~0").replace(/\//g, "~1")+"/reasoningEncryptedContent",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/properties/reasoningEncryptedContent/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
var valid15 = _errs68 === errors;
}
else {
var valid15 = true;
}
if(valid15){
if(data21.itemId !== undefined){
let data26 = data21.itemId;
const _errs70 = errors;
if(errors === _errs70){
if(typeof data26 === "string"){
if(func2(data26) > 131072){
const err57 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key8.replace(/~/g, "~0").replace(/\//g, "~1")+"/itemId",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/properties/itemId/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
else {
const err58 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key8.replace(/~/g, "~0").replace(/\//g, "~1")+"/itemId",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/properties/itemId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
var valid15 = _errs70 === errors;
}
else {
var valid15 = true;
}
}
}
}
}
}
}
else {
const err59 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key8.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/properties/providerMetadata/additionalProperties/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
var valid14 = _errs59 === errors;
if(!valid14){
break;
}
}
}
}
else {
const err60 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/properties/providerMetadata/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
var valid12 = _errs55 === errors;
}
else {
var valid12 = true;
}
}
}
}
}
}
}
else {
const err61 = {instancePath:instancePath+"/content/" + i1,schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
}
var _valid2 = _errs47 === errors;
valid11 = valid11 || _valid2;
if(!valid11){
const _errs72 = errors;
if(errors === _errs72){
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
let missing4;
if(((data16.type === undefined) && (missing4 = "type")) || ((data16.thinking === undefined) && (missing4 = "thinking"))){
const err62 = {instancePath:instancePath+"/content/" + i1,schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/required",keyword:"required",params:{missingProperty: missing4},message:"must have required property '"+missing4+"'"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
else {
const _errs74 = errors;
for(const key10 in data16){
if(!(((((key10 === "type") || (key10 === "thinking")) || (key10 === "thinkingSignature")) || (key10 === "redacted")) || (key10 === "providerMetadata"))){
const err63 = {instancePath:instancePath+"/content/" + i1,schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key10},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
break;
}
}
if(_errs74 === errors){
if(data16.type !== undefined){
const _errs75 = errors;
if("thinking" !== data16.type){
const err64 = {instancePath:instancePath+"/content/" + i1+"/type",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/properties/type/const",keyword:"const",params:{allowedValue: "thinking"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
var valid16 = _errs75 === errors;
}
else {
var valid16 = true;
}
if(valid16){
if(data16.thinking !== undefined){
let data28 = data16.thinking;
const _errs76 = errors;
if(errors === _errs76){
if(typeof data28 === "string"){
if(func2(data28) > 131072){
const err65 = {instancePath:instancePath+"/content/" + i1+"/thinking",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/properties/thinking/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
else {
const err66 = {instancePath:instancePath+"/content/" + i1+"/thinking",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/properties/thinking/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
var valid16 = _errs76 === errors;
}
else {
var valid16 = true;
}
if(valid16){
if(data16.thinkingSignature !== undefined){
let data29 = data16.thinkingSignature;
const _errs78 = errors;
if(errors === _errs78){
if(typeof data29 === "string"){
if(func2(data29) > 131072){
const err67 = {instancePath:instancePath+"/content/" + i1+"/thinkingSignature",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/properties/thinkingSignature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
}
else {
const err68 = {instancePath:instancePath+"/content/" + i1+"/thinkingSignature",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/properties/thinkingSignature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
var valid16 = _errs78 === errors;
}
else {
var valid16 = true;
}
if(valid16){
if(data16.redacted !== undefined){
const _errs80 = errors;
if(typeof data16.redacted !== "boolean"){
const err69 = {instancePath:instancePath+"/content/" + i1+"/redacted",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/properties/redacted/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
var valid16 = _errs80 === errors;
}
else {
var valid16 = true;
}
if(valid16){
if(data16.providerMetadata !== undefined){
let data31 = data16.providerMetadata;
const _errs82 = errors;
if(errors === _errs82){
if(data31 && typeof data31 == "object" && !Array.isArray(data31)){
for(const key11 in data31){
const _errs84 = errors;
if(typeof key11 === "string"){
if(!pattern161.test(key11)){
const err70 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/properties/providerMetadata/propertyNames/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,64}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,64}$"+"\"",propertyName:key11};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
var valid17 = _errs84 === errors;
if(!valid17){
const err71 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/properties/providerMetadata/propertyNames",keyword:"propertyNames",params:{propertyName: key11},message:"property name must be valid"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
break;
}
}
if(valid17){
for(const key12 in data31){
let data32 = data31[key12];
const _errs86 = errors;
if(errors === _errs86){
if(data32 && typeof data32 == "object" && !Array.isArray(data32)){
const _errs88 = errors;
for(const key13 in data32){
if(!(((((key13 === "signature") || (key13 === "thoughtSignature")) || (key13 === "encryptedContent")) || (key13 === "reasoningEncryptedContent")) || (key13 === "itemId"))){
const err72 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key12.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key13},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
break;
}
}
if(_errs88 === errors){
if(data32.signature !== undefined){
let data33 = data32.signature;
const _errs89 = errors;
if(errors === _errs89){
if(typeof data33 === "string"){
if(func2(data33) > 131072){
const err73 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key12.replace(/~/g, "~0").replace(/\//g, "~1")+"/signature",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/properties/signature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
}
else {
const err74 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key12.replace(/~/g, "~0").replace(/\//g, "~1")+"/signature",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/properties/signature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
var valid19 = _errs89 === errors;
}
else {
var valid19 = true;
}
if(valid19){
if(data32.thoughtSignature !== undefined){
let data34 = data32.thoughtSignature;
const _errs91 = errors;
if(errors === _errs91){
if(typeof data34 === "string"){
if(func2(data34) > 131072){
const err75 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key12.replace(/~/g, "~0").replace(/\//g, "~1")+"/thoughtSignature",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/properties/thoughtSignature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
}
else {
const err76 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key12.replace(/~/g, "~0").replace(/\//g, "~1")+"/thoughtSignature",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/properties/thoughtSignature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
}
var valid19 = _errs91 === errors;
}
else {
var valid19 = true;
}
if(valid19){
if(data32.encryptedContent !== undefined){
let data35 = data32.encryptedContent;
const _errs93 = errors;
if(errors === _errs93){
if(typeof data35 === "string"){
if(func2(data35) > 131072){
const err77 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key12.replace(/~/g, "~0").replace(/\//g, "~1")+"/encryptedContent",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/properties/encryptedContent/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
}
else {
const err78 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key12.replace(/~/g, "~0").replace(/\//g, "~1")+"/encryptedContent",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/properties/encryptedContent/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
}
var valid19 = _errs93 === errors;
}
else {
var valid19 = true;
}
if(valid19){
if(data32.reasoningEncryptedContent !== undefined){
let data36 = data32.reasoningEncryptedContent;
const _errs95 = errors;
if(errors === _errs95){
if(typeof data36 === "string"){
if(func2(data36) > 131072){
const err79 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key12.replace(/~/g, "~0").replace(/\//g, "~1")+"/reasoningEncryptedContent",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/properties/reasoningEncryptedContent/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
else {
const err80 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key12.replace(/~/g, "~0").replace(/\//g, "~1")+"/reasoningEncryptedContent",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/properties/reasoningEncryptedContent/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
}
var valid19 = _errs95 === errors;
}
else {
var valid19 = true;
}
if(valid19){
if(data32.itemId !== undefined){
let data37 = data32.itemId;
const _errs97 = errors;
if(errors === _errs97){
if(typeof data37 === "string"){
if(func2(data37) > 131072){
const err81 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key12.replace(/~/g, "~0").replace(/\//g, "~1")+"/itemId",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/properties/itemId/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
}
else {
const err82 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key12.replace(/~/g, "~0").replace(/\//g, "~1")+"/itemId",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/properties/itemId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
var valid19 = _errs97 === errors;
}
else {
var valid19 = true;
}
}
}
}
}
}
}
else {
const err83 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key12.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/properties/providerMetadata/additionalProperties/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
}
var valid18 = _errs86 === errors;
if(!valid18){
break;
}
}
}
}
else {
const err84 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/properties/providerMetadata/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
}
var valid16 = _errs82 === errors;
}
else {
var valid16 = true;
}
}
}
}
}
}
}
}
else {
const err85 = {instancePath:instancePath+"/content/" + i1,schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
}
var _valid2 = _errs72 === errors;
valid11 = valid11 || _valid2;
if(!valid11){
const _errs99 = errors;
if(errors === _errs99){
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
let missing5;
if(((((data16.type === undefined) && (missing5 = "type")) || ((data16.id === undefined) && (missing5 = "id"))) || ((data16.name === undefined) && (missing5 = "name"))) || ((data16.arguments === undefined) && (missing5 = "arguments"))){
const err86 = {instancePath:instancePath+"/content/" + i1,schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/required",keyword:"required",params:{missingProperty: missing5},message:"must have required property '"+missing5+"'"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
else {
const _errs101 = errors;
for(const key14 in data16){
if(!(((((((key14 === "type") || (key14 === "id")) || (key14 === "name")) || (key14 === "arguments")) || (key14 === "thoughtSignature")) || (key14 === "namespace")) || (key14 === "providerMetadata"))){
const err87 = {instancePath:instancePath+"/content/" + i1,schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key14},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
break;
}
}
if(_errs101 === errors){
if(data16.type !== undefined){
const _errs102 = errors;
if("toolCall" !== data16.type){
const err88 = {instancePath:instancePath+"/content/" + i1+"/type",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/type/const",keyword:"const",params:{allowedValue: "toolCall"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
var valid20 = _errs102 === errors;
}
else {
var valid20 = true;
}
if(valid20){
if(data16.id !== undefined){
let data39 = data16.id;
const _errs103 = errors;
if(errors === _errs103){
if(typeof data39 === "string"){
if(!pattern137.test(data39)){
const err89 = {instancePath:instancePath+"/content/" + i1+"/id",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/id/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z0-9_|:./+=-]{1,2048}$"},message:"must match pattern \""+"^[A-Za-z0-9_|:./+=-]{1,2048}$"+"\""};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
}
else {
const err90 = {instancePath:instancePath+"/content/" + i1+"/id",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
}
var valid20 = _errs103 === errors;
}
else {
var valid20 = true;
}
if(valid20){
if(data16.name !== undefined){
let data40 = data16.name;
const _errs105 = errors;
if(errors === _errs105){
if(typeof data40 === "string"){
if(!pattern138.test(data40)){
const err91 = {instancePath:instancePath+"/content/" + i1+"/name",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/name/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z_][A-Za-z0-9_-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z_][A-Za-z0-9_-]{0,63}$"+"\""};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
}
else {
const err92 = {instancePath:instancePath+"/content/" + i1+"/name",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
}
var valid20 = _errs105 === errors;
}
else {
var valid20 = true;
}
if(valid20){
if(data16.arguments !== undefined){
let data41 = data16.arguments;
const _errs107 = errors;
if(!(data41 && typeof data41 == "object" && !Array.isArray(data41))){
const err93 = {instancePath:instancePath+"/content/" + i1+"/arguments",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/arguments/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
var valid20 = _errs107 === errors;
}
else {
var valid20 = true;
}
if(valid20){
if(data16.thoughtSignature !== undefined){
let data42 = data16.thoughtSignature;
const _errs109 = errors;
if(errors === _errs109){
if(typeof data42 === "string"){
if(func2(data42) > 131072){
const err94 = {instancePath:instancePath+"/content/" + i1+"/thoughtSignature",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/thoughtSignature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
}
else {
const err95 = {instancePath:instancePath+"/content/" + i1+"/thoughtSignature",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/thoughtSignature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
}
var valid20 = _errs109 === errors;
}
else {
var valid20 = true;
}
if(valid20){
if(data16.namespace !== undefined){
let data43 = data16.namespace;
const _errs111 = errors;
if(errors === _errs111){
if(typeof data43 === "string"){
if(func2(data43) > 256){
const err96 = {instancePath:instancePath+"/content/" + i1+"/namespace",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/namespace/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
}
else {
const err97 = {instancePath:instancePath+"/content/" + i1+"/namespace",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/namespace/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
}
var valid20 = _errs111 === errors;
}
else {
var valid20 = true;
}
if(valid20){
if(data16.providerMetadata !== undefined){
let data44 = data16.providerMetadata;
const _errs113 = errors;
if(errors === _errs113){
if(data44 && typeof data44 == "object" && !Array.isArray(data44)){
for(const key15 in data44){
const _errs115 = errors;
if(typeof key15 === "string"){
if(!pattern161.test(key15)){
const err98 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/providerMetadata/propertyNames/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,64}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,64}$"+"\"",propertyName:key15};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
}
var valid21 = _errs115 === errors;
if(!valid21){
const err99 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/providerMetadata/propertyNames",keyword:"propertyNames",params:{propertyName: key15},message:"property name must be valid"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
break;
}
}
if(valid21){
for(const key16 in data44){
let data45 = data44[key16];
const _errs117 = errors;
if(errors === _errs117){
if(data45 && typeof data45 == "object" && !Array.isArray(data45)){
const _errs119 = errors;
for(const key17 in data45){
if(!(((((key17 === "signature") || (key17 === "thoughtSignature")) || (key17 === "encryptedContent")) || (key17 === "reasoningEncryptedContent")) || (key17 === "itemId"))){
const err100 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key16.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key17},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
break;
}
}
if(_errs119 === errors){
if(data45.signature !== undefined){
let data46 = data45.signature;
const _errs120 = errors;
if(errors === _errs120){
if(typeof data46 === "string"){
if(func2(data46) > 131072){
const err101 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key16.replace(/~/g, "~0").replace(/\//g, "~1")+"/signature",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/properties/signature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
}
else {
const err102 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key16.replace(/~/g, "~0").replace(/\//g, "~1")+"/signature",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/properties/signature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
}
var valid23 = _errs120 === errors;
}
else {
var valid23 = true;
}
if(valid23){
if(data45.thoughtSignature !== undefined){
let data47 = data45.thoughtSignature;
const _errs122 = errors;
if(errors === _errs122){
if(typeof data47 === "string"){
if(func2(data47) > 131072){
const err103 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key16.replace(/~/g, "~0").replace(/\//g, "~1")+"/thoughtSignature",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/properties/thoughtSignature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
}
else {
const err104 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key16.replace(/~/g, "~0").replace(/\//g, "~1")+"/thoughtSignature",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/properties/thoughtSignature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
}
var valid23 = _errs122 === errors;
}
else {
var valid23 = true;
}
if(valid23){
if(data45.encryptedContent !== undefined){
let data48 = data45.encryptedContent;
const _errs124 = errors;
if(errors === _errs124){
if(typeof data48 === "string"){
if(func2(data48) > 131072){
const err105 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key16.replace(/~/g, "~0").replace(/\//g, "~1")+"/encryptedContent",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/properties/encryptedContent/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
}
else {
const err106 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key16.replace(/~/g, "~0").replace(/\//g, "~1")+"/encryptedContent",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/properties/encryptedContent/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
}
var valid23 = _errs124 === errors;
}
else {
var valid23 = true;
}
if(valid23){
if(data45.reasoningEncryptedContent !== undefined){
let data49 = data45.reasoningEncryptedContent;
const _errs126 = errors;
if(errors === _errs126){
if(typeof data49 === "string"){
if(func2(data49) > 131072){
const err107 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key16.replace(/~/g, "~0").replace(/\//g, "~1")+"/reasoningEncryptedContent",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/properties/reasoningEncryptedContent/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
}
else {
const err108 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key16.replace(/~/g, "~0").replace(/\//g, "~1")+"/reasoningEncryptedContent",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/properties/reasoningEncryptedContent/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
}
var valid23 = _errs126 === errors;
}
else {
var valid23 = true;
}
if(valid23){
if(data45.itemId !== undefined){
let data50 = data45.itemId;
const _errs128 = errors;
if(errors === _errs128){
if(typeof data50 === "string"){
if(func2(data50) > 131072){
const err109 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key16.replace(/~/g, "~0").replace(/\//g, "~1")+"/itemId",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/properties/itemId/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
}
else {
const err110 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key16.replace(/~/g, "~0").replace(/\//g, "~1")+"/itemId",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/properties/itemId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
}
var valid23 = _errs128 === errors;
}
else {
var valid23 = true;
}
}
}
}
}
}
}
else {
const err111 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata/" + key16.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/providerMetadata/additionalProperties/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
}
var valid22 = _errs117 === errors;
if(!valid22){
break;
}
}
}
}
else {
const err112 = {instancePath:instancePath+"/content/" + i1+"/providerMetadata",schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/properties/providerMetadata/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
}
var valid20 = _errs113 === errors;
}
else {
var valid20 = true;
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
const err113 = {instancePath:instancePath+"/content/" + i1,schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf/2/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
}
var _valid2 = _errs99 === errors;
valid11 = valid11 || _valid2;
}
}
if(!valid11){
const err114 = {instancePath:instancePath+"/content/" + i1,schemaPath:"#/$defs/PiAssistant/properties/content/items/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
else {
errors = _errs46;
if(vErrors !== null){
if(_errs46){
vErrors.length = _errs46;
}
else {
vErrors = null;
}
}
}
var valid10 = _errs45 === errors;
if(!valid10){
break;
}
}
}
}
else {
const err115 = {instancePath:instancePath+"/content",schemaPath:"#/$defs/PiAssistant/properties/content/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
}
var valid9 = _errs43 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data.api !== undefined){
let data51 = data.api;
const _errs130 = errors;
if(errors === _errs130){
if(typeof data51 === "string"){
if(func2(data51) > 256){
const err116 = {instancePath:instancePath+"/api",schemaPath:"#/$defs/PiAssistant/properties/api/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
}
else {
const err117 = {instancePath:instancePath+"/api",schemaPath:"#/$defs/PiAssistant/properties/api/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
}
var valid9 = _errs130 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data.provider !== undefined){
let data52 = data.provider;
const _errs132 = errors;
if(errors === _errs132){
if(typeof data52 === "string"){
if(func2(data52) > 256){
const err118 = {instancePath:instancePath+"/provider",schemaPath:"#/$defs/PiAssistant/properties/provider/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
}
else {
const err119 = {instancePath:instancePath+"/provider",schemaPath:"#/$defs/PiAssistant/properties/provider/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
}
var valid9 = _errs132 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data.model !== undefined){
let data53 = data.model;
const _errs134 = errors;
if(errors === _errs134){
if(typeof data53 === "string"){
if(func2(data53) > 256){
const err120 = {instancePath:instancePath+"/model",schemaPath:"#/$defs/PiAssistant/properties/model/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
}
else {
const err121 = {instancePath:instancePath+"/model",schemaPath:"#/$defs/PiAssistant/properties/model/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
}
var valid9 = _errs134 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data.responseId !== undefined){
let data54 = data.responseId;
const _errs136 = errors;
if(errors === _errs136){
if(typeof data54 === "string"){
if(func2(data54) > 256){
const err122 = {instancePath:instancePath+"/responseId",schemaPath:"#/$defs/PiAssistant/properties/responseId/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
}
else {
const err123 = {instancePath:instancePath+"/responseId",schemaPath:"#/$defs/PiAssistant/properties/responseId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
}
var valid9 = _errs136 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data.responseModel !== undefined){
let data55 = data.responseModel;
const _errs138 = errors;
if(errors === _errs138){
if(typeof data55 === "string"){
if(func2(data55) > 256){
const err124 = {instancePath:instancePath+"/responseModel",schemaPath:"#/$defs/PiAssistant/properties/responseModel/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
}
else {
const err125 = {instancePath:instancePath+"/responseModel",schemaPath:"#/$defs/PiAssistant/properties/responseModel/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
}
var valid9 = _errs138 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data.providerThinkingLevel !== undefined){
let data56 = data.providerThinkingLevel;
const _errs140 = errors;
if(errors === _errs140){
if(typeof data56 === "string"){
if(func2(data56) > 256){
const err126 = {instancePath:instancePath+"/providerThinkingLevel",schemaPath:"#/$defs/PiAssistant/properties/providerThinkingLevel/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
}
else {
const err127 = {instancePath:instancePath+"/providerThinkingLevel",schemaPath:"#/$defs/PiAssistant/properties/providerThinkingLevel/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
}
var valid9 = _errs140 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data.thinkingLevel !== undefined){
let data57 = data.thinkingLevel;
const _errs142 = errors;
if(errors === _errs142){
if(typeof data57 === "string"){
if(func2(data57) > 256){
const err128 = {instancePath:instancePath+"/thinkingLevel",schemaPath:"#/$defs/PiAssistant/properties/thinkingLevel/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"};
if(vErrors === null){
vErrors = [err128];
}
else {
vErrors.push(err128);
}
errors++;
}
}
else {
const err129 = {instancePath:instancePath+"/thinkingLevel",schemaPath:"#/$defs/PiAssistant/properties/thinkingLevel/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
}
var valid9 = _errs142 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data.stopReason !== undefined){
let data58 = data.stopReason;
const _errs144 = errors;
if(!(((data58 === "stop") || (data58 === "length")) || (data58 === "toolUse"))){
const err130 = {instancePath:instancePath+"/stopReason",schemaPath:"#/$defs/PiAssistant/properties/stopReason/enum",keyword:"enum",params:{allowedValues: schema97.properties.stopReason.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
var valid9 = _errs144 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data.timestamp !== undefined){
let data59 = data.timestamp;
const _errs145 = errors;
if(!(((typeof data59 == "number") && (!(data59 % 1) && !isNaN(data59))) && (isFinite(data59)))){
const err131 = {instancePath:instancePath+"/timestamp",schemaPath:"#/$defs/PiAssistant/properties/timestamp/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err131];
}
else {
vErrors.push(err131);
}
errors++;
}
if(errors === _errs145){
if((typeof data59 == "number") && (isFinite(data59))){
if(data59 > 9007199254740991 || isNaN(data59)){
const err132 = {instancePath:instancePath+"/timestamp",schemaPath:"#/$defs/PiAssistant/properties/timestamp/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
else {
if(data59 < 0 || isNaN(data59)){
const err133 = {instancePath:instancePath+"/timestamp",schemaPath:"#/$defs/PiAssistant/properties/timestamp/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err133];
}
else {
vErrors.push(err133);
}
errors++;
}
}
}
}
var valid9 = _errs145 === errors;
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
}
}
}
}
}
}
else {
const err134 = {instancePath,schemaPath:"#/$defs/PiAssistant/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
}
var _valid0 = _errs38 === errors;
valid0 = valid0 || _valid0;
if(!valid0){
const _errs147 = errors;
if(errors === _errs147){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing6;
if(((((((data.role === undefined) && (missing6 = "role")) || ((data.toolCallId === undefined) && (missing6 = "toolCallId"))) || ((data.toolName === undefined) && (missing6 = "toolName"))) || ((data.content === undefined) && (missing6 = "content"))) || ((data.isError === undefined) && (missing6 = "isError"))) || ((data.timestamp === undefined) && (missing6 = "timestamp"))){
const err135 = {instancePath,schemaPath:"#/anyOf/2/required",keyword:"required",params:{missingProperty: missing6},message:"must have required property '"+missing6+"'"};
if(vErrors === null){
vErrors = [err135];
}
else {
vErrors.push(err135);
}
errors++;
}
else {
const _errs149 = errors;
for(const key18 in data){
if(!((((((key18 === "role") || (key18 === "toolCallId")) || (key18 === "toolName")) || (key18 === "content")) || (key18 === "isError")) || (key18 === "timestamp"))){
const err136 = {instancePath,schemaPath:"#/anyOf/2/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key18},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err136];
}
else {
vErrors.push(err136);
}
errors++;
break;
}
}
if(_errs149 === errors){
if(data.role !== undefined){
const _errs150 = errors;
if("toolResult" !== data.role){
const err137 = {instancePath:instancePath+"/role",schemaPath:"#/anyOf/2/properties/role/const",keyword:"const",params:{allowedValue: "toolResult"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err137];
}
else {
vErrors.push(err137);
}
errors++;
}
var valid24 = _errs150 === errors;
}
else {
var valid24 = true;
}
if(valid24){
if(data.toolCallId !== undefined){
let data61 = data.toolCallId;
const _errs151 = errors;
if(errors === _errs151){
if(typeof data61 === "string"){
if(!pattern137.test(data61)){
const err138 = {instancePath:instancePath+"/toolCallId",schemaPath:"#/anyOf/2/properties/toolCallId/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z0-9_|:./+=-]{1,2048}$"},message:"must match pattern \""+"^[A-Za-z0-9_|:./+=-]{1,2048}$"+"\""};
if(vErrors === null){
vErrors = [err138];
}
else {
vErrors.push(err138);
}
errors++;
}
}
else {
const err139 = {instancePath:instancePath+"/toolCallId",schemaPath:"#/anyOf/2/properties/toolCallId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err139];
}
else {
vErrors.push(err139);
}
errors++;
}
}
var valid24 = _errs151 === errors;
}
else {
var valid24 = true;
}
if(valid24){
if(data.toolName !== undefined){
let data62 = data.toolName;
const _errs153 = errors;
if(errors === _errs153){
if(typeof data62 === "string"){
if(func2(data62) > 256){
const err140 = {instancePath:instancePath+"/toolName",schemaPath:"#/anyOf/2/properties/toolName/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"};
if(vErrors === null){
vErrors = [err140];
}
else {
vErrors.push(err140);
}
errors++;
}
}
else {
const err141 = {instancePath:instancePath+"/toolName",schemaPath:"#/anyOf/2/properties/toolName/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err141];
}
else {
vErrors.push(err141);
}
errors++;
}
}
var valid24 = _errs153 === errors;
}
else {
var valid24 = true;
}
if(valid24){
if(data.content !== undefined){
let data63 = data.content;
const _errs155 = errors;
if(errors === _errs155){
if(Array.isArray(data63)){
if(data63.length > 64){
const err142 = {instancePath:instancePath+"/content",schemaPath:"#/anyOf/2/properties/content/maxItems",keyword:"maxItems",params:{limit: 64},message:"must NOT have more than 64 items"};
if(vErrors === null){
vErrors = [err142];
}
else {
vErrors.push(err142);
}
errors++;
}
else {
var valid25 = true;
const len2 = data63.length;
for(let i2=0; i2<len2; i2++){
let data64 = data63[i2];
const _errs157 = errors;
if(errors === _errs157){
if(data64 && typeof data64 == "object" && !Array.isArray(data64)){
let missing7;
if(((data64.type === undefined) && (missing7 = "type")) || ((data64.text === undefined) && (missing7 = "text"))){
const err143 = {instancePath:instancePath+"/content/" + i2,schemaPath:"#/anyOf/2/properties/content/items/required",keyword:"required",params:{missingProperty: missing7},message:"must have required property '"+missing7+"'"};
if(vErrors === null){
vErrors = [err143];
}
else {
vErrors.push(err143);
}
errors++;
}
else {
const _errs159 = errors;
for(const key19 in data64){
if(!((((key19 === "type") || (key19 === "text")) || (key19 === "textSignature")) || (key19 === "providerMetadata"))){
const err144 = {instancePath:instancePath+"/content/" + i2,schemaPath:"#/anyOf/2/properties/content/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key19},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err144];
}
else {
vErrors.push(err144);
}
errors++;
break;
}
}
if(_errs159 === errors){
if(data64.type !== undefined){
const _errs160 = errors;
if("text" !== data64.type){
const err145 = {instancePath:instancePath+"/content/" + i2+"/type",schemaPath:"#/anyOf/2/properties/content/items/properties/type/const",keyword:"const",params:{allowedValue: "text"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err145];
}
else {
vErrors.push(err145);
}
errors++;
}
var valid26 = _errs160 === errors;
}
else {
var valid26 = true;
}
if(valid26){
if(data64.text !== undefined){
let data66 = data64.text;
const _errs161 = errors;
if(errors === _errs161){
if(typeof data66 === "string"){
if(func2(data66) > 131072){
const err146 = {instancePath:instancePath+"/content/" + i2+"/text",schemaPath:"#/anyOf/2/properties/content/items/properties/text/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err146];
}
else {
vErrors.push(err146);
}
errors++;
}
}
else {
const err147 = {instancePath:instancePath+"/content/" + i2+"/text",schemaPath:"#/anyOf/2/properties/content/items/properties/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err147];
}
else {
vErrors.push(err147);
}
errors++;
}
}
var valid26 = _errs161 === errors;
}
else {
var valid26 = true;
}
if(valid26){
if(data64.textSignature !== undefined){
let data67 = data64.textSignature;
const _errs163 = errors;
if(errors === _errs163){
if(typeof data67 === "string"){
if(func2(data67) > 131072){
const err148 = {instancePath:instancePath+"/content/" + i2+"/textSignature",schemaPath:"#/anyOf/2/properties/content/items/properties/textSignature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err148];
}
else {
vErrors.push(err148);
}
errors++;
}
}
else {
const err149 = {instancePath:instancePath+"/content/" + i2+"/textSignature",schemaPath:"#/anyOf/2/properties/content/items/properties/textSignature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err149];
}
else {
vErrors.push(err149);
}
errors++;
}
}
var valid26 = _errs163 === errors;
}
else {
var valid26 = true;
}
if(valid26){
if(data64.providerMetadata !== undefined){
let data68 = data64.providerMetadata;
const _errs165 = errors;
if(errors === _errs165){
if(data68 && typeof data68 == "object" && !Array.isArray(data68)){
for(const key20 in data68){
const _errs167 = errors;
if(typeof key20 === "string"){
if(!pattern161.test(key20)){
const err150 = {instancePath:instancePath+"/content/" + i2+"/providerMetadata",schemaPath:"#/anyOf/2/properties/content/items/properties/providerMetadata/propertyNames/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,64}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,64}$"+"\"",propertyName:key20};
if(vErrors === null){
vErrors = [err150];
}
else {
vErrors.push(err150);
}
errors++;
}
}
var valid27 = _errs167 === errors;
if(!valid27){
const err151 = {instancePath:instancePath+"/content/" + i2+"/providerMetadata",schemaPath:"#/anyOf/2/properties/content/items/properties/providerMetadata/propertyNames",keyword:"propertyNames",params:{propertyName: key20},message:"property name must be valid"};
if(vErrors === null){
vErrors = [err151];
}
else {
vErrors.push(err151);
}
errors++;
break;
}
}
if(valid27){
for(const key21 in data68){
let data69 = data68[key21];
const _errs169 = errors;
if(errors === _errs169){
if(data69 && typeof data69 == "object" && !Array.isArray(data69)){
const _errs171 = errors;
for(const key22 in data69){
if(!(((((key22 === "signature") || (key22 === "thoughtSignature")) || (key22 === "encryptedContent")) || (key22 === "reasoningEncryptedContent")) || (key22 === "itemId"))){
const err152 = {instancePath:instancePath+"/content/" + i2+"/providerMetadata/" + key21.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/anyOf/2/properties/content/items/properties/providerMetadata/additionalProperties/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key22},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err152];
}
else {
vErrors.push(err152);
}
errors++;
break;
}
}
if(_errs171 === errors){
if(data69.signature !== undefined){
let data70 = data69.signature;
const _errs172 = errors;
if(errors === _errs172){
if(typeof data70 === "string"){
if(func2(data70) > 131072){
const err153 = {instancePath:instancePath+"/content/" + i2+"/providerMetadata/" + key21.replace(/~/g, "~0").replace(/\//g, "~1")+"/signature",schemaPath:"#/anyOf/2/properties/content/items/properties/providerMetadata/additionalProperties/properties/signature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err153];
}
else {
vErrors.push(err153);
}
errors++;
}
}
else {
const err154 = {instancePath:instancePath+"/content/" + i2+"/providerMetadata/" + key21.replace(/~/g, "~0").replace(/\//g, "~1")+"/signature",schemaPath:"#/anyOf/2/properties/content/items/properties/providerMetadata/additionalProperties/properties/signature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err154];
}
else {
vErrors.push(err154);
}
errors++;
}
}
var valid29 = _errs172 === errors;
}
else {
var valid29 = true;
}
if(valid29){
if(data69.thoughtSignature !== undefined){
let data71 = data69.thoughtSignature;
const _errs174 = errors;
if(errors === _errs174){
if(typeof data71 === "string"){
if(func2(data71) > 131072){
const err155 = {instancePath:instancePath+"/content/" + i2+"/providerMetadata/" + key21.replace(/~/g, "~0").replace(/\//g, "~1")+"/thoughtSignature",schemaPath:"#/anyOf/2/properties/content/items/properties/providerMetadata/additionalProperties/properties/thoughtSignature/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err155];
}
else {
vErrors.push(err155);
}
errors++;
}
}
else {
const err156 = {instancePath:instancePath+"/content/" + i2+"/providerMetadata/" + key21.replace(/~/g, "~0").replace(/\//g, "~1")+"/thoughtSignature",schemaPath:"#/anyOf/2/properties/content/items/properties/providerMetadata/additionalProperties/properties/thoughtSignature/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err156];
}
else {
vErrors.push(err156);
}
errors++;
}
}
var valid29 = _errs174 === errors;
}
else {
var valid29 = true;
}
if(valid29){
if(data69.encryptedContent !== undefined){
let data72 = data69.encryptedContent;
const _errs176 = errors;
if(errors === _errs176){
if(typeof data72 === "string"){
if(func2(data72) > 131072){
const err157 = {instancePath:instancePath+"/content/" + i2+"/providerMetadata/" + key21.replace(/~/g, "~0").replace(/\//g, "~1")+"/encryptedContent",schemaPath:"#/anyOf/2/properties/content/items/properties/providerMetadata/additionalProperties/properties/encryptedContent/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err157];
}
else {
vErrors.push(err157);
}
errors++;
}
}
else {
const err158 = {instancePath:instancePath+"/content/" + i2+"/providerMetadata/" + key21.replace(/~/g, "~0").replace(/\//g, "~1")+"/encryptedContent",schemaPath:"#/anyOf/2/properties/content/items/properties/providerMetadata/additionalProperties/properties/encryptedContent/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err158];
}
else {
vErrors.push(err158);
}
errors++;
}
}
var valid29 = _errs176 === errors;
}
else {
var valid29 = true;
}
if(valid29){
if(data69.reasoningEncryptedContent !== undefined){
let data73 = data69.reasoningEncryptedContent;
const _errs178 = errors;
if(errors === _errs178){
if(typeof data73 === "string"){
if(func2(data73) > 131072){
const err159 = {instancePath:instancePath+"/content/" + i2+"/providerMetadata/" + key21.replace(/~/g, "~0").replace(/\//g, "~1")+"/reasoningEncryptedContent",schemaPath:"#/anyOf/2/properties/content/items/properties/providerMetadata/additionalProperties/properties/reasoningEncryptedContent/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err159];
}
else {
vErrors.push(err159);
}
errors++;
}
}
else {
const err160 = {instancePath:instancePath+"/content/" + i2+"/providerMetadata/" + key21.replace(/~/g, "~0").replace(/\//g, "~1")+"/reasoningEncryptedContent",schemaPath:"#/anyOf/2/properties/content/items/properties/providerMetadata/additionalProperties/properties/reasoningEncryptedContent/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err160];
}
else {
vErrors.push(err160);
}
errors++;
}
}
var valid29 = _errs178 === errors;
}
else {
var valid29 = true;
}
if(valid29){
if(data69.itemId !== undefined){
let data74 = data69.itemId;
const _errs180 = errors;
if(errors === _errs180){
if(typeof data74 === "string"){
if(func2(data74) > 131072){
const err161 = {instancePath:instancePath+"/content/" + i2+"/providerMetadata/" + key21.replace(/~/g, "~0").replace(/\//g, "~1")+"/itemId",schemaPath:"#/anyOf/2/properties/content/items/properties/providerMetadata/additionalProperties/properties/itemId/maxLength",keyword:"maxLength",params:{limit: 131072},message:"must NOT have more than 131072 characters"};
if(vErrors === null){
vErrors = [err161];
}
else {
vErrors.push(err161);
}
errors++;
}
}
else {
const err162 = {instancePath:instancePath+"/content/" + i2+"/providerMetadata/" + key21.replace(/~/g, "~0").replace(/\//g, "~1")+"/itemId",schemaPath:"#/anyOf/2/properties/content/items/properties/providerMetadata/additionalProperties/properties/itemId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err162];
}
else {
vErrors.push(err162);
}
errors++;
}
}
var valid29 = _errs180 === errors;
}
else {
var valid29 = true;
}
}
}
}
}
}
}
else {
const err163 = {instancePath:instancePath+"/content/" + i2+"/providerMetadata/" + key21.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/anyOf/2/properties/content/items/properties/providerMetadata/additionalProperties/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err163];
}
else {
vErrors.push(err163);
}
errors++;
}
}
var valid28 = _errs169 === errors;
if(!valid28){
break;
}
}
}
}
else {
const err164 = {instancePath:instancePath+"/content/" + i2+"/providerMetadata",schemaPath:"#/anyOf/2/properties/content/items/properties/providerMetadata/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err164];
}
else {
vErrors.push(err164);
}
errors++;
}
}
var valid26 = _errs165 === errors;
}
else {
var valid26 = true;
}
}
}
}
}
}
}
else {
const err165 = {instancePath:instancePath+"/content/" + i2,schemaPath:"#/anyOf/2/properties/content/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err165];
}
else {
vErrors.push(err165);
}
errors++;
}
}
var valid25 = _errs157 === errors;
if(!valid25){
break;
}
}
}
}
else {
const err166 = {instancePath:instancePath+"/content",schemaPath:"#/anyOf/2/properties/content/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err166];
}
else {
vErrors.push(err166);
}
errors++;
}
}
var valid24 = _errs155 === errors;
}
else {
var valid24 = true;
}
if(valid24){
if(data.isError !== undefined){
const _errs182 = errors;
if(typeof data.isError !== "boolean"){
const err167 = {instancePath:instancePath+"/isError",schemaPath:"#/anyOf/2/properties/isError/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err167];
}
else {
vErrors.push(err167);
}
errors++;
}
var valid24 = _errs182 === errors;
}
else {
var valid24 = true;
}
if(valid24){
if(data.timestamp !== undefined){
let data76 = data.timestamp;
const _errs184 = errors;
if(!(((typeof data76 == "number") && (!(data76 % 1) && !isNaN(data76))) && (isFinite(data76)))){
const err168 = {instancePath:instancePath+"/timestamp",schemaPath:"#/anyOf/2/properties/timestamp/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err168];
}
else {
vErrors.push(err168);
}
errors++;
}
if(errors === _errs184){
if((typeof data76 == "number") && (isFinite(data76))){
if(data76 > 9007199254740991 || isNaN(data76)){
const err169 = {instancePath:instancePath+"/timestamp",schemaPath:"#/anyOf/2/properties/timestamp/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"};
if(vErrors === null){
vErrors = [err169];
}
else {
vErrors.push(err169);
}
errors++;
}
else {
if(data76 < 0 || isNaN(data76)){
const err170 = {instancePath:instancePath+"/timestamp",schemaPath:"#/anyOf/2/properties/timestamp/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err170];
}
else {
vErrors.push(err170);
}
errors++;
}
}
}
}
var valid24 = _errs184 === errors;
}
else {
var valid24 = true;
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
const err171 = {instancePath,schemaPath:"#/anyOf/2/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err171];
}
else {
vErrors.push(err171);
}
errors++;
}
}
var _valid0 = _errs147 === errors;
valid0 = valid0 || _valid0;
}
}
if(!valid0){
const err172 = {instancePath,schemaPath:"#/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err172];
}
else {
vErrors.push(err172);
}
errors++;
validate77.errors = vErrors;
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
validate77.errors = vErrors;
return errors === 0;
}

export const PiInferenceRequest = validate78;
const schema100 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"inference"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"requestId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"sequence":{"type":"integer","minimum":1,"maximum":2147483647},"deadlineUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991},"messages":{"type":"array","minItems":1,"maxItems":128,"items":{"$ref":"#/$defs/PiMessage"}},"maxOutputTokens":{"type":"integer","minimum":1,"maximum":8192},"upstreamBudget":{"$ref":"#/$defs/UpstreamBudget"},"tools":{"type":"array","maxItems":64,"items":{"$ref":"#/$defs/CodingToolDefinition"}},"protocol":{"const":"coding_v1"},"thinking":{"type":"boolean"},"purpose":{"enum":["main","compaction","btw","subagent"]},"capabilities":{"type":"array","uniqueItems":true,"maxItems":5,"items":{"enum":["coding_v1","streaming_v1","tools_v1","thinking_v1","images_v1"]}},"connector":{"$ref":"#/$defs/ConnectorDescriptor"},"connectorProtocol":{"enum":["pi_native_v1","pi_native_v2","pi_native_v3"]},"messageFormat":{"const":"pi_context_v1"},"model":{"type":"string","maxLength":256},"provider":{"type":"string","maxLength":256},"api":{"type":"string","maxLength":256},"nativeRevision":{"type":"integer","minimum":0,"maximum":9007199254740991},"configurationDigest":{"type":"string","pattern":"^[a-f0-9]{64}$"},"endpoint":{"type":"string","maxLength":2048},"modelSettings":{"$ref":"#/$defs/ModelSettings"}},"required":["type","sessionId","requestId","bindingRevision","sequence","deadlineUnixMs","messages","maxOutputTokens","upstreamBudget","tools","protocol","thinking","purpose","capabilities","connectorProtocol","messageFormat","model","provider","api"]};

function validate78(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((((((((((((((data.type === undefined) && (missing0 = "type")) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.bindingRevision === undefined) && (missing0 = "bindingRevision"))) || ((data.sequence === undefined) && (missing0 = "sequence"))) || ((data.deadlineUnixMs === undefined) && (missing0 = "deadlineUnixMs"))) || ((data.messages === undefined) && (missing0 = "messages"))) || ((data.maxOutputTokens === undefined) && (missing0 = "maxOutputTokens"))) || ((data.upstreamBudget === undefined) && (missing0 = "upstreamBudget"))) || ((data.tools === undefined) && (missing0 = "tools"))) || ((data.protocol === undefined) && (missing0 = "protocol"))) || ((data.thinking === undefined) && (missing0 = "thinking"))) || ((data.purpose === undefined) && (missing0 = "purpose"))) || ((data.capabilities === undefined) && (missing0 = "capabilities"))) || ((data.connectorProtocol === undefined) && (missing0 = "connectorProtocol"))) || ((data.messageFormat === undefined) && (missing0 = "messageFormat"))) || ((data.model === undefined) && (missing0 = "model"))) || ((data.provider === undefined) && (missing0 = "provider"))) || ((data.api === undefined) && (missing0 = "api"))){
validate78.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema100.properties, key0))){
validate78.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("inference" !== data.type){
validate78.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "inference"},message:"must be equal to constant"}];
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
validate78.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate78.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate78.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate78.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate78.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate78.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate78.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 2147483647 || isNaN(data4)){
validate78.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data4 < 1 || isNaN(data4)){
validate78.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate78.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs11){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 9007199254740991 || isNaN(data5)){
validate78.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data5 < 1 || isNaN(data5)){
validate78.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate78.errors = [{instancePath:instancePath+"/messages",schemaPath:"#/properties/messages/maxItems",keyword:"maxItems",params:{limit: 128},message:"must NOT have more than 128 items"}];
return false;
}
else {
if(data6.length < 1){
validate78.errors = [{instancePath:instancePath+"/messages",schemaPath:"#/properties/messages/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid1 = true;
const len0 = data6.length;
for(let i0=0; i0<len0; i0++){
const _errs15 = errors;
if(!(validate77(data6[i0], {instancePath:instancePath+"/messages/" + i0,parentData:data6,parentDataProperty:i0,rootData}))){
vErrors = vErrors === null ? validate77.errors : vErrors.concat(validate77.errors);
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
validate78.errors = [{instancePath:instancePath+"/messages",schemaPath:"#/properties/messages/type",keyword:"type",params:{type: "array"},message:"must be array"}];
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
validate78.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs16){
if((typeof data8 == "number") && (isFinite(data8))){
if(data8 > 8192 || isNaN(data8)){
validate78.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 8192},message:"must be <= 8192"}];
return false;
}
else {
if(data8 < 1 || isNaN(data8)){
validate78.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate78.errors = [{instancePath:instancePath+"/upstreamBudget",schemaPath:"#/$defs/UpstreamBudget/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs21 = errors;
for(const key1 in data9){
if(!(((((key1 === "reservedMicrousd") || (key1 === "inputBound")) || (key1 === "tariffVersion")) || (key1 === "inputMicrousdPerMillion")) || (key1 === "outputMicrousdPerMillion"))){
validate78.errors = [{instancePath:instancePath+"/upstreamBudget",schemaPath:"#/$defs/UpstreamBudget/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
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
validate78.errors = [{instancePath:instancePath+"/upstreamBudget/reservedMicrousd",schemaPath:"#/$defs/UpstreamBudget/properties/reservedMicrousd/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate78.errors = [{instancePath:instancePath+"/upstreamBudget/reservedMicrousd",schemaPath:"#/$defs/UpstreamBudget/properties/reservedMicrousd/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate78.errors = [{instancePath:instancePath+"/upstreamBudget/inputBound",schemaPath:"#/$defs/UpstreamBudget/properties/inputBound/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs24){
if((typeof data11 == "number") && (isFinite(data11))){
if(data11 > 262144 || isNaN(data11)){
validate78.errors = [{instancePath:instancePath+"/upstreamBudget/inputBound",schemaPath:"#/$defs/UpstreamBudget/properties/inputBound/maximum",keyword:"maximum",params:{comparison: "<=", limit: 262144},message:"must be <= 262144"}];
return false;
}
else {
if(data11 < 1 || isNaN(data11)){
validate78.errors = [{instancePath:instancePath+"/upstreamBudget/inputBound",schemaPath:"#/$defs/UpstreamBudget/properties/inputBound/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate78.errors = [{instancePath:instancePath+"/upstreamBudget/tariffVersion",schemaPath:"#/$defs/UpstreamBudget/properties/tariffVersion/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
}
else {
validate78.errors = [{instancePath:instancePath+"/upstreamBudget/tariffVersion",schemaPath:"#/$defs/UpstreamBudget/properties/tariffVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate78.errors = [{instancePath:instancePath+"/upstreamBudget/inputMicrousdPerMillion",schemaPath:"#/$defs/UpstreamBudget/properties/inputMicrousdPerMillion/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate78.errors = [{instancePath:instancePath+"/upstreamBudget/inputMicrousdPerMillion",schemaPath:"#/$defs/UpstreamBudget/properties/inputMicrousdPerMillion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate78.errors = [{instancePath:instancePath+"/upstreamBudget/outputMicrousdPerMillion",schemaPath:"#/$defs/UpstreamBudget/properties/outputMicrousdPerMillion/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate78.errors = [{instancePath:instancePath+"/upstreamBudget/outputMicrousdPerMillion",schemaPath:"#/$defs/UpstreamBudget/properties/outputMicrousdPerMillion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate78.errors = [{instancePath:instancePath+"/upstreamBudget",schemaPath:"#/$defs/UpstreamBudget/type",keyword:"type",params:{type: "object"},message:"must be object"}];
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
validate78.errors = [{instancePath:instancePath+"/tools",schemaPath:"#/properties/tools/maxItems",keyword:"maxItems",params:{limit: 64},message:"must NOT have more than 64 items"}];
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
validate78.errors = [{instancePath:instancePath+"/tools/" + i1,schemaPath:"#/$defs/CodingToolDefinition/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];
return false;
}
else {
const _errs37 = errors;
for(const key2 in data16){
if(!((key2 === "type") || (key2 === "function"))){
validate78.errors = [{instancePath:instancePath+"/tools/" + i1,schemaPath:"#/$defs/CodingToolDefinition/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs37 === errors){
if(data16.type !== undefined){
const _errs38 = errors;
if("function" !== data16.type){
validate78.errors = [{instancePath:instancePath+"/tools/" + i1+"/type",schemaPath:"#/$defs/CodingToolDefinition/properties/type/const",keyword:"const",params:{allowedValue: "function"},message:"must be equal to constant"}];
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
validate78.errors = [{instancePath:instancePath+"/tools/" + i1+"/function",schemaPath:"#/$defs/CodingToolDefinition/properties/function/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"}];
return false;
}
else {
const _errs41 = errors;
for(const key3 in data18){
if(!(((key3 === "name") || (key3 === "description")) || (key3 === "parameters"))){
validate78.errors = [{instancePath:instancePath+"/tools/" + i1+"/function",schemaPath:"#/$defs/CodingToolDefinition/properties/function/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"}];
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
if(!pattern138.test(data19)){
validate78.errors = [{instancePath:instancePath+"/tools/" + i1+"/function/name",schemaPath:"#/$defs/CodingToolDefinition/properties/function/properties/name/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z_][A-Za-z0-9_-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z_][A-Za-z0-9_-]{0,63}$"+"\""}];
return false;
}
}
else {
validate78.errors = [{instancePath:instancePath+"/tools/" + i1+"/function/name",schemaPath:"#/$defs/CodingToolDefinition/properties/function/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate78.errors = [{instancePath:instancePath+"/tools/" + i1+"/function/description",schemaPath:"#/$defs/CodingToolDefinition/properties/function/properties/description/maxLength",keyword:"maxLength",params:{limit: 8192},message:"must NOT have more than 8192 characters"}];
return false;
}
}
else {
validate78.errors = [{instancePath:instancePath+"/tools/" + i1+"/function/description",schemaPath:"#/$defs/CodingToolDefinition/properties/function/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate78.errors = [{instancePath:instancePath+"/tools/" + i1+"/function/parameters",schemaPath:"#/$defs/CodingToolDefinition/properties/function/properties/parameters/type",keyword:"type",params:{type: "object"},message:"must be object"}];
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
validate78.errors = [{instancePath:instancePath+"/tools/" + i1+"/function",schemaPath:"#/$defs/CodingToolDefinition/properties/function/type",keyword:"type",params:{type: "object"},message:"must be object"}];
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
validate78.errors = [{instancePath:instancePath+"/tools/" + i1,schemaPath:"#/$defs/CodingToolDefinition/type",keyword:"type",params:{type: "object"},message:"must be object"}];
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
validate78.errors = [{instancePath:instancePath+"/tools",schemaPath:"#/properties/tools/type",keyword:"type",params:{type: "array"},message:"must be array"}];
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
validate78.errors = [{instancePath:instancePath+"/protocol",schemaPath:"#/properties/protocol/const",keyword:"const",params:{allowedValue: "coding_v1"},message:"must be equal to constant"}];
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
validate78.errors = [{instancePath:instancePath+"/thinking",schemaPath:"#/properties/thinking/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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
validate78.errors = [{instancePath:instancePath+"/purpose",schemaPath:"#/properties/purpose/enum",keyword:"enum",params:{allowedValues: schema100.properties.purpose.enum},message:"must be equal to one of the allowed values"}];
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
validate78.errors = [{instancePath:instancePath+"/capabilities",schemaPath:"#/properties/capabilities/maxItems",keyword:"maxItems",params:{limit: 5},message:"must NOT have more than 5 items"}];
return false;
}
else {
var valid8 = true;
const len2 = data25.length;
for(let i2=0; i2<len2; i2++){
let data26 = data25[i2];
const _errs54 = errors;
if(!(((((data26 === "coding_v1") || (data26 === "streaming_v1")) || (data26 === "tools_v1")) || (data26 === "thinking_v1")) || (data26 === "images_v1"))){
validate78.errors = [{instancePath:instancePath+"/capabilities/" + i2,schemaPath:"#/properties/capabilities/items/enum",keyword:"enum",params:{allowedValues: schema100.properties.capabilities.items.enum},message:"must be equal to one of the allowed values"}];
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
validate78.errors = [{instancePath:instancePath+"/capabilities",schemaPath:"#/properties/capabilities/uniqueItems",keyword:"uniqueItems",params:{i: i3, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i3+" are identical)"}];
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
validate78.errors = [{instancePath:instancePath+"/capabilities",schemaPath:"#/properties/capabilities/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs52 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.connector !== undefined){
let data27 = data.connector;
const _errs55 = errors;
const _errs56 = errors;
const _errs58 = errors;
const _errs59 = errors;
let valid12 = true;
const _errs60 = errors;
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
let missing4;
if((data27.id === undefined) && (missing4 = "id")){
const err0 = {};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
if(data27.id !== undefined){
if("deepseek-v1" !== data27.id){
const err1 = {};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
}
var _valid0 = _errs60 === errors;
errors = _errs59;
if(vErrors !== null){
if(_errs59){
vErrors.length = _errs59;
}
else {
vErrors = null;
}
}
if(_valid0){
const _errs62 = errors;
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
if(data27.id !== undefined){
const _errs63 = errors;
if("deepseek-v1" !== data27.id){
validate78.errors = [{instancePath:instancePath+"/connector/id",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/id/const",keyword:"const",params:{allowedValue: "deepseek-v1"},message:"must be equal to constant"}];
return false;
}
var valid14 = _errs63 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data27.version !== undefined){
const _errs64 = errors;
if(1 !== data27.version){
validate78.errors = [{instancePath:instancePath+"/connector/version",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid14 = _errs64 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data27.authentication !== undefined){
const _errs65 = errors;
if("bearer" !== data27.authentication){
validate78.errors = [{instancePath:instancePath+"/connector/authentication",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/authentication/const",keyword:"const",params:{allowedValue: "bearer"},message:"must be equal to constant"}];
return false;
}
var valid14 = _errs65 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data27.outputTokenParameter !== undefined){
const _errs66 = errors;
if("max_tokens" !== data27.outputTokenParameter){
validate78.errors = [{instancePath:instancePath+"/connector/outputTokenParameter",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/outputTokenParameter/const",keyword:"const",params:{allowedValue: "max_tokens"},message:"must be equal to constant"}];
return false;
}
var valid14 = _errs66 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data27.streamingUsage !== undefined){
const _errs67 = errors;
if("include_usage" !== data27.streamingUsage){
validate78.errors = [{instancePath:instancePath+"/connector/streamingUsage",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/streamingUsage/const",keyword:"const",params:{allowedValue: "include_usage"},message:"must be equal to constant"}];
return false;
}
var valid14 = _errs67 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data27.thinking !== undefined){
const _errs68 = errors;
if("type" !== data27.thinking){
validate78.errors = [{instancePath:instancePath+"/connector/thinking",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/thinking/const",keyword:"const",params:{allowedValue: "type"},message:"must be equal to constant"}];
return false;
}
var valid14 = _errs68 === errors;
}
else {
var valid14 = true;
}
if(valid14){
if(data27.reasoningHistory !== undefined){
const _errs69 = errors;
if(true !== data27.reasoningHistory){
validate78.errors = [{instancePath:instancePath+"/connector/reasoningHistory",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/then/properties/reasoningHistory/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
return false;
}
var valid14 = _errs69 === errors;
}
else {
var valid14 = true;
}
}
}
}
}
}
}
}
var _valid0 = _errs62 === errors;
valid12 = _valid0;
}
if(!valid12){
const err2 = {instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
validate78.errors = vErrors;
return false;
}
var valid11 = _errs58 === errors;
if(valid11){
const _errs70 = errors;
const _errs71 = errors;
let valid15 = true;
const _errs72 = errors;
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
let missing5;
if((data27.id === undefined) && (missing5 = "id")){
const err3 = {};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
else {
if(data27.id !== undefined){
if("mimo-v1" !== data27.id){
const err4 = {};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
}
var _valid1 = _errs72 === errors;
errors = _errs71;
if(vErrors !== null){
if(_errs71){
vErrors.length = _errs71;
}
else {
vErrors = null;
}
}
if(_valid1){
const _errs74 = errors;
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
if(data27.id !== undefined){
const _errs75 = errors;
if("mimo-v1" !== data27.id){
validate78.errors = [{instancePath:instancePath+"/connector/id",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/id/const",keyword:"const",params:{allowedValue: "mimo-v1"},message:"must be equal to constant"}];
return false;
}
var valid17 = _errs75 === errors;
}
else {
var valid17 = true;
}
if(valid17){
if(data27.version !== undefined){
const _errs76 = errors;
if(1 !== data27.version){
validate78.errors = [{instancePath:instancePath+"/connector/version",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid17 = _errs76 === errors;
}
else {
var valid17 = true;
}
if(valid17){
if(data27.authentication !== undefined){
const _errs77 = errors;
if("api_key" !== data27.authentication){
validate78.errors = [{instancePath:instancePath+"/connector/authentication",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/authentication/const",keyword:"const",params:{allowedValue: "api_key"},message:"must be equal to constant"}];
return false;
}
var valid17 = _errs77 === errors;
}
else {
var valid17 = true;
}
if(valid17){
if(data27.outputTokenParameter !== undefined){
const _errs78 = errors;
if("max_completion_tokens" !== data27.outputTokenParameter){
validate78.errors = [{instancePath:instancePath+"/connector/outputTokenParameter",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/outputTokenParameter/const",keyword:"const",params:{allowedValue: "max_completion_tokens"},message:"must be equal to constant"}];
return false;
}
var valid17 = _errs78 === errors;
}
else {
var valid17 = true;
}
if(valid17){
if(data27.streamingUsage !== undefined){
const _errs79 = errors;
if("include_usage" !== data27.streamingUsage){
validate78.errors = [{instancePath:instancePath+"/connector/streamingUsage",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/streamingUsage/const",keyword:"const",params:{allowedValue: "include_usage"},message:"must be equal to constant"}];
return false;
}
var valid17 = _errs79 === errors;
}
else {
var valid17 = true;
}
if(valid17){
if(data27.thinking !== undefined){
const _errs80 = errors;
if("type" !== data27.thinking){
validate78.errors = [{instancePath:instancePath+"/connector/thinking",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/thinking/const",keyword:"const",params:{allowedValue: "type"},message:"must be equal to constant"}];
return false;
}
var valid17 = _errs80 === errors;
}
else {
var valid17 = true;
}
if(valid17){
if(data27.reasoningHistory !== undefined){
const _errs81 = errors;
if(true !== data27.reasoningHistory){
validate78.errors = [{instancePath:instancePath+"/connector/reasoningHistory",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/then/properties/reasoningHistory/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
return false;
}
var valid17 = _errs81 === errors;
}
else {
var valid17 = true;
}
}
}
}
}
}
}
}
var _valid1 = _errs74 === errors;
valid15 = _valid1;
}
if(!valid15){
const err5 = {instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
validate78.errors = vErrors;
return false;
}
var valid11 = _errs70 === errors;
}
if(errors === _errs56){
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
let missing6;
if((((((((data27.id === undefined) && (missing6 = "id")) || ((data27.version === undefined) && (missing6 = "version"))) || ((data27.authentication === undefined) && (missing6 = "authentication"))) || ((data27.outputTokenParameter === undefined) && (missing6 = "outputTokenParameter"))) || ((data27.streamingUsage === undefined) && (missing6 = "streamingUsage"))) || ((data27.thinking === undefined) && (missing6 = "thinking"))) || ((data27.reasoningHistory === undefined) && (missing6 = "reasoningHistory"))){
validate78.errors = [{instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/required",keyword:"required",params:{missingProperty: missing6},message:"must have required property '"+missing6+"'"}];
return false;
}
else {
const _errs82 = errors;
for(const key4 in data27){
if(!(((((((key4 === "id") || (key4 === "version")) || (key4 === "authentication")) || (key4 === "outputTokenParameter")) || (key4 === "streamingUsage")) || (key4 === "thinking")) || (key4 === "reasoningHistory"))){
validate78.errors = [{instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs82 === errors){
if(data27.id !== undefined){
let data44 = data27.id;
const _errs83 = errors;
if(!(((data44 === "openai-compatible-v1") || (data44 === "deepseek-v1")) || (data44 === "mimo-v1"))){
validate78.errors = [{instancePath:instancePath+"/connector/id",schemaPath:"#/$defs/ConnectorDescriptor/properties/id/enum",keyword:"enum",params:{allowedValues: schema27.properties.id.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid18 = _errs83 === errors;
}
else {
var valid18 = true;
}
if(valid18){
if(data27.version !== undefined){
const _errs84 = errors;
if(1 !== data27.version){
validate78.errors = [{instancePath:instancePath+"/connector/version",schemaPath:"#/$defs/ConnectorDescriptor/properties/version/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid18 = _errs84 === errors;
}
else {
var valid18 = true;
}
if(valid18){
if(data27.authentication !== undefined){
let data46 = data27.authentication;
const _errs85 = errors;
if(!((((data46 === "bearer") || (data46 === "api_key")) || (data46 === "x_api_key")) || (data46 === "none"))){
validate78.errors = [{instancePath:instancePath+"/connector/authentication",schemaPath:"#/$defs/ConnectorDescriptor/properties/authentication/enum",keyword:"enum",params:{allowedValues: schema27.properties.authentication.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid18 = _errs85 === errors;
}
else {
var valid18 = true;
}
if(valid18){
if(data27.outputTokenParameter !== undefined){
let data47 = data27.outputTokenParameter;
const _errs86 = errors;
if(!((data47 === "max_tokens") || (data47 === "max_completion_tokens"))){
validate78.errors = [{instancePath:instancePath+"/connector/outputTokenParameter",schemaPath:"#/$defs/ConnectorDescriptor/properties/outputTokenParameter/enum",keyword:"enum",params:{allowedValues: schema27.properties.outputTokenParameter.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid18 = _errs86 === errors;
}
else {
var valid18 = true;
}
if(valid18){
if(data27.streamingUsage !== undefined){
let data48 = data27.streamingUsage;
const _errs87 = errors;
if(!((data48 === "include_usage") || (data48 === "native"))){
validate78.errors = [{instancePath:instancePath+"/connector/streamingUsage",schemaPath:"#/$defs/ConnectorDescriptor/properties/streamingUsage/enum",keyword:"enum",params:{allowedValues: schema27.properties.streamingUsage.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid18 = _errs87 === errors;
}
else {
var valid18 = true;
}
if(valid18){
if(data27.thinking !== undefined){
let data49 = data27.thinking;
const _errs88 = errors;
if(!(((data49 === "none") || (data49 === "type")) || (data49 === "reasoning_effort"))){
validate78.errors = [{instancePath:instancePath+"/connector/thinking",schemaPath:"#/$defs/ConnectorDescriptor/properties/thinking/enum",keyword:"enum",params:{allowedValues: schema27.properties.thinking.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid18 = _errs88 === errors;
}
else {
var valid18 = true;
}
if(valid18){
if(data27.reasoningHistory !== undefined){
const _errs89 = errors;
if(typeof data27.reasoningHistory !== "boolean"){
validate78.errors = [{instancePath:instancePath+"/connector/reasoningHistory",schemaPath:"#/$defs/ConnectorDescriptor/properties/reasoningHistory/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid18 = _errs89 === errors;
}
else {
var valid18 = true;
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
validate78.errors = [{instancePath:instancePath+"/connector",schemaPath:"#/$defs/ConnectorDescriptor/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs55 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.connectorProtocol !== undefined){
let data51 = data.connectorProtocol;
const _errs91 = errors;
if(!(((data51 === "pi_native_v1") || (data51 === "pi_native_v2")) || (data51 === "pi_native_v3"))){
validate78.errors = [{instancePath:instancePath+"/connectorProtocol",schemaPath:"#/properties/connectorProtocol/enum",keyword:"enum",params:{allowedValues: schema100.properties.connectorProtocol.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs91 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.messageFormat !== undefined){
const _errs92 = errors;
if("pi_context_v1" !== data.messageFormat){
validate78.errors = [{instancePath:instancePath+"/messageFormat",schemaPath:"#/properties/messageFormat/const",keyword:"const",params:{allowedValue: "pi_context_v1"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs92 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.model !== undefined){
let data53 = data.model;
const _errs93 = errors;
if(errors === _errs93){
if(typeof data53 === "string"){
if(func2(data53) > 256){
validate78.errors = [{instancePath:instancePath+"/model",schemaPath:"#/properties/model/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate78.errors = [{instancePath:instancePath+"/model",schemaPath:"#/properties/model/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs93 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.provider !== undefined){
let data54 = data.provider;
const _errs95 = errors;
if(errors === _errs95){
if(typeof data54 === "string"){
if(func2(data54) > 256){
validate78.errors = [{instancePath:instancePath+"/provider",schemaPath:"#/properties/provider/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate78.errors = [{instancePath:instancePath+"/provider",schemaPath:"#/properties/provider/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs95 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.api !== undefined){
let data55 = data.api;
const _errs97 = errors;
if(errors === _errs97){
if(typeof data55 === "string"){
if(func2(data55) > 256){
validate78.errors = [{instancePath:instancePath+"/api",schemaPath:"#/properties/api/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate78.errors = [{instancePath:instancePath+"/api",schemaPath:"#/properties/api/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs97 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nativeRevision !== undefined){
let data56 = data.nativeRevision;
const _errs99 = errors;
if(!(((typeof data56 == "number") && (!(data56 % 1) && !isNaN(data56))) && (isFinite(data56)))){
validate78.errors = [{instancePath:instancePath+"/nativeRevision",schemaPath:"#/properties/nativeRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs99){
if((typeof data56 == "number") && (isFinite(data56))){
if(data56 > 9007199254740991 || isNaN(data56)){
validate78.errors = [{instancePath:instancePath+"/nativeRevision",schemaPath:"#/properties/nativeRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data56 < 0 || isNaN(data56)){
validate78.errors = [{instancePath:instancePath+"/nativeRevision",schemaPath:"#/properties/nativeRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs99 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.configurationDigest !== undefined){
let data57 = data.configurationDigest;
const _errs101 = errors;
if(errors === _errs101){
if(typeof data57 === "string"){
if(!pattern115.test(data57)){
validate78.errors = [{instancePath:instancePath+"/configurationDigest",schemaPath:"#/properties/configurationDigest/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""}];
return false;
}
}
else {
validate78.errors = [{instancePath:instancePath+"/configurationDigest",schemaPath:"#/properties/configurationDigest/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs101 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.endpoint !== undefined){
let data58 = data.endpoint;
const _errs103 = errors;
if(errors === _errs103){
if(typeof data58 === "string"){
if(func2(data58) > 2048){
validate78.errors = [{instancePath:instancePath+"/endpoint",schemaPath:"#/properties/endpoint/maxLength",keyword:"maxLength",params:{limit: 2048},message:"must NOT have more than 2048 characters"}];
return false;
}
}
else {
validate78.errors = [{instancePath:instancePath+"/endpoint",schemaPath:"#/properties/endpoint/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs103 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.modelSettings !== undefined){
let data59 = data.modelSettings;
const _errs105 = errors;
const _errs106 = errors;
if(errors === _errs106){
if(data59 && typeof data59 == "object" && !Array.isArray(data59)){
let missing7;
if((data59.reasoning === undefined) && (missing7 = "reasoning")){
validate78.errors = [{instancePath:instancePath+"/modelSettings",schemaPath:"#/$defs/ModelSettings/required",keyword:"required",params:{missingProperty: missing7},message:"must have required property '"+missing7+"'"}];
return false;
}
else {
const _errs108 = errors;
for(const key5 in data59){
if(!(key5 === "reasoning")){
validate78.errors = [{instancePath:instancePath+"/modelSettings",schemaPath:"#/$defs/ModelSettings/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs108 === errors){
if(data59.reasoning !== undefined){
let data60 = data59.reasoning;
if(!(((((((data60 === "off") || (data60 === "minimal")) || (data60 === "low")) || (data60 === "medium")) || (data60 === "high")) || (data60 === "xhigh")) || (data60 === "max"))){
validate78.errors = [{instancePath:instancePath+"/modelSettings/reasoning",schemaPath:"#/$defs/ModelSettings/properties/reasoning/enum",keyword:"enum",params:{allowedValues: schema63.properties.reasoning.enum},message:"must be equal to one of the allowed values"}];
return false;
}
}
}
}
}
else {
validate78.errors = [{instancePath:instancePath+"/modelSettings",schemaPath:"#/$defs/ModelSettings/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs105 === errors;
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
}
}
}
}
}
else {
validate78.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate78.errors = vErrors;
return errors === 0;
}

export const ProviderRebindRequest = validate80;
const schema105 = {"type":"object","additionalProperties":false,"properties":{"expectedInstallationId":{"type":"string","maxLength":128}},"required":["expectedInstallationId"]};

function validate80(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.expectedInstallationId === undefined) && (missing0 = "expectedInstallationId")){
validate80.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "expectedInstallationId")){
validate80.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.expectedInstallationId !== undefined){
let data0 = data.expectedInstallationId;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(func2(data0) > 128){
validate80.errors = [{instancePath:instancePath+"/expectedInstallationId",schemaPath:"#/properties/expectedInstallationId/maxLength",keyword:"maxLength",params:{limit: 128},message:"must NOT have more than 128 characters"}];
return false;
}
}
else {
validate80.errors = [{instancePath:instancePath+"/expectedInstallationId",schemaPath:"#/properties/expectedInstallationId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
}
}
}
else {
validate80.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate80.errors = vErrors;
return errors === 0;
}

export const ProviderDisconnectRequest = validate81;
const schema106 = {"type":"object","additionalProperties":false,"properties":{"confirm":{"const":true}},"required":["confirm"]};

function validate81(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.confirm === undefined) && (missing0 = "confirm")){
validate81.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "confirm")){
validate81.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.confirm !== undefined){
if(true !== data.confirm){
validate81.errors = [{instancePath:instancePath+"/confirm",schemaPath:"#/properties/confirm/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
return false;
}
}
}
}
}
else {
validate81.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate81.errors = vErrors;
return errors === 0;
}

export const ProviderCredentialStatusRequest = validate82;
const schema107 = {"type":"object","additionalProperties":false,"properties":{"status":{"enum":["stored","removed"]},"expectedRevision":{"type":"integer","minimum":0,"maximum":9007199254740991}},"required":["status","expectedRevision"]};

function validate82(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.status === undefined) && (missing0 = "status")) || ((data.expectedRevision === undefined) && (missing0 = "expectedRevision"))){
validate82.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "status") || (key0 === "expectedRevision"))){
validate82.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.status !== undefined){
let data0 = data.status;
const _errs2 = errors;
if(!((data0 === "stored") || (data0 === "removed"))){
validate82.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema107.properties.status.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.expectedRevision !== undefined){
let data1 = data.expectedRevision;
const _errs3 = errors;
if(!(((typeof data1 == "number") && (!(data1 % 1) && !isNaN(data1))) && (isFinite(data1)))){
validate82.errors = [{instancePath:instancePath+"/expectedRevision",schemaPath:"#/properties/expectedRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs3){
if((typeof data1 == "number") && (isFinite(data1))){
if(data1 > 9007199254740991 || isNaN(data1)){
validate82.errors = [{instancePath:instancePath+"/expectedRevision",schemaPath:"#/properties/expectedRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data1 < 0 || isNaN(data1)){
validate82.errors = [{instancePath:instancePath+"/expectedRevision",schemaPath:"#/properties/expectedRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
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
validate82.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate82.errors = vErrors;
return errors === 0;
}

export const PiConnection = validate83;
const schema108 = {"type":"object","additionalProperties":false,"properties":{"kind":{"enum":["builtin","custom"]},"baseUrl":{"type":"string","maxLength":2048},"api":{"type":"string","pattern":"^(openai-completions|openai-responses|anthropic-messages|google-generative-ai|mistral-conversations|azure-openai-responses|pi-messages|sdk:[a-zA-Z0-9@/_.-]+)$","maxLength":256},"headerNames":{"type":"array","maxItems":16,"uniqueItems":true,"items":{"type":"string","pattern":"^[A-Za-z][A-Za-z0-9-]{0,63}$"}},"modelDefinitions":{"type":"array","maxItems":64,"items":{"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","maxLength":256},"name":{"type":"string","maxLength":256},"api":{"type":"string","pattern":"^(openai-completions|openai-responses|anthropic-messages|google-generative-ai|mistral-conversations|azure-openai-responses|pi-messages|sdk:[a-zA-Z0-9@/_.-]+)$","maxLength":256},"contextWindow":{"type":"integer","minimum":4096,"maximum":131072},"maxTokens":{"type":"integer","minimum":128,"maximum":8192},"cost":{"type":"object","additionalProperties":false,"properties":{"input":{"type":"number","minimum":0},"output":{"type":"number","minimum":0},"cacheRead":{"type":"number","minimum":0},"cacheWrite":{"type":"number","minimum":0}},"required":["input","output","cacheRead","cacheWrite"]},"thinking":{"enum":["none","optional","required"]},"compat":{"type":"object","additionalProperties":false,"properties":{"supportsStore":{"type":"boolean"},"supportsDeveloperRole":{"type":"boolean"},"supportsReasoningEffort":{"type":"boolean"},"supportsUsageInStreaming":{"type":"boolean"},"maxTokensField":{"enum":["max_tokens","max_completion_tokens"]},"requiresToolResultName":{"type":"boolean"},"requiresAssistantAfterToolResult":{"type":"boolean"},"requiresThinkingAsText":{"type":"boolean"},"thinkingFormat":{"enum":["openai","zai","qwen","deepseek"]}},"required":[]}},"required":["id","contextWindow","maxTokens","cost"]}},"compat":{"type":"object","additionalProperties":false,"properties":{"supportsStore":{"type":"boolean"},"supportsDeveloperRole":{"type":"boolean"},"supportsReasoningEffort":{"type":"boolean"},"supportsUsageInStreaming":{"type":"boolean"},"maxTokensField":{"enum":["max_tokens","max_completion_tokens"]},"requiresToolResultName":{"type":"boolean"},"requiresAssistantAfterToolResult":{"type":"boolean"},"requiresThinkingAsText":{"type":"boolean"},"thinkingFormat":{"enum":["openai","zai","qwen","deepseek"]}},"required":[]},"authentication":{"enum":["api_key","none"]}},"required":["kind"]};
const pattern182 = new RegExp("^(openai-completions|openai-responses|anthropic-messages|google-generative-ai|mistral-conversations|azure-openai-responses|pi-messages|sdk:[a-zA-Z0-9@/_.-]+)$", "u");
const pattern183 = new RegExp("^[A-Za-z][A-Za-z0-9-]{0,63}$", "u");

function validate83(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.kind === undefined) && (missing0 = "kind")){
validate83.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((((key0 === "kind") || (key0 === "baseUrl")) || (key0 === "api")) || (key0 === "headerNames")) || (key0 === "modelDefinitions")) || (key0 === "compat")) || (key0 === "authentication"))){
validate83.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.kind !== undefined){
let data0 = data.kind;
const _errs2 = errors;
if(!((data0 === "builtin") || (data0 === "custom"))){
validate83.errors = [{instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/enum",keyword:"enum",params:{allowedValues: schema108.properties.kind.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.baseUrl !== undefined){
let data1 = data.baseUrl;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data1 === "string"){
if(func2(data1) > 2048){
validate83.errors = [{instancePath:instancePath+"/baseUrl",schemaPath:"#/properties/baseUrl/maxLength",keyword:"maxLength",params:{limit: 2048},message:"must NOT have more than 2048 characters"}];
return false;
}
}
else {
validate83.errors = [{instancePath:instancePath+"/baseUrl",schemaPath:"#/properties/baseUrl/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.api !== undefined){
let data2 = data.api;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data2 === "string"){
if(func2(data2) > 256){
validate83.errors = [{instancePath:instancePath+"/api",schemaPath:"#/properties/api/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
else {
if(!pattern182.test(data2)){
validate83.errors = [{instancePath:instancePath+"/api",schemaPath:"#/properties/api/pattern",keyword:"pattern",params:{pattern: "^(openai-completions|openai-responses|anthropic-messages|google-generative-ai|mistral-conversations|azure-openai-responses|pi-messages|sdk:[a-zA-Z0-9@/_.-]+)$"},message:"must match pattern \""+"^(openai-completions|openai-responses|anthropic-messages|google-generative-ai|mistral-conversations|azure-openai-responses|pi-messages|sdk:[a-zA-Z0-9@/_.-]+)$"+"\""}];
return false;
}
}
}
else {
validate83.errors = [{instancePath:instancePath+"/api",schemaPath:"#/properties/api/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.headerNames !== undefined){
let data3 = data.headerNames;
const _errs7 = errors;
if(errors === _errs7){
if(Array.isArray(data3)){
if(data3.length > 16){
validate83.errors = [{instancePath:instancePath+"/headerNames",schemaPath:"#/properties/headerNames/maxItems",keyword:"maxItems",params:{limit: 16},message:"must NOT have more than 16 items"}];
return false;
}
else {
var valid1 = true;
const len0 = data3.length;
for(let i0=0; i0<len0; i0++){
let data4 = data3[i0];
const _errs9 = errors;
if(errors === _errs9){
if(typeof data4 === "string"){
if(!pattern183.test(data4)){
validate83.errors = [{instancePath:instancePath+"/headerNames/" + i0,schemaPath:"#/properties/headerNames/items/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9-]{0,63}$"+"\""}];
return false;
}
}
else {
validate83.errors = [{instancePath:instancePath+"/headerNames/" + i0,schemaPath:"#/properties/headerNames/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid1 = _errs9 === errors;
if(!valid1){
break;
}
}
if(valid1){
let i1 = data3.length;
let j0;
if(i1 > 1){
const indices0 = {};
for(;i1--;){
let item0 = data3[i1];
if(typeof item0 !== "string"){
continue;
}
if(typeof indices0[item0] == "number"){
j0 = indices0[item0];
validate83.errors = [{instancePath:instancePath+"/headerNames",schemaPath:"#/properties/headerNames/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"}];
return false;
break;
}
indices0[item0] = i1;
}
}
}
}
}
else {
validate83.errors = [{instancePath:instancePath+"/headerNames",schemaPath:"#/properties/headerNames/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.modelDefinitions !== undefined){
let data5 = data.modelDefinitions;
const _errs11 = errors;
if(errors === _errs11){
if(Array.isArray(data5)){
if(data5.length > 64){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions",schemaPath:"#/properties/modelDefinitions/maxItems",keyword:"maxItems",params:{limit: 64},message:"must NOT have more than 64 items"}];
return false;
}
else {
var valid3 = true;
const len1 = data5.length;
for(let i2=0; i2<len1; i2++){
let data6 = data5[i2];
const _errs13 = errors;
if(errors === _errs13){
if(data6 && typeof data6 == "object" && !Array.isArray(data6)){
let missing1;
if(((((data6.id === undefined) && (missing1 = "id")) || ((data6.contextWindow === undefined) && (missing1 = "contextWindow"))) || ((data6.maxTokens === undefined) && (missing1 = "maxTokens"))) || ((data6.cost === undefined) && (missing1 = "cost"))){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2,schemaPath:"#/properties/modelDefinitions/items/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs15 = errors;
for(const key1 in data6){
if(!((((((((key1 === "id") || (key1 === "name")) || (key1 === "api")) || (key1 === "contextWindow")) || (key1 === "maxTokens")) || (key1 === "cost")) || (key1 === "thinking")) || (key1 === "compat"))){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2,schemaPath:"#/properties/modelDefinitions/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs15 === errors){
if(data6.id !== undefined){
let data7 = data6.id;
const _errs16 = errors;
if(errors === _errs16){
if(typeof data7 === "string"){
if(func2(data7) > 256){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/id",schemaPath:"#/properties/modelDefinitions/items/properties/id/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/id",schemaPath:"#/properties/modelDefinitions/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid4 = _errs16 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data6.name !== undefined){
let data8 = data6.name;
const _errs18 = errors;
if(errors === _errs18){
if(typeof data8 === "string"){
if(func2(data8) > 256){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/name",schemaPath:"#/properties/modelDefinitions/items/properties/name/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/name",schemaPath:"#/properties/modelDefinitions/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid4 = _errs18 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data6.api !== undefined){
let data9 = data6.api;
const _errs20 = errors;
if(errors === _errs20){
if(typeof data9 === "string"){
if(func2(data9) > 256){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/api",schemaPath:"#/properties/modelDefinitions/items/properties/api/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
else {
if(!pattern182.test(data9)){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/api",schemaPath:"#/properties/modelDefinitions/items/properties/api/pattern",keyword:"pattern",params:{pattern: "^(openai-completions|openai-responses|anthropic-messages|google-generative-ai|mistral-conversations|azure-openai-responses|pi-messages|sdk:[a-zA-Z0-9@/_.-]+)$"},message:"must match pattern \""+"^(openai-completions|openai-responses|anthropic-messages|google-generative-ai|mistral-conversations|azure-openai-responses|pi-messages|sdk:[a-zA-Z0-9@/_.-]+)$"+"\""}];
return false;
}
}
}
else {
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/api",schemaPath:"#/properties/modelDefinitions/items/properties/api/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid4 = _errs20 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data6.contextWindow !== undefined){
let data10 = data6.contextWindow;
const _errs22 = errors;
if(!(((typeof data10 == "number") && (!(data10 % 1) && !isNaN(data10))) && (isFinite(data10)))){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/contextWindow",schemaPath:"#/properties/modelDefinitions/items/properties/contextWindow/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs22){
if((typeof data10 == "number") && (isFinite(data10))){
if(data10 > 131072 || isNaN(data10)){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/contextWindow",schemaPath:"#/properties/modelDefinitions/items/properties/contextWindow/maximum",keyword:"maximum",params:{comparison: "<=", limit: 131072},message:"must be <= 131072"}];
return false;
}
else {
if(data10 < 4096 || isNaN(data10)){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/contextWindow",schemaPath:"#/properties/modelDefinitions/items/properties/contextWindow/minimum",keyword:"minimum",params:{comparison: ">=", limit: 4096},message:"must be >= 4096"}];
return false;
}
}
}
}
var valid4 = _errs22 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data6.maxTokens !== undefined){
let data11 = data6.maxTokens;
const _errs24 = errors;
if(!(((typeof data11 == "number") && (!(data11 % 1) && !isNaN(data11))) && (isFinite(data11)))){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/maxTokens",schemaPath:"#/properties/modelDefinitions/items/properties/maxTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs24){
if((typeof data11 == "number") && (isFinite(data11))){
if(data11 > 8192 || isNaN(data11)){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/maxTokens",schemaPath:"#/properties/modelDefinitions/items/properties/maxTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 8192},message:"must be <= 8192"}];
return false;
}
else {
if(data11 < 128 || isNaN(data11)){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/maxTokens",schemaPath:"#/properties/modelDefinitions/items/properties/maxTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 128},message:"must be >= 128"}];
return false;
}
}
}
}
var valid4 = _errs24 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data6.cost !== undefined){
let data12 = data6.cost;
const _errs26 = errors;
if(errors === _errs26){
if(data12 && typeof data12 == "object" && !Array.isArray(data12)){
let missing2;
if(((((data12.input === undefined) && (missing2 = "input")) || ((data12.output === undefined) && (missing2 = "output"))) || ((data12.cacheRead === undefined) && (missing2 = "cacheRead"))) || ((data12.cacheWrite === undefined) && (missing2 = "cacheWrite"))){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/cost",schemaPath:"#/properties/modelDefinitions/items/properties/cost/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];
return false;
}
else {
const _errs28 = errors;
for(const key2 in data12){
if(!((((key2 === "input") || (key2 === "output")) || (key2 === "cacheRead")) || (key2 === "cacheWrite"))){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/cost",schemaPath:"#/properties/modelDefinitions/items/properties/cost/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs28 === errors){
if(data12.input !== undefined){
let data13 = data12.input;
const _errs29 = errors;
if(errors === _errs29){
if((typeof data13 == "number") && (isFinite(data13))){
if(data13 < 0 || isNaN(data13)){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/cost/input",schemaPath:"#/properties/modelDefinitions/items/properties/cost/properties/input/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
else {
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/cost/input",schemaPath:"#/properties/modelDefinitions/items/properties/cost/properties/input/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
}
var valid5 = _errs29 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data12.output !== undefined){
let data14 = data12.output;
const _errs31 = errors;
if(errors === _errs31){
if((typeof data14 == "number") && (isFinite(data14))){
if(data14 < 0 || isNaN(data14)){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/cost/output",schemaPath:"#/properties/modelDefinitions/items/properties/cost/properties/output/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
else {
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/cost/output",schemaPath:"#/properties/modelDefinitions/items/properties/cost/properties/output/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
}
var valid5 = _errs31 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data12.cacheRead !== undefined){
let data15 = data12.cacheRead;
const _errs33 = errors;
if(errors === _errs33){
if((typeof data15 == "number") && (isFinite(data15))){
if(data15 < 0 || isNaN(data15)){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/cost/cacheRead",schemaPath:"#/properties/modelDefinitions/items/properties/cost/properties/cacheRead/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
else {
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/cost/cacheRead",schemaPath:"#/properties/modelDefinitions/items/properties/cost/properties/cacheRead/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
}
var valid5 = _errs33 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data12.cacheWrite !== undefined){
let data16 = data12.cacheWrite;
const _errs35 = errors;
if(errors === _errs35){
if((typeof data16 == "number") && (isFinite(data16))){
if(data16 < 0 || isNaN(data16)){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/cost/cacheWrite",schemaPath:"#/properties/modelDefinitions/items/properties/cost/properties/cacheWrite/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
else {
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/cost/cacheWrite",schemaPath:"#/properties/modelDefinitions/items/properties/cost/properties/cacheWrite/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
}
var valid5 = _errs35 === errors;
}
else {
var valid5 = true;
}
}
}
}
}
}
}
else {
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/cost",schemaPath:"#/properties/modelDefinitions/items/properties/cost/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid4 = _errs26 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data6.thinking !== undefined){
let data17 = data6.thinking;
const _errs37 = errors;
if(!(((data17 === "none") || (data17 === "optional")) || (data17 === "required"))){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/thinking",schemaPath:"#/properties/modelDefinitions/items/properties/thinking/enum",keyword:"enum",params:{allowedValues: schema108.properties.modelDefinitions.items.properties.thinking.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid4 = _errs37 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data6.compat !== undefined){
let data18 = data6.compat;
const _errs38 = errors;
if(errors === _errs38){
if(data18 && typeof data18 == "object" && !Array.isArray(data18)){
const _errs40 = errors;
for(const key3 in data18){
if(!(func7.call(schema108.properties.modelDefinitions.items.properties.compat.properties, key3))){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/compat",schemaPath:"#/properties/modelDefinitions/items/properties/compat/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs40 === errors){
if(data18.supportsStore !== undefined){
const _errs41 = errors;
if(typeof data18.supportsStore !== "boolean"){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/compat/supportsStore",schemaPath:"#/properties/modelDefinitions/items/properties/compat/properties/supportsStore/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid6 = _errs41 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data18.supportsDeveloperRole !== undefined){
const _errs43 = errors;
if(typeof data18.supportsDeveloperRole !== "boolean"){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/compat/supportsDeveloperRole",schemaPath:"#/properties/modelDefinitions/items/properties/compat/properties/supportsDeveloperRole/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid6 = _errs43 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data18.supportsReasoningEffort !== undefined){
const _errs45 = errors;
if(typeof data18.supportsReasoningEffort !== "boolean"){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/compat/supportsReasoningEffort",schemaPath:"#/properties/modelDefinitions/items/properties/compat/properties/supportsReasoningEffort/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid6 = _errs45 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data18.supportsUsageInStreaming !== undefined){
const _errs47 = errors;
if(typeof data18.supportsUsageInStreaming !== "boolean"){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/compat/supportsUsageInStreaming",schemaPath:"#/properties/modelDefinitions/items/properties/compat/properties/supportsUsageInStreaming/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid6 = _errs47 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data18.maxTokensField !== undefined){
let data23 = data18.maxTokensField;
const _errs49 = errors;
if(!((data23 === "max_tokens") || (data23 === "max_completion_tokens"))){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/compat/maxTokensField",schemaPath:"#/properties/modelDefinitions/items/properties/compat/properties/maxTokensField/enum",keyword:"enum",params:{allowedValues: schema108.properties.modelDefinitions.items.properties.compat.properties.maxTokensField.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid6 = _errs49 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data18.requiresToolResultName !== undefined){
const _errs50 = errors;
if(typeof data18.requiresToolResultName !== "boolean"){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/compat/requiresToolResultName",schemaPath:"#/properties/modelDefinitions/items/properties/compat/properties/requiresToolResultName/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid6 = _errs50 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data18.requiresAssistantAfterToolResult !== undefined){
const _errs52 = errors;
if(typeof data18.requiresAssistantAfterToolResult !== "boolean"){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/compat/requiresAssistantAfterToolResult",schemaPath:"#/properties/modelDefinitions/items/properties/compat/properties/requiresAssistantAfterToolResult/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid6 = _errs52 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data18.requiresThinkingAsText !== undefined){
const _errs54 = errors;
if(typeof data18.requiresThinkingAsText !== "boolean"){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/compat/requiresThinkingAsText",schemaPath:"#/properties/modelDefinitions/items/properties/compat/properties/requiresThinkingAsText/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid6 = _errs54 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data18.thinkingFormat !== undefined){
let data27 = data18.thinkingFormat;
const _errs56 = errors;
if(!((((data27 === "openai") || (data27 === "zai")) || (data27 === "qwen")) || (data27 === "deepseek"))){
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/compat/thinkingFormat",schemaPath:"#/properties/modelDefinitions/items/properties/compat/properties/thinkingFormat/enum",keyword:"enum",params:{allowedValues: schema108.properties.modelDefinitions.items.properties.compat.properties.thinkingFormat.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid6 = _errs56 === errors;
}
else {
var valid6 = true;
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
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2+"/compat",schemaPath:"#/properties/modelDefinitions/items/properties/compat/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid4 = _errs38 === errors;
}
else {
var valid4 = true;
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
validate83.errors = [{instancePath:instancePath+"/modelDefinitions/" + i2,schemaPath:"#/properties/modelDefinitions/items/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid3 = _errs13 === errors;
if(!valid3){
break;
}
}
}
}
else {
validate83.errors = [{instancePath:instancePath+"/modelDefinitions",schemaPath:"#/properties/modelDefinitions/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.compat !== undefined){
let data28 = data.compat;
const _errs57 = errors;
if(errors === _errs57){
if(data28 && typeof data28 == "object" && !Array.isArray(data28)){
const _errs59 = errors;
for(const key4 in data28){
if(!(func7.call(schema108.properties.compat.properties, key4))){
validate83.errors = [{instancePath:instancePath+"/compat",schemaPath:"#/properties/compat/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs59 === errors){
if(data28.supportsStore !== undefined){
const _errs60 = errors;
if(typeof data28.supportsStore !== "boolean"){
validate83.errors = [{instancePath:instancePath+"/compat/supportsStore",schemaPath:"#/properties/compat/properties/supportsStore/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid7 = _errs60 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data28.supportsDeveloperRole !== undefined){
const _errs62 = errors;
if(typeof data28.supportsDeveloperRole !== "boolean"){
validate83.errors = [{instancePath:instancePath+"/compat/supportsDeveloperRole",schemaPath:"#/properties/compat/properties/supportsDeveloperRole/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid7 = _errs62 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data28.supportsReasoningEffort !== undefined){
const _errs64 = errors;
if(typeof data28.supportsReasoningEffort !== "boolean"){
validate83.errors = [{instancePath:instancePath+"/compat/supportsReasoningEffort",schemaPath:"#/properties/compat/properties/supportsReasoningEffort/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid7 = _errs64 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data28.supportsUsageInStreaming !== undefined){
const _errs66 = errors;
if(typeof data28.supportsUsageInStreaming !== "boolean"){
validate83.errors = [{instancePath:instancePath+"/compat/supportsUsageInStreaming",schemaPath:"#/properties/compat/properties/supportsUsageInStreaming/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid7 = _errs66 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data28.maxTokensField !== undefined){
let data33 = data28.maxTokensField;
const _errs68 = errors;
if(!((data33 === "max_tokens") || (data33 === "max_completion_tokens"))){
validate83.errors = [{instancePath:instancePath+"/compat/maxTokensField",schemaPath:"#/properties/compat/properties/maxTokensField/enum",keyword:"enum",params:{allowedValues: schema108.properties.compat.properties.maxTokensField.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid7 = _errs68 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data28.requiresToolResultName !== undefined){
const _errs69 = errors;
if(typeof data28.requiresToolResultName !== "boolean"){
validate83.errors = [{instancePath:instancePath+"/compat/requiresToolResultName",schemaPath:"#/properties/compat/properties/requiresToolResultName/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid7 = _errs69 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data28.requiresAssistantAfterToolResult !== undefined){
const _errs71 = errors;
if(typeof data28.requiresAssistantAfterToolResult !== "boolean"){
validate83.errors = [{instancePath:instancePath+"/compat/requiresAssistantAfterToolResult",schemaPath:"#/properties/compat/properties/requiresAssistantAfterToolResult/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid7 = _errs71 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data28.requiresThinkingAsText !== undefined){
const _errs73 = errors;
if(typeof data28.requiresThinkingAsText !== "boolean"){
validate83.errors = [{instancePath:instancePath+"/compat/requiresThinkingAsText",schemaPath:"#/properties/compat/properties/requiresThinkingAsText/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid7 = _errs73 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data28.thinkingFormat !== undefined){
let data37 = data28.thinkingFormat;
const _errs75 = errors;
if(!((((data37 === "openai") || (data37 === "zai")) || (data37 === "qwen")) || (data37 === "deepseek"))){
validate83.errors = [{instancePath:instancePath+"/compat/thinkingFormat",schemaPath:"#/properties/compat/properties/thinkingFormat/enum",keyword:"enum",params:{allowedValues: schema108.properties.compat.properties.thinkingFormat.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid7 = _errs75 === errors;
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
else {
validate83.errors = [{instancePath:instancePath+"/compat",schemaPath:"#/properties/compat/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs57 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.authentication !== undefined){
let data38 = data.authentication;
const _errs76 = errors;
if(!((data38 === "api_key") || (data38 === "none"))){
validate83.errors = [{instancePath:instancePath+"/authentication",schemaPath:"#/properties/authentication/enum",keyword:"enum",params:{allowedValues: schema108.properties.authentication.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs76 === errors;
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
validate83.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate83.errors = vErrors;
return errors === 0;
}

export const PiConnectionDraft = validate84;
const schema109 = {"type":"object","additionalProperties":false,"properties":{"connectorProtocol":{"enum":["pi_native_v2","pi_native_v3"]},"name":{"type":"string","maxLength":120},"provider":{"type":"string","maxLength":256},"models":{"type":"array","minItems":1,"maxItems":16,"uniqueItems":true,"items":{"type":"string","maxLength":256}},"fields":{"type":"object","additionalProperties":{"type":"string","maxLength":128}},"connection":{"$ref":"#/$defs/PiConnection"},"inputRate":{"type":"string","pattern":"^(0|[1-9][0-9]{0,8})$"},"outputRate":{"type":"string","pattern":"^(0|[1-9][0-9]{0,8})$"},"totalTokens":{"type":"string","pattern":"^[1-9][0-9]{0,11}$"},"testCredits":{"type":"string","pattern":"^[1-9][0-9]{0,8}$"},"maxOutputTokens":{"type":"integer","minimum":128,"maximum":8192},"modelsConfirmed":{"type":"boolean"},"supplyClass":{"enum":["authorized_api","self_hosted"]}},"required":["connectorProtocol","name","provider","models","fields","connection","inputRate","outputRate","totalTokens","testCredits","maxOutputTokens"]};
const pattern190 = new RegExp("^[1-9][0-9]{0,11}$", "u");
const pattern191 = new RegExp("^[1-9][0-9]{0,8}$", "u");

function validate84(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((((((data.connectorProtocol === undefined) && (missing0 = "connectorProtocol")) || ((data.name === undefined) && (missing0 = "name"))) || ((data.provider === undefined) && (missing0 = "provider"))) || ((data.models === undefined) && (missing0 = "models"))) || ((data.fields === undefined) && (missing0 = "fields"))) || ((data.connection === undefined) && (missing0 = "connection"))) || ((data.inputRate === undefined) && (missing0 = "inputRate"))) || ((data.outputRate === undefined) && (missing0 = "outputRate"))) || ((data.totalTokens === undefined) && (missing0 = "totalTokens"))) || ((data.testCredits === undefined) && (missing0 = "testCredits"))) || ((data.maxOutputTokens === undefined) && (missing0 = "maxOutputTokens"))){
validate84.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema109.properties, key0))){
validate84.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.connectorProtocol !== undefined){
let data0 = data.connectorProtocol;
const _errs2 = errors;
if(!((data0 === "pi_native_v2") || (data0 === "pi_native_v3"))){
validate84.errors = [{instancePath:instancePath+"/connectorProtocol",schemaPath:"#/properties/connectorProtocol/enum",keyword:"enum",params:{allowedValues: schema109.properties.connectorProtocol.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.name !== undefined){
let data1 = data.name;
const _errs3 = errors;
if(errors === _errs3){
if(typeof data1 === "string"){
if(func2(data1) > 120){
validate84.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"}];
return false;
}
}
else {
validate84.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.provider !== undefined){
let data2 = data.provider;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data2 === "string"){
if(func2(data2) > 256){
validate84.errors = [{instancePath:instancePath+"/provider",schemaPath:"#/properties/provider/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate84.errors = [{instancePath:instancePath+"/provider",schemaPath:"#/properties/provider/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.models !== undefined){
let data3 = data.models;
const _errs7 = errors;
if(errors === _errs7){
if(Array.isArray(data3)){
if(data3.length > 16){
validate84.errors = [{instancePath:instancePath+"/models",schemaPath:"#/properties/models/maxItems",keyword:"maxItems",params:{limit: 16},message:"must NOT have more than 16 items"}];
return false;
}
else {
if(data3.length < 1){
validate84.errors = [{instancePath:instancePath+"/models",schemaPath:"#/properties/models/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid1 = true;
const len0 = data3.length;
for(let i0=0; i0<len0; i0++){
let data4 = data3[i0];
const _errs9 = errors;
if(errors === _errs9){
if(typeof data4 === "string"){
if(func2(data4) > 256){
validate84.errors = [{instancePath:instancePath+"/models/" + i0,schemaPath:"#/properties/models/items/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate84.errors = [{instancePath:instancePath+"/models/" + i0,schemaPath:"#/properties/models/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid1 = _errs9 === errors;
if(!valid1){
break;
}
}
if(valid1){
let i1 = data3.length;
let j0;
if(i1 > 1){
const indices0 = {};
for(;i1--;){
let item0 = data3[i1];
if(typeof item0 !== "string"){
continue;
}
if(typeof indices0[item0] == "number"){
j0 = indices0[item0];
validate84.errors = [{instancePath:instancePath+"/models",schemaPath:"#/properties/models/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"}];
return false;
break;
}
indices0[item0] = i1;
}
}
}
}
}
}
else {
validate84.errors = [{instancePath:instancePath+"/models",schemaPath:"#/properties/models/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.fields !== undefined){
let data5 = data.fields;
const _errs11 = errors;
if(errors === _errs11){
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
for(const key1 in data5){
let data6 = data5[key1];
const _errs14 = errors;
if(errors === _errs14){
if(typeof data6 === "string"){
if(func2(data6) > 128){
validate84.errors = [{instancePath:instancePath+"/fields/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/fields/additionalProperties/maxLength",keyword:"maxLength",params:{limit: 128},message:"must NOT have more than 128 characters"}];
return false;
}
}
else {
validate84.errors = [{instancePath:instancePath+"/fields/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/fields/additionalProperties/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid3 = _errs14 === errors;
if(!valid3){
break;
}
}
}
else {
validate84.errors = [{instancePath:instancePath+"/fields",schemaPath:"#/properties/fields/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.connection !== undefined){
let data7 = data.connection;
const _errs16 = errors;
const _errs17 = errors;
if(errors === _errs17){
if(data7 && typeof data7 == "object" && !Array.isArray(data7)){
let missing1;
if((data7.kind === undefined) && (missing1 = "kind")){
validate84.errors = [{instancePath:instancePath+"/connection",schemaPath:"#/$defs/PiConnection/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs19 = errors;
for(const key2 in data7){
if(!(((((((key2 === "kind") || (key2 === "baseUrl")) || (key2 === "api")) || (key2 === "headerNames")) || (key2 === "modelDefinitions")) || (key2 === "compat")) || (key2 === "authentication"))){
validate84.errors = [{instancePath:instancePath+"/connection",schemaPath:"#/$defs/PiConnection/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs19 === errors){
if(data7.kind !== undefined){
let data8 = data7.kind;
const _errs20 = errors;
if(!((data8 === "builtin") || (data8 === "custom"))){
validate84.errors = [{instancePath:instancePath+"/connection/kind",schemaPath:"#/$defs/PiConnection/properties/kind/enum",keyword:"enum",params:{allowedValues: schema108.properties.kind.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid5 = _errs20 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data7.baseUrl !== undefined){
let data9 = data7.baseUrl;
const _errs21 = errors;
if(errors === _errs21){
if(typeof data9 === "string"){
if(func2(data9) > 2048){
validate84.errors = [{instancePath:instancePath+"/connection/baseUrl",schemaPath:"#/$defs/PiConnection/properties/baseUrl/maxLength",keyword:"maxLength",params:{limit: 2048},message:"must NOT have more than 2048 characters"}];
return false;
}
}
else {
validate84.errors = [{instancePath:instancePath+"/connection/baseUrl",schemaPath:"#/$defs/PiConnection/properties/baseUrl/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid5 = _errs21 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data7.api !== undefined){
let data10 = data7.api;
const _errs23 = errors;
if(errors === _errs23){
if(typeof data10 === "string"){
if(func2(data10) > 256){
validate84.errors = [{instancePath:instancePath+"/connection/api",schemaPath:"#/$defs/PiConnection/properties/api/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
else {
if(!pattern182.test(data10)){
validate84.errors = [{instancePath:instancePath+"/connection/api",schemaPath:"#/$defs/PiConnection/properties/api/pattern",keyword:"pattern",params:{pattern: "^(openai-completions|openai-responses|anthropic-messages|google-generative-ai|mistral-conversations|azure-openai-responses|pi-messages|sdk:[a-zA-Z0-9@/_.-]+)$"},message:"must match pattern \""+"^(openai-completions|openai-responses|anthropic-messages|google-generative-ai|mistral-conversations|azure-openai-responses|pi-messages|sdk:[a-zA-Z0-9@/_.-]+)$"+"\""}];
return false;
}
}
}
else {
validate84.errors = [{instancePath:instancePath+"/connection/api",schemaPath:"#/$defs/PiConnection/properties/api/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid5 = _errs23 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data7.headerNames !== undefined){
let data11 = data7.headerNames;
const _errs25 = errors;
if(errors === _errs25){
if(Array.isArray(data11)){
if(data11.length > 16){
validate84.errors = [{instancePath:instancePath+"/connection/headerNames",schemaPath:"#/$defs/PiConnection/properties/headerNames/maxItems",keyword:"maxItems",params:{limit: 16},message:"must NOT have more than 16 items"}];
return false;
}
else {
var valid6 = true;
const len1 = data11.length;
for(let i2=0; i2<len1; i2++){
let data12 = data11[i2];
const _errs27 = errors;
if(errors === _errs27){
if(typeof data12 === "string"){
if(!pattern183.test(data12)){
validate84.errors = [{instancePath:instancePath+"/connection/headerNames/" + i2,schemaPath:"#/$defs/PiConnection/properties/headerNames/items/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z][A-Za-z0-9-]{0,63}$"},message:"must match pattern \""+"^[A-Za-z][A-Za-z0-9-]{0,63}$"+"\""}];
return false;
}
}
else {
validate84.errors = [{instancePath:instancePath+"/connection/headerNames/" + i2,schemaPath:"#/$defs/PiConnection/properties/headerNames/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid6 = _errs27 === errors;
if(!valid6){
break;
}
}
if(valid6){
let i3 = data11.length;
let j1;
if(i3 > 1){
const indices1 = {};
for(;i3--;){
let item1 = data11[i3];
if(typeof item1 !== "string"){
continue;
}
if(typeof indices1[item1] == "number"){
j1 = indices1[item1];
validate84.errors = [{instancePath:instancePath+"/connection/headerNames",schemaPath:"#/$defs/PiConnection/properties/headerNames/uniqueItems",keyword:"uniqueItems",params:{i: i3, j: j1},message:"must NOT have duplicate items (items ## "+j1+" and "+i3+" are identical)"}];
return false;
break;
}
indices1[item1] = i3;
}
}
}
}
}
else {
validate84.errors = [{instancePath:instancePath+"/connection/headerNames",schemaPath:"#/$defs/PiConnection/properties/headerNames/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid5 = _errs25 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data7.modelDefinitions !== undefined){
let data13 = data7.modelDefinitions;
const _errs29 = errors;
if(errors === _errs29){
if(Array.isArray(data13)){
if(data13.length > 64){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/maxItems",keyword:"maxItems",params:{limit: 64},message:"must NOT have more than 64 items"}];
return false;
}
else {
var valid8 = true;
const len2 = data13.length;
for(let i4=0; i4<len2; i4++){
let data14 = data13[i4];
const _errs31 = errors;
if(errors === _errs31){
if(data14 && typeof data14 == "object" && !Array.isArray(data14)){
let missing2;
if(((((data14.id === undefined) && (missing2 = "id")) || ((data14.contextWindow === undefined) && (missing2 = "contextWindow"))) || ((data14.maxTokens === undefined) && (missing2 = "maxTokens"))) || ((data14.cost === undefined) && (missing2 = "cost"))){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4,schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];
return false;
}
else {
const _errs33 = errors;
for(const key3 in data14){
if(!((((((((key3 === "id") || (key3 === "name")) || (key3 === "api")) || (key3 === "contextWindow")) || (key3 === "maxTokens")) || (key3 === "cost")) || (key3 === "thinking")) || (key3 === "compat"))){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4,schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs33 === errors){
if(data14.id !== undefined){
let data15 = data14.id;
const _errs34 = errors;
if(errors === _errs34){
if(typeof data15 === "string"){
if(func2(data15) > 256){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/id",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/id/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/id",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid9 = _errs34 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data14.name !== undefined){
let data16 = data14.name;
const _errs36 = errors;
if(errors === _errs36){
if(typeof data16 === "string"){
if(func2(data16) > 256){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/name",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/name/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
}
else {
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/name",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid9 = _errs36 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data14.api !== undefined){
let data17 = data14.api;
const _errs38 = errors;
if(errors === _errs38){
if(typeof data17 === "string"){
if(func2(data17) > 256){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/api",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/api/maxLength",keyword:"maxLength",params:{limit: 256},message:"must NOT have more than 256 characters"}];
return false;
}
else {
if(!pattern182.test(data17)){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/api",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/api/pattern",keyword:"pattern",params:{pattern: "^(openai-completions|openai-responses|anthropic-messages|google-generative-ai|mistral-conversations|azure-openai-responses|pi-messages|sdk:[a-zA-Z0-9@/_.-]+)$"},message:"must match pattern \""+"^(openai-completions|openai-responses|anthropic-messages|google-generative-ai|mistral-conversations|azure-openai-responses|pi-messages|sdk:[a-zA-Z0-9@/_.-]+)$"+"\""}];
return false;
}
}
}
else {
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/api",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/api/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid9 = _errs38 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data14.contextWindow !== undefined){
let data18 = data14.contextWindow;
const _errs40 = errors;
if(!(((typeof data18 == "number") && (!(data18 % 1) && !isNaN(data18))) && (isFinite(data18)))){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/contextWindow",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/contextWindow/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs40){
if((typeof data18 == "number") && (isFinite(data18))){
if(data18 > 131072 || isNaN(data18)){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/contextWindow",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/contextWindow/maximum",keyword:"maximum",params:{comparison: "<=", limit: 131072},message:"must be <= 131072"}];
return false;
}
else {
if(data18 < 4096 || isNaN(data18)){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/contextWindow",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/contextWindow/minimum",keyword:"minimum",params:{comparison: ">=", limit: 4096},message:"must be >= 4096"}];
return false;
}
}
}
}
var valid9 = _errs40 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data14.maxTokens !== undefined){
let data19 = data14.maxTokens;
const _errs42 = errors;
if(!(((typeof data19 == "number") && (!(data19 % 1) && !isNaN(data19))) && (isFinite(data19)))){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/maxTokens",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/maxTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs42){
if((typeof data19 == "number") && (isFinite(data19))){
if(data19 > 8192 || isNaN(data19)){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/maxTokens",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/maxTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 8192},message:"must be <= 8192"}];
return false;
}
else {
if(data19 < 128 || isNaN(data19)){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/maxTokens",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/maxTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 128},message:"must be >= 128"}];
return false;
}
}
}
}
var valid9 = _errs42 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data14.cost !== undefined){
let data20 = data14.cost;
const _errs44 = errors;
if(errors === _errs44){
if(data20 && typeof data20 == "object" && !Array.isArray(data20)){
let missing3;
if(((((data20.input === undefined) && (missing3 = "input")) || ((data20.output === undefined) && (missing3 = "output"))) || ((data20.cacheRead === undefined) && (missing3 = "cacheRead"))) || ((data20.cacheWrite === undefined) && (missing3 = "cacheWrite"))){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/cost",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/cost/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"}];
return false;
}
else {
const _errs46 = errors;
for(const key4 in data20){
if(!((((key4 === "input") || (key4 === "output")) || (key4 === "cacheRead")) || (key4 === "cacheWrite"))){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/cost",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/cost/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs46 === errors){
if(data20.input !== undefined){
let data21 = data20.input;
const _errs47 = errors;
if(errors === _errs47){
if((typeof data21 == "number") && (isFinite(data21))){
if(data21 < 0 || isNaN(data21)){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/cost/input",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/cost/properties/input/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
else {
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/cost/input",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/cost/properties/input/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
}
var valid10 = _errs47 === errors;
}
else {
var valid10 = true;
}
if(valid10){
if(data20.output !== undefined){
let data22 = data20.output;
const _errs49 = errors;
if(errors === _errs49){
if((typeof data22 == "number") && (isFinite(data22))){
if(data22 < 0 || isNaN(data22)){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/cost/output",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/cost/properties/output/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
else {
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/cost/output",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/cost/properties/output/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
}
var valid10 = _errs49 === errors;
}
else {
var valid10 = true;
}
if(valid10){
if(data20.cacheRead !== undefined){
let data23 = data20.cacheRead;
const _errs51 = errors;
if(errors === _errs51){
if((typeof data23 == "number") && (isFinite(data23))){
if(data23 < 0 || isNaN(data23)){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/cost/cacheRead",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/cost/properties/cacheRead/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
else {
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/cost/cacheRead",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/cost/properties/cacheRead/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
}
var valid10 = _errs51 === errors;
}
else {
var valid10 = true;
}
if(valid10){
if(data20.cacheWrite !== undefined){
let data24 = data20.cacheWrite;
const _errs53 = errors;
if(errors === _errs53){
if((typeof data24 == "number") && (isFinite(data24))){
if(data24 < 0 || isNaN(data24)){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/cost/cacheWrite",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/cost/properties/cacheWrite/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
else {
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/cost/cacheWrite",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/cost/properties/cacheWrite/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
}
var valid10 = _errs53 === errors;
}
else {
var valid10 = true;
}
}
}
}
}
}
}
else {
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/cost",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/cost/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid9 = _errs44 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data14.thinking !== undefined){
let data25 = data14.thinking;
const _errs55 = errors;
if(!(((data25 === "none") || (data25 === "optional")) || (data25 === "required"))){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/thinking",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/thinking/enum",keyword:"enum",params:{allowedValues: schema108.properties.modelDefinitions.items.properties.thinking.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid9 = _errs55 === errors;
}
else {
var valid9 = true;
}
if(valid9){
if(data14.compat !== undefined){
let data26 = data14.compat;
const _errs56 = errors;
if(errors === _errs56){
if(data26 && typeof data26 == "object" && !Array.isArray(data26)){
const _errs58 = errors;
for(const key5 in data26){
if(!(func7.call(schema108.properties.modelDefinitions.items.properties.compat.properties, key5))){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/compat",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/compat/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs58 === errors){
if(data26.supportsStore !== undefined){
const _errs59 = errors;
if(typeof data26.supportsStore !== "boolean"){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/compat/supportsStore",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/compat/properties/supportsStore/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid11 = _errs59 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data26.supportsDeveloperRole !== undefined){
const _errs61 = errors;
if(typeof data26.supportsDeveloperRole !== "boolean"){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/compat/supportsDeveloperRole",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/compat/properties/supportsDeveloperRole/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid11 = _errs61 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data26.supportsReasoningEffort !== undefined){
const _errs63 = errors;
if(typeof data26.supportsReasoningEffort !== "boolean"){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/compat/supportsReasoningEffort",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/compat/properties/supportsReasoningEffort/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid11 = _errs63 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data26.supportsUsageInStreaming !== undefined){
const _errs65 = errors;
if(typeof data26.supportsUsageInStreaming !== "boolean"){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/compat/supportsUsageInStreaming",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/compat/properties/supportsUsageInStreaming/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid11 = _errs65 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data26.maxTokensField !== undefined){
let data31 = data26.maxTokensField;
const _errs67 = errors;
if(!((data31 === "max_tokens") || (data31 === "max_completion_tokens"))){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/compat/maxTokensField",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/compat/properties/maxTokensField/enum",keyword:"enum",params:{allowedValues: schema108.properties.modelDefinitions.items.properties.compat.properties.maxTokensField.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid11 = _errs67 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data26.requiresToolResultName !== undefined){
const _errs68 = errors;
if(typeof data26.requiresToolResultName !== "boolean"){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/compat/requiresToolResultName",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/compat/properties/requiresToolResultName/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid11 = _errs68 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data26.requiresAssistantAfterToolResult !== undefined){
const _errs70 = errors;
if(typeof data26.requiresAssistantAfterToolResult !== "boolean"){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/compat/requiresAssistantAfterToolResult",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/compat/properties/requiresAssistantAfterToolResult/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid11 = _errs70 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data26.requiresThinkingAsText !== undefined){
const _errs72 = errors;
if(typeof data26.requiresThinkingAsText !== "boolean"){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/compat/requiresThinkingAsText",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/compat/properties/requiresThinkingAsText/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid11 = _errs72 === errors;
}
else {
var valid11 = true;
}
if(valid11){
if(data26.thinkingFormat !== undefined){
let data35 = data26.thinkingFormat;
const _errs74 = errors;
if(!((((data35 === "openai") || (data35 === "zai")) || (data35 === "qwen")) || (data35 === "deepseek"))){
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/compat/thinkingFormat",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/compat/properties/thinkingFormat/enum",keyword:"enum",params:{allowedValues: schema108.properties.modelDefinitions.items.properties.compat.properties.thinkingFormat.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid11 = _errs74 === errors;
}
else {
var valid11 = true;
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
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4+"/compat",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/properties/compat/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid9 = _errs56 === errors;
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
}
}
}
else {
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions/" + i4,schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/items/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid8 = _errs31 === errors;
if(!valid8){
break;
}
}
}
}
else {
validate84.errors = [{instancePath:instancePath+"/connection/modelDefinitions",schemaPath:"#/$defs/PiConnection/properties/modelDefinitions/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid5 = _errs29 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data7.compat !== undefined){
let data36 = data7.compat;
const _errs75 = errors;
if(errors === _errs75){
if(data36 && typeof data36 == "object" && !Array.isArray(data36)){
const _errs77 = errors;
for(const key6 in data36){
if(!(func7.call(schema108.properties.compat.properties, key6))){
validate84.errors = [{instancePath:instancePath+"/connection/compat",schemaPath:"#/$defs/PiConnection/properties/compat/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs77 === errors){
if(data36.supportsStore !== undefined){
const _errs78 = errors;
if(typeof data36.supportsStore !== "boolean"){
validate84.errors = [{instancePath:instancePath+"/connection/compat/supportsStore",schemaPath:"#/$defs/PiConnection/properties/compat/properties/supportsStore/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid12 = _errs78 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data36.supportsDeveloperRole !== undefined){
const _errs80 = errors;
if(typeof data36.supportsDeveloperRole !== "boolean"){
validate84.errors = [{instancePath:instancePath+"/connection/compat/supportsDeveloperRole",schemaPath:"#/$defs/PiConnection/properties/compat/properties/supportsDeveloperRole/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid12 = _errs80 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data36.supportsReasoningEffort !== undefined){
const _errs82 = errors;
if(typeof data36.supportsReasoningEffort !== "boolean"){
validate84.errors = [{instancePath:instancePath+"/connection/compat/supportsReasoningEffort",schemaPath:"#/$defs/PiConnection/properties/compat/properties/supportsReasoningEffort/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid12 = _errs82 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data36.supportsUsageInStreaming !== undefined){
const _errs84 = errors;
if(typeof data36.supportsUsageInStreaming !== "boolean"){
validate84.errors = [{instancePath:instancePath+"/connection/compat/supportsUsageInStreaming",schemaPath:"#/$defs/PiConnection/properties/compat/properties/supportsUsageInStreaming/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid12 = _errs84 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data36.maxTokensField !== undefined){
let data41 = data36.maxTokensField;
const _errs86 = errors;
if(!((data41 === "max_tokens") || (data41 === "max_completion_tokens"))){
validate84.errors = [{instancePath:instancePath+"/connection/compat/maxTokensField",schemaPath:"#/$defs/PiConnection/properties/compat/properties/maxTokensField/enum",keyword:"enum",params:{allowedValues: schema108.properties.compat.properties.maxTokensField.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid12 = _errs86 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data36.requiresToolResultName !== undefined){
const _errs87 = errors;
if(typeof data36.requiresToolResultName !== "boolean"){
validate84.errors = [{instancePath:instancePath+"/connection/compat/requiresToolResultName",schemaPath:"#/$defs/PiConnection/properties/compat/properties/requiresToolResultName/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid12 = _errs87 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data36.requiresAssistantAfterToolResult !== undefined){
const _errs89 = errors;
if(typeof data36.requiresAssistantAfterToolResult !== "boolean"){
validate84.errors = [{instancePath:instancePath+"/connection/compat/requiresAssistantAfterToolResult",schemaPath:"#/$defs/PiConnection/properties/compat/properties/requiresAssistantAfterToolResult/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid12 = _errs89 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data36.requiresThinkingAsText !== undefined){
const _errs91 = errors;
if(typeof data36.requiresThinkingAsText !== "boolean"){
validate84.errors = [{instancePath:instancePath+"/connection/compat/requiresThinkingAsText",schemaPath:"#/$defs/PiConnection/properties/compat/properties/requiresThinkingAsText/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid12 = _errs91 === errors;
}
else {
var valid12 = true;
}
if(valid12){
if(data36.thinkingFormat !== undefined){
let data45 = data36.thinkingFormat;
const _errs93 = errors;
if(!((((data45 === "openai") || (data45 === "zai")) || (data45 === "qwen")) || (data45 === "deepseek"))){
validate84.errors = [{instancePath:instancePath+"/connection/compat/thinkingFormat",schemaPath:"#/$defs/PiConnection/properties/compat/properties/thinkingFormat/enum",keyword:"enum",params:{allowedValues: schema108.properties.compat.properties.thinkingFormat.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid12 = _errs93 === errors;
}
else {
var valid12 = true;
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
validate84.errors = [{instancePath:instancePath+"/connection/compat",schemaPath:"#/$defs/PiConnection/properties/compat/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid5 = _errs75 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data7.authentication !== undefined){
let data46 = data7.authentication;
const _errs94 = errors;
if(!((data46 === "api_key") || (data46 === "none"))){
validate84.errors = [{instancePath:instancePath+"/connection/authentication",schemaPath:"#/$defs/PiConnection/properties/authentication/enum",keyword:"enum",params:{allowedValues: schema108.properties.authentication.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid5 = _errs94 === errors;
}
else {
var valid5 = true;
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
validate84.errors = [{instancePath:instancePath+"/connection",schemaPath:"#/$defs/PiConnection/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.inputRate !== undefined){
let data47 = data.inputRate;
const _errs95 = errors;
if(errors === _errs95){
if(typeof data47 === "string"){
if(!pattern91.test(data47)){
validate84.errors = [{instancePath:instancePath+"/inputRate",schemaPath:"#/properties/inputRate/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,8})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,8})$"+"\""}];
return false;
}
}
else {
validate84.errors = [{instancePath:instancePath+"/inputRate",schemaPath:"#/properties/inputRate/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs95 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.outputRate !== undefined){
let data48 = data.outputRate;
const _errs97 = errors;
if(errors === _errs97){
if(typeof data48 === "string"){
if(!pattern91.test(data48)){
validate84.errors = [{instancePath:instancePath+"/outputRate",schemaPath:"#/properties/outputRate/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,8})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,8})$"+"\""}];
return false;
}
}
else {
validate84.errors = [{instancePath:instancePath+"/outputRate",schemaPath:"#/properties/outputRate/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs97 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.totalTokens !== undefined){
let data49 = data.totalTokens;
const _errs99 = errors;
if(errors === _errs99){
if(typeof data49 === "string"){
if(!pattern190.test(data49)){
validate84.errors = [{instancePath:instancePath+"/totalTokens",schemaPath:"#/properties/totalTokens/pattern",keyword:"pattern",params:{pattern: "^[1-9][0-9]{0,11}$"},message:"must match pattern \""+"^[1-9][0-9]{0,11}$"+"\""}];
return false;
}
}
else {
validate84.errors = [{instancePath:instancePath+"/totalTokens",schemaPath:"#/properties/totalTokens/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs99 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.testCredits !== undefined){
let data50 = data.testCredits;
const _errs101 = errors;
if(errors === _errs101){
if(typeof data50 === "string"){
if(!pattern191.test(data50)){
validate84.errors = [{instancePath:instancePath+"/testCredits",schemaPath:"#/properties/testCredits/pattern",keyword:"pattern",params:{pattern: "^[1-9][0-9]{0,8}$"},message:"must match pattern \""+"^[1-9][0-9]{0,8}$"+"\""}];
return false;
}
}
else {
validate84.errors = [{instancePath:instancePath+"/testCredits",schemaPath:"#/properties/testCredits/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs101 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.maxOutputTokens !== undefined){
let data51 = data.maxOutputTokens;
const _errs103 = errors;
if(!(((typeof data51 == "number") && (!(data51 % 1) && !isNaN(data51))) && (isFinite(data51)))){
validate84.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs103){
if((typeof data51 == "number") && (isFinite(data51))){
if(data51 > 8192 || isNaN(data51)){
validate84.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 8192},message:"must be <= 8192"}];
return false;
}
else {
if(data51 < 128 || isNaN(data51)){
validate84.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 128},message:"must be >= 128"}];
return false;
}
}
}
}
var valid0 = _errs103 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.modelsConfirmed !== undefined){
const _errs105 = errors;
if(typeof data.modelsConfirmed !== "boolean"){
validate84.errors = [{instancePath:instancePath+"/modelsConfirmed",schemaPath:"#/properties/modelsConfirmed/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs105 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.supplyClass !== undefined){
let data53 = data.supplyClass;
const _errs107 = errors;
if(!((data53 === "authorized_api") || (data53 === "self_hosted"))){
validate84.errors = [{instancePath:instancePath+"/supplyClass",schemaPath:"#/properties/supplyClass/enum",keyword:"enum",params:{allowedValues: schema109.properties.supplyClass.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs107 === errors;
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
validate84.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate84.errors = vErrors;
return errors === 0;
}

export const ExecutionCompletion = validate85;
const schema111 = {"type":"object","additionalProperties":false,"properties":{"providerRunId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"relayGeneration":{"type":"integer","minimum":1,"maximum":9007199254740991},"sessionId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"requestId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"sequence":{"type":"integer","minimum":1,"maximum":9007199254740991}},"required":["providerRunId","relayGeneration","sessionId","requestId","sequence"]};

function validate85(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.providerRunId === undefined) && (missing0 = "providerRunId")) || ((data.relayGeneration === undefined) && (missing0 = "relayGeneration"))) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.sequence === undefined) && (missing0 = "sequence"))){
validate85.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "providerRunId") || (key0 === "relayGeneration")) || (key0 === "sessionId")) || (key0 === "requestId")) || (key0 === "sequence"))){
validate85.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate85.errors = [{instancePath:instancePath+"/providerRunId",schemaPath:"#/properties/providerRunId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate85.errors = [{instancePath:instancePath+"/providerRunId",schemaPath:"#/properties/providerRunId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.relayGeneration !== undefined){
let data1 = data.relayGeneration;
const _errs4 = errors;
if(!(((typeof data1 == "number") && (!(data1 % 1) && !isNaN(data1))) && (isFinite(data1)))){
validate85.errors = [{instancePath:instancePath+"/relayGeneration",schemaPath:"#/properties/relayGeneration/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs4){
if((typeof data1 == "number") && (isFinite(data1))){
if(data1 > 9007199254740991 || isNaN(data1)){
validate85.errors = [{instancePath:instancePath+"/relayGeneration",schemaPath:"#/properties/relayGeneration/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data1 < 1 || isNaN(data1)){
validate85.errors = [{instancePath:instancePath+"/relayGeneration",schemaPath:"#/properties/relayGeneration/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
if(data.sessionId !== undefined){
let data2 = data.sessionId;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data2 === "string"){
if(!pattern67.test(data2)){
validate85.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate85.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestId !== undefined){
let data3 = data.requestId;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data3 === "string"){
if(!pattern67.test(data3)){
validate85.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate85.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sequence !== undefined){
let data4 = data.sequence;
const _errs10 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
validate85.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs10){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 9007199254740991 || isNaN(data4)){
validate85.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data4 < 1 || isNaN(data4)){
validate85.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
else {
validate85.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate85.errors = vErrors;
return errors === 0;
}

export const ProviderRunTeardown = validate86;
const schema112 = {"type":"object","additionalProperties":false,"properties":{"providerRunId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"guestTeardownVerified":{"const":true}},"required":["providerRunId","guestTeardownVerified"]};

function validate86(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.providerRunId === undefined) && (missing0 = "providerRunId")) || ((data.guestTeardownVerified === undefined) && (missing0 = "guestTeardownVerified"))){
validate86.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "providerRunId") || (key0 === "guestTeardownVerified"))){
validate86.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate86.errors = [{instancePath:instancePath+"/providerRunId",schemaPath:"#/properties/providerRunId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate86.errors = [{instancePath:instancePath+"/providerRunId",schemaPath:"#/properties/providerRunId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate86.errors = [{instancePath:instancePath+"/guestTeardownVerified",schemaPath:"#/properties/guestTeardownVerified/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
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
validate86.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate86.errors = vErrors;
return errors === 0;
}

export const ModelSettings = validate87;

function validate87(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.reasoning === undefined) && (missing0 = "reasoning")){
validate87.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "reasoning")){
validate87.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.reasoning !== undefined){
let data0 = data.reasoning;
if(!(((((((data0 === "off") || (data0 === "minimal")) || (data0 === "low")) || (data0 === "medium")) || (data0 === "high")) || (data0 === "xhigh")) || (data0 === "max"))){
validate87.errors = [{instancePath:instancePath+"/reasoning",schemaPath:"#/properties/reasoning/enum",keyword:"enum",params:{allowedValues: schema63.properties.reasoning.enum},message:"must be equal to one of the allowed values"}];
return false;
}
}
}
}
}
else {
validate87.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate87.errors = vErrors;
return errors === 0;
}

export const ExecutionUsage = validate88;
const schema114 = {"type":"object","additionalProperties":false,"properties":{"providerRunId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"relayGeneration":{"type":"integer","minimum":1,"maximum":9007199254740991},"sessionId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"requestId":{"type":"string","pattern":"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},"sequence":{"type":"integer","minimum":1,"maximum":9007199254740991},"inputTokens":{"type":"integer","minimum":0,"maximum":262144},"outputTokens":{"type":"integer","minimum":0,"maximum":8192},"nativeUsage":{"type":"object"}},"required":["providerRunId","relayGeneration","sessionId","requestId","sequence","inputTokens","outputTokens"]};

function validate88(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((data.providerRunId === undefined) && (missing0 = "providerRunId")) || ((data.relayGeneration === undefined) && (missing0 = "relayGeneration"))) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.sequence === undefined) && (missing0 = "sequence"))) || ((data.inputTokens === undefined) && (missing0 = "inputTokens"))) || ((data.outputTokens === undefined) && (missing0 = "outputTokens"))){
validate88.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((((key0 === "providerRunId") || (key0 === "relayGeneration")) || (key0 === "sessionId")) || (key0 === "requestId")) || (key0 === "sequence")) || (key0 === "inputTokens")) || (key0 === "outputTokens")) || (key0 === "nativeUsage"))){
validate88.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate88.errors = [{instancePath:instancePath+"/providerRunId",schemaPath:"#/properties/providerRunId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate88.errors = [{instancePath:instancePath+"/providerRunId",schemaPath:"#/properties/providerRunId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.relayGeneration !== undefined){
let data1 = data.relayGeneration;
const _errs4 = errors;
if(!(((typeof data1 == "number") && (!(data1 % 1) && !isNaN(data1))) && (isFinite(data1)))){
validate88.errors = [{instancePath:instancePath+"/relayGeneration",schemaPath:"#/properties/relayGeneration/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs4){
if((typeof data1 == "number") && (isFinite(data1))){
if(data1 > 9007199254740991 || isNaN(data1)){
validate88.errors = [{instancePath:instancePath+"/relayGeneration",schemaPath:"#/properties/relayGeneration/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data1 < 1 || isNaN(data1)){
validate88.errors = [{instancePath:instancePath+"/relayGeneration",schemaPath:"#/properties/relayGeneration/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
if(data.sessionId !== undefined){
let data2 = data.sessionId;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data2 === "string"){
if(!pattern67.test(data2)){
validate88.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate88.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestId !== undefined){
let data3 = data.requestId;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data3 === "string"){
if(!pattern67.test(data3)){
validate88.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"},message:"must match pattern \""+"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"+"\""}];
return false;
}
}
else {
validate88.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sequence !== undefined){
let data4 = data.sequence;
const _errs10 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
validate88.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs10){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 9007199254740991 || isNaN(data4)){
validate88.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data4 < 1 || isNaN(data4)){
validate88.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
if(data.inputTokens !== undefined){
let data5 = data.inputTokens;
const _errs12 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
validate88.errors = [{instancePath:instancePath+"/inputTokens",schemaPath:"#/properties/inputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs12){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 262144 || isNaN(data5)){
validate88.errors = [{instancePath:instancePath+"/inputTokens",schemaPath:"#/properties/inputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 262144},message:"must be <= 262144"}];
return false;
}
else {
if(data5 < 0 || isNaN(data5)){
validate88.errors = [{instancePath:instancePath+"/inputTokens",schemaPath:"#/properties/inputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
if(data.outputTokens !== undefined){
let data6 = data.outputTokens;
const _errs14 = errors;
if(!(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6)))){
validate88.errors = [{instancePath:instancePath+"/outputTokens",schemaPath:"#/properties/outputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs14){
if((typeof data6 == "number") && (isFinite(data6))){
if(data6 > 8192 || isNaN(data6)){
validate88.errors = [{instancePath:instancePath+"/outputTokens",schemaPath:"#/properties/outputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 8192},message:"must be <= 8192"}];
return false;
}
else {
if(data6 < 0 || isNaN(data6)){
validate88.errors = [{instancePath:instancePath+"/outputTokens",schemaPath:"#/properties/outputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
if(data.nativeUsage !== undefined){
let data7 = data.nativeUsage;
const _errs16 = errors;
if(!(data7 && typeof data7 == "object" && !Array.isArray(data7))){
validate88.errors = [{instancePath:instancePath+"/nativeUsage",schemaPath:"#/properties/nativeUsage/type",keyword:"type",params:{type: "object"},message:"must be object"}];
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
}
}
else {
validate88.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate88.errors = vErrors;
return errors === 0;
}
