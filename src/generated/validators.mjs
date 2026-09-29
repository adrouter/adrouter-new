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

export const Message = validate17;
const schema19 = {"type":"object","additionalProperties":false,"properties":{"role":{"enum":["system","user","assistant","tool"]},"content":{"type":"string","maxLength":65536}},"required":["role","content"]};
const func2 = require("ajv/dist/runtime/ucs2length").default;

function validate17(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.role === undefined) && (missing0 = "role")) || ((data.content === undefined) && (missing0 = "content"))){
validate17.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "role") || (key0 === "content"))){
validate17.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.role !== undefined){
let data0 = data.role;
const _errs2 = errors;
if(!((((data0 === "system") || (data0 === "user")) || (data0 === "assistant")) || (data0 === "tool"))){
validate17.errors = [{instancePath:instancePath+"/role",schemaPath:"#/properties/role/enum",keyword:"enum",params:{allowedValues: schema19.properties.role.enum},message:"must be equal to one of the allowed values"}];
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
validate17.errors = [{instancePath:instancePath+"/content",schemaPath:"#/properties/content/maxLength",keyword:"maxLength",params:{limit: 65536},message:"must NOT have more than 65536 characters"}];
return false;
}
}
else {
validate17.errors = [{instancePath:instancePath+"/content",schemaPath:"#/properties/content/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate17.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate17.errors = vErrors;
return errors === 0;
}

export const InferenceRequest = validate18;
const schema20 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"inference"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"requestId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"sequence":{"type":"integer","minimum":1,"maximum":2147483647},"deadlineUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991},"messages":{"type":"array","minItems":1,"maxItems":128,"items":{"$ref":"#/$defs/Message"}},"maxOutputTokens":{"type":"integer","minimum":1,"maximum":8192}},"required":["type","sessionId","requestId","bindingRevision","sequence","deadlineUnixMs","messages","maxOutputTokens"]};

function validate18(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((((data.type === undefined) && (missing0 = "type")) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.bindingRevision === undefined) && (missing0 = "bindingRevision"))) || ((data.sequence === undefined) && (missing0 = "sequence"))) || ((data.deadlineUnixMs === undefined) && (missing0 = "deadlineUnixMs"))) || ((data.messages === undefined) && (missing0 = "messages"))) || ((data.maxOutputTokens === undefined) && (missing0 = "maxOutputTokens"))){
validate18.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((((key0 === "type") || (key0 === "sessionId")) || (key0 === "requestId")) || (key0 === "bindingRevision")) || (key0 === "sequence")) || (key0 === "deadlineUnixMs")) || (key0 === "messages")) || (key0 === "maxOutputTokens"))){
validate18.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("inference" !== data.type){
validate18.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "inference"},message:"must be equal to constant"}];
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
validate18.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate18.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate18.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate18.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate18.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate18.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate18.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 2147483647 || isNaN(data4)){
validate18.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data4 < 1 || isNaN(data4)){
validate18.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate18.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs11){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 9007199254740991 || isNaN(data5)){
validate18.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data5 < 1 || isNaN(data5)){
validate18.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate18.errors = [{instancePath:instancePath+"/messages",schemaPath:"#/properties/messages/maxItems",keyword:"maxItems",params:{limit: 128},message:"must NOT have more than 128 items"}];
return false;
}
else {
if(data6.length < 1){
validate18.errors = [{instancePath:instancePath+"/messages",schemaPath:"#/properties/messages/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid1 = true;
const len0 = data6.length;
for(let i0=0; i0<len0; i0++){
let data7 = data6[i0];
const _errs15 = errors;
const _errs16 = errors;
if(errors === _errs16){
if(data7 && typeof data7 == "object" && !Array.isArray(data7)){
let missing1;
if(((data7.role === undefined) && (missing1 = "role")) || ((data7.content === undefined) && (missing1 = "content"))){
validate18.errors = [{instancePath:instancePath+"/messages/" + i0,schemaPath:"#/$defs/Message/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];
return false;
}
else {
const _errs18 = errors;
for(const key1 in data7){
if(!((key1 === "role") || (key1 === "content"))){
validate18.errors = [{instancePath:instancePath+"/messages/" + i0,schemaPath:"#/$defs/Message/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs18 === errors){
if(data7.role !== undefined){
let data8 = data7.role;
const _errs19 = errors;
if(!((((data8 === "system") || (data8 === "user")) || (data8 === "assistant")) || (data8 === "tool"))){
validate18.errors = [{instancePath:instancePath+"/messages/" + i0+"/role",schemaPath:"#/$defs/Message/properties/role/enum",keyword:"enum",params:{allowedValues: schema19.properties.role.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid3 = _errs19 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data7.content !== undefined){
let data9 = data7.content;
const _errs20 = errors;
if(errors === _errs20){
if(typeof data9 === "string"){
if(func2(data9) > 65536){
validate18.errors = [{instancePath:instancePath+"/messages/" + i0+"/content",schemaPath:"#/$defs/Message/properties/content/maxLength",keyword:"maxLength",params:{limit: 65536},message:"must NOT have more than 65536 characters"}];
return false;
}
}
else {
validate18.errors = [{instancePath:instancePath+"/messages/" + i0+"/content",schemaPath:"#/$defs/Message/properties/content/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid3 = _errs20 === errors;
}
else {
var valid3 = true;
}
}
}
}
}
else {
validate18.errors = [{instancePath:instancePath+"/messages/" + i0,schemaPath:"#/$defs/Message/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
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
validate18.errors = [{instancePath:instancePath+"/messages",schemaPath:"#/properties/messages/type",keyword:"type",params:{type: "array"},message:"must be array"}];
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
let data10 = data.maxOutputTokens;
const _errs22 = errors;
if(!(((typeof data10 == "number") && (!(data10 % 1) && !isNaN(data10))) && (isFinite(data10)))){
validate18.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs22){
if((typeof data10 == "number") && (isFinite(data10))){
if(data10 > 8192 || isNaN(data10)){
validate18.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 8192},message:"must be <= 8192"}];
return false;
}
else {
if(data10 < 1 || isNaN(data10)){
validate18.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
}
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
validate18.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate18.errors = vErrors;
return errors === 0;
}

export const Cancel = validate19;
const schema22 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"cancel"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"requestId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"sequence":{"type":"integer","minimum":1,"maximum":2147483647}},"required":["type","sessionId","requestId","bindingRevision","sequence"]};

function validate19(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.type === undefined) && (missing0 = "type")) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.bindingRevision === undefined) && (missing0 = "bindingRevision"))) || ((data.sequence === undefined) && (missing0 = "sequence"))){
validate19.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "type") || (key0 === "sessionId")) || (key0 === "requestId")) || (key0 === "bindingRevision")) || (key0 === "sequence"))){
validate19.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("cancel" !== data.type){
validate19.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "cancel"},message:"must be equal to constant"}];
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
validate19.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate19.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate19.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate19.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate19.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate19.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate19.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 2147483647 || isNaN(data4)){
validate19.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data4 < 1 || isNaN(data4)){
validate19.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate19.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate19.errors = vErrors;
return errors === 0;
}

export const Activate = validate20;
const schema23 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"activate"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"sequence":{"type":"integer","minimum":1,"maximum":2147483647},"deadlineUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991}},"required":["type","sessionId","bindingRevision","sequence","deadlineUnixMs"]};

function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.type === undefined) && (missing0 = "type")) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.bindingRevision === undefined) && (missing0 = "bindingRevision"))) || ((data.sequence === undefined) && (missing0 = "sequence"))) || ((data.deadlineUnixMs === undefined) && (missing0 = "deadlineUnixMs"))){
validate20.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "type") || (key0 === "sessionId")) || (key0 === "bindingRevision")) || (key0 === "sequence")) || (key0 === "deadlineUnixMs"))){
validate20.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("activate" !== data.type){
validate20.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "activate"},message:"must be equal to constant"}];
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
validate20.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate20.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate20.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate20.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate20.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs7){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 2147483647 || isNaN(data3)){
validate20.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data3 < 1 || isNaN(data3)){
validate20.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate20.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 9007199254740991 || isNaN(data4)){
validate20.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data4 < 1 || isNaN(data4)){
validate20.errors = [{instancePath:instancePath+"/deadlineUnixMs",schemaPath:"#/properties/deadlineUnixMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate20.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate20.errors = vErrors;
return errors === 0;
}

export const Health = validate21;
const schema24 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"health"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"ready":{"type":"boolean"}},"required":["type","bindingRevision","ready"]};

function validate21(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.type === undefined) && (missing0 = "type")) || ((data.bindingRevision === undefined) && (missing0 = "bindingRevision"))) || ((data.ready === undefined) && (missing0 = "ready"))){
validate21.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "type") || (key0 === "bindingRevision")) || (key0 === "ready"))){
validate21.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("health" !== data.type){
validate21.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "health"},message:"must be equal to constant"}];
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
validate21.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate21.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate21.errors = [{instancePath:instancePath+"/ready",schemaPath:"#/properties/ready/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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
validate21.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate21.errors = vErrors;
return errors === 0;
}

export const Delta = validate22;
const schema25 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"delta"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"requestId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"sequence":{"type":"integer","minimum":1,"maximum":2147483647},"text":{"type":"string","maxLength":8192}},"required":["type","sessionId","requestId","bindingRevision","sequence","text"]};

function validate22(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.type === undefined) && (missing0 = "type")) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.bindingRevision === undefined) && (missing0 = "bindingRevision"))) || ((data.sequence === undefined) && (missing0 = "sequence"))) || ((data.text === undefined) && (missing0 = "text"))){
validate22.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "type") || (key0 === "sessionId")) || (key0 === "requestId")) || (key0 === "bindingRevision")) || (key0 === "sequence")) || (key0 === "text"))){
validate22.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("delta" !== data.type){
validate22.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "delta"},message:"must be equal to constant"}];
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
validate22.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate22.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate22.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate22.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate22.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate22.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate22.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 2147483647 || isNaN(data4)){
validate22.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data4 < 1 || isNaN(data4)){
validate22.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate22.errors = [{instancePath:instancePath+"/text",schemaPath:"#/properties/text/maxLength",keyword:"maxLength",params:{limit: 8192},message:"must NOT have more than 8192 characters"}];
return false;
}
}
else {
validate22.errors = [{instancePath:instancePath+"/text",schemaPath:"#/properties/text/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate22.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate22.errors = vErrors;
return errors === 0;
}

export const Usage = validate23;
const schema26 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"usage"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"requestId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"inputTokens":{"type":"integer","minimum":0,"maximum":1048576},"outputTokens":{"type":"integer","minimum":0,"maximum":8192},"meteringProfile":{"const":"observable_io_v1"}},"required":["type","sessionId","requestId","bindingRevision","inputTokens","outputTokens","meteringProfile"]};

function validate23(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((data.type === undefined) && (missing0 = "type")) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.bindingRevision === undefined) && (missing0 = "bindingRevision"))) || ((data.inputTokens === undefined) && (missing0 = "inputTokens"))) || ((data.outputTokens === undefined) && (missing0 = "outputTokens"))) || ((data.meteringProfile === undefined) && (missing0 = "meteringProfile"))){
validate23.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((((key0 === "type") || (key0 === "sessionId")) || (key0 === "requestId")) || (key0 === "bindingRevision")) || (key0 === "inputTokens")) || (key0 === "outputTokens")) || (key0 === "meteringProfile"))){
validate23.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
const _errs2 = errors;
if("usage" !== data.type){
validate23.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "usage"},message:"must be equal to constant"}];
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
if(data.requestId !== undefined){
let data2 = data.requestId;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data2 === "string"){
if(!pattern1.test(data2)){
validate23.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate23.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate23.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate23.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate23.errors = [{instancePath:instancePath+"/inputTokens",schemaPath:"#/properties/inputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 1048576 || isNaN(data4)){
validate23.errors = [{instancePath:instancePath+"/inputTokens",schemaPath:"#/properties/inputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1048576},message:"must be <= 1048576"}];
return false;
}
else {
if(data4 < 0 || isNaN(data4)){
validate23.errors = [{instancePath:instancePath+"/inputTokens",schemaPath:"#/properties/inputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate23.errors = [{instancePath:instancePath+"/outputTokens",schemaPath:"#/properties/outputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs11){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 8192 || isNaN(data5)){
validate23.errors = [{instancePath:instancePath+"/outputTokens",schemaPath:"#/properties/outputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 8192},message:"must be <= 8192"}];
return false;
}
else {
if(data5 < 0 || isNaN(data5)){
validate23.errors = [{instancePath:instancePath+"/outputTokens",schemaPath:"#/properties/outputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate23.errors = [{instancePath:instancePath+"/meteringProfile",schemaPath:"#/properties/meteringProfile/const",keyword:"const",params:{allowedValue: "observable_io_v1"},message:"must be equal to constant"}];
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
validate23.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate23.errors = vErrors;
return errors === 0;
}

export const ListingRevision = validate24;
const schema27 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"listingId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"binding":{"$ref":"#/$defs/ApprovedBinding"},"availability":{"enum":["hot","cold"]},"inputRate":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"outputRate":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"rateDenominator":{"type":"string","pattern":"^[1-9][0-9]{0,18}$"},"capacity":{"type":"integer","minimum":1,"maximum":1048576},"concurrency":{"type":"integer","minimum":1,"maximum":128}},"required":["id","listingId","binding","availability","inputRate","outputRate","rateDenominator","capacity","concurrency"]};
const func5 = Object.prototype.hasOwnProperty;
const pattern24 = new RegExp("^[1-9][0-9]{0,18}$", "u");

function validate24(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((((data.id === undefined) && (missing0 = "id")) || ((data.listingId === undefined) && (missing0 = "listingId"))) || ((data.binding === undefined) && (missing0 = "binding"))) || ((data.availability === undefined) && (missing0 = "availability"))) || ((data.inputRate === undefined) && (missing0 = "inputRate"))) || ((data.outputRate === undefined) && (missing0 = "outputRate"))) || ((data.rateDenominator === undefined) && (missing0 = "rateDenominator"))) || ((data.capacity === undefined) && (missing0 = "capacity"))) || ((data.concurrency === undefined) && (missing0 = "concurrency"))){
validate24.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func5.call(schema27.properties, key0))){
validate24.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate24.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate24.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate24.errors = [{instancePath:instancePath+"/listingId",schemaPath:"#/properties/listingId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate24.errors = [{instancePath:instancePath+"/listingId",schemaPath:"#/properties/listingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate24.errors = [{instancePath:instancePath+"/availability",schemaPath:"#/properties/availability/enum",keyword:"enum",params:{allowedValues: schema27.properties.availability.enum},message:"must be equal to one of the allowed values"}];
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
validate24.errors = [{instancePath:instancePath+"/inputRate",schemaPath:"#/properties/inputRate/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate24.errors = [{instancePath:instancePath+"/inputRate",schemaPath:"#/properties/inputRate/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate24.errors = [{instancePath:instancePath+"/outputRate",schemaPath:"#/properties/outputRate/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate24.errors = [{instancePath:instancePath+"/outputRate",schemaPath:"#/properties/outputRate/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
if(!pattern24.test(data6)){
validate24.errors = [{instancePath:instancePath+"/rateDenominator",schemaPath:"#/properties/rateDenominator/pattern",keyword:"pattern",params:{pattern: "^[1-9][0-9]{0,18}$"},message:"must match pattern \""+"^[1-9][0-9]{0,18}$"+"\""}];
return false;
}
}
else {
validate24.errors = [{instancePath:instancePath+"/rateDenominator",schemaPath:"#/properties/rateDenominator/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate24.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs14){
if((typeof data7 == "number") && (isFinite(data7))){
if(data7 > 1048576 || isNaN(data7)){
validate24.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1048576},message:"must be <= 1048576"}];
return false;
}
else {
if(data7 < 1 || isNaN(data7)){
validate24.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate24.errors = [{instancePath:instancePath+"/concurrency",schemaPath:"#/properties/concurrency/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs16){
if((typeof data8 == "number") && (isFinite(data8))){
if(data8 > 128 || isNaN(data8)){
validate24.errors = [{instancePath:instancePath+"/concurrency",schemaPath:"#/properties/concurrency/maximum",keyword:"maximum",params:{comparison: "<=", limit: 128},message:"must be <= 128"}];
return false;
}
else {
if(data8 < 1 || isNaN(data8)){
validate24.errors = [{instancePath:instancePath+"/concurrency",schemaPath:"#/properties/concurrency/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate24.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate24.errors = vErrors;
return errors === 0;
}

export const Quote = validate26;
const schema28 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"listingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"buyerId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"expiresUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991},"maximumCharge":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"outputQuota":{"type":"integer","minimum":1,"maximum":1048576},"concurrency":{"type":"integer","minimum":1,"maximum":128},"providerBond":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"}},"required":["id","listingRevision","buyerId","expiresUnixMs","maximumCharge","outputQuota","concurrency","providerBond"]};

function validate26(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((((data.id === undefined) && (missing0 = "id")) || ((data.listingRevision === undefined) && (missing0 = "listingRevision"))) || ((data.buyerId === undefined) && (missing0 = "buyerId"))) || ((data.expiresUnixMs === undefined) && (missing0 = "expiresUnixMs"))) || ((data.maximumCharge === undefined) && (missing0 = "maximumCharge"))) || ((data.outputQuota === undefined) && (missing0 = "outputQuota"))) || ((data.concurrency === undefined) && (missing0 = "concurrency"))) || ((data.providerBond === undefined) && (missing0 = "providerBond"))){
validate26.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((((key0 === "id") || (key0 === "listingRevision")) || (key0 === "buyerId")) || (key0 === "expiresUnixMs")) || (key0 === "maximumCharge")) || (key0 === "outputQuota")) || (key0 === "concurrency")) || (key0 === "providerBond"))){
validate26.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate26.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate26.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate26.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate26.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate26.errors = [{instancePath:instancePath+"/buyerId",schemaPath:"#/properties/buyerId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate26.errors = [{instancePath:instancePath+"/buyerId",schemaPath:"#/properties/buyerId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate26.errors = [{instancePath:instancePath+"/expiresUnixMs",schemaPath:"#/properties/expiresUnixMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate26.errors = [{instancePath:instancePath+"/expiresUnixMs",schemaPath:"#/properties/expiresUnixMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 1 || isNaN(data3)){
validate26.errors = [{instancePath:instancePath+"/expiresUnixMs",schemaPath:"#/properties/expiresUnixMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate26.errors = [{instancePath:instancePath+"/maximumCharge",schemaPath:"#/properties/maximumCharge/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate26.errors = [{instancePath:instancePath+"/maximumCharge",schemaPath:"#/properties/maximumCharge/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate26.errors = [{instancePath:instancePath+"/outputQuota",schemaPath:"#/properties/outputQuota/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs12){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 1048576 || isNaN(data5)){
validate26.errors = [{instancePath:instancePath+"/outputQuota",schemaPath:"#/properties/outputQuota/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1048576},message:"must be <= 1048576"}];
return false;
}
else {
if(data5 < 1 || isNaN(data5)){
validate26.errors = [{instancePath:instancePath+"/outputQuota",schemaPath:"#/properties/outputQuota/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate26.errors = [{instancePath:instancePath+"/concurrency",schemaPath:"#/properties/concurrency/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs14){
if((typeof data6 == "number") && (isFinite(data6))){
if(data6 > 128 || isNaN(data6)){
validate26.errors = [{instancePath:instancePath+"/concurrency",schemaPath:"#/properties/concurrency/maximum",keyword:"maximum",params:{comparison: "<=", limit: 128},message:"must be <= 128"}];
return false;
}
else {
if(data6 < 1 || isNaN(data6)){
validate26.errors = [{instancePath:instancePath+"/concurrency",schemaPath:"#/properties/concurrency/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate26.errors = [{instancePath:instancePath+"/providerBond",schemaPath:"#/properties/providerBond/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate26.errors = [{instancePath:instancePath+"/providerBond",schemaPath:"#/properties/providerBond/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate26.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate26.errors = vErrors;
return errors === 0;
}

export const Session = validate27;
const schema29 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"quoteId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"listingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"state":{"enum":["reserved","funding","funded","activating","verifying","ready","active","stopping","settlement_pending","settled","refunded","disputed"]},"funded":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"reserved":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"charged":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"}},"required":["id","quoteId","listingRevision","state","funded","reserved","charged"]};

function validate27(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((data.id === undefined) && (missing0 = "id")) || ((data.quoteId === undefined) && (missing0 = "quoteId"))) || ((data.listingRevision === undefined) && (missing0 = "listingRevision"))) || ((data.state === undefined) && (missing0 = "state"))) || ((data.funded === undefined) && (missing0 = "funded"))) || ((data.reserved === undefined) && (missing0 = "reserved"))) || ((data.charged === undefined) && (missing0 = "charged"))){
validate27.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((((key0 === "id") || (key0 === "quoteId")) || (key0 === "listingRevision")) || (key0 === "state")) || (key0 === "funded")) || (key0 === "reserved")) || (key0 === "charged"))){
validate27.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate27.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate27.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate27.errors = [{instancePath:instancePath+"/quoteId",schemaPath:"#/properties/quoteId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate27.errors = [{instancePath:instancePath+"/quoteId",schemaPath:"#/properties/quoteId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate27.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate27.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate27.errors = [{instancePath:instancePath+"/state",schemaPath:"#/properties/state/enum",keyword:"enum",params:{allowedValues: schema29.properties.state.enum},message:"must be equal to one of the allowed values"}];
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
validate27.errors = [{instancePath:instancePath+"/funded",schemaPath:"#/properties/funded/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate27.errors = [{instancePath:instancePath+"/funded",schemaPath:"#/properties/funded/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate27.errors = [{instancePath:instancePath+"/reserved",schemaPath:"#/properties/reserved/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate27.errors = [{instancePath:instancePath+"/reserved",schemaPath:"#/properties/reserved/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate27.errors = [{instancePath:instancePath+"/charged",schemaPath:"#/properties/charged/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate27.errors = [{instancePath:instancePath+"/charged",schemaPath:"#/properties/charged/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate27.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate27.errors = vErrors;
return errors === 0;
}

export const UsageReceipt = validate28;
const schema30 = {"type":"object","additionalProperties":false,"properties":{"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"requestId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"bindingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"listingRevision":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"providerNodeId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"sequence":{"type":"integer","minimum":1,"maximum":2147483647},"timestampUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991},"inputTokens":{"type":"integer","minimum":0,"maximum":1048576},"outputTokens":{"type":"integer","minimum":0,"maximum":8192},"cumulativeCharge":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"cumulativeFee":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"meteringProfile":{"const":"observable_io_v1"},"signerId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"signature":{"type":"string","pattern":"^[A-Za-z0-9_-]{86}$"}},"required":["sessionId","requestId","bindingRevision","listingRevision","providerNodeId","sequence","timestampUnixMs","inputTokens","outputTokens","cumulativeCharge","cumulativeFee","meteringProfile","signerId","signature"]};
const pattern44 = new RegExp("^[A-Za-z0-9_-]{86}$", "u");

function validate28(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((((((((((data.sessionId === undefined) && (missing0 = "sessionId")) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.bindingRevision === undefined) && (missing0 = "bindingRevision"))) || ((data.listingRevision === undefined) && (missing0 = "listingRevision"))) || ((data.providerNodeId === undefined) && (missing0 = "providerNodeId"))) || ((data.sequence === undefined) && (missing0 = "sequence"))) || ((data.timestampUnixMs === undefined) && (missing0 = "timestampUnixMs"))) || ((data.inputTokens === undefined) && (missing0 = "inputTokens"))) || ((data.outputTokens === undefined) && (missing0 = "outputTokens"))) || ((data.cumulativeCharge === undefined) && (missing0 = "cumulativeCharge"))) || ((data.cumulativeFee === undefined) && (missing0 = "cumulativeFee"))) || ((data.meteringProfile === undefined) && (missing0 = "meteringProfile"))) || ((data.signerId === undefined) && (missing0 = "signerId"))) || ((data.signature === undefined) && (missing0 = "signature"))){
validate28.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func5.call(schema30.properties, key0))){
validate28.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate28.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate28.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate28.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate28.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate28.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate28.errors = [{instancePath:instancePath+"/bindingRevision",schemaPath:"#/properties/bindingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate28.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate28.errors = [{instancePath:instancePath+"/listingRevision",schemaPath:"#/properties/listingRevision/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate28.errors = [{instancePath:instancePath+"/providerNodeId",schemaPath:"#/properties/providerNodeId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate28.errors = [{instancePath:instancePath+"/providerNodeId",schemaPath:"#/properties/providerNodeId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate28.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs12){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 2147483647 || isNaN(data5)){
validate28.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2147483647},message:"must be <= 2147483647"}];
return false;
}
else {
if(data5 < 1 || isNaN(data5)){
validate28.errors = [{instancePath:instancePath+"/sequence",schemaPath:"#/properties/sequence/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate28.errors = [{instancePath:instancePath+"/timestampUnixMs",schemaPath:"#/properties/timestampUnixMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs14){
if((typeof data6 == "number") && (isFinite(data6))){
if(data6 > 9007199254740991 || isNaN(data6)){
validate28.errors = [{instancePath:instancePath+"/timestampUnixMs",schemaPath:"#/properties/timestampUnixMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data6 < 1 || isNaN(data6)){
validate28.errors = [{instancePath:instancePath+"/timestampUnixMs",schemaPath:"#/properties/timestampUnixMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate28.errors = [{instancePath:instancePath+"/inputTokens",schemaPath:"#/properties/inputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs16){
if((typeof data7 == "number") && (isFinite(data7))){
if(data7 > 1048576 || isNaN(data7)){
validate28.errors = [{instancePath:instancePath+"/inputTokens",schemaPath:"#/properties/inputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1048576},message:"must be <= 1048576"}];
return false;
}
else {
if(data7 < 0 || isNaN(data7)){
validate28.errors = [{instancePath:instancePath+"/inputTokens",schemaPath:"#/properties/inputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate28.errors = [{instancePath:instancePath+"/outputTokens",schemaPath:"#/properties/outputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs18){
if((typeof data8 == "number") && (isFinite(data8))){
if(data8 > 8192 || isNaN(data8)){
validate28.errors = [{instancePath:instancePath+"/outputTokens",schemaPath:"#/properties/outputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 8192},message:"must be <= 8192"}];
return false;
}
else {
if(data8 < 0 || isNaN(data8)){
validate28.errors = [{instancePath:instancePath+"/outputTokens",schemaPath:"#/properties/outputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate28.errors = [{instancePath:instancePath+"/cumulativeCharge",schemaPath:"#/properties/cumulativeCharge/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate28.errors = [{instancePath:instancePath+"/cumulativeCharge",schemaPath:"#/properties/cumulativeCharge/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate28.errors = [{instancePath:instancePath+"/cumulativeFee",schemaPath:"#/properties/cumulativeFee/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate28.errors = [{instancePath:instancePath+"/cumulativeFee",schemaPath:"#/properties/cumulativeFee/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate28.errors = [{instancePath:instancePath+"/meteringProfile",schemaPath:"#/properties/meteringProfile/const",keyword:"const",params:{allowedValue: "observable_io_v1"},message:"must be equal to constant"}];
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
validate28.errors = [{instancePath:instancePath+"/signerId",schemaPath:"#/properties/signerId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate28.errors = [{instancePath:instancePath+"/signerId",schemaPath:"#/properties/signerId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
if(!pattern44.test(data13)){
validate28.errors = [{instancePath:instancePath+"/signature",schemaPath:"#/properties/signature/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z0-9_-]{86}$"},message:"must match pattern \""+"^[A-Za-z0-9_-]{86}$"+"\""}];
return false;
}
}
else {
validate28.errors = [{instancePath:instancePath+"/signature",schemaPath:"#/properties/signature/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate28.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate28.errors = vErrors;
return errors === 0;
}

export const AgentPermission = validate29;
const schema31 = {"type":"object","additionalProperties":false,"properties":{"id":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"sessionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{1,96}$"},"expiresUnixMs":{"type":"integer","minimum":1,"maximum":9007199254740991},"maximumCharge":{"type":"string","pattern":"^(0|[1-9][0-9]{0,18})$"},"maxOutputTokens":{"type":"integer","minimum":1,"maximum":8192},"concurrency":{"type":"integer","minimum":1,"maximum":128},"scopes":{"type":"array","minItems":1,"maxItems":2,"uniqueItems":true,"items":{"enum":["marketplace:infer","marketplace:stop"]}}},"required":["id","sessionId","expiresUnixMs","maximumCharge","maxOutputTokens","concurrency","scopes"]};
const func0 = require("ajv/dist/runtime/equal").default;

function validate29(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((data.id === undefined) && (missing0 = "id")) || ((data.sessionId === undefined) && (missing0 = "sessionId"))) || ((data.expiresUnixMs === undefined) && (missing0 = "expiresUnixMs"))) || ((data.maximumCharge === undefined) && (missing0 = "maximumCharge"))) || ((data.maxOutputTokens === undefined) && (missing0 = "maxOutputTokens"))) || ((data.concurrency === undefined) && (missing0 = "concurrency"))) || ((data.scopes === undefined) && (missing0 = "scopes"))){
validate29.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((((key0 === "id") || (key0 === "sessionId")) || (key0 === "expiresUnixMs")) || (key0 === "maximumCharge")) || (key0 === "maxOutputTokens")) || (key0 === "concurrency")) || (key0 === "scopes"))){
validate29.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate29.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate29.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate29.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{1,96}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{1,96}$"+"\""}];
return false;
}
}
else {
validate29.errors = [{instancePath:instancePath+"/sessionId",schemaPath:"#/properties/sessionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate29.errors = [{instancePath:instancePath+"/expiresUnixMs",schemaPath:"#/properties/expiresUnixMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate29.errors = [{instancePath:instancePath+"/expiresUnixMs",schemaPath:"#/properties/expiresUnixMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 1 || isNaN(data2)){
validate29.errors = [{instancePath:instancePath+"/expiresUnixMs",schemaPath:"#/properties/expiresUnixMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate29.errors = [{instancePath:instancePath+"/maximumCharge",schemaPath:"#/properties/maximumCharge/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]{0,18})$"},message:"must match pattern \""+"^(0|[1-9][0-9]{0,18})$"+"\""}];
return false;
}
}
else {
validate29.errors = [{instancePath:instancePath+"/maximumCharge",schemaPath:"#/properties/maximumCharge/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate29.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs10){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 8192 || isNaN(data4)){
validate29.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/maximum",keyword:"maximum",params:{comparison: "<=", limit: 8192},message:"must be <= 8192"}];
return false;
}
else {
if(data4 < 1 || isNaN(data4)){
validate29.errors = [{instancePath:instancePath+"/maxOutputTokens",schemaPath:"#/properties/maxOutputTokens/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate29.errors = [{instancePath:instancePath+"/concurrency",schemaPath:"#/properties/concurrency/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs12){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 128 || isNaN(data5)){
validate29.errors = [{instancePath:instancePath+"/concurrency",schemaPath:"#/properties/concurrency/maximum",keyword:"maximum",params:{comparison: "<=", limit: 128},message:"must be <= 128"}];
return false;
}
else {
if(data5 < 1 || isNaN(data5)){
validate29.errors = [{instancePath:instancePath+"/concurrency",schemaPath:"#/properties/concurrency/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];
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
validate29.errors = [{instancePath:instancePath+"/scopes",schemaPath:"#/properties/scopes/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"}];
return false;
}
else {
if(data6.length < 1){
validate29.errors = [{instancePath:instancePath+"/scopes",schemaPath:"#/properties/scopes/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];
return false;
}
else {
var valid1 = true;
const len0 = data6.length;
for(let i0=0; i0<len0; i0++){
let data7 = data6[i0];
const _errs16 = errors;
if(!((data7 === "marketplace:infer") || (data7 === "marketplace:stop"))){
validate29.errors = [{instancePath:instancePath+"/scopes/" + i0,schemaPath:"#/properties/scopes/items/enum",keyword:"enum",params:{allowedValues: schema31.properties.scopes.items.enum},message:"must be equal to one of the allowed values"}];
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
validate29.errors = [{instancePath:instancePath+"/scopes",schemaPath:"#/properties/scopes/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"}];
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
validate29.errors = [{instancePath:instancePath+"/scopes",schemaPath:"#/properties/scopes/type",keyword:"type",params:{type: "array"},message:"must be array"}];
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
validate29.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate29.errors = vErrors;
return errors === 0;
}

