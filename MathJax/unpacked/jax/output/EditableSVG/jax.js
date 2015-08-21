/* -*- Mode: Javascript; indent-tabs-mode:nil; js-indent-level: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */
/*************************************************************
 *
 *  MathJax/jax/output/EditableSVG/jax.js
 *
 *  Implements an editable SVG OutputJax that displays mathematics using
 *  SVG (or VML in IE) to position the characters from math fonts
 *  in their proper locations.
 *
 *  ---------------------------------------------------------------------
 *
 *  Copyright (c) 2011-2015 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
(function(AJAX, HUB, HTML, SVG) {
  var MML;

  var SVGNS = "http://www.w3.org/2000/svg";
  var XLINKNS = "http://www.w3.org/1999/xlink";
  var globalCursor;

  var UP = 1;
  var RIGHT = 2;
  var DOWN = 3;
  var LEFT = 4;

  SVG.Augment({

    mathLatexToUnicode: {
      "\\ddot{O}": "#x000D6",
      "\\breve{u}": "#x0016D",
      "\\check{t}": "#x00165",
      "\\acute{e}": "#x000E9",
      "\\check{Z}": "#x0017D",
      "\\ddot{a}": "#x000E4",
      "\\hat{u}": "#x000FB",
      "\\k{U}": "#x00172",
      "\\check{R}": "#x00158",
      "\\ddot{y}": "#x000FF",
      "\\check{E}": "#x0011A",
      "\\dot{g}": "#x00121",
      "\\hat{C}": "#x00108",
      "\\acute{C}": "#x00106",
      "\\acute{\\imath}": "#x000ED",
      "\\mathring{}": "#x002DA",
      "\\grave{u}": "#x000F9",
      "\\bar{E}": "#x00112",
      "\\mbox{\\k{}}": "#x002DB",
      "\\imath": "#x00131",
      "\\check{l}": "#x0013E",
      "\\$": "#x00024",
      "\\dot{e}": "#x00117",
      "\\mathrm{'I}": "#x0038A",
      "\\check{d}": "#x0010F",
      "\\mbox{\\c{c}}": "#x000E7",
      "\\dag": "#x02020",
      "\\hat{e}": "#x000EA",
      "\\tilde{u}": "#x00169",
      "\\bar": "#x00304",
      "\\breve{U}": "#x0016C",
      "\\Elzpes": "#x020A7",
      "\\mbox{\\c{T}}": "#x00162",
      "\\tilde{\\imath}": "#x00129",
      "\\acute{S}": "#x0015A",
      "\\dot{C}": "#x0010A",
      "\\dot{Z}": "#x0017B",
      "\\mbox{\\c{r}}": "#x00157",
      "\\check{S}": "#x00160",
      "\\mbox{\\H{}}": "#x002DD",
      "\\grave{e}": "#x000E8",
      "\\bar{U}": "#x0016A",
      "\\mathring{U}": "#x0016E",
      "\\tilde": "#x00303",
      "\\u": "#x002D8",
      "\\ddot{o}": "#x000F6",
      "\\mbox{\\textcurrency}": "#x000A4",
      "\\mbox{\\c{L}}": "#x0013B",
      "\\bar{o}": "#x0014D",
      "\\tilde{n}": "#x000F1",
      "\\check{r}": "#x00159",
      "\\check{e}": "#x0011B",
      "\\hat{J}": "#x00134",
      "\\check{z}": "#x0017E",
      "\\acute{r}": "#x00155",
      "\\ddot{I}": "#x000CF",
      "\\hat{U}": "#x000DB",
      "\\dot{I}": "#x00130",
      "\\hat{h}": "#x00125",
      "\\mbox{\\c{N}}": "#x00145",
      "\\hat{s}": "#x0015D",
      "\\breve{g}": "#x0011F",
      "\\check{n}": "#x00148",
      "\\hat{A}": "#x000C2",
      "\\circledR": "#x000AE",
      "\\acute{l}": "#x0013A",
      "\\dot": "#x00307",
      "\\check{T}": "#x00164",
      "\\acute{E}": "#x00388",
      "\\mbox{\\c{n}}": "#x00146",
      "\\ddot{A}": "#x000C4",
      "\\mbox{\\H{U}}": "#x00170",
      "\\hat{I}": "#x000CE",
      "\\ddot{Y}": "#x00178",
      "\\S": "#x000A7",
      "\\bar{O}": "#x0014C",
      "\\grave{\\imath}": "#x000EC",
      "\\hat{c}": "#x00109",
      "\\bar{e}": "#x00113",
      "\\mathrm{'O}": "#x0038C",
      "\\mbox{\\c{s}}": "#x0015F",
      "\\grave{U}": "#x000D9",
      "\\backslash": "#x0005C",
      "\\pounds": "#x000A3",
      "\\bullet": "#x02022",
      "\\dot{E}": "#x00116",
      "\\ddag": "#x02021",
      "\\check{D}": "#x0010E",
      "\\acute{U}": "#x000DA",
      "\\check{L}": "#x0013D",
      "\\P": "#x000B6",
      "\\mbox{\\c{k}}": "#x00137",
      "\\hat{H}": "#x00124",
      "\\breve{I}": "#x0012C",
      "\\hat{S}": "#x0015C",
      "\\breve{A}": "#x00102",
      "\\acute{Z}": "#x00179",
      "\\breve": "#x00306",
      "\\grave{E}": "#x000C8",
      "\\bar{u}": "#x0016B",
      "\\times": "#x000D7",
      "\\acute{a}": "#x000E1",
      "\\mathring{u}": "#x0016F",
      "\\ddot{e}": "#x000EB",
      "\\tilde{O}": "#x000D5",
      "\\mbox{\\c{R}}": "#x00156",
      "\\tilde{I}": "#x00128",
      "\\acute{O}": "#x000D3",
      "\\hat": "#x00302",
      "\\vartheta": "#x003D1",
      "\\mbox{\\c{C}}": "#x000C7",
      "\\breve{\\imath}": "#x0012D",
      "\\tilde{a}": "#x000E3",
      "\\dot{}": "#x002D9",
      "\\grave{I}": "#x000CC",
      "\\hat{y}": "#x00177",
      "\\hat{G}": "#x0011C",
      "\\breve{e}": "#x00115",
      "\\acute": "#x00301",
      "\\bar{A}": "#x00100",
      "\\acute{n}": "#x00144",
      "\\acute{y}": "#x000FD",
      "\\mbox{\\guillemotright}": "#x000BB",
      "\\hat{\\jmath}": "#x00135",
      "\\mbox{\\c{G}}": "#x00122",
      "\\check{N}": "#x00147",
      "\\ddot{u}": "#x000FC",
      "\\hat{a}": "#x000E2",
      "\\hat{O}": "#x000D4",
      "\\bar{I}": "#x0012A",
      "\\acute{L}": "#x00139",
      "\\dot{G}": "#x00120",
      "\\breve{O}": "#x0014E",
      "\\acute{u}": "#x000FA",
      "\\grave{H}": "#x00389",
      "\\mbox{\\H{O}}": "#x00150",
      "\\mbox{\\c{g}}": "#x00123",
      "\\grave{a}": "#x000E0",
      "\\breve{E}": "#x00114",
      "\\hat{\\imath}": "#x000EE",
      "\\copyright": "#x000A9",
      "\\acute{o}": "#x003CC",
      "\\mbox{\\c{t}}": "#x00163",
      "\\mbox{\\H{o}}": "#x00151",
      "\\acute{g}": "#x001F5",
      "\\breve{G}": "#x0011E",
      "\\tilde{A}": "#x000C3",
      "\\k{E}": "#x00118",
      "\\hat{Y}": "#x00176",
      "\\acute{c}": "#x00107",
      "\\check{C}": "#x0010C",
      "\\mbox{\\c{l}}": "#x0013C",
      "\\mbox{\\textdegree}": "#x000B0",
      "---": "#x02014",
      "\\hat{w}": "#x00175",
      "\\bar{\\imath}": "#x0012B",
      "\\acute{\\alpha}": "#x003AC",
      "\\hat{E}": "#x000CA",
      "\\acute{I}": "#x000CD",
      "\\tilde{U}": "#x00168",
      "\\grave{O}": "#x000D2",
      "\\acute{A}": "#x00386",
      "\\ddot{E}": "#x000CB",
      "\\hat{W}": "#x00174",
      "\\tilde{o}": "#x000F5",
      "\\acute{s}": "#x0015B",
      "\\dot{c}": "#x0010B",
      "\\dot{z}": "#x0017C",
      "\\check{s}": "#x00161",
      "\\mbox{\\c{K}}": "#x00136",
      "\\hat{g}": "#x0011D",
      "\\check": "#x0030C",
      "\\u{a}": "#x00103",
      "\\ddot{\\imath}": "#x000EF",
      "\\bar{a}": "#x00101",
      "\\acute{N}": "#x00143",
      "\\tilde{N}": "#x000D1",
      "\\acute{Y}": "#x000DD",
      "\\mbox{\\H{u}}": "#x00171",
      "\\ddot{U}": "#x000DC",
      "\\hat{o}": "#x000F4",
      "\\acute{R}": "#x00154",
      "\\mbox{\\guillemotleft}": "#x000AB",
      "\\theta": "#x003B8",
      "\\grave": "#x00300",
      "\\check{c}": "#x0010D",
      "\\ddot": "#x00308",
      "\\mbox{\\c{}}": "#x000B8",
      "\\mbox{\\textcent}": "#x000A2",
      "\\breve{o}": "#x0014F",
      "\\mbox{\\c{S}}": "#x0015E",
      "\\grave{A}": "#x000C0",
      "\\grave{o}": "#x000F2",
      "\\yen": "#x000A5",
      "\\acute{z}": "#x0017A"
    },

    latexToUnicode: {
      "0": "#x00030",
      "1": "#x00031",
      "2": "#x00032",
      "3": "#x00033",
      "4": "#x00034",
      "5": "#x00035",
      "6": "#x00036",
      "7": "#x00037",
      "8": "#x00038",
      "9": "#x00039",
      "\\_": "#x0005F",
      "\\mathbit{i}": "#x1D48A",
      "\\mathtt{U}": "#x1D684",
      "\\ding{99}": "#x02743",
      "\\o": "#x000F8",
      "\\Elzpscrv": "#x0028B",
      "\\cyrchar\\CYRDZHE": "#x0040F",
      "\\cyrchar\\cyrshha": "#x004BB",
      "\\mathbf{\\varpi}": "#x1D6E1",
      "\\={I}": "#x0012A",
      "\\mathbit{r}": "#x1D493",
      "\\mathsfbf{E}": "#x1D5D8",
      "\\boxtimes": "#x022A0",
      "\\mathsf{Y}": "#x1D5B8",
      "\\parallel": "#x02225",
      "\\pi": "#x003C0",
      "\\mathsfsl{V}": "#x1D61D",
      "\\hspace{1em}": "#x02003",
      "\\mathbit{\\varsigma}": "#x1D747",
      "\\v{T}": "#x00164",
      "\\mathbit{u}": "#x1D496",
      "\\mathsfbf{\\varsigma}": "#x1D781",
      "\\mathsfbfsl{R}": "#x1D64D",
      "\\cyrchar\\cyrabhch": "#x004BD",
      "@": "#x00040",
      "\\cyrchar\\cyrkoppa": "#x00481",
      "\\mathbf{o}": "#x1D428",
      "\\mathmit{p}": "#x1D4F9",
      "\\mathsfsl{O}": "#x1D616",
      "\\'{R}": "#x00154",
      "\\cyrchar{\\'\\cyrk}": "#x0045C",
      "\\mathsfbf{s}": "#x1D600",
      "\\cyrchar\\cyrery": "#x0044B",
      "\\mp": "#x02213",
      "\\mathsfsl{d}": "#x1D625",
      "\\ding{193}": "#x02781",
      "\\capricornus": "#x02651",
      "\\ding{51}": "#x02713",
      "\\nLeftrightarrow": "#x021CE",
      "\\mathsl{Q}": "#x1D444",
      "\\mathscr{j}": "#x1D4BF",
      "\\mathsl{n}": "#x1D45B",
      "\\mathsfbfsl{n}": "#x1D663",
      "\\trianglerighteq": "#x022B5",
      "\\mathmit{T}": "#x1D4E3",
      "\\divideontimes": "#x022C7",
      "\\mathbf{s}": "#x1D42C",
      "\\cyrchar\\cyrkdsc": "#x0049B",
      "\\aries": "#x02648",
      "\\mathsfbfsl{\\Zeta}": "#x1D7AF",
      "\\leqslant": "#x02A7D",
      "+": "#x0002B",
      "\\mathfrak{j}": "#x1D527",
      "\\equiv": "#x02261",
      "\\cdot": "#x022C5",
      "\\cyrchar{\\'\\CYRG}": "#x00403",
      "\\mathsf{K}": "#x1D5AA",
      "\\mathbb{L}": "#x1D543",
      "\\exists": "#x02203",
      "\\mathsfbf{\\Pi}": "#x1D77F",
      "\\ElzThr": "#x02A05",
      "\\ding{124}": "#x0275C",
      "\\ding{179}": "#x02467",
      "\\mathsfbf{W}": "#x1D5EA",
      "\\mathslbb{T}": "#x1D57F",
      "\\mathtt{0}": "#x1D7F6",
      "\\mathmit{B}": "#x1D4D1",
      "\\urcorner": "#x0231D",
      "k": "#x0006B",
      "\\mathbit{k}": "#x1D48C",
      "\\.{e}": "#x00117",
      "\\mathsfsl{S}": "#x1D61A",
      "\\not\\subseteq": "#x02288",
      "\\leftthreetimes": "#x022CB",
      "\\Cup": "#x022D3",
      "\\cyrchar\\CYRYAT": "#x00462",
      "\\mathbf{D}": "#x1D403",
      "\\mathslbb{m}": "#x1D592",
      "\\mathbit{\\Alpha}": "#x1D736",
      "\\mathsf{g}": "#x1D5C0",
      "\\ding{223}": "#x0279F",
      "\\succneqq": "#x02AB6",
      "\\mathbf{X}": "#x1D417",
      "u": "#x00075",
      "\\cyrchar\\cyromega": "#x00461",
      "\\clockoint": "#x02A0F",
      "\\eighthnote": "#x0266A",
      "\\mathbb{h}": "#x1D559",
      "\\cyrchar\\cyro": "#x0043E",
      "\\mathscr{x}": "#x1D4CD",
      "\\mathsfbfsl{x}": "#x1D66D",
      "\\DownLeftVectorBar": "#x02956",
      "\\mkern4mu": "#x0205F",
      "\\leftrightsquigarrow": "#x021AD",
      "\\ding{252}": "#x027BC",
      "\\cdots": "#x022EF",
      "\\mathbf{6}": "#x1D7D4",
      "\\mathtt{I}": "#x1D678",
      "V": "#x00056",
      "\\curlyeqsucc": "#x022DF",
      "\\lneq": "#x02A87",
      "\\updownarrow": "#x02195",
      "\\Elzglst": "#x00294",
      "\\mathsf{a}": "#x1D5BA",
      "\\'{l}": "#x0013A",
      "\\mathbb{Z}": "#x02124",
      "\\mathsfbf{Y}": "#x1D5EC",
      "\\lnsim": "#x022E6",
      "\\mathsfsl{J}": "#x1D611",
      "\\mathsfsl{G}": "#x1D60E",
      "\\mathsf{u}": "#x1D5CE",
      "\\boxminus": "#x0229F",
      "\\mathsf{8}": "#x1D7EA",
      "\\lneqq": "#x02268",
      "\\mathsfsl{u}": "#x1D636",
      "\\blacksquare": "#x025AA",
      "\\mathscr{D}": "#x1D49F",
      "\\guilsinglleft": "#x02039",
      "\\mathsfsl{o}": "#x1D630",
      "\\cyrchar\\CYRKSI": "#x0046E",
      "\\ding{74}": "#x0272A",
      "\\mathsfbf{b}": "#x1D5EF",
      "\\ding{201}": "#x02789",
      "\\leftrightharpoons": "#x021CB",
      "\\mathbf{J}": "#x1D409",
      "\\mathtt{m}": "#x1D696",
      "\\mathbit{V}": "#x1D47D",
      "\\mathsfbfsl{\\Iota}": "#x1D7B2",
      "\\longrightarrow": "#x027F6",
      "\\RightVectorBar": "#x02953",
      "\\TH": "#x000DE",
      "A": "#x00041",
      "\\mathsfbfsl{\\Epsilon}": "#x1D7AE",
      "\\mathbb{f}": "#x1D557",
      "\\rmoustache": "#x023B1",
      "\\mathslbb{F}": "#x1D571",
      "\\lessdot": "#x022D6",
      "\\ElsevierGlyph{E210}": "#x0292A",
      "\\ding{230}": "#x027A6",
      "\\mathsl{r}": "#x1D45F",
      "\\mathscr{f}": "#x1D4BB",
      "\\mathsl{\\phi}": "#x1D719",
      "\\tone{22}": "#x002E8",
      "\\cyrchar\\cyrschwa": "#x004D9",
      "\\cyrchar\\cyrchrdsc": "#x004B7",
      "\\mathfrak{F}": "#x1D509",
      "\\mathtt{s}": "#x1D69C",
      "\\mathsf{h}": "#x1D5C1",
      "\\mathbf{n}": "#x1D427",
      "\\mathslbb{G}": "#x1D572",
      "{\\fontencoding{LECO}\\selectfont\\char203}": "#x0032B",
      "\\ding{52}": "#x02714",
      "\\'{S}": "#x0015A",
      "\\backepsilon": "#x003F6",
      "\\={U}": "#x0016A",
      ",": "#x0201A",
      "\\div": "#x000F7",
      "\\c{C}": "#x000C7",
      "\\ding{192}": "#x02780",
      "\\mathsfbf{t}": "#x1D601",
      "\\Elzverts": "#x002C8",
      "\\mathsl{V}": "#x1D449",
      "\\daleth": "#x02138",
      "\\upsilon": "#x003C5",
      "\\blacktriangle": "#x025B4",
      "\\subset": "#x02282",
      "\\approxeq": "#x0224A",
      "\\mathsfbfsl{C}": "#x1D63E",
      "\\v{E}": "#x0011A",
      "\\Elzsqfnw": "#x02519",
      "\\mathslbb{q}": "#x1D596",
      "\\ElsevierGlyph{E61B}": "#x029B6",
      "{\\fontencoding{LEIP}\\selectfont\\char202}": "#x0027F",
      "\\RightUpTeeVector": "#x0295C",
      "\\mathmit{i}": "#x1D4F2",
      "l": "#x0006C",
      "\\lceil": "#x02308",
      "\\H{U}": "#x00170",
      "\\tone{55}": "#x002E5",
      "\\ding{69}": "#x02725",
      "\\rightarrowtail": "#x021A3",
      "\\ding{34}": "#x02702",
      "\\mathbb{t}": "#x1D565",
      "\\mathsfbf{H}": "#x1D5DB",
      "\\mathbb{K}": "#x1D542",
      "\\cyrchar\\CYRABHCHDSC": "#x004BE",
      "\\ding{125}": "#x0275D",
      "\\mathsf{D}": "#x1D5A3",
      "\\^{W}": "#x00174",
      "\\pisces": "#x02653",
      "\\amalg": "#x02A3F",
      "\\ding{83}": "#x02733",
      "\\ding{178}": "#x02466",
      "\\mathsf{5}": "#x1D7E7",
      "\\cyrchar\\CYROMEGA": "#x00460",
      "\\\"{U}": "#x000DC",
      "\\mathtt{7}": "#x1D7FD",
      "\\mathslbb{U}": "#x1D580",
      "\\mathbit{h}": "#x1D489",
      "\\quarternote": "#x02669",
      "\\ding{165}": "#x02765",
      "\\cyrchar\\cyrot": "#x0047F",
      "\\triangleleft": "#x025C3",
      "\\ulcorner": "#x0231C",
      "\\mathsf{x}": "#x1D5D1",
      "\\mathsfbf{\\Eta}": "#x1D776",
      "\\mathtt{T}": "#x1D683",
      "\\bigcirc": "#x025EF",
      "\\'{A}": "#x00386",
      "\\mathsfsl{i}": "#x1D62A",
      "\\mathsfbf{\\Omega}": "#x1D788",
      "\\delta": "#x003B4",
      "W": "#x00057",
      "\\cyrchar\\cyrmillions": "#x00489",
      "\\Elzminhat": "#x02A5F",
      "\\mathsfbf{\\Theta}": "#x1D777",
      "\\mathscr{S}": "#x1D4AE",
      "\\mathsfbfsl{M}": "#x1D648",
      "\\mathfrak{M}": "#x1D510",
      "\\cyrchar\\CYRSFTSN": "#x0042C",
      "\\textbackslash": "#x0005C",
      "\\mathsfbf{F}": "#x1D5D9",
      "\\pitchfork": "#x022D4",
      "\\rightarrow": "#x02192",
      "\\v{S}": "#x00160",
      "\\mathbit{z}": "#x1D49B",
      "\\mathfrak{w}": "#x1D534",
      "\\ding{253}": "#x027BD",
      "\\cap": "#x02229",
      "\\Chi": "#x003A7",
      "\\mathbf{4}": "#x1D7D2",
      "\\mathtt{H}": "#x1D677",
      "\\guilsinglright": "#x0203A",
      "\\u{A}": "#x00102",
      "\\mathsl{\\Eta}": "#x1D702",
      "\\perspcorrespond": "#x02A5E",
      "\\Omega": "#x02126",
      "\\cyrchar\\CYRNDSC": "#x004A2",
      "\\mathsfbf{Z}": "#x1D5ED",
      "\\mathsf{v}": "#x1D5CF",
      "\\acute{\\omega}": "#x003CE",
      "\\Updownarrow": "#x021D5",
      "\\mathsl{o}": "#x1D45C",
      "\\truestate": "#x022A7",
      "B": "#x00042",
      "\\mathbf{\\Phi}": "#x1D6D7",
      "\\cyrchar\\CYRZDSC": "#x00498",
      "\\^{E}": "#x000CA",
      "\\mathsfbfsl{\\Xi}": "#x1D7B7",
      "\\mathscr{i}": "#x1D4BE",
      "\\k{u}": "#x00173",
      "\\mathsfbfsl{i}": "#x1D65E",
      "''''": "#x02057",
      "\\mathsl{\\Epsilon}": "#x1D700",
      "\\mathfrak{i}": "#x1D526",
      "z": "#x0007A",
      "\\nLeftarrow": "#x021CD",
      "\\cyrchar\\CYRYHCRS": "#x004B0",
      "\\mathtt{Z}": "#x1D689",
      "\\greaterequivlnt": "#x02273",
      "\\cyrchar\\CYRERY": "#x0042B",
      "\\textperiodcentered": "#x002D9",
      "\\mathbb{e}": "#x1D556",
      "\\mathsfbfsl{\\Phi}": "#x1D7BF",
      "\\downarrow": "#x02193",
      "\\mathscr{u}": "#x1D4CA",
      "\\^{a}": "#x000E2",
      "\\ElsevierGlyph{E211}": "#x02927",
      "\\Longrightarrow": "#x027F9",
      "\\Upsilon": "#x003D2",
      "{\\fontencoding{LELA}\\selectfont\\char40}": "#x00126",
      "\\={u}": "#x0016B",
      "\\mathbf{\\Theta}": "#x1D6AF",
      "\\^{\\i}": "#x000EE",
      "-": "#x02212",
      "\\lnot": "#x000AC",
      "\\cyrchar\\cyrr": "#x00440",
      "\\textordfeminine": "#x000AA",
      "\\mathsl{\\Rho}": "#x1D70C",
      "\\mathfrak{E}": "#x1D508",
      "\\ding{222}": "#x0279E",
      "\\veebar": "#x022BB",
      "\\c{K}": "#x00136",
      "\\mathbit{\\Lambda}": "#x1D740",
      "\\ElsevierGlyph{E21C}": "#x02933",
      "\\mathbb{W}": "#x1D54E",
      "\\mathbb{X}": "#x1D54F",
      "\\cyrchar\\CYRA": "#x00410",
      "\\mathscr{g}": "#x0210A",
      "\\^{s}": "#x0015D",
      "\\varsigma": "#x003C2",
      "\\sqcup": "#x02294",
      "\\mathsfbf{\\Upsilon}": "#x1D784",
      "\\gtreqqless": "#x02A8C",
      "\\`{o}": "#x000F2",
      "\\\"{I}": "#x000CF",
      "\\v{D}": "#x0010E",
      "\\mathbb{C}": "#x02102",
      "\\leftarrowtail": "#x021A2",
      "\\mathsfbfsl{B}": "#x1D63D",
      "\\cyrchar\\CYRS": "#x00421",
      "\\.{G}": "#x00120",
      "\\nearrow": "#x02197",
      "{\\fontencoding{LECO}\\selectfont\\char215}": "#x00337",
      "\\cyrchar\\cyrksi": "#x0046F",
      "\\mathslbb{v}": "#x1D59B",
      "\\cyrchar\\cyryhcrs": "#x004B1",
      "\\ding{35}": "#x02703",
      "\\Rho": "#x003A1",
      "\\Elztrnm": "#x0026F",
      "\\textasciitilde": "#x0007E",
      "\\triangleright": "#x025B9",
      "\\cyrchar\\CYRSCHWA": "#x004D8",
      "\\triangledown": "#x025BF",
      "\\ntriangleright": "#x022EB",
      "\\textphi": "#x00278",
      "\\^{o}": "#x000F4",
      "\\ding{68}": "#x02724",
      "\\mathsfbf{c}": "#x1D5F0",
      "\\mathsfsl{w}": "#x1D638",
      "\\mathsfsl{t}": "#x1D635",
      "\\mathscr{C}": "#x1D49E",
      "\\sim": "#x0223C",
      "{\\fontencoding{LECO}\\selectfont\\char177}": "#x00311",
      "\\mathfrak{S}": "#x1D516",
      "\\ding{75}": "#x0272B",
      "\\textquotedblleft": "#x0201C",
      "\\ElsevierGlyph{E20C}": "#x02923",
      "\\mathbf{I}": "#x1D408",
      "\\mathtt{l}": "#x1D695",
      "\\mathbit{W}": "#x1D47E",
      "\\mathsfbfsl{\\Delta}": "#x1D7AD",
      "\\ding{200}": "#x02788",
      "\\cyrchar\\CYRIOTBYUS": "#x0046C",
      "\\ElzAnd": "#x02A53",
      "\\'{N}": "#x00143",
      "\\ding{116}": "#x025BC",
      "\\neptune": "#x02646",
      "\\mathsfsl{X}": "#x1D61F",
      "\\Elzrh": "#x00322",
      "\\varepsilon": "#x0025B",
      "\\mathsfsl{h}": "#x1D629",
      "\\i": "#x00131",
      "\\mho": "#x02127",
      "\\Zeta": "#x00396",
      "\\allequal": "#x0224C",
      "\\mathsfbfsl{L}": "#x1D647",
      "\\hspace{0.25em}": "#x02005",
      "\\mathsfbfsl{\\Psi}": "#x1D7C1",
      "\\mathsfbf{G}": "#x1D5DA",
      "\\Elzschwa": "#x00259",
      "\\rightanglearc": "#x022BE",
      "\\mathbf{m}": "#x1D426",
      "\\v{R}": "#x00158",
      "\\mathbf{\\Zeta}": "#x1D6C7",
      "\\mathmit{M}": "#x1D4DC",
      "\\tildetrpl": "#x0224B",
      "C": "#x00043",
      "\\mathsfbf{\\Psi}": "#x1D787",
      "\\mathscr{K}": "#x1D4A6",
      "\\in": "#x1D7C4",
      "\\ding{53}": "#x02715",
      "\\Elzsbrhr": "#x002D2",
      "\\mathscr{Q}": "#x1D4AC",
      "\\mathsl{I}": "#x1D43C",
      "{\\fontencoding{LELA}\\selectfont\\char201}": "#x0013F",
      "\\ding{191}": "#x0277F",
      "\\top": "#x022A4",
      "\\cyrchar\\cyrsh": "#x00448",
      "\\mathtt{h}": "#x1D691",
      "\\mathsfbf{u}": "#x1D602",
      "\\mathsl{W}": "#x1D44A",
      "\\mathsfsl{f}": "#x1D627",
      "\\mathbf{E}": "#x1D404",
      "\\Elzxh": "#x00127",
      "\\mathscr{h}": "#x1D4BD",
      "\\mathsfbfsl{h}": "#x1D65D",
      "\\mathsl{l}": "#x1D459",
      "\\rightrightarrows": "#x021C9",
      "\\ding{168}": "#x02663",
      "\\Koppa": "#x003DE",
      "\\langle": "#x02329",
      "\\mathfrak{h}": "#x1D525",
      "\\leftharpoonup": "#x021BC",
      "\\mathmit{V}": "#x1D4E5",
      "\\ding{113}": "#x02751",
      "\\mathtt{Y}": "#x1D688",
      ".": "#x02024",
      "\\c{t}": "#x00163",
      "\\ss": "#x000DF",
      "\\mathbf{\\Lambda}": "#x1D6CC",
      "\\textfrac{7}{8}": "#x0215E",
      "\\mathsl{\\nabla}": "#x1D6FB",
      "\\mathbb{J}": "#x1D541",
      "\\mathsfbf{I}": "#x1D5DC",
      "\\ding{122}": "#x0275A",
      "\\textendash": "#x02013",
      "\\forcesextra": "#x022A8",
      "\\mathsfsl{Z}": "#x1D621",
      "\\ding{174}": "#x02462",
      "\\mathsf{E}": "#x1D5A4",
      "\\supsetneq": "#x0228B",
      "\\bullet": "#x02219",
      "\\ding{82}": "#x02732",
      "\\nRightarrow": "#x021CF",
      "\\mathbit{\\Eta}": "#x1D73C",
      "\\mathtt{6}": "#x1D7FC",
      "\\mathmit{D}": "#x1D4D3",
      "\\mathslbb{Z}": "#x1D585",
      "\\.{c}": "#x0010B",
      "n": "#x0006E",
      "\\ElsevierGlyph{E25D}": "#x02A2E",
      "\\~{U}": "#x00168",
      "\\smile": "#x02323",
      "\\cyrchar\\CYRABHCH": "#x004BC",
      "\\ding{225}": "#x027A1",
      "\\mathbf{p}": "#x1D429",
      "\\Elzsqfse": "#x025EA",
      "\\sigma": "#x003C3",
      "\\curlyvee": "#x022CE",
      "ij": "#x00133",
      "\\mathbb{V}": "#x1D54D",
      "\\ding{249}": "#x027B9",
      "\\cyrchar\\cyra": "#x00430",
      "\\mathsfbfsl{z}": "#x1D66F",
      "\\mathsl{b}": "#x1D44F",
      "\\cyrchar\\cyrushrt": "#x0045E",
      "\\gtreqless": "#x022DB",
      "\\Elzrtlz": "#x00290",
      "\\mathmit{X}": "#x1D4E7",
      "\\oint": "#x0222E",
      "\\mathbit{\\Upsilon}": "#x1D74A",
      "\\NG": "#x0014A",
      "\\mathfrak{v}": "#x1D533",
      "\\square": "#x025A1",
      "\\cyrchar\\CYRABHHA": "#x004A8",
      "\\cyrchar\\cyrs": "#x00441",
      "\\nparallel": "#x02226",
      "\\mathsfsl{Q}": "#x1D618",
      "Y": "#x00059",
      "\\cyrchar\\CYROTLD": "#x004E8",
      "\\mathtt{O}": "#x1D67E",
      "\\mathsf{w}": "#x1D5D0",
      "\\ding{164}": "#x02764",
      "\\subsetneq": "#x0228A",
      "\\Elzrtld": "#x00256",
      "\\mid": "#x02223",
      "\\mathsfsl{L}": "#x1D613",
      "\\mathsfbf{d}": "#x1D5F1",
      "\\mathscr{B}": "#x0212C",
      "\\mathsl{F}": "#x1D439",
      "\\verymuchless": "#x022D8",
      "\\mathslbb{c}": "#x1D588",
      "\\ElsevierGlyph{E20B}": "#x02925",
      "\\ElsevierGlyph{2274}": "#x02274",
      "\\mathbit{T}": "#x1D47B",
      "\\mathfrak{R}": "#x0211C",
      "\\cyrchar\\CYRB": "#x00411",
      "\\mathslbb{a}": "#x1D586",
      "\\ding{207}": "#x0278F",
      "\\gtrapprox": "#x02A86",
      "\\mathbf{H}": "#x1D407",
      "\\mathtt{c}": "#x1D68C",
      "\\DownArrowUpArrow": "#x021F5",
      "\\mathbit{\\Zeta}": "#x1D73B",
      "\\NestedLessLess": "#x02AA1",
      "D": "#x00044",
      "\\cyrchar\\CYRT": "#x00422",
      "\\mathbb{d}": "#x1D555",
      "\\mathsfbf{\\Lambda}": "#x1D77A",
      "\\mathsl{p}": "#x1D45D",
      "\\textfrac{1}{8}": "#x0215B",
      "\\mathscr{t}": "#x1D4C9",
      "\\mathfrak{D}": "#x1D507",
      "\\longleftarrow": "#x027F5",
      "\\mathsl{\\Pi}": "#x1D70B",
      "\\mathbit{X}": "#x1D47F",
      "\\blacktriangleleft": "#x025C2",
      "\\mapsto": "#x021A6",
      "\\mathbf{\\theta}": "#x1D6C9",
      "\\mathbf{i}": "#x1D422",
      "\\mbox{\\texteuro}": "#x020AC",
      "\\Rrightarrow": "#x021DB",
      "\\ElsevierGlyph{300A}": "#x0300A",
      "\\longleftrightarrow": "#x027F7",
      "\\mathsfsl{y}": "#x1D63A",
      "\\mathscr{P}": "#x1D4AB",
      "\\mathsl{T}": "#x1D447",
      "\\odot": "#x02299",
      "/": "#x0002F",
      "\\ding{78}": "#x0272E",
      "\\mathsfbf{v}": "#x1D603",
      "\\ding{190}": "#x0277E",
      "\\not\\sim": "#x02241",
      "\\v{C}": "#x0010C",
      "\\Digamma": "#x003DC",
      "\\tone{11}": "#x002E9",
      "\\preceq": "#x02AAF",
      "\\mathbit{J}": "#x1D471",
      "\\^{}": "#x0005E",
      "\\mathmit{c}": "#x1D4EC",
      "\\textfrac{3}{5}": "#x02157",
      "\\gg": "#x0226B",
      "\\ding{210}": "#x02792",
      "\\cyrchar\\cyrdje": "#x00452",
      "\\bigcup": "#x022C3",
      "\\mathbb{r}": "#x1D563",
      "\\cyrchar\\CYRHDSC": "#x004B2",
      "\\ding{123}": "#x0275B",
      "\\cyrchar\\CYRPHK": "#x004A6",
      "\\mathsfbf{J}": "#x1D5DD",
      "\\mathsfbfsl{\\Kappa}": "#x1D7B3",
      "\\mathsf{F}": "#x1D5A5",
      "{\\fontencoding{LECO}\\selectfont\\char207}": "#x0032F",
      "\\cyrchar\\cyryu": "#x0044E",
      "\\ding{81}": "#x02731",
      "\\^{U}": "#x000DB",
      "{\\fontencoding{LELA}\\selectfont\\char195}": "#x001BA",
      "\\circlearrowleft": "#x021BA",
      "\\mathsfbfsl{Y}": "#x1D654",
      "\\ElzrLarr": "#x02944",
      "\\not<": "#x0226E",
      "\\mathbf{r}": "#x1D42B",
      "\\mathtt{5}": "#x1D7FB",
      "\\epsilon": "#x003B5",
      "\\ElsevierGlyph{E25E}": "#x02A35",
      "\\nVdash": "#x022AE",
      "\\mu": "#x003BC",
      "\\'{O}": "#x000D3",
      "\\u{o}": "#x0014F",
      "\\c{g}": "#x00123",
      "\\omega": "#x003C9",
      "\\cyrchar\\cyrndsc": "#x004A3",
      "\\mathsfsl{k}": "#x1D62C",
      "Z": "#x0005A",
      "\\mathsf{T}": "#x1D5B3",
      "\\ElsevierGlyph{E395}": "#x02A10",
      "\\propto": "#x0221D",
      "\\mathsfbfsl{O}": "#x1D64A",
      "\\Vdash": "#x022A9",
      "\\\"{e}": "#x000EB",
      "\\mathslbb{E}": "#x1D570",
      "\\mathbb{4}": "#x1D7DC",
      "\\mathbit{x}": "#x1D499",
      "\\mathbit{\\Beta}": "#x1D737",
      "\\sqsubset": "#x0228F",
      "\\mathfrak{u}": "#x1D532",
      "\\intercal": "#x022BA",
      "\\cyrchar{\\'\\CYRK}": "#x0040C",
      "\\DownArrowBar": "#x02913",
      "\\mathfrak{x}": "#x1D535",
      "\\mathsfbfsl{I}": "#x1D644",
      "\\asymp": "#x0224D",
      "\\mathbb{Q}": "#x0211A",
      "\\mathsfsl{b}": "#x1D623",
      "\\v{r}": "#x00159",
      "\\mathsf{p}": "#x1D5C9",
      "\\mathbb{G}": "#x1D53E",
      "\\mathsfbfsl{k}": "#x1D660",
      "\\ding{47}": "#x0270F",
      "\\mathsfbf{\\Delta}": "#x1D773",
      "\\varphi": "#x003C6",
      "E": "#x00045",
      "\\mathmit{I}": "#x1D4D8",
      "\\mathsl{m}": "#x1D45A",
      "\\mathscr{X}": "#x1D4B3",
      "\\\"{Y}": "#x00178",
      "\\textdegree": "#x000B0",
      "'n": "#x00149",
      "\\'{}O": "#x0038C",
      "\\ding{112}": "#x02750",
      "\\ding{169}": "#x02666",
      "\\cyrchar\\cyrb": "#x00431",
      "\\rightleftharpoons": "#x021CC",
      "\\th": "#x000FE",
      "\\dblarrowupdown": "#x021C5",
      "\\mathbit{\\Pi}": "#x1D745",
      "\\ngeqslant": "#x02A7E-00338",
      "\\mathslbb{L}": "#x1D577",
      "\\Vert": "#x02016",
      "\\cyrchar\\cyrt": "#x00442",
      "\\mathbb{c}": "#x1D554",
      "\\Elzreglst": "#x00295",
     ":=": "#x02254",
      "\\mathbit{\\Chi}": "#x1D74C",
      "\\mathscr{s}": "#x1D4C8",
      "\\mathmit{e}": "#x1D4EE",
      "\\mathsl{q}": "#x1D45E",
      "\\mathfrak{C}": "#x0212D",
      "\\`{a}": "#x000E0",
      "\\pluto": "#x02647",
      "\\mathsfbf{\\Sigma}": "#x1D782",
      "\\rightharpoondown": "#x021C1",
      "\\texttimes": "#x000D7",
      "\\cyrchar\\CYRII": "#x00406",
      "\\ElsevierGlyph{E21A}": "#x02936",
      "\\mathsfsl{M}": "#x1D614",
      "\\lessequivlnt": "#x02272",
      "\\recorder": "#x02315",
      "\\cyrchar\\CYRGHCRS": "#x00492",
      "\\ding{248}": "#x027B8",
      "\\not\\supseteq": "#x02289",
      "\\mathsfbfsl{\\varsigma}": "#x1D7BB",
      "\\mathsf{b}": "#x1D5BB",
      "\\sim\\joinrel\\leadsto": "#x027FF",
      "\\mathscr{e}": "#x0212F",
      "\\mathsl{c}": "#x1D450",
      "\\mathsfbf{\\varpi}": "#x1D78F",
      "\\Elxuplus": "#x02A04",
      "\\textasciimacron": "#x000AF",
      "\\Equal": "#x02A75",
      "p": "#x00070",
      "\\\"{O}": "#x000D6",
      "\\coprod": "#x02210",
      "\\cyrchar\\CYRC": "#x00426",
      "\\mathslbb{t}": "#x1D599",
      "\\mathmit{b}": "#x1D4EB",
      "\\cyrchar\\CYRU": "#x00423",
      "\\textregistered": "#x000AE",
      "\\mathbit{K}": "#x1D472",
      "\\not\\preceq": "#x02AAF-00338",
      "\\.{E}": "#x00116",
      "\\cyrchar\\cyrtdsc": "#x004AD",
      "\\rceil": "#x02309",
      "\\ding{33}": "#x02701",
      "\\ding{211}": "#x02793",
      "\\mathbb{q}": "#x1D562",
      "\\cyrchar\\C": "#x0030F",
      "\\mathscr{A}": "#x1D49C",
      "\\`{u}": "#x000F9",
      "\\sqsupset": "#x02290",
      "\\Elztrny": "#x0028E",
      "\\mathsfbf{e}": "#x1D5F2",
      "\\cyrchar\\CYRPSI": "#x00470",
      "\\.{z}": "#x0017C",
      "\\mathsfsl{v}": "#x1D637",
      "\\oslash": "#x02298",
      "\\v{t}": "#x00165",
      "\\mathbit{U}": "#x1D47C",
      "\\ElsevierGlyph{E20E}": "#x02928",
      "[": "#x0005B",
      "\\mathfrak{Q}": "#x1D514",
      "\\ding{206}": "#x0278E",
      "\\mathbf{O}": "#x1D40E",
      "\\mathtt{b}": "#x1D68B",
      "\\mathslbb{f}": "#x1D58B",
      "\\NotHumpDownHump": "#x0224E-00338",
      "(": "#x00028",
      "\\not\\cong": "#x02247",
      "\\Elzrvbull": "#x025D8",
      "\\eqcirc": "#x02256",
      "\\'{L}": "#x00139",
      "\\Colon": "#x02237",
      "\\mathsfbf{y}": "#x1D606",
      "\\mathsfsl{j}": "#x1D62B",
      "\\Elzrarrx": "#x02947",
      "\\mathsf{U}": "#x1D5B4",
      "\\mathbit{y}": "#x1D49A",
      "\\mathsfbfsl{N}": "#x1D649",
      "\\Elzfhr": "#x0027E",
      "\\surd": "#x0221A",
      "\\mathmit{t}": "#x1D4FD",
      "\\textvartheta": "#x003D1",
      "\\mathslbb{w}": "#x1D59C",
      "\\ding{180}": "#x02468",
      "\\mathslbb{J}": "#x1D575",
      "\\mathbf{c}": "#x1D41C",
      "F": "#x00046",
      "\\cancer": "#x0264B",
      "\\Lleftarrow": "#x021DA",
      "\\chi": "#x003C7",
      "\\mathsl{\\varkappa}": "#x1D718",
      "\\starequal": "#x0225B",
      "\\fbox{~~}": "#x025AD",
      "\\mathfrak{T}": "#x1D517",
      "\\mathsl{U}": "#x1D448",
      "\\LeftRightVector": "#x0294E",
      "\\cyrchar\\cyrae": "#x004D5",
      "\\'{\\i}": "#x000ED",
      "\\mathsfbfsl{\\varpi}": "#x1D7C9",
      "\\H{}": "#x002DD",
      "\\cyrchar\\cyriotbyus": "#x0046D",
      "\\v{L}": "#x0013D",
      "\\ding{197}": "#x02785",
      "\\mathsfbf{w}": "#x1D604",
      "\\cyrchar{\\'\\cyrg}": "#x00453",
      "\\downharpoonright": "#x021C2",
      "\\mathsfbfsl{\\Sigma}": "#x1D7BC",
      "\\mathmit{K}": "#x1D4DA",
      "\\mathmit{H}": "#x1D4D7",
      "\\risingdotseq": "#x02253",
      "\\Elzcirfr": "#x025D1",
      "\\~{A}": "#x000C3",
      "o": "#x003BF",
      "\\ding{111}": "#x0274F",
      "\\mathfrak{f}": "#x1D523",
      "\\ding{73}": "#x02729",
      "\\sphericalangle": "#x02222",
      "\\mathsfbfsl{\\Gamma}": "#x1D7AC",
      "\\mathmit{L}": "#x1D4DB",
      ",,": "#x0201E",
      "\\'{z}": "#x0017A",
      "\\mathsf{G}": "#x1D5A6",
      "\\mathsfbf{\\Iota}": "#x1D778",
      "!": "#x00021",
      "\\mathbf{\\Beta}": "#x1D6C3",
      "\\mathsfbf{K}": "#x1D5DE",
      "\\mathbb{H}": "#x0210D",
      "\\mathsl{\\Upsilon}": "#x1D710",
      "\\ding{120}": "#x02758",
      "\\ding{175}": "#x02463",
      "\\mathbit{o}": "#x1D490",
      "\\Pisymbol{ppi022}{87}": "#x003D0",
      "\\Elzdefas": "#x029CB",
      "\\mathsfbfsl{X}": "#x1D653",
      "\\ding{80}": "#x02730",
      "\\beta": "#x003B2",
      "\\mathbit{M}": "#x1D474",
      "\\textvisiblespace": "#x02423",
      "\\mathbf{q}": "#x1D42A",
      "\\mathtt{4}": "#x1D7FA",
      "\\lbrace": "#x0007B",
      "\\mathslbb{X}": "#x1D583",
      "q": "#x00071",
      "\\subseteqq": "#x02AC5",
      "\\mathsfbf{\\varkappa}": "#x1D78C",
      "\\mathsl{\\Lambda}": "#x1D706",
      "\\LeftUpTeeVector": "#x02960",
      "\\c{N}": "#x00145",
      "\\cyrchar\\CYRAE": "#x004D4",
      "\\Elzreapos": "#x0201B",
      "\\not\\apid": "#x0224B-00338",
      "\\H{u}": "#x00171",
      "\\LeftDownTeeVector": "#x02961",
      "\\mathsf{c}": "#x1D5BC",
      "\\mathbit{\\Iota}": "#x1D73E",
      "\\mathbb{T}": "#x1D54B",
      "\\ding{247}": "#x027B7",
      "\\Elzrtlt": "#x00288",
      "\\mathsfbf{\\Phi}": "#x1D785",
      "\\mathsfbfsl{\\vartheta}": "#x1D7C5",
      "\\NotEqualTilde": "#x02242-00338",
      "\\mathsfsl{F}": "#x1D60D",
      "\\mathscr{d}": "#x1D4B9",
      "\\mathfrak{t}": "#x1D531",
      "\\notlessgreater": "#x02278",
      "\\~{O}": "#x000D5",
      "\\leo": "#x0264C",
      "\\cyrchar\\cyrc": "#x00446",
      "\\mathtt{M}": "#x1D67C",
      "\\cyrchar\\cyru": "#x00443",
      "\\textonehalf": "#x000BD",
      "\\mathbb{I}": "#x1D540",
      "\\mathfrak{y}": "#x1D536",
      "\\mathsfbfsl{\\Beta}": "#x1D7AB",
      "\\mathbb{9}": "#x1D7E1",
      "\\lvertneqq": "#x02268-0FE00",
      "\\mathsf{q}": "#x1D5CA",
      "\\gtrdot": "#x022D7",
      "\\mathbb{F}": "#x1D53D",
      "\\cyrchar\\CYRKDSC": "#x0049A",
      "\\mathbit{n}": "#x1D48F",
      "\\mathsfbfsl{j}": "#x1D65F",
      "\\Elztdcol": "#x02AF6",
      "\\textbrokenbar": "#x000A6",
      "\\rfloor": "#x0230B",
      "\\mathsfbf{f}": "#x1D5F3",
      "\\={\\i}": "#x0012B",
      "\\NotSquareSubset": "#x0228F-00338",
      "\\LeftTeeVector": "#x0295A",
      "\\mathbit{\\phi}": "#x1D753",
      "\\v{s}": "#x00161",
      "\\ding{205}": "#x0278D",
      "\\ElsevierGlyph{E20D}": "#x02924",
      "\\curvearrowright": "#x021B7",
      "\\mathfrak{P}": "#x1D513",
      "\\mathbit{Z}": "#x1D481",
      "\\cyrchar\\cyrghcrs": "#x00493",
      "\\ding{229}": "#x027A5",
      "\\mathbf{N}": "#x1D40D",
      "\\mathtt{a}": "#x1D68A",
      "\\mathbit{Y}": "#x1D480",
      "\\mathslbb{g}": "#x1D58C",
      "\\k{e}": "#x00119",
      "\\nolinebreak": "#x02060",
      "\\mathbf{\\varsigma}": "#x1D6D3",
      "\\textasciigrave": "#x00060",
      "\\mathsf{m}": "#x1D5C6",
      "\\cyrchar\\CYRD": "#x00414",
      "\\venus": "#x02640",
      "\\mathsfsl{R}": "#x1D619",
      "\\mathsfbfsl{q}": "#x1D666",
      "\\cyrchar\\CYRV": "#x00412",
      "G": "#x00047",
      "\\mathbb{b}": "#x1D553",
      "\\mathsfbf{1}": "#x1D7ED",
      "\\mathsfbf{\\Xi}": "#x1D77D",
      "\\mathscr{r}": "#x1D4C7",
      "\\frown": "#x02322",
      "\\varrho": "#x003F1",
      "\\^{\\j}": "#x00135",
      "\\mathfrak{B}": "#x1D505",
      "\\NotSquareSuperset": "#x02290-00338",
      "\\cyrchar\\cyrghk": "#x00495",
      "\\cyrchar\\cyrie": "#x00454",
      "\\v{e}": "#x0011B",
      "\\UpArrowBar": "#x02912",
      "\\mathbb{7}": "#x1D7DF",
      "\\mathbf{8}": "#x1D7D6",
      "\\mathscr{v}": "#x1D4CB",
      "\\mathmit{G}": "#x1D4D6",
      "\\ElsevierGlyph{2238}": "#x02238",
      "\\cyrchar\\cyromegatitlo": "#x0047D",
      "\\mathslbb{j}": "#x1D58F",
      "\\mathscr{q}": "#x1D4C6",
      "\\mathsfbf{h}": "#x1D5F5",
      "\\cyrchar\\CYRYU": "#x0042E",
      "\\mathsl{Z}": "#x1D44D",
      "\\volintegral": "#x02230",
      "\\ding{196}": "#x02784",
      "\\mathsfbf{\\Alpha}": "#x1D770",
      "\\textasciibreve": "#x002D8",
      "\\\"{u}": "#x000FC",
      "\\mathslbb{u}": "#x1D59A",
      "\\mathbit{H}": "#x1D46F",
      "\\ae": "#x000E6",
      "\\cyrchar\\CYRSEMISFTSN": "#x0048C",
      "\\ding{49}": "#x02711",
      "\\ding{212}": "#x02794",
      "\\mathbb{p}": "#x1D561",
      "\\not\\sqsubseteq": "#x022E2",
      "\\boxplus": "#x0229E",
      "\\ElzRlarr": "#x02942",
      "\\natural": "#x0266E",
      "{\\fontencoding{LECO}\\selectfont\\char221}": "#x0033D",
      "\\ding{65}": "#x02721",
      "\\c{T}": "#x00162",
      "r": "#x00072",
      "\\mathsl{D}": "#x1D437",
      "\\mathslbb{B}": "#x1D56D",
      "\\vdash": "#x022A2",
      "\\ding{121}": "#x02759",
      "\\^{S}": "#x0015C",
      "\\mathsfbf{L}": "#x1D5DF",
      "\\mathslbb{Y}": "#x1D584",
      "\\mathsl{w}": "#x1D464",
      "\\`{O}": "#x000D2",
      "\\ding{87}": "#x02737",
      "\\mathbit{l}": "#x1D48D",
      "\\cyrchar\\CYRR": "#x00420",
      "\\Elxsqcup": "#x02A06",
      "\\precedesnotsimilar": "#x022E8",
      "\\cyrchar\\CYRKHK": "#x004C3",
      "\\precapprox": "#x02AB7",
      "\\u{a}": "#x00103",
      "\\int\\!\\int\\!\\int": "#x0222D",
      "\\cyrchar\\cyryi": "#x00457",
      "\\mathsl{\\varpi}": "#x1D71B",
      "\\wedge": "#x02227",
      "\\mathsf{V}": "#x1D5B5",
      "]": "#x0005D",
      "\\mathsfsl{m}": "#x1D62E",
      "\\not>": "#x0226F",
      "\\DownRightTeeVector": "#x0295F",
      "\\mathsfbf{x}": "#x1D605",
      "\\mathmit{W}": "#x1D4E6",
      "\\DownLeftTeeVector": "#x0295E",
      "\\ding{181}": "#x02469",
      "\\backsim": "#x0223D",
      "\\mathslbb{K}": "#x1D576",
      "\\uparrow": "#x02191",
      "\\cyrchar\\cyromegarnd": "#x0047B",
      "\\mathbf{\\varkappa}": "#x1D6DE",
      "\\ElzTimes": "#x02A2F",
      "\\mathsfbf{\\Epsilon}": "#x1D774",
      "\\mathtt{L}": "#x1D67B",
      "\\mathfrak{A}": "#x1D504",
      "\\blacktriangledown": "#x025BE",
      "\\phi": "#x003D5",
      "\\prod": "#x0220F",
      "\\supset": "#x02283",
      "\\mathbb{8}": "#x1D7E0",
      "\\u{E}": "#x00114",
      "\\mathbb{E}": "#x1D53C",
      "\\mathsfsl{A}": "#x1D608",
      "\\mathsf{r}": "#x1D5CB",
      "\\mathbit{\\Tau}": "#x1D749",
      "\\mathmit{s}": "#x1D4FC",
      "\\^{A}": "#x000C2",
      "\\mathbit{b}": "#x1D483",
      "\\mathsfbfsl{e}": "#x1D65A",
      "<\\kern-0.58em(": "#x02993",
      "\\mathtt{9}": "#x1D7FF",
      "\\ding{110}": "#x025A0",
      "H": "#x00048",
      "\\multimap": "#x022B8",
      "\\ding{90}": "#x0273A",
      "\\NotGreaterGreater": "#x0226B-00338",
      "\\mathfrak{e}": "#x1D522",
      "\\c{k}": "#x00137",
      "\\cyrchar\\cyrkhcrs": "#x0049F",
      "\\mathsfbf{\\Beta}": "#x1D771",
      "\\clwintegral": "#x02231",
      "\\LeftUpDownVector": "#x02951",
      "\\Supset": "#x022D1",
      "\\cyrchar\\cyrd": "#x00434",
      "\\therefore": "#x02234",
      "\\mathchar\"2208": "#x02316",
      "\\cyrchar\\cyrv": "#x00432",
      "\\mathsfbfsl{J}": "#x1D645",
      "\\`{e}": "#x000E8",
      "\\mathsfbf{2}": "#x1D7EE",
      "\\mathsfbf{z}": "#x1D607",
      "\\Angle": "#x0299C",
      "\\v{d}": "#x0010F",
      "\\cup": "#x0222A",
      "\\blacktriangleright": "#x025B8",
      "\\mathbf{l}": "#x1D425",
      "\\mathbb{6}": "#x1D7DE",
      "\\cyrchar\\CYRABHDZE": "#x004E0",
      "\\'{g}": "#x001F5",
      "\\mathtt{r}": "#x1D69B",
      "\\ding{226}": "#x027A2",
      "\\^{O}": "#x000D4",
      "\\mathbb{S}": "#x1D54A",
      "\\ding{246}": "#x027B6",
      "\\lesseqgtr": "#x022DA",
      "\\mathmit{h}": "#x1D4F1",
      "\\searrow": "#x02198",
      "\\gemini": "#x0264A",
      "\\mathscr{c}": "#x1D4B8",
      "\\cyrchar\\cyrnje": "#x0045A",
      "\\lrcorner": "#x0231F",
      "\\mathsl{a}": "#x1D44E",
      "\\Stigma": "#x003DA",
      "s": "#x00073",
      "\\mathfrak{s}": "#x1D530",
      "\\cyrchar\\CYRE": "#x00415",
      "\\~{N}": "#x000D1",
      "\\textTheta": "#x003F4",
      "\\ng": "#x0014B",
      "\\boxdot": "#x022A1",
      "\\mathmit{d}": "#x1D4ED",
      "\\eqslantless": "#x02A95",
      "\\mathslbb{z}": "#x1D59F",
      "\\.{C}": "#x0010A",
      "\\mathbf{S}": "#x1D412",
      "\\~{u}": "#x00169",
      "\\ensuremath{\\Elzpes}": "#x020A7",
      "\\bigtriangleup": "#x025B3",
      "\\ding{64}": "#x02720",
      "\\mathbf{\\Epsilon}": "#x1D6C6",
      "\\mathsl{E}": "#x1D438",
      "\\mathbf{\\Kappa}": "#x1D6CB",
      "\\ltimes": "#x022C9",
      "\\\"{\\i}": "#x000EF",
      "\\mathfrak{O}": "#x1D512",
      "\\mathsfbf{g}": "#x1D5F4",
      "\\mathsfbfsl{\\varrho}": "#x1D7C8",
      "\\ding{204}": "#x0278C",
      "\\mathslbb{d}": "#x1D589",
      "\\mathbf{M}": "#x1D40C",
      "\\mathscr{R}": "#x0211B",
      "\\Uparrow": "#x021D1",
      "\\sqcap": "#x02293",
      "\\ding{228}": "#x027A4",
      "\\cyrchar\\cyrzh": "#x00436",
      "\\not\\succeq": "#x02AB0-00338",
      "\\mathsf{n}": "#x1D5C7",
      "\\mathbb{a}": "#x1D552",
      "\\textfrac{2}{5}": "#x02156",
      "\\textcent": "#x000A2",
      "\\mathsf{W}": "#x1D5B6",
      "\\cyrchar\\CYRISHRT": "#x00419",
      "\\mathsfbfsl{w}": "#x1D66C",
      "\\mathtt{N}": "#x1D67D",
      "\\={O}": "#x0014C",
      "\\textcopyright": "#x000A9",
      "\\mathbit{D}": "#x1D46B",
      "\\mathsfsl{l}": "#x1D62D",
      "\\ElsevierGlyph{300B}": "#x0300B",
      "\\cyrchar\\CYRY": "#x004AE",
      "\\ding{182}": "#x02776",
      "\\looparrowright": "#x021AC",
      "\\ding{46}": "#x0270E",
      "\\mathbf{a}": "#x1D41A",
      "\\mathmit{u}": "#x1D4FE",
      "\\mathsf{9}": "#x1D7EB",
      "\\mathsfbfsl{\\Pi}": "#x1D7B9",
      "\\mathslbb{H}": "#x1D573",
      "\\cyrchar\\CYRHRDSN": "#x0042A",
      "I": "#x00049",
      "\\hphantom{0}": "#x02007",
      "IJ": "#x00132",
      "{\\fontencoding{LECO}\\selectfont\\char220}": "#x0033C",
      "\\ding{227}": "#x027A3",
      "\\mathsfbf{i}": "#x1D5F6",
      "\\gnsim": "#x022E7",
      "\\ding{195}": "#x02783",
      "\\looparrowleft": "#x021AB",
      "\\mathsfsl{z}": "#x1D63B",
      "\\mathbf{\\Tau}": "#x1D6D5",
      "\\cyrchar\\CYRUK": "#x00478",
      "\\succnapprox": "#x02ABA",
      "\\cyrchar\\CYRJE": "#x00408",
      "\\Elzcirfb": "#x025D2",
      "\\mathfrak{d}": "#x1D521",
      "\\ding{117}": "#x025C6",
      "\\cyrchar\\CYRZH": "#x00416",
      "\\cyrchar\\CYRTETSE": "#x004B4",
      "\\original": "#x022B6",
      "\\mathsf{z}": "#x1D5D3",
      "\\mathtt{8}": "#x1D7FE",
      "\\mathmit{J}": "#x1D4D9",
      "\\mathbb{s}": "#x1D564",
      "\\ding{91}": "#x0273B",
      "\\rightharpoonup": "#x021C0",
      "\\Elzcirfl": "#x025D0",
      "\\cyrchar\\CYRNJE": "#x0040A",
      "\\=": "#x00304",
      "\\;": "#x02009-0200A-0200A",
      "\\&": "#x00026",
      "\\'": "#x00301",
      "\\ddot{\\iota}": "#x003CA",
      "\\%": "#x00025",
      "\\\"": "#x00308",
      "\\.": "#x00307",
      "\\ReverseUpEquilibrium": "#x0296F",
      "\\prec": "#x0227A",
      "\\not\\supset": "#x02285",
      "\\mathsfbfsl{Z}": "#x1D655",
      "\\cyrchar\\cyrtetse": "#x004B5",
      "\\^": "#x00302",
      "\\ding{177}": "#x02465",
      "\\Elzsbbrg": "#x0032A",
      "\\mathsfbf{M}": "#x1D5E0",
      "\\mathbf{w}": "#x1D430",
      "\\mathmit{x}": "#x1D501",
      "\\ding{86}": "#x02736",
      "\\H": "#x0030B",
      "\\v": "#x0030C",
      "\\cyrchar\\CYRFITA": "#x00472",
      "\\r": "#x0030A",
      "\\~": "#x00303",
      "\\^{C}": "#x00108",
      "\\c": "#x00327",
      "\\`": "#x00300",
      "\\trianglelefteq": "#x022B4",
      "\\textdoublepipe": "#x001C2",
      "\\k": "#x00328",
      "\\mathsfbf{\\Chi}": "#x1D786",
      "\\c{r}": "#x00157",
      "\\textturnk": "#x0029E",
      "\\mathsl{\\Iota}": "#x1D704",
      "\\mathsfbfsl{v}": "#x1D66B",
      "\\circleddash": "#x0229D",
      "\\ding{48}": "#x02710",
      "\\cyrchar\\CYRCHRDSC": "#x004B6",
      "\\ding{245}": "#x027B5",
      "\\textquestiondown": "#x000BF",
      "\\textdaggerdbl": "#x02021",
      "\\mathscr{b}": "#x1D4B7",
      "\\mathsl{f}": "#x1D453",
      "\\mathsfbf{\\Gamma}": "#x1D772",
      "\\ElzOr": "#x02A54",
      "\\mathfrak{r}": "#x1D52F",
      "\\cyrchar\\cyre": "#x00435",
      "\\gvertneqq": "#x02269-0FE00",
      "\\cyrchar\\CYRLJE": "#x00409",
      "\\mathsl{\\Xi}": "#x1D709",
      "\\Rightarrow": "#x021D2",
      "\\mathsf{6}": "#x1D7E8",
      "\\mathsfbf{\\Rho}": "#x1D780",
      "\\ding{100}": "#x02744",
      "\\cyrchar\\cyrgup": "#x00491",
      "\\mathsf{s}": "#x1D5CC",
      "\\mathbb{D}": "#x1D53B",
      "\\mercury": "#x0263F",
      "\\mathbit{c}": "#x1D484",
      "\\lozenge": "#x025CA",
      "\\mathsfbfsl{d}": "#x1D659",
      "\\cyrchar\\cyrng": "#x004A5",
      "\\mathfrak{N}": "#x1D511",
      "\\mathbit{\\Epsilon}": "#x1D73A",
      "\\sagittarius": "#x02650",
      "\\mathbf{L}": "#x1D40B",
      "\\mathtt{g}": "#x1D690",
      "\\mathslbb{e}": "#x1D58A",
      "\\mathfrak{g}": "#x1D524",
      "\\Kappa": "#x0039A",
      "\\mathbit{\\varpi}": "#x1D755",
      "\\succapprox": "#x02AB8",
      "\\c{R}": "#x00156",
      "\\mathfrak{b}": "#x1D51F",
      "\\taurus": "#x02649",
      "\\ElsevierGlyph{E381}": "#x025B1",
      "\\mathsfbf{3}": "#x1D7EF",
      "\\cyrchar\\CYRF": "#x00424",
      "\\ast": "#x0002A",
      "\\not\\approx": "#x02249",
      "\\mathsf{o}": "#x1D5C8",
      "\\not\\prec": "#x02280",
      "\\mathsl{\\Alpha}": "#x1D6FC",
      "\\mathscr{p}": "#x1D4C5",
      "\\mathsl{t}": "#x1D461",
      "J": "#x0004A",
      "\\Epsilon": "#x00395",
      "\\nleftrightarrow": "#x021AE",
      "\\cyrchar\\CYRH": "#x00425",
      "\\acute{\\iota}": "#x003AF",
      "\\v{c}": "#x0010D",
      "\\cyrchar\\cyry": "#x004AF",
      "\\mathbb{5}": "#x1D7DD",
      "\\surfintegral": "#x0222F",
      "\\Elztrnh": "#x00265",
      "\\gneq": "#x02A88",
      "\\aquarius": "#x02652",
      "\\mathtt{q}": "#x1D69A",
      "\\c{L}": "#x0013B",
      ">": "#x0003E",
      "\\setminus": "#x02216",
      "\\mathsl{\\Phi}": "#x1D711",
      "\\cyrchar\\cyrch": "#x00447",
      "\\mathsfbfsl{\\Tau}": "#x1D7BD",
      "\\llcorner": "#x0231E",
      "\\LeftVectorBar": "#x02952",
      "\\ding{58}": "#x0271A",
      "\\mathtt{X}": "#x1D687",
      "\\ding{194}": "#x02782",
      "\\mathsfbf{j}": "#x1D5F7",
      "\\mathsl{X}": "#x1D44B",
      "\\succcurlyeq": "#x0227D",
      "\\mathbit{N}": "#x1D475",
      "\\cyrchar\\CYROMEGATITLO": "#x0047C",
      "\\mathbf{R}": "#x1D411",
      "\\mathmit{E}": "#x1D4D4",
      "\\mathbit{g}": "#x1D488",
      "\\iota": "#x003B9",
      "\\cyrchar\\CYRZ": "#x00417",
      "\\ding{67}": "#x02723",
      "\\ElsevierGlyph{E20F}": "#x02929",
      "\\cyrchar\\CYRYI": "#x00407",
      "\\acute{\\eta}": "#x003AE",
      "\\mathscr{N}": "#x1D4A9",
      "\\leqq": "#x02266",
      "\\textnrleg": "#x0019E",
      "\\blacklozenge": "#x029EB",
      "\\ding{85}": "#x02735",
      "\\k{i}": "#x0012F",
      "\\Elzesh": "#x00283",
      "\\`{I}": "#x000CC",
      "\\mathbf{v}": "#x1D42F",
      "\\\"{o}": "#x000F6",
      "\\Elztrnt": "#x00287",
      "\\mathsfsl{E}": "#x1D60C",
      "\\textsection": "#x000A7",
      "\\mathbit{\\Phi}": "#x1D74B",
      "\\ntriangleleft": "#x022EA",
      "\\textasciiacute": "#x000B4",
      "\\mathsfbf{0}": "#x1D7EC",
      "{'}": "#x02032",
      "\\H{O}": "#x00150",
      "\\gnapprox": "#x02A8A",
      "\\mathsf{P}": "#x1D5AF",
      "\\mathsfbfsl{K}": "#x1D646",
      "\\varpi": "#x003D6",
      "\\mathsfsl{P}": "#x1D617",
      "\\mathslbb{I}": "#x1D574",
      "`": "#x02018",
      "\\cyrchar\\cyrkbeak": "#x004A1",
      "\\RightUpVectorBar": "#x02954",
      "\\\"{y}": "#x000FF",
      "\\ding{45}": "#x0270D",
      "\\simeq": "#x02243",
      "\\cyrchar\\CYRSHHA": "#x004BA",
      "\\ding{183}": "#x02777",
      "\\cyrchar\\CYRKVCRS": "#x0049C",
      "\\mathtt{B}": "#x1D671",
      "\\mathsf{2}": "#x1D7E4",
      "\\rightmoon": "#x0263E",
      "\\u{G}": "#x0011E",
      "\\mathsf{L}": "#x1D5AB",
      "\\ding{101}": "#x02745",
      "\\mathbit{\\varrho}": "#x1D754",
      "\\cyrchar\\CYRCH": "#x00427",
      "\\Tau": "#x003A4",
      "\\mathsfbf{P}": "#x1D5E3",
      "\\cyrchar\\cyryo": "#x00451",
      "\\mathsfsl{C}": "#x1D60A",
      "\\mathsl{P}": "#x1D443",
      "\\eth": "#x001AA",
      "\\mathsfbfsl{g}": "#x1D65C",
      "\\Beta": "#x00392",
      "\\mathsfbf{\\nabla}": "#x1D76F",
      "\\mathfrak{c}": "#x1D520",
      "\\dotplus": "#x02214",
      "\\perp": "#x022A5",
      "\\nsubseteqq": "#x02AC5-00338",
      "K": "#x0004B",
      "\\ding{92}": "#x0273C",
      "\\Elzsqspne": "#x022E5",
      "\\mathsfbfsl{\\Alpha}": "#x1D7AA",
      "\\'{y}": "#x000FD",
      "\\mathsf{7}": "#x1D7E9",
      "\\mathmit{w}": "#x1D500",
      "\\u{U}": "#x0016C",
      "\\Elzbtdl": "#x0026C",
      "\\mathsfbf{N}": "#x1D5E1",
      "\\cyrchar\\cyrf": "#x00444",
      "\\eqslantgtr": "#x02A96",
      "\\ding{176}": "#x02464",
      "\\Eta": "#x00397",
      "\\Elzsqfl": "#x025E7",
      "\\mathsf{Z}": "#x1D5B9",
      "\\mathsfsl{g}": "#x1D628",
      "\\mathsl{u}": "#x1D462",
      "\\Rsh": "#x021B1",
      "\\textfrac{1}{3}": "#x02153",
      "\\cyrchar\\cyrh": "#x00445",
      "{\\fontencoding{LELA}\\selectfont\\char91}": "#x00138",
      "\\mathtt{p}": "#x1D699",
      "\\mathbf{9}": "#x1D7D7",
      "\\L": "#x00141",
      "\\'{e}": "#x000E9",
      "\\DownRightVectorBar": "#x02957",
      "\\nsupseteqq": "#x02AC6-00338",
      "\\angle": "#x02220",
      "\\supseteqq": "#x02AC6",
      "\\u{I}": "#x0012C",
      "\\mathtt{W}": "#x1D686",
      "\\Elzltln": "#x00272",
      "\\textordmasculine": "#x000BA",
      "\\ding{244}": "#x027B4",
      "\\VDash": "#x022AB",
      "\\mathscr{a}": "#x1D4B6",
      "\\mathmit{q}": "#x1D4FA",
      "\\ElsevierGlyph{3018}": "#x03018",
      "\\`{U}": "#x000D9",
      "\\mathbit{\\Psi}": "#x1D74D",
      "\\mathbf{\\nabla}": "#x1D6C1",
      "\\ding{166}": "#x02766",
      "\\mathsl{g}": "#x1D454",
      "\\geq": "#x02265",
      "\\alpha": "#x003B1",
      "\\cyrchar\\CYRG": "#x00413",
      "v": "#x00076",
      "\\mathfrak{q}": "#x1D52E",
      "\\cyrchar\\CYRZHDSC": "#x00496",
      "\\ding{224}": "#x027A0",
      "\\approxnotequal": "#x02246",
      "\\upharpoonright": "#x021BE",
      "\\mathbf{\\Upsilon}": "#x1D6D6",
      "\\mathbf{Q}": "#x1D410",
      "\\mathmit{f}": "#x1D4EF",
      "\\ElsevierGlyph{E219}": "#x02937",
      "\\mathslbb{x}": "#x1D59D",
      "\\ding{66}": "#x02722",
      "\\mathbf{\\Alpha}": "#x1D6C2",
      "\\ElsevierGlyph{225F}": "#x0225F",
      "\\ElsevierGlyph{E260}": "#x029B5",
      "\\cyrchar\\CYRI": "#x00418",
      "\\uplus": "#x0228E",
      "\\bigtriangledown": "#x025BD",
      "\\cyrchar\\cyrz": "#x00437",
      "\\mathscr{M}": "#x02133",
      "\\mathsl{K}": "#x1D43E",
      "w": "#x00077",
      "{\\fontencoding{LELA}\\selectfont\\char202}": "#x00140",
      "\\openbracketright": "#x0301B",
      "\\AE": "#x000C6",
      "\\lambda": "#x003BB",
      "\\mathtt{f}": "#x1D68F",
      "ff": "#x0FB00",
      "\\int": "#x0222B",
      "fi": "#x0FB01",
      "\\not\\ni": "#x0220C",
      "fl": "#x0FB02",
      "\\mathbf{C}": "#x1D402",
      "a": "#x00061",
      "\\c{S}": "#x0015E",
      "\\mathbb{U}": "#x1D54C",
      "\\cyrchar\\CYRGUP": "#x00490",
      "\\subsetneqq": "#x02ACB",
      "\\ElsevierGlyph{E36E}": "#x02A55",
      "\\mathsfbf{4}": "#x1D7F0",
      "\\circlearrowright": "#x021BB",
      "\\textfrac{2}{3}": "#x02154",
      "\\mathbb{o}": "#x1D560",
      "\\mathsf{Q}": "#x1D5B0",
      "\\mathsfsl{n}": "#x1D62F",
      "\\mathrm{'Y}": "#x0038E",
      "\\mathsfbfsl{H}": "#x1D643",
      "\\mathbb{P}": "#x02119",
      "ffl": "#x0FB04",
      "ffi": "#x0FB03",
      "\\hspace{0.33em}": "#x02004",
      "\\mathbf{g}": "#x1D420",
      "\\cyrchar\\cyrzdsc": "#x00499",
      "\\textemdash": "#x02014",
      "\\hookleftarrow": "#x021A9",
      "\\mathslbb{N}": "#x1D579",
      "\\Lambda": "#x0039B",
      "\\openbracketleft": "#x0301A",
      "\\~{a}": "#x000E3",
      "\\ding{184}": "#x02778",
      "\\ding{44}": "#x0270C",
      "\\arrowwaveright": "#x0219D",
      "\\rho": "#x003C1",
      "\\infty": "#x0221E",
      "\\'{Z}": "#x00179",
      "L": "#x0004C",
      "\\ding{59}": "#x0271B",
      "\\mathsl{Y}": "#x1D44C",
      "\\precneqq": "#x02AB5",
      "\\gtrless": "#x02277",
      "\\mathmit{v}": "#x1D4FF",
      "{\\fontencoding{LECO}\\selectfont\\char184}": "#x00318",
      "\\mathsfbf{k}": "#x1D5F8",
      "\\flat": "#x0266D",
      "\\mathbit{\\Theta}": "#x1D73D",
      "\\Sigma": "#x003A3",
      "\\mathbit{O}": "#x1D72D",
      "\\v{N}": "#x00147",
      "\\image": "#x022B7",
      "\\k{I}": "#x0012E",
      "\\mkern1mu": "#x0200A",
      "\\mathsfbfsl{u}": "#x1D66A",
      "\\doteq": "#x02250",
      "\\Elzinglst": "#x00296",
      "\\ding{115}": "#x025B2",
      "\\ding{162}": "#x02762",
      "\\twoheadleftarrow": "#x0219E",
      "\\circledast": "#x0229B",
      "\\ding{93}": "#x0273D",
      "\\mathtt{S}": "#x1D682",
      "\\c{n}": "#x00146",
      "\\cyrchar\\CYRKBEAK": "#x004A0",
      "\\ni": "#x0220B",
      "\\mathfrak{G}": "#x1D50A",
      "\\mathbf{5}": "#x1D7D3",
      "\\ding{171}": "#x02660",
      "\\mathsfbf{O}": "#x1D5E2",
      "\\mathsf{C}": "#x1D5A2",
      "\\ding{84}": "#x02734",
      "\\mathbit{s}": "#x1D494",
      "\\mathsfbfsl{T}": "#x1D64F",
      "\\not\\sqsupseteq": "#x022E3",
      "\\mathsl{\\Psi}": "#x1D713",
      "\\~{o}": "#x000F5",
      "\\mathbf{u}": "#x1D42E",
      "\\mathmit{z}": "#x1D503",
      "\\uranus": "#x02645",
      "\\cyrchar\\CYRDJE": "#x00402",
      "\\vartriangleleft": "#x022B2",
      "\\'{H}": "#x00389",
      "\\mathsl{\\Zeta}": "#x1D701",
      "\\cyrchar\\cyrsdsc": "#x004AB",
      "\\Elzdyogh": "#x002A4",
      "\\mathmit{o}": "#x1D4F8",
      "\\nvDash": "#x022AD",
      "\\swarrow": "#x02199",
      "\\ding{243}": "#x027B3",
      "\\mathsfbfsl{p}": "#x1D665",
      "\\mathsl{d}": "#x1D451",
      "\\Bumpeq": "#x0224E",
      "\\cyrchar\\CYRNG": "#x004A4",
      "\"": "#x00022",
      "\\Elzlmrk": "#x002D0",
      "\\cyrchar\\cyrg": "#x00433",
      "\\cyrchar\\CYRTSHE": "#x0040B",
      "\\cyrchar\\cyrchldsc": "#x004CC",
      "\\mathfrak{p}": "#x1D52D",
      "\\cyrchar\\cyrphk": "#x004A7",
      "\\mathbf{\\Delta}": "#x1D6C5",
      "\\mathtt{A}": "#x1D670",
      "\\notgreaterless": "#x02279",
      "\\rightthreetimes": "#x022CC",
      "\\mathsfsl{B}": "#x1D609",
      "\\Elzltlmr": "#x00271",
      "\\mathsf{M}": "#x1D5AC",
      "\\ding{102}": "#x02746",
      "\\cyrchar\\cyri": "#x00438",
      "\\mathbin{{:}\\!\\!{-}\\!\\!{:}}": "#x0223A",
      "\\mathsl{v}": "#x1D463",
      "\\mathsfbfsl{f}": "#x1D65B",
      "b": "#x00062",
      "\\mathbb{B}": "#x1D539",
      "\\diamond": "#x02662",
      "\\mathsfbf{Q}": "#x1D5E4",
      "\\vdots": "#x022EE",
      "i": "#x00069",
      "\\cyrchar\\CYRRTICK": "#x0048E",
      "\\mathbit{a}": "#x1D482",
      "\\circ": "#x02218",
      "\\mathbf{\\Psi}": "#x1D6D9",
      "\\mathfrak{L}": "#x1D50F",
      "\\cyrchar\\CYRIOTLYUS": "#x00468",
      "\\dh": "#x000F0",
      "\\not\\in": "#x02209",
      "\\r{U}": "#x0016E",
      "\\ldots": "#x02026",
      "\\cyrchar\\CYRSDSC": "#x004AA",
      "\\Elzlpargt": "#x029A0",
      "{\\fontencoding{LELA}\\selectfont\\char47}": "#x00166",
      "\\OE": "#x00152",
      "\\ding{209}": "#x02791",
      "\\mathslbb{k}": "#x1D590",
      "\\mathbf{B}": "#x1D401",
      "\\mathtt{e}": "#x1D68E",
      "\\cyrchar\\cyrhdsc": "#x004B3",
      "\\mathsfbf{\\varrho}": "#x1D78E",
      "\\mathsfbf{5}": "#x1D7F1",
      "\\mathbf{\\vartheta}": "#x1D6DD",
      "\\kappa": "#x003BA",
      "\\mathbb{n}": "#x1D55F",
      "\\mathmit{O}": "#x1D4DE",
      "\\mathbit{I}": "#x1D470",
      "M": "#x1D7B5",
      "\\ding{238}": "#x027AE",
      "\\mathsl{z}": "#x1D467",
      "\\mathbf{\\Iota}": "#x1D6CA",
      "\\mathsl{\\Delta}": "#x1D6FF",
      "\\ding{254}": "#x027BE",
      "\\Elzpbgam": "#x00264",
      "\\cyrchar\\cyrii": "#x00456",
      "\\mathtt{w}": "#x1D6A0",
      "\\ElsevierGlyph{3019}": "#x03019",
      "\\Elzrtll": "#x0026D",
      "\\mathsl{\\varrho}": "#x1D71A",
      "\\jupiter": "#x02643",
      "\\mathbb{3}": "#x1D7DB",
      "\\Elzopeno": "#x00254",
      "\\mathscr{Z}": "#x1D4B5",
      "\\textthreequarters": "#x000BE",
      "{''}": "#x02033",
      "{\\fontencoding{LECO}\\selectfont\\char225}": "#x00361",
      "\\approx": "#x02248",
      "\\ElzLap": "#x029CA",
      "\\ll": "#x0226A",
      "\\cyrchar\\CYROT": "#x0047E",
      "\\lmoustache": "#x023B0",
      "\\ding{72}": "#x02605",
      "\\mathsfbf{l}": "#x1D5F9",
      "\\mathslbb{y}": "#x1D59E",
      "\\mathbf{P}": "#x1D40F",
      "\\mathtt{k}": "#x1D694",
      "\\mathbit{L}": "#x1D473",
      "\\mathfrak{Z}": "#x02128",
      "\\u{\\i}": "#x0012D",
      "\\cyrchar\\CYRYO": "#x00401",
      "{^1}": "#x000B9",
      "\\ding{61}": "#x0271D",
      "\\succ": "#x0227B",
      "\\ding{216}": "#x02798",
      "\\aa": "#x000E5",
      "\\curlyeqprec": "#x022DE",
      "\\fallingdotseq": "#x02252",
      "\\ding{236}": "#x027AC",
      "\\textdagger": "#x02020",
      "\\^{h}": "#x00125",
      "\\mathsl{\\Kappa}": "#x1D705",
      "x": "#x00078",
      "\\mathbit{p}": "#x1D491",
      "\\NotNestedLessLess": "#x02AA1-00338",
      "\\hphantom{,}": "#x02008",
      "\\mathsfbfsl{W}": "#x1D652",
      "\\Pisymbol{ppi020}{117}": "#x02A9D",
      "\\mathbf{t}": "#x1D42D",
      "\\~{n}": "#x000F1",
      "\\textfrac{4}{5}": "#x02158",
      "\\Elztrnr": "#x00279",
      "\\mathslbb{R}": "#x1D57D",
      "\\Elzverti": "#x002CC",
      "\\mathbit{\\Rho}": "#x1D746",
      "\\LeftDownVectorBar": "#x02959",
      "\\mathsl{G}": "#x1D43A",
      "\\ding{54}": "#x02716",
      "\\'{I}": "#x000CD",
      "\\nrightarrow": "#x0219B",
      "\\Leftarrow": "#x021D0",
      "\\u{e}": "#x00115",
      "\\Longleftarrow": "#x027F8",
      "\\mathsfsl{a}": "#x1D622",
      "\\mathsf{R}": "#x1D5B1",
      "\\Gamma": "#x00393",
      "\\mathbit{B}": "#x1D469",
      "\\mathsfbfsl{E}": "#x1D640",
      "\\circledS": "#x024C8",
      "\\mathbf{f}": "#x1D41F",
      "c": "#x00063",
      "\\Elzpupsil": "#x0028A",
      "\\mathslbb{O}": "#x1D57A",
      "\\Sampi": "#x003E0",
      "\\cyrchar\\CYRUSHRT": "#x0040E",
      "\\cyrchar\\cyrshch": "#x00449",
      "\\ding{43}": "#x0261E",
      "\\'{u}": "#x000FA",
      "\\ding{103}": "#x02747",
      "\\mathsf{N}": "#x1D5AD",
      "\\mathbb{A}": "#x1D538",
      "\\mathmit{a}": "#x1D4EA",
      "\\mathsf{A}": "#x1D5A0",
      "\\mathsfbfsl{a}": "#x1D656",
      "\\`{E}": "#x000C8",
      "\\wp": "#x02118",
      "\\mathslbb{S}": "#x1D57E",
      "\\measuredangle": "#x02221",
      "\\ding{63}": "#x0271F",
      "\\mathbit{f}": "#x1D487",
      "\\ding{218}": "#x0279A",
      "\\#": "#x00023",
      "\\~{\\i}": "#x00129",
      "\\LeftUpVectorBar": "#x02958",
      "\\varsupsetneq": "#x0228B-0FE00",
      "\\ding{114}": "#x02752",
      "\\mathfrak{a}": "#x1D51E",
      "\\ding{163}": "#x02763",
      "N": "#x1D7B6",
      "\\mathmit{C}": "#x1D4D2",
      "\\mathsf{0}": "#x1D7E2",
      "\\RightDownVectorBar": "#x02955",
      "\\ding{94}": "#x0273E",
      "\\mathtt{R}": "#x1D681",
      "\\={A}": "#x00100",
      "\\twoheadrightarrow": "#x021A0",
      "\\mathsf{B}": "#x1D5A1",
      "\\dashv": "#x022A3",
      "\\sqsupseteq": "#x02292",
      "\\ding{170}": "#x02665",
      "\\Elzrtls": "#x00282",
      "\\mathslbb{W}": "#x1D582",
      "\\mathsl{s}": "#x1D460",
      "\\NotLeftTriangleBar": "#x029CF-00338",
      "\\k{A}": "#x00104",
      "\\hspace{0.166em}": "#x02006",
      "\\cyrchar\\cyrabhha": "#x004A9",
      "\\ding{239}": "#x027AF",
      "\\cyrchar\\CYRSHCH": "#x00429",
      "\\mathtt{v}": "#x1D69F",
      "\\cyrchar\\cyrabhchdsc": "#x004BF",
      "\\mathbf{3}": "#x1D7D1",
      "\\ominus": "#x02296",
      "\\nu": "#x003BD",
      "\\'{c}": "#x00107",
      "\\zeta": "#x003B6",
      "\\ElsevierGlyph{22C1}": "#x022C1",
      "\\ding{242}": "#x027B2",
      "\\mathsf{l}": "#x1D5C5",
      "\\mathsl{e}": "#x1D452",
      "\\mathbit{\\vartheta}": "#x1D751",
      "\\mathsfbfsl{s}": "#x1D668",
      "\\mathscr{o}": "#x02134",
      "\\nexists": "#x02204",
      "\\mathfrak{o}": "#x1D52C",
      "\\mathsfbfsl{\\phi}": "#x1D7C7",
      "\\\"{A}": "#x000C4",
      "\\mathsfbfsl{\\Lambda}": "#x1D7B4",
      "\\mathmit{Q}": "#x1D4E0",
      "\\supsetneqq": "#x02ACC",
      "\\bowtie": "#x022C8",
      "y": "#x00079",
      "\\ElsevierGlyph{E838}": "#x0233D",
      "\\Elzsqfr": "#x025E8",
      "\\Vvdash": "#x022AA",
      "\\mathsfbf{8}": "#x1D7F4",
      "\\ding{217}": "#x02799",
      "\\ding{60}": "#x0271C",
      "\\cyrchar\\CYRK": "#x0041A",
      "\\mathsfbf{\\Tau}": "#x1D783",
      "\\mathbf{j}": "#x1D423",
      "\\^{g}": "#x0011D",
      "\\Downarrow": "#x021D3",
      "\\mathbit{m}": "#x1D48E",
      "\\ding{237}": "#x027AD",
      "\\cyrchar\\cyrlyus": "#x00467",
      "\\mathbf{\\varrho}": "#x1D6E0",
      "\\mathbit{\\Gamma}": "#x1D738",
      "\\={o}": "#x0014D",
      "\\mathbit{v}": "#x1D497",
      "\\mathbit{\\nabla}": "#x1D735",
      "\\ding{208}": "#x02790",
      "\\vee": "#x02228",
      "\\mathfrak{K}": "#x1D50E",
      "\\mathsf{i}": "#x1D5C2",
      "\\u": "#x00306",
      "\\cyrchar\\CYRBYUS": "#x0046A",
      "\\mathbf{A}": "#x1D400",
      "\\mathtt{d}": "#x1D68D",
      "\\nleqslant": "#x02A7D-00338",
      "\\mathslbb{h}": "#x1D58D",
      "d": "#x00064",
      "\\hermitconjmatrix": "#x022B9",
      "\\textsterling": "#x000A3",
      "\\mathbb{m}": "#x1D55E",
      "\\^{y}": "#x00177",
      "\\mathsfbf{6}": "#x1D7F2",
      "\\space": "#x00020",
      "\\mathsfsl{W}": "#x1D61E",
      "\\mathbf{\\Gamma}": "#x1D6C4",
      "\\mathsf{S}": "#x1D5B2",
      "\\mathbf{\\Rho}": "#x1D6D2",
      "\\mathbit{C}": "#x1D46A",
      "\\NotHumpEqual": "#x0224F-00338",
      "\\mathsfbfsl{D}": "#x1D63F",
      "\\Psi": "#x003A8",
      "\\v{Z}": "#x0017D",
      "\\ding{186}": "#x0277A",
      "\\backsimeq": "#x022CD",
      "\\mathbf{e}": "#x1D41E",
      "\\mathmit{j}": "#x1D4F3",
      "\\cyrchar\\cyrhundredthousands": "#x00488",
      "\\ding{42}": "#x0261B",
      "t": "#x00074",
      "\\upslopeellipsis": "#x022F0",
      "O": "#x1D7B8",
      "\\lazysinv": "#x0223E",
      "\\={a}": "#x00101",
      "\\mathscr{Y}": "#x1D4B4",
      "\\scorpio": "#x0264F",
      "\\r{}": "#x002DA",
      "\\mathfrak{Y}": "#x1D51C",
      "\\ding{199}": "#x02787",
      "\\mathsfbf{m}": "#x1D5FA",
      "\\in": "#x02208",
      "\\mathbf{W}": "#x1D416",
      "\\mathtt{j}": "#x1D693",
      "\\saturn": "#x02644",
      "\\lfloor": "#x0230A",
      "\\cong": "#x02245",
      "\\ddddot": "#x020DC",
      "\\mathtt{Q}": "#x1D680",
      "\\c{l}": "#x0013C",
      "\\ding{95}": "#x0273F",
      "\\longmapsto": "#x027FC",
      "\\RightTriangleBar": "#x029D0",
      "..": "#x02025",
      "\\pm": "#x000B1",
      "\\Elzdlcorn": "#x023A3",
      "\\mathsfbfsl{V}": "#x1D651",
      "\\={E}": "#x00112",
      "\\mathsfbf{A}": "#x1D5D4",
     ":": "#x0003A",
      "\\nleftarrow": "#x0219A",
      "\\ding{173}": "#x02461",
      "\\mathscr{V}": "#x1D4B1",
      "\\verymuchgreater": "#x022D9",
      "\\mathbb{Y}": "#x1D550",
      "\\mathbf{k}": "#x1D424",
      "\\complement": "#x02201",
      "\\downdownarrows": "#x021CA",
      "\\mathbit{q}": "#x1D492",
      "\\texthvlig": "#x00195",
      "\\bumpeq": "#x0224F",
      "\\mathscr{W}": "#x1D4B2",
      "\\ding{55}": "#x02717",
      "\\ding{232}": "#x027A8",
      "\\mathsf{y}": "#x1D5D2",
      "m": "#x0006D",
      "\\ding{241}": "#x027B1",
      "\\Elorarr": "#x02941",
      "\\ddot{\\upsilon}": "#x003CB",
      "\\mathbb{R}": "#x0211D",
      "\\diagup": "#x02571",
      "\\^{J}": "#x00134",
      "\\mathscr{n}": "#x1D4C3",
      "\\mathsfbfsl{r}": "#x1D667",
      "\\mathsl{j}": "#x1D457",
      "\\ding{119}": "#x025D7",
      "\\mathfrak{n}": "#x1D52B",
      "\\gimel": "#x02137",
      "\\~{I}": "#x00128",
      "\\mathmit{P}": "#x1D4DF",
      "\\Elzddfnc": "#x02999",
      "\\mathtt{G}": "#x1D676",
      "\\Elzrtlr": "#x0027D",
      "{\\fontencoding{LEIP}\\selectfont\\char61}": "#x00258",
      "\\not\\equiv": "#x02262",
      "\\ding{104}": "#x02748",
      "\\int\\!\\int": "#x0222C",
      "\\mathmit{Y}": "#x1D4E8",
      "\\Elzhlmrk": "#x002D1",
      "\\`{\\i}": "#x000EC",
      "\\mathsfbf{S}": "#x1D5E6",
      "\\mathsfsl{D}": "#x1D60B",
      "\\cyrchar\\cyrk": "#x0043A",
      "\\Elolarr": "#x02940",
      "\\cyrchar\\CYRNHK": "#x004C7",
      "\\mathsf{O}": "#x1D5AE",
      "\\ElsevierGlyph{E25B}": "#x02A2A",
      "e": "#x00065",
      "\\cyrchar\\CYRIZH": "#x00474",
      "\\mathbf{y}": "#x1D432",
      "\\O": "#x000D8",
      "\\mathmit{N}": "#x1D4DD",
      "\\mathmit{y}": "#x1D502",
      "\\mathslbb{P}": "#x1D57B",
      "\\hookrightarrow": "#x021AA",
      "\\mathslbb{i}": "#x1D58E",
      "\\cyrchar\\cyrpsi": "#x00471",
      "\\dj": "#x00111",
      "\\mathfrak{J}": "#x1D50D",
      "\\mathbit{E}": "#x1D46C",
      "\\textquotesingle": "#x00027",
      "\\star": "#x022C6",
      "\\lesseqqgtr": "#x02A8B",
      "\\mathsf{k}": "#x1D5C4",
      "\\mathbb{l}": "#x1D55D",
      "\\RightDownTeeVector": "#x0295D",
      "\\nmid": "#x02224",
      "\\mathscr{J}": "#x1D4A5",
      "\\RightUpDownVector": "#x0294F",
      "\\mathsfbf{7}": "#x1D7F3",
      "\\mathsl{x}": "#x1D465",
      "\\mathsfsl{x}": "#x1D639",
      "\\mathsfbfsl{\\varkappa}": "#x1D7C6",
      "P": "#x00050",
      "\\cyrchar\\CYRL": "#x0041B",
      "\\mathbf{\\Chi}": "#x1D6D8",
      "\\doteqdot": "#x02251",
      "\\bigcap": "#x022C2",
      "\\cyrchar\\CYROMEGARND": "#x0047A",
      "\\texttrademark": "#x02122",
      "\\Elzrtln": "#x00273",
      "\\mathbb{1}": "#x1D7D9",
      "\\Elzpalh": "#x00321",
      "\\mathbf{2}": "#x1D7D0",
      "\\mathtt{u}": "#x1D69E",
      "\\cyrchar\\textnumero": "#x02116",
      "\\not\\succ": "#x02281",
      "\\ElsevierGlyph{22C0}": "#x022C0",
      "\\mathsf{t}": "#x1D5CD",
      "\\mathmit{m}": "#x1D4F6",
      "\\circeq": "#x02257",
      "\\'{Y}": "#x000DD",
      "\\u{u}": "#x0016D",
      "\\mathsfbf{n}": "#x1D5FB",
      "\\leftleftarrows": "#x021C7",
      "\\ding{198}": "#x02786",
      "\\mathsfsl{q}": "#x1D632",
      "\\mathrm{'\\Omega}": "#x0038F",
      "\\rbrace": "#x0007D",
      "\\mathfrak{X}": "#x1D51B",
      "\\mathbit{R}": "#x1D479",
      "{\\fontencoding{LECO}\\selectfont\\char218}": "#x0033A",
      "\\ding{70}": "#x02726",
      "\\mathbf{V}": "#x1D415",
      "\\mathtt{i}": "#x1D692",
      "\\mathscr{O}": "#x1D4AA",
      ";": "#x0003B",
      "\\leftrightarrows": "#x021C6",
      "{\\fontencoding{LECO}\\selectfont\\char185}": "#x00319",
      "{^3}": "#x000B3",
      "\\mathsfbf{\\phi}": "#x1D78D",
      "\\ElsevierGlyph{E214}": "#x0297C",
      "\\Alpha": "#x00391",
      "\\mathbb{z}": "#x1D56B",
      "\\mathsfbf{9}": "#x1D7F5",
      "\\mathtt{C}": "#x1D672",
      "\\mathsl{\\Omega}": "#x1D714",
      "\\H{o}": "#x00151",
      "\\hslash": "#x0210F",
      "\\ding{234}": "#x027AA",
      "\\mathsl{N}": "#x1D441",
      "\\mathsl{\\Theta}": "#x1D703",
      "\\ElOr": "#x02A56",
      "\\mathmit{U}": "#x1D4E4",
      "\\ding{79}": "#x0272F",
      "\\Elzbar": "#x00336",
      "\\not\\kern-0.3em\\times": "#x0226D",
      "\\cyrchar\\CYRDZE": "#x00405",
      "\\ding{105}": "#x02749",
      "\\mathslbb{C}": "#x1D56E",
      "\\lnapprox": "#x02A89",
      "\\ding{89}": "#x02739",
      "\\cyrchar\\cyruk": "#x00479",
      "\\ElzCint": "#x02A0D",
      "\\mathsfbfsl{\\nabla}": "#x1D7A9",
      "\\mathbf{\\Sigma}": "#x1D6D4",
      "\\.{Z}": "#x0017B",
      "{{/}\\!\\!{/}}": "#x02AFD",
      "\\NotLessLess": "#x0226A-00338",
      "\\leftrightarrow": "#x02194",
      "\\k{}": "#x002DB",
      "\\ding{56}": "#x02718",
      "\\u{g}": "#x0011F",
      "\\mathsl{R}": "#x1D445",
      "\\Elzclomeg": "#x00277",
      "\\NotPrecedesTilde": "#x0227E-00338",
      "\\sqsubseteq": "#x02291",
      "\\rtimes": "#x022CA",
      "\\mathsfbf{p}": "#x1D5FD",
      "\\l": "#x00142",
      "\\mathsfsl{c}": "#x1D624",
      "\\cyrchar\\CYRSH": "#x00428",
      "\\cyrchar\\cyrchvcrs": "#x004B9",
      "\\mathsfbfsl{G}": "#x1D642",
      "\\ding{187}": "#x0277B",
      "\\sqrint": "#x02A16",
      "\\ding{41}": "#x02709",
      "f": "#x00192",
      "\\mathbf{d}": "#x1D41D",
      "\\mathslbb{M}": "#x1D578",
      "\\ding{38}": "#x02706",
      "\\vartriangleright": "#x022B3",
      "\\mathbit{\\Omega}": "#x1D74E",
      "\\acute{\\ddot{\\upsilon}}": "#x003B0",
      "\\c{s}": "#x0015F",
      "\\mathsfsl{r}": "#x1D633",
      "\\'{s}": "#x0015B",
      "\\mathsfbf{T}": "#x1D5E7",
      "\\mathsf{H}": "#x1D5A7",
      "\\mathbb{O}": "#x1D546",
      "\\cyrchar\\cyrthousands": "#x00482",
      "\\ElsevierGlyph{E25C}": "#x02A2D",
      "\\curlywedge": "#x022CF",
      "\\virgo": "#x0264D",
      "\\mathsfbfsl{c}": "#x1D658",
      "\\wr": "#x02240",
      "\\ding{161}": "#x02761",
      "\\mathslbb{Q}": "#x1D57C",
      "\\'{r}": "#x00155",
      "\\texttildelow": "#x002DC",
      "\\mathbf{x}": "#x1D431",
      "\\mathtt{3}": "#x1D7F9",
      "\\gneqq": "#x02269",
      "\\acute{\\upsilon}": "#x003CD",
      "\\ding{96}": "#x02740",
      "\\textfrac{5}{8}": "#x0215D",
      "\\cyrchar\\cyrya": "#x0044F",
      "\\textpertenthousand": "#x02031",
      "\\cyrchar\\cyrishrt": "#x00439",
      "Q": "#x00051",
      "\\'{E}": "#x00388",
      "\\mathsl{A}": "#x1D434",
      "\\mathbit{d}": "#x1D485",
      "\\mathsfbf{\\Kappa}": "#x1D779",
      "\\c{}": "#x000B8",
      "\\mathsfsl{U}": "#x1D61C",
      "\\forall": "#x02200",
      "\\ElsevierGlyph{2275}": "#x02275",
      "\\mathsfbfsl{\\Omega}": "#x1D7C2",
      "\\mathsfbfsl{Q}": "#x1D64C",
      "\\ding{172}": "#x02460",
      "\\mathsfbf{B}": "#x1D5D5",
      "\\cyrchar\\cyrerev": "#x0044D",
      "\\DH": "#x000D0",
      "\\cyrchar\\cyrl": "#x0043B",
      "\\Elzinvv": "#x0028C",
      "X": "#x00058",
      "\\mathbb{0}": "#x1D7D8",
      "\\mathbf{1}": "#x1D7CF",
      "\\mathtt{t}": "#x1D69D",
      "\\Elzrais": "#x002D4",
      "\\mathsfsl{I}": "#x1D610",
      "\\leftharpoondown": "#x021BD",
      "<": "#x0003C",
      "\\mathsfbfsl{m}": "#x1D662",
      "\\cyrchar\\cyrlje": "#x00459",
      "\\^{I}": "#x000CE",
      "\\geqslant": "#x02A7E",
      "\\Elztesh": "#x002A7",
      "\\Elztrnmlr": "#x00270",
      "\\mathscr{m}": "#x1D4C2",
      "\\mathsl{k}": "#x1D458",
      "\\textperthousand": "#x02030",
      "\\mathfrak{m}": "#x1D52A",
      "\\guillemotright": "#x000BB",
      "\\mathscr{L}": "#x02112",
      "\\ding{118}": "#x02756",
      "\\mathtt{F}": "#x1D675",
      "\\textexclamdown": "#x000A1",
      "\\mathmit{A}": "#x1D4D0",
      "{^2}": "#x000B2",
      "\\backprime": "#x02035",
      "\\NotNestedGreaterGreater": "#x02AA2-00338",
      "\\mathsf{j}": "#x1D5C3",
      "\\cyrchar\\CYRM": "#x0041C",
      "\\Lsh": "#x021B0",
      "\\ElsevierGlyph{E215}": "#x0297D",
      "\\ding{62}": "#x0271E",
      "\\ding{219}": "#x0279B",
      "\\mathbb{y}": "#x1D56A",
      "\\mathsl{O}": "#x1D442",
      "\\mathtt{P}": "#x1D67F",
      "\\^{e}": "#x000EA",
      "\\^{c}": "#x00109",
      "\\ElzSup": "#x02A08",
      "\\mathscr{I}": "#x02110",
      "\\k{U}": "#x00172",
      "\\ding{235}": "#x027AB",
      "\\mathbit{\\Xi}": "#x1D743",
      "\\mathfrak{I}": "#x02111",
      "\\Elzlow": "#x002D5",
      "\\mathbf{G}": "#x1D406",
      "\\mathtt{z}": "#x1D6A3",
      "\\mathslbb{n}": "#x1D593",
      "\\mathsf{4}": "#x1D7E6",
      "\\mathsl{H}": "#x1D43B",
      "\\nVDash": "#x022AF",
      "\\leftarrow": "#x02190",
      "\\AA": "#x0212B",
      "\\mathbb{k}": "#x1D55C",
      "g": "#x00261",
      "\\guillemotleft": "#x000AB",
      "\\cyrchar\\CYREREV": "#x0042D",
      "\\mathsf{d}": "#x1D5BD",
      "\\^{w}": "#x00175",
      "\\mathsl{y}": "#x1D466",
      "\\mathsfbfsl{\\Upsilon}": "#x1D7BE",
      "\\mathsf{3}": "#x1D7E5",
      "\\mathsfbfsl{F}": "#x1D641",
      "\\mathsfbf{\\Zeta}": "#x1D775",
      "\\'{$\\alpha$}": "#x003AC",
      "\\mathsfbf{q}": "#x1D5FE",
      "\\downslopeellipsis": "#x022F1",
      "\\mathslbb{r}": "#x1D597",
      "\\Elzdshfnc": "#x02506",
      "\\hspace{0.6em}": "#x02002",
      "\\ElsevierGlyph{2242}": "#x02242",
      "\\mathsl{\\Tau}": "#x1D70F",
      "\\mathbit{A}": "#x1D468",
      "\\textparagraph": "#x000B6",
      "\\ding{40}": "#x02708",
      "\\Longleftrightarrow": "#x027FA",
      "\\mathmit{l}": "#x1D4F5",
      "\\Elztrna": "#x00250",
      "\\ding{188}": "#x0277C",
      "\\ding{39}": "#x02707",
      "\\mathbb{w}": "#x1D568",
      "\\mathscr{G}": "#x1D4A2",
      "\\RightTeeVector": "#x0295B",
      "\\ElzInf": "#x02A07",
      "R": "#x00052",
      "\\mathsfbf{o}": "#x1D5FC",
      "\\ding{71}": "#x02727",
      "\\Iota": "#x00399",
      "\\mathbit{\\Kappa}": "#x1D73F",
      "\\mathsfsl{p}": "#x1D631",
      "\\curvearrowleft": "#x021B6",
      "{\\fontencoding{LECO}\\selectfont\\char219}": "#x0033B",
      "\\mathbit{S}": "#x1D47A",
      "\\mathfrak{W}": "#x1D51A",
      "\\leq": "#x02264",
      "\\gamma": "#x003B3",
      "\\mathbf{U}": "#x1D414",
      "\\cyrchar\\cyriote": "#x00465",
      "\\ding{97}": "#x02741",
      "\\mathmit{F}": "#x1D4D5",
      "\\dddot": "#x020DB",
      "\\mathbf{\\Pi}": "#x1D6D1",
      "\\aleph": "#x02135",
      "\\Elzrl": "#x0027C",
      "\\mathbit{\\Delta}": "#x1D739",
      "\\Elzvrecto": "#x025AF",
      "\\mathsfbf{C}": "#x1D5D6",
      "\\not\\doteq": "#x02250-00338",
      "\\downharpoonleft": "#x021C3",
      "\\mathsfsl{T}": "#x1D61B",
      "\\cyrchar\\CYRGHK": "#x00494",
      "\\mathsfbfsl{P}": "#x1D64B",
      "\\ding{88}": "#x02738",
      "\\nwarrow": "#x02196",
      "=": "#x0003D",
      "\\textquotedblright": "#x0201D",
      "\\cyrchar\\cyrhrdsn": "#x0044A",
      "\\cyrchar\\CYRKOPPA": "#x00480",
      "\\cyrchar\\CYRLYUS": "#x00466",
      "\\Elzyogh": "#x00292",
      "\\mathbit{w}": "#x1D498",
      "\\ElsevierGlyph{2233}": "#x02233",
      "\\libra": "#x0264E",
      "\\Leftrightarrow": "#x021D4",
      "\\mathsfbf{\\vartheta}": "#x1D78B",
      "\\Elztrnsa": "#x00252",
      "\\mathscr{U}": "#x1D4B0",
      "\\mathsl{S}": "#x1D446",
      "\\textasciidieresis": "#x000A8",
      "\\cyrchar\\cyrkhk": "#x004C4",
      "\\ding{57}": "#x02719",
      "\\mathsfbfsl{l}": "#x1D661",
      "\\Elzxl": "#x00335",
      "\\mathscr{l}": "#x1D4C1",
      "\\^{H}": "#x00124",
      "\\textdollar": "#x00024",
      "\\cyrchar\\cyrje": "#x00458",
      "\\mathmit{R}": "#x1D4E1",
      "\\eta": "#x003B7",
      "\\cyrchar\\CYRIOTE": "#x00464",
      "\\mathfrak{l}": "#x1D529",
      "\\vert": "#x0007C",
      "\\r{u}": "#x0016F",
      "\\mathslbb{D}": "#x1D56F",
      "\\cyrchar\\cyrdzhe": "#x0045F",
      "\\mathtt{E}": "#x1D674",
      "\\supseteq": "#x02287",
      "\\mathmit{r}": "#x1D4FB",
      "\\ding{106}": "#x0274A",
      "=:": "#x02255",
      "\\cyrchar\\cyrm": "#x0043C",
      "\\upharpoonleft": "#x021BF",
      "\\Elzinvw": "#x0028D",
      "\\mathsfbf{U}": "#x1D5E8",
      "\\mathsf{I}": "#x1D5A8",
      "\\mathbb{N}": "#x02115",
      "\\texttheta": "#x003B8",
      "\\ding{126}": "#x0275E",
      "\\mathbit{e}": "#x1D486",
      "h": "#x00068",
      "\\mathbf{\\Omega}": "#x1D6DA",
      "\\Elroang": "#x02986",
      "\\rule{1em}{1pt}": "#x02015",
      "\\mathsfbfsl{b}": "#x1D657",
      "\\textbullet": "#x02022",
      "\\.{g}": "#x00121",
      "\\succeq": "#x02AB0",
      "\\v{n}": "#x00148",
      "\\mathsfbfsl{\\Chi}": "#x1D7C0",
      "\\mathtt{2}": "#x1D7F8",
      "\\mathslbb{V}": "#x1D581",
      "\\mathbf{F}": "#x1D405",
      "\\mathtt{y}": "#x1D6A2",
      "\\varkappa": "#x003F0",
      "j": "#x0006A",
      "\\mathslbb{o}": "#x1D594",
      "\\not\\subset": "#x02284",
      "\\textasciicaron": "#x002C7",
      "\\acute{\\epsilon}": "#x003AD",
      "{_\\ast}": "#x02217",
      "\\estimates": "#x02259",
      "{\\fontencoding{LELA}\\selectfont\\char63}": "#x00167",
      "\\ding{221}": "#x0279D",
      "\\mathbb{j}": "#x1D55B",
      "\\mathsf{e}": "#x1D5BE",
      "{\\rlap{\\textbackslash}{{/}\\!\\!{/}}}": "#x02AFD-020E5",
      "\\mathscr{z}": "#x1D4CF",
      "\\textfrac{1}{6}": "#x02159",
      "\\ElsevierGlyph{E21D}": "#x02933-00338",
      "\\male": "#x02642",
      "\\preccurlyeq": "#x0227C",
      "\\ding{250}": "#x027BA",
      "\\varnothing": "#x02205",
      "S": "#x00053",
      "\\rightsquigarrow": "#x021DD",
      "\\mathbf{0}": "#x1D7CE",
      "\\mathtt{K}": "#x1D67A",
      "\\precnapprox": "#x02AB9",
      "\\mathfrak{z}": "#x1D537",
      "\\'{n}": "#x00144",
      "\\Elzxrat": "#x0211E",
      "\\mathsfbfsl{\\Eta}": "#x1D7B0",
      "\\ding{108}": "#x025CF",
      "\\mathsl{\\Beta}": "#x1D6FD",
      "\\mathbf{b}": "#x1D41B",
      "\\mathsfbfsl{t}": "#x1D669",
      "\\mathsfsl{H}": "#x1D60F",
      "\\cyrchar\\cyrotld": "#x004E9",
      "\\mathsl{\\Chi}": "#x1D712",
      "\\NotSucceedsTilde": "#x0227F-00338",
      "\\mathscr{F}": "#x02131",
      "\\mathsl{\\vartheta}": "#x1D717",
      "\\mathsl{B}": "#x1D435",
      "\\'{a}": "#x000E1",
      "\\ding{76}": "#x0272C",
      "\\cyrchar\\cyrsemisftsn": "#x0048D",
      "\\mathtt{n}": "#x1D697",
      "\\mathsfsl{s}": "#x1D634",
      "\\mathbit{P}": "#x1D477",
      "\\sum": "#x02211",
      "\\ElsevierGlyph{E372}": "#x029DC",
      "\\ding{203}": "#x0278B",
      "\\vartriangle": "#x025B5",
      "\\mathfrak{V}": "#x1D519",
      "\\ElsevierGlyph{225A}": "#x02A63",
      "\\cyrchar\\CYRN": "#x0041D",
      "{\\fontencoding{LECO}\\selectfont\\char216}": "#x00338",
      "\\mathrm{\\ddot{I}}": "#x003AA",
      "\\textyen": "#x000A5",
      "\\tone{44}": "#x002E6",
      "\\mathbf{T}": "#x1D413",
      "\\mathtt{o}": "#x1D698",
      "\\tone{33}": "#x002E7",
      "\\mathmit{k}": "#x1D4F4",
      "\\Elztrnrl": "#x0027A",
      "\\between": "#x0226C",
      "\\not\\leq": "#x02270",
      "\\LeftTriangleBar": "#x029CF",
      "\\cyrchar\\cyrnhk": "#x004C8",
      "\\mathbb{x}": "#x1D569",
      "\\ElsevierGlyph{E212}": "#x02905",
      "\\mathsl{\\varsigma}": "#x1D70D",
      "\\mathscr{H}": "#x0210B",
      "\\mathsl{L}": "#x1D43F",
      "\\mathmit{n}": "#x1D4F7",
      "\\mathfrak{H}": "#x0210C",
      "\\mathbb{2}": "#x1D7DA",
      "\\cyrchar\\CYRP": "#x0041F",
      "\\mathmit{Z}": "#x1D4E9",
      "~": "#x000A0",
      "\\ElsevierGlyph{2232}": "#x02232",
      "\\ntrianglerighteq": "#x022ED",
      "\\\"{a}": "#x000E4",
      "\\mathslbb{A}": "#x1D56C",
      "\\mathbf{h}": "#x1D421",
      "\\nvdash": "#x022AC",
      "\\.{I}": "#x00130",
      "\\'{U}": "#x000DA",
      "\\mathbf{\\phi}": "#x1D6DF",
      "\\Cap": "#x022D2",
      ")": "#x00029",
      "\\barwedge": "#x02305",
      "\\mathsfsl{e}": "#x1D626",
      "\\ding{50}": "#x02712",
      "\\mathrm{\\ddot{Y}}": "#x003AB",
      "\\mathscr{T}": "#x1D4AF",
      "\\Xi": "#x0039E",
      "\\mathsfbfsl{A}": "#x1D63C",
      "\\mathsfbf{r}": "#x1D5FF",
      "\\mathsfbfsl{U}": "#x1D650",
      "\\ding{185}": "#x02779",
      "\\mathslbb{s}": "#x1D598",
      "\\textonequarter": "#x000BC",
      "\\mathbf{Z}": "#x1D419",
      "\\cyrchar\\cyrtshe": "#x0045B",
      "\\oe": "#x00153",
      "\\mathbit{F}": "#x1D46D",
      "\\rightleftarrows": "#x021C4",
      "\\cyrchar\\CYRYA": "#x0042F",
      "\\Phi": "#x003A6",
      "\\ding{189}": "#x0277D",
      "\\succnsim": "#x022E9",
      "\\textcurrency": "#x000A4",
      "\\mathbb{v}": "#x1D567",
      "\\ding{36}": "#x02704",
      "\\cyrchar\\CYRTDSC": "#x004AC",
      "\\mathsfsl{Y}": "#x1D620",
      "\\mathsf{J}": "#x1D5A9",
      "\\beth": "#x02136",
      "\\ding{107}": "#x0274B",
      "\\Pi": "#x003A0",
      "\\lessgtr": "#x02276",
      "\\Elzrttrnr": "#x0027B",
      "\\varsubsetneqq": "#x0228A-0FE00",
      "\\mathbf{\\Eta}": "#x1D6C8",
      "\\mathbb{M}": "#x1D544",
      "\\^{Y}": "#x00176",
      "\\mathsfbf{V}": "#x1D5E9",
      "\\k{a}": "#x00105",
      "\\`{A}": "#x000C0",
      "\\acute{\\ddot{\\iota}}": "#x00390",
      "\\mathbit{j}": "#x1D48B",
      "\\ding{167}": "#x02767",
      "\\oplus": "#x02295",
      "\\ElsevierGlyph{E25A}": "#x02A25",
      "\\mathtt{1}": "#x1D7F7",
      "\\ding{231}": "#x027A7",
      "\\mathtt{V}": "#x1D685",
      "\\nabla": "#x02207",
      "\\cyrchar\\CYRCHVCRS": "#x004B8",
      "\\textfrac{5}{6}": "#x0215A",
      "\\ding{98}": "#x02742",
      "\\ElsevierGlyph{E30D}": "#x02AEB",
      "\\ntrianglelefteq": "#x022EC",
      "\\c{c}": "#x000E7",
      "T": "#x00054",
      "\\'{C}": "#x00106",
      "\\mathsfsl{N}": "#x1D615",
      "\\Elzpgamma": "#x00263",
      "\\-": "#x000AD",
      "\\mathsfbf{D}": "#x1D5D7",
      "\\sharp": "#x0266F",
      "\\digamma": "#x003DD",
      "\\cyrchar\\cyrzhdsc": "#x00497",
      "\\mathsf{X}": "#x1D5B7",
      "\\cyrchar\\CYRKHCRS": "#x0049E",
      "\\mathmit{S}": "#x1D4E2",
      "\\mathbit{t}": "#x1D495",
      "\\mathsfbfsl{S}": "#x1D64E",
      "\\partial": "#x1D7C3",
      "\\not\\simeq": "#x02244",
      "\\ding{251}": "#x027BB",
      "\\ElsevierGlyph{E259}": "#x02A3C",
      "\\cyrchar\\cyrkvcrs": "#x0049D",
      "\\v{l}": "#x0013E",
      "\\DJ": "#x00110",
      "\\mathbf{7}": "#x1D7D5",
      "\\mathtt{J}": "#x1D679",
      "\\rightangle": "#x0221F",
      "{'''}": "#x02034",
      "\\'{o}": "#x003CC",
      "\\ding{109}": "#x0274D",
      "\\mathbit{\\Sigma}": "#x1D748",
      "\\u{O}": "#x0014E",
      "\\c{G}": "#x00122",
      "\\mathsfbf{X}": "#x1D5EB",
      "\\not =": "#x02260",
      "\\Delta": "#x00394",
      "\\mathsfsl{K}": "#x1D612",
      "\\because": "#x02235",
      "?": "#x0003F",
      "\\Theta": "#x00398",
      "\\^{G}": "#x0011C",
      "\\mathscr{k}": "#x1D4C0",
      "\\mathsfbfsl{o}": "#x1D664",
      "\\mathsl{i}": "#x1D456",
      "\\tau": "#x003C4",
      "\\hspace{0.167em}": "#x02009",
      "\\mathmit{g}": "#x1D4F0",
      "\\stackrel{*}{=}": "#x02A6E",
      "\\\"{E}": "#x000CB",
      "\\mathsl{\\Sigma}": "#x1D70E",
      "\\triangleq": "#x0225C",
      "\\upuparrows": "#x021C8",
      "\\cyrchar\\cyrn": "#x0043D",
      "\\mathfrak{k}": "#x1D528",
      "\\circledcirc": "#x0229A",
      "\\NotRightTriangleBar": "#x029D0-00338",
      "\\mathtt{D}": "#x1D673",
      "\\ElsevierGlyph{E291}": "#x02994",
      "\\not\\geq": "#x02271",
      "\\mathbb{g}": "#x1D558",
      "\\RuleDelayed": "#x029F4",
      "\\mathscr{w}": "#x1D4CC",
      "\\ElsevierGlyph{21B3}": "#x021B3",
      "\\mathsfbf{R}": "#x1D5E5",
      "\\geqq": "#x02267",
      "\\mathsfbf{a}": "#x1D5EE",
      "\\mathrm{\\mu}": "#x000B5",
      "\\mathsl{\\Gamma}": "#x1D6FE",
      "\\ding{233}": "#x027A9",
      "\\mathsl{M}": "#x1D440",
      "\\Pisymbol{ppi020}{105}": "#x02A9E",
      "\\cyrchar\\cyrp": "#x0043F",
      "\\UpEquilibrium": "#x0296E",
      "\\mathbf{\\Xi}": "#x1D6CF",
      "\\cyrchar\\cyrdze": "#x00455",
      "\\v{z}": "#x0017E",
      "\\NestedGreaterGreater": "#x02AA2",
      "\\cyrchar\\CYRpalochka": "#x004C0",
      "\\mathslbb{l}": "#x1D591",
      "\\cyrchar\\CYRIE": "#x00404",
      "\\mathtt{x}": "#x1D6A1",
      "\\xi": "#x003BE",
      "\\psi": "#x003C8",
      "\\ding{220}": "#x0279C",
      "\\'{}{I}": "#x0038A",
      "\\homothetic": "#x0223B",
      "\\mathsf{f}": "#x1D5BF",
      "\\cyrchar\\CYRO": "#x0041E",
      "\\mathbit{\\varkappa}": "#x1D752",
      "\\mathbb{i}": "#x1D55A",
      "\\^{u}": "#x000FB",
      "\\textfrac{1}{5}": "#x02155",
      "\\otimes": "#x02297",
      "\\mathscr{y}": "#x1D4CE",
      "\\k{E}": "#x00118",
      "\\mathsfbfsl{y}": "#x1D66E",
      "\\mathbf{Y}": "#x1D418",
      "\\RoundImplies": "#x02970",
      "\\cyrchar\\cyrabhdze": "#x004E1",
      "\\mathslbb{p}": "#x1D595",
      "\\mathbit{G}": "#x1D46E",
      "\\subseteq": "#x02286",
      "\\mathfrak{U}": "#x1D518",
      "\\Subset": "#x022D0",
      "\\textfrac{3}{8}": "#x0215C",
      "\\mathbb{u}": "#x1D566",
      "\\cyrchar\\cyrrtick": "#x0048F",
      "\\ding{37}": "#x0260E",
      "\\mathscr{E}": "#x02130",
      "\\mathsf{1}": "#x1D7E3",
      "\\mathsl{C}": "#x1D436",
      "\\mathbf{z}": "#x1D433",
      "\\Elztfnc": "#x02980",
      "\\cyrchar\\cyriotlyus": "#x00469",
      "\\lessapprox": "#x02A85",
      "\\ding{77}": "#x0272D",
      "#x": "#x00055",
      "\\={e}": "#x00113",
      "\\Elzsblhr": "#x002D3",
      "\\ElsevierGlyph{E20A}": "#x02926",
      "\\cyrchar\\CYRCHLDSC": "#x004CB",
      "\\ElsevierGlyph{2129}": "#x02129",
      "\\mathslbb{b}": "#x1D587",
      "\\DownLeftRightVector": "#x02950",
      "\\ding{202}": "#x0278A",
      "'": "#x02019",
      "\\mathbf{K}": "#x1D40A",
      "\\cyrchar\\cyrsftsn": "#x0044C",
      "\\mathbit{Q}": "#x1D478",
      "\\mathsfbfsl{\\Rho}": "#x1D7BA",
      "\\rangle": "#x0232A",
      "\\mathsl{J}": "#x1D43D"
    },

    config: {
      styles: {
        ".MathJax_SVG": {
          "display": "inline",
          "font-style": "normal",
          "font-weight": "normal",
          "line-height": "normal",
          "font-size": "100%",
          "font-size-adjust": "none",
          "text-indent": 0,
          "text-align": "left",
          "text-transform": "none",
          "letter-spacing": "normal",
          "word-spacing": "normal",
          "word-wrap": "normal",
          "white-space": "nowrap",
          "float": "none",
          "direction": "ltr",
          "max-width": "none",
          "max-height": "none",
          "min-width": 0,
          "min-height": 0,
          border: 0,
          padding: 0,
          margin: 0
        },

        ".MathJax_SVG_Display": {
          position: "relative",
          display: "block!important",
          "text-indent": 0,
          "max-width": "none",
          "max-height": "none",
          "min-width": 0,
          "min-height": 0,
          width: "100%"
        },

        ".MathJax_SVG *": {
          transition: "none",
          "-webkit-transition": "none",
          "-moz-transition": "none",
          "-ms-transition": "none",
          "-o-transition": "none"
        },

        ".mjx-svg-href": {
          fill: "blue",
          stroke: "blue"
        },

        ".MathJax_SVG_Processing": {
          visibility: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          overflow: "hidden",
          display: "block!important"
        },

        ".MathJax_SVG_Processed": {
          display: "none!important"
        },

        ".MathJax_SVG_ExBox": {
          display: "block!important",
          overflow: "hidden",
          width: "1px",
          height: "60ex",
          "min-height": 0,
          "max-height": "none",
          padding: 0,
          border: 0,
          margin: 0
        },

        ".backslash-mode use": {
          fill: "gray",
          stroke: "gray"
        },

        "#MathJax_SVG_Tooltip": {
          position: "absolute",
          left: 0,
          top: 0,
          width: "auto",
          height: "auto",
          display: "none"
        }
      }
    },

    hideProcessedMath: true, // use display:none until all math is processed

    fontNames: ["TeX", "STIX", "STIX-Web", "Asana-Math",
                "Gyre-Termes", "Gyre-Pagella", "Latin-Modern", "Neo-Euler"
               ],


    Config: function() {
      this.SUPER(arguments).Config.apply(this, arguments);
      var settings = HUB.config.menuSettings,
          config = this.config,
          font = settings.font;
      if (settings.scale) {
        config.scale = settings.scale;
      }
      if (font && font !== "Auto") {
        font = font.replace(/(Local|Web|Image)$/i, "");
        font = font.replace(/([a-z])([A-Z])/, "$1-$2");
        this.fontInUse = font;
      } else {
        this.fontInUse = config.font || "TeX";
      }
      if (this.fontNames.indexOf(this.fontInUse) < 0) {
        this.fontInUse = "TeX";
      }
      this.fontDir += "/" + this.fontInUse;
      if (!this.require) {
        this.require = [];
      }
      this.require.push(this.fontDir + "/fontdata.js");
      this.require.push(MathJax.OutputJax.extensionDir + "/MathEvents.js");
    },

    preprocessElementJax: function preprocessElementJax(root) {
      if (root.type === 'texatom') {
        if (root.data.length !== 1) throw Error('Unexpected length in texatom')
        preprocessElementJax(root.data[0])
      } else if (root.type === 'mrow') {
        var i
        for (i=0; i<root.data.length; ++i) {
          preprocessElementJax(root.data[i])
        }
      } else if (root.cursorable || root.type === 'math') {
        var i
        for (i=0; i<root.data.length; ++i) {
          var cur = root.data[i]
          if (!cur) continue
          var type = cur.type
          if (type[0] !== 'm' || type === 'mrow') {
            preprocessElementJax(cur)
          } else {
            var row = new MML.mrow()
            row.Append(preprocessElementJax(cur))
            root.SetData(i, row)
          }
        }
      }
      return root
    },

    highlightBox: function(svg, bb) {
      d = 100; // TODO: use proper units

      drawLine = function(x1, y1, x2, y2) {
        return d3.select(svg)
          .insert('svg:line')
          .attr('style', 'stroke:rgb(0,0,255);stroke-width:20')
          .attr('x1', x1)
          .attr('y1', y1)
          .attr('x2', x2)
          .attr('y2', y2)[0][0];
      };

      return [
        // Top left
        drawLine(bb.x, bb.y, bb.x + d, bb.y),
        drawLine(bb.x, bb.y, bb.x, bb.y + d),
        // Top right
        drawLine(bb.x + bb.width, bb.y, bb.x + bb.width - d, bb.y),
        drawLine(bb.x + bb.width, bb.y, bb.x + bb.width, bb.y + d),
        // Bottom right
        drawLine(bb.x, bb.y + bb.height, bb.x, bb.y + bb.height - d),
        drawLine(bb.x, bb.y + bb.height, bb.x + d, bb.y + bb.height),

        // Bottom right
        drawLine(bb.x + bb.width, bb.y + bb.height, bb.x + bb.width - d, bb.y + bb.height),
        drawLine(bb.x + bb.width, bb.y + bb.height, bb.x + bb.width, bb.y + bb.height - d)
      ];
    },

    /*
     * Append a visualization of the jax to a given div
     * Pass in the jax and a jQuery selector div
     */
    visualizeJax: function(jax, selector) {
      selector.empty();
      var hb = this.highlightBox;

      var f = function(j, spacer) {
        var s;
        var end;
        if (_.isString(j)) {
          s = spacer + j + "\n";
          end = true;
        } else {
          s = spacer + (j ? j.type : "null") + "\n";
        }
        var item = $('<li><pre style="margin: 0;">' + s + '</pre></li>');
        item.appendTo(selector);
        if (end) return;
        item.on('click', function() {
          var bb = j.getSVGBBox();
          var svg = j.EditableSVGelem.ownerSVGElement;

          hb(svg, bb);

          // d3.select(svg)
          //   .insert('svg:rect')
          //   .attr('fill', 'red')
          //   .attr('x', bbox.x)
          //   .attr('y', bbox.y)
          //   .attr('width', bbox.width)
          //   .attr('height', bbox.height);

        });

        if (!j) return;

        for (var i = 0; i < j.data.length; i++) {
          f(j.data[i], spacer + " ");
        }
      };
      f(jax.root, "");
    },

    getSVGElem: function(elem) {
      if (!elem) return
      var svg = elem.nodeName === 'svg' ? elem : elem.ownerSVGElement
      if (!svg) {
        console.error('No owner SVG element');
        return
      }
      return svg
    },

    elemCoordsToScreenCoords: function(elem, x, y) {
      var svg = this.getSVGElem(elem)
      if (!svg) return

      var pt = svg.createSVGPoint()
      pt.x = x
      pt.y = y

      return pt.matrixTransform(elem.getScreenCTM())
    },

    // Convert coordinates in some arbitrary element's coordinate system to the viewport coordinate system
    elemCoordsToViewportCoords: function(elem, x, y) {
      var svg = this.getSVGElem(elem)
      if (!svg) return

      var pt = svg.createSVGPoint();
      pt.x = x;
      pt.y = y;

      return pt.matrixTransform(elem.getTransformToElement(svg));
    },

    screenCoordsToElemCoords: function(elem, x, y) {
      var svg = this.getSVGElem(elem)
      if (!svg) return

      var pt = svg.createSVGPoint();
      pt.x = x
      pt.y = y

      return pt.matrixTransform(elem.getScreenCTM().inverse());
    },

    boxContains: function(bb, x, y) {
      return bb && bb.x <= x && x <= bb.x+bb.width && bb.y <= y && y <= bb.y+bb.height;
    },

    nodeContainsScreenPoint: function(node, x, y) {
      var bb = node.getBB && node.getBB()
      var p = this.screenCoordsToElemCoords(node.EditableSVGelem, x, y);
      if (!bb || !p) return false

      return bb.x <= p.x && p.x <= bb.x+bb.width && bb.y <= p.y && p.y <= bb.y+bb.height;
    },

    Startup: function() {
      //  Set up event handling
      EVENT = MathJax.Extension.MathEvents.Event;
      TOUCH = MathJax.Extension.MathEvents.Touch;
      HOVER = MathJax.Extension.MathEvents.Hover;
      this.ContextMenu = EVENT.ContextMenu;
      this.Mouseover = HOVER.Mouseover;
      this.Mouseout = HOVER.Mouseout;
      this.Mousemove = HOVER.Mousemove;

      // Make hidden div for doing tests and storing global SVG <defs>
      this.hiddenDiv = HTML.Element("div", {
        style: {
          visibility: "hidden",
          overflow: "hidden",
          position: "absolute",
          top: 0,
          height: "1px",
          width: "auto",
          padding: 0,
          border: 0,
          margin: 0,
          textAlign: "left",
          textIndent: 0,
          textTransform: "none",
          lineHeight: "normal",
          letterSpacing: "normal",
          wordSpacing: "normal"
        }
      });
      if (!document.body.firstChild) {
        document.body.appendChild(this.hiddenDiv);
      } else {
        document.body.insertBefore(this.hiddenDiv, document.body.firstChild);
      }
      this.hiddenDiv = HTML.addElement(this.hiddenDiv, "div", {
        id: "MathJax_SVG_Hidden"
      });

      // Determine pixels-per-inch and em-size
      var div = HTML.addElement(this.hiddenDiv, "div", {
        style: {
          width: "5in"
        }
      });
      this.pxPerInch = div.offsetWidth / 5;
      this.hiddenDiv.removeChild(div);

      // Used for measuring text sizes
      this.textSVG = this.Element("svg");

      // Global defs for font glyphs
      BBOX.GLYPH.defs = this.addElement(this.addElement(this.hiddenDiv.parentNode, "svg"),
                                        "defs", {
                                          id: "MathJax_SVG_glyphs"
                                        });

      // Used in preTranslate to get scaling factors
      this.ExSpan = HTML.Element("span", {
        style: {
          position: "absolute",
          "font-size-adjust": "none"
        }
      }, [
        ["span", {
          className: "MathJax_SVG_ExBox"
        }]
      ]);

      // Used in preTranslate to get linebreak width
      this.linebreakSpan = HTML.Element("span", null, [
        ["hr", {
          style: {
            width: "auto",
            size: 1,
            padding: 0,
            border: 0,
            margin: 0
          }
        }]
      ]);

      // Set up styles
      return AJAX.Styles(this.config.styles, ["InitializeSVG", this]);
    },

    //
    //  Handle initialization that requires styles to be set up
    //
    InitializeSVG: function() {
      //
      //  Get the default sizes (need styles in place to do this)
      //
      document.body.appendChild(this.ExSpan);
      document.body.appendChild(this.linebreakSpan);
      this.defaultEx = this.ExSpan.firstChild.offsetHeight / 60;
      this.defaultWidth = this.linebreakSpan.firstChild.offsetWidth;
      document.body.removeChild(this.linebreakSpan);
      document.body.removeChild(this.ExSpan);
    },

    preTranslate: function(state) {
      var scripts = state.jax[this.id],
          i, m = scripts.length,
          script, prev, span, div, test, jax, ex, em, maxwidth, relwidth = false,
          cwidth,
          linebreak = this.config.linebreaks.automatic,
          width = this.config.linebreaks.width;
      if (linebreak) {
        relwidth = (width.match(/^\s*(\d+(\.\d*)?%\s*)?container\s*$/) != null);
        if (relwidth) {
          width = width.replace(/\s*container\s*/, "")
        } else {
          maxwidth = this.defaultWidth
        }
        if (width === "") {
          width = "100%"
        }
      } else {
        maxwidth = 100000
      } // a big width, so no implicit line breaks
      //
      //  Loop through the scripts
      //
      for (i = 0; i < m; i++) {
        script = scripts[i];
        if (!script.parentNode) continue;
        //
        //  Remove any existing output
        //
        prev = script.previousSibling;
        if (prev && String(prev.className).match(/^MathJax(_SVG)?(_Display)?( MathJax(_SVG)?_Processing)?$/)) {
          prev.parentNode.removeChild(prev)
        }
        //
        //  Add the span, and a div if in display mode,
        //  then set the role and mark it as being processed
        //
        jax = script.MathJax.elementJax;
        if (!jax) continue;
        jax.SVG = {
          display: (jax.root.Get("display") === "block")
        }
        span = div = HTML.Element("span", {
          style: {
            "font-size": this.config.scale + "%",
            display: "inline-block"
          },
          className: "MathJax_SVG",
          id: jax.inputID + "-Frame",
          isMathJax: true,
          jaxID: this.id,
          oncontextmenu: EVENT.Menu,
          onmousedown: EVENT.Mousedown,
          onmouseover: EVENT.Mouseover,
          onmouseout: EVENT.Mouseout,
          onmousemove: EVENT.Mousemove,
          onclick: EVENT.Click,
          ondblclick: EVENT.DblClick
        });
        if (HUB.Browser.noContextMenu) {
          span.ontouchstart = TOUCH.start;
          span.ontouchend = TOUCH.end;
        }
        if (jax.SVG.display) {
          div = HTML.Element("div", {
            className: "MathJax_SVG_Display"
          });
          div.appendChild(span);
        }
        div.className += " MathJax_SVG_Processing";
        script.parentNode.insertBefore(div, script);

        //  Add the test span for determining scales and linebreak widths
        script.parentNode.insertBefore(this.ExSpan.cloneNode(true), script);
        div.parentNode.insertBefore(this.linebreakSpan.cloneNode(true), div);
      }

      //  Determine the scaling factors for each script
      //  (this only requires one reflow rather than a reflow for each equation)
      for (i = 0; i < m; i++) {
        script = scripts[i];
        if (!script.parentNode) continue;
        test = script.previousSibling;
        div = test.previousSibling;
        jax = script.MathJax.elementJax;
        if (!jax) continue;
        ex = test.firstChild.offsetHeight / 60;
        cwidth = div.previousSibling.firstChild.offsetWidth;
        if (relwidth) {
          maxwidth = cwidth
        }
        if (ex === 0 || ex === "NaN") {
          // can't read width, so move to hidden div for processing
          // (this will cause a reflow for each math element that is hidden)
          this.hiddenDiv.appendChild(div);
          jax.SVG.isHidden = true;
          ex = this.defaultEx;
          cwidth = this.defaultWidth;
          if (relwidth) {
            maxwidth = cwidth
          }
        }
        jax.SVG.ex = ex;
        jax.SVG.em = em = ex / SVG.TeX.x_height * 1000; // scale ex to x_height
        jax.SVG.cwidth = cwidth / em * 1000;
        jax.SVG.lineWidth = (linebreak ? this.length2em(width, 1, maxwidth / em * 1000) : SVG.BIGDIMEN);
      }
      //
      //  Remove the test spans used for determining scales and linebreak widths
      //
      for (i = 0; i < m; i++) {
        script = scripts[i];
        if (!script.parentNode) continue;
        test = scripts[i].previousSibling;
        span = test.previousSibling;
        jax = scripts[i].MathJax.elementJax;
        if (!jax) continue;
        if (!jax.SVG.isHidden) {
          span = span.previousSibling
        }
        span.parentNode.removeChild(span);
        test.parentNode.removeChild(test);
      }
      //
      //  Set state variables used for displaying equations in chunks
      //
      state.SVGeqn = state.SVGlast = 0;
      state.SVGi = -1;
      state.SVGchunk = this.config.EqnChunk;
      state.SVGdelay = false;
    },

    AddInputHandlers: function(math, span, div) {
      math.cursor = new MathJax.Object.Cursor()
      span.setAttribute('tabindex', '0')
      var recall = math.toSVG.bind(math, span, div, true)
      function handler(e) {
        if (math.cursor[e.type]) {
          math.cursor[e.type](e, recall)
        }
      }
      span.addEventListener('keydown', handler)
      span.addEventListener('keypress', handler)
      span.addEventListener('mousedown', handler)
    },

    Translate: function(script, state) {
      if (!script.parentNode) return;

      //  If we are supposed to do a chunk delay, do it
      if (state.SVGdelay) {
        state.SVGdelay = false;
        HUB.RestartAfter(MathJax.Callback.Delay(this.config.EqnChunkDelay));
      }

      //  Get the data about the math
      var jax = script.MathJax.elementJax,
          math = this.preprocessElementJax(jax.root),
          span = document.getElementById(jax.inputID + "-Frame"),
          div = (jax.SVG.display ? (span || {}).parentNode : span),
          localCache = (SVG.config.useFontCache && !SVG.config.useGlobalCache);
      if (!div) return;

      //  Set the font metrics
      this.em = MML.mbase.prototype.em = jax.SVG.em;
      this.ex = jax.SVG.ex;
      this.linebreakWidth = jax.SVG.lineWidth;
      this.cwidth = jax.SVG.cwidth;

      //  Typeset the math
      this.mathDiv = div;
      span.appendChild(this.textSVG);
      if (localCache) {
        SVG.resetGlyphs();
      }
      this.initSVG(math, span);
      math.setTeXclass();
      try {
        math.toSVG(span, div);
      } catch (err) {
        if (err.restart) {
          while (span.firstChild) {
            span.removeChild(span.firstChild);
          }
        }
        if (localCache) {
          BBOX.GLYPH.n--;
        }
        throw err;
      }
      span.removeChild(this.textSVG);
      this.AddInputHandlers(math, span, div)

      //  Put it in place, and remove the processing marker
      if (jax.SVG.isHidden) {
        script.parentNode.insertBefore(div, script);
      }
      div.className = div.className.split(/ /)[0];
      //
      //  Check if we are hiding the math until more is processed
      //
      if (this.hideProcessedMath) {
        //
        //  Hide the math and don't let its preview be removed
        //
        div.className += " MathJax_SVG_Processed";
        if (script.MathJax.preview) {
          jax.SVG.preview = script.MathJax.preview;
          delete script.MathJax.preview;
        }
        //
        //  Check if we should show this chunk of equations
        //
        state.SVGeqn += (state.i - state.SVGi);
        state.SVGi = state.i;
        if (state.SVGeqn >= state.SVGlast + state.SVGchunk) {
          this.postTranslate(state, true);
          state.SVGchunk = Math.floor(state.SVGchunk * this.config.EqnChunkFactor);
          state.SVGdelay = true; // delay if there are more scripts
        }
      }
    },

    postTranslate: function(state, partial) {
      var scripts = state.jax[this.id];
      if (!this.hideProcessedMath) return;
      //
      //  Reveal this chunk of math
      //
      for (var i = state.SVGlast, m = state.SVGeqn; i < m; i++) {
        var script = scripts[i];
        if (script && script.MathJax.elementJax) {
          //
          //  Remove the processed marker
          //
          script.previousSibling.className = script.previousSibling.className.split(/ /)[0];
          var data = script.MathJax.elementJax.SVG;
          //
          //  Remove the preview, if any
          //
          if (data.preview) {
            data.preview.innerHTML = "";
            script.MathJax.preview = data.preview;
            delete data.preview;
          }
        }
      }
      //
      //  Save our place so we know what is revealed
      //
      state.SVGlast = state.SVGeqn;
    },

    resetGlyphs: function(reset) {
      if (this.config.useFontCache) {
        var GLYPH = BBOX.GLYPH;
        if (this.config.useGlobalCache) {
          GLYPH.defs = document.getElementById("MathJax_SVG_glyphs");
          GLYPH.defs.innerHTML = "";
        } else {
          GLYPH.defs = this.Element("defs");
          GLYPH.n++;
        }
        GLYPH.glyphs = {};
        if (reset) {
          GLYPH.n = 0;
        }
      }
    },

    //
    //  Return the containing HTML element rather than the SVG element, since
    //  most browsers can't position to an SVG element properly.
    //
    hashCheck: function(target) {
      if (target && target.nodeName.toLowerCase() === "g") {
        do {
          target = target.parentNode;
        } while (target && target.firstChild.nodeName !== "svg");
      }
      return target;
    },

    getJaxFromMath: function(math) {
      if (math.parentNode.className === "MathJax_SVG_Display") {
        math = math.parentNode;
      }
      do {
        math = math.nextSibling;
      } while (math && math.nodeName.toLowerCase() !== "script");
      return HUB.getJaxFor(math);
    },

    getHoverSpan: function(jax, math) {
      math.style.position = "relative"; // make sure inline containers have position set
      return math.firstChild;
    },

    getHoverBBox: function(jax, span, math) {
      var bbox = EVENT.getBBox(span.parentNode);
      bbox.h += 2;
      bbox.d -= 2; // bbox seems to be a bit off, so compensate (FIXME)
      return bbox;
    },

    Zoom: function(jax, span, math, Mw, Mh) {
      //
      //  Re-render at larger size
      //
      span.className = "MathJax_SVG";

      //
      //  get em size (taken from this.preTranslate)
      //
      var emex = span.appendChild(this.ExSpan.cloneNode(true));
      var ex = emex.firstChild.offsetHeight / 60;
      this.em = MML.mbase.prototype.em = ex / SVG.TeX.x_height * 1000;
      this.ex = ex;
      this.linebreakWidth = jax.SVG.lineWidth;
      this.cwidth = jax.SVG.cwidth;
      emex.parentNode.removeChild(emex);

      span.appendChild(this.textSVG);
      this.mathDIV = span;
      this.zoomScale = parseInt(HUB.config.menuSettings.zscale) / 100;
      var tw = jax.root.data[0].EditableSVGdata.tw;
      if (tw && tw < this.cwidth) this.cwidth = tw;
      this.idPostfix = "-zoom";
      jax.root.toSVG(span, span);
      this.idPostfix = "";
      this.zoomScale = 1;
      span.removeChild(this.textSVG);

      //
      //  Don't allow overlaps on any edge
      //
      var svg = span.getElementsByTagName("svg")[0].style;
      svg.marginTop = svg.marginRight = svg.marginLeft = 0;
      if (svg.marginBottom.charAt(0) === "-")
        span.style.marginBottom = svg.marginBottom.substr(1);

      if (this.operaZoomRefresh) {
        setTimeout(function() {
          span.firstChild.style.border = "1px solid transparent";
        }, 1);
      }

      //
      // WebKit bug (issue #749)
      //
      if (span.offsetWidth < span.firstChild.offsetWidth) {
        span.style.minWidth = span.firstChild.offsetWidth + "px";
        math.style.minWidth = math.firstChild.offsetWidth + "px";
      }
      //
      //  Get height and width of zoomed math and original math
      //
      span.style.position = math.style.position = "absolute";
      var zW = span.offsetWidth,
          zH = span.offsetHeight,
          mH = math.offsetHeight,
          mW = math.offsetWidth;
      span.style.position = math.style.position = "";
      //
      return {
        Y: -EVENT.getBBox(span).h,
        mW: mW,
        mH: mH,
        zW: zW,
        zH: zH
      };
    },

    initSVG: function(math, span) {},

    Remove: function(jax) {
      var span = document.getElementById(jax.inputID + "-Frame");
      if (span) {
        if (jax.SVG.display) {
          span = span.parentNode;
        }
        span.parentNode.removeChild(span);
      }
      delete jax.SVG;
    },

    Em: function(m) {
      if (Math.abs(m) < 0.0006) {
        return "0em";
      }
      return m.toFixed(3).replace(/\.?0+$/, "") + "em";
    },
    Ex: function(m) {
      m = Math.round(m / this.TeX.x_height * this.ex) / this.ex; // try to use closest pixel size
      if (Math.abs(m) < 0.0006) {
        return "0ex";
      }
      return m.toFixed(3).replace(/\.?0+$/, "") + "ex";
    },
    Percent: function(m) {
      return (100 * m).toFixed(1).replace(/\.?0+$/, "") + "%";
    },
    Fixed: function(m, n) {
      if (Math.abs(m) < 0.0006) {
        return "0";
      }
      return m.toFixed(n || 3).replace(/\.?0+$/, "");
    },
    length2em: function(length, mu, size) {
      if (typeof(length) !== "string") {
        length = length.toString();
      }
      if (length === "") {
        return "";
      }
      if (length === MML.SIZE.NORMAL) {
        return 1000;
      }
      if (length === MML.SIZE.BIG) {
        return 2000;
      }
      if (length === MML.SIZE.SMALL) {
        return 710;
      }
      if (length === "infinity") {
        return SVG.BIGDIMEN;
      }
      if (length.match(/mathspace$/)) {
        return 1000 * SVG.MATHSPACE[length];
      }
      var emFactor = (this.zoomScale || 1) / SVG.em;
      var match = length.match(/^\s*([-+]?(?:\.\d+|\d+(?:\.\d*)?))?(pt|em|ex|mu|px|pc|in|mm|cm|%)?/);
      var m = parseFloat(match[1] || "1") * 1000,
          unit = match[2];
      if (size == null) {
        size = 1000
      };
      if (mu == null) {
        mu = 1;
      }
      if (unit === "em") {
        return m;
      }
      if (unit === "ex") {
        return m * SVG.TeX.x_height / 1000;
      }
      if (unit === "%") {
        return m / 100 * size / 1000;
      }
      if (unit === "px") {
        return m * emFactor;
      }
      if (unit === "pt") {
        return m / 10;
      } // 10 pt to an em
      if (unit === "pc") {
        return m * 1.2;
      } // 12 pt to a pc
      if (unit === "in") {
        return m * this.pxPerInch * emFactor;
      }
      if (unit === "cm") {
        return m * this.pxPerInch * emFactor / 2.54;
      } // 2.54 cm to an inch
      if (unit === "mm") {
        return m * this.pxPerInch * emFactor / 25.4;
      } // 10 mm to a cm
      if (unit === "mu") {
        return m / 18 * mu;
      }
      return m * size / 1000; // relative to given size (or 1em as default)
    },

    thickness2em: function(length, mu) {
      var thick = SVG.TeX.rule_thickness;
      if (length === MML.LINETHICKNESS.MEDIUM) {
        return thick;
      }
      if (length === MML.LINETHICKNESS.THIN) {
        return 0.67 * thick;
      }
      if (length === MML.LINETHICKNESS.THICK) {
        return 1.67 * thick;
      }
      return this.length2em(length, mu, thick);
    },

    getPadding: function(styles) {
      var padding = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
      var has = false;

      for (var id in padding) {
        if (padding.hasOwnProperty(id)) {
          var pad = styles["padding" + id.charAt(0).toUpperCase() + id.substr(1)];
          if (pad) {
            padding[id] = this.length2em(pad);
            has = true;
          }
        }
      }
      return (has ? padding : false);
    },

    getBorders: function(styles) {
      var border = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
          has = false;
      for (var id in border) {
        if (border.hasOwnProperty(id)) {
          var ID = "border" + id.charAt(0).toUpperCase() + id.substr(1);
          var style = styles[ID + "Style"];
          if (style && style !== "none") {
            has = true;
            border[id] = this.length2em(styles[ID + "Width"]);
            border[id + "Style"] = styles[ID + "Style"];
            border[id + "Color"] = styles[ID + "Color"];
            if (border[id + "Color"] === "initial") {
              border[id + "Color"] = "";
            }
          } else {
            delete border[id];
          }
        }
      }
      return (has ? border : false);
    },

    Element: function(type, def) {
      var obj = (typeof(type) === "string" ? document.createElementNS(SVGNS, type) : type);
      obj.isMathJax = true;
      if (def) {
        for (var id in def) {
          if (def.hasOwnProperty(id)) {
            obj.setAttribute(id, def[id].toString());
          }
        }
      }
      return obj;
    },
    addElement: function(parent, type, def) {
      return parent.appendChild(this.Element(type, def))
    },
    TextNode: HTML.TextNode,
    addText: HTML.addText,
    ucMatch: HTML.ucMatch,

    HandleVariant: function(variant, scale, text) {
      var svg = BBOX.G();
      var n, N, c, font, VARIANT, i, m, id, M, RANGES;
      if (!variant) {
        variant = this.FONTDATA.VARIANT[MML.VARIANT.NORMAL];
      }
      if (variant.forceFamily) {
        text = BBOX.TEXT(scale, text, variant.font);
        if (variant.h !== null) {
          text.h = variant.h;
        }
        if (variant.d !== null) {
          text.d = variant.d;
        }
        svg.Add(text);
        text = "";
      }
      VARIANT = variant;
      for (i = 0, m = text.length; i < m; i++) {
        variant = VARIANT;
        n = text.charCodeAt(i);
        c = text.charAt(i);
        if (n >= 0xD800 && n < 0xDBFF) {
          i++;
          n = (((n - 0xD800) << 10) + (text.charCodeAt(i) - 0xDC00)) + 0x10000;
          if (this.FONTDATA.RemapPlane1) {
            var nv = this.FONTDATA.RemapPlane1(n, variant);
            n = nv.n;
            variant = nv.variant;
          }
        } else {
          RANGES = this.FONTDATA.RANGES;
          for (id = 0, M = RANGES.length; id < M; id++) {
            if (RANGES[id].name === "alpha" && variant.noLowerCase) continue;
            N = variant["offset" + RANGES[id].offset];
            if (N && n >= RANGES[id].low && n <= RANGES[id].high) {
              if (RANGES[id].remap && RANGES[id].remap[n]) {
                n = N + RANGES[id].remap[n];
              } else {
                n = n - RANGES[id].low + N;
                if (RANGES[id].add) {
                  n += RANGES[id].add;
                }
              }
              if (variant["variant" + RANGES[id].offset]) {
                variant = this.FONTDATA.VARIANT[variant["variant" + RANGES[id].offset]];
              }
              break;
            }
          }
        }
        if (variant.remap && variant.remap[n]) {
          n = variant.remap[n];
          if (variant.remap.variant) {
            variant = this.FONTDATA.VARIANT[variant.remap.variant];
          }
        } else if (this.FONTDATA.REMAP[n] && !variant.noRemap) {
          n = this.FONTDATA.REMAP[n];
        }
        if (n instanceof Array) {
          variant = this.FONTDATA.VARIANT[n[1]];
          n = n[0];
        }
        if (typeof(n) === "string") {
          text = n + text.substr(i + 1);
          m = text.length;
          i = -1;
          continue;
        }
        font = this.lookupChar(variant, n);
        c = font[n];
        if (c) {
          if ((c[5] && c[5].space) || (c[5] === "" && c[0] + c[1] === 0)) {
            svg.w += c[2];
          } else {
            c = [scale, font.id + "-" + n.toString(16).toUpperCase()].concat(c);
            svg.Add(BBOX.GLYPH.apply(BBOX, c), svg.w, 0);
          }
        } else if (this.FONTDATA.DELIMITERS[n]) {
          c = this.createDelimiter(n, 0, 1, font);
          svg.Add(c, svg.w, (this.FONTDATA.DELIMITERS[n].dir === "V" ? c.d : 0));
        } else {
          if (n <= 0xFFFF) {
            c = String.fromCharCode(n);
          } else {
            N = n - 0x10000;
            c = String.fromCharCode((N >> 10) + 0xD800) + String.fromCharCode((N & 0x3FF) + 0xDC00);
          }
          var box = BBOX.TEXT(scale * 100 / SVG.config.scale, c, {
            "font-family": variant.defaultFamily || SVG.config.undefinedFamily,
            "font-style": (variant.italic ? "italic" : ""),
            "font-weight": (variant.bold ? "bold" : "")
          });
          if (variant.h !== null) {
            box.h = variant.h;
          }
          if (variant.d !== null) {
            box.d = variant.d;
          }
          c = BBOX.G();
          c.Add(box);
          svg.Add(c, svg.w, 0);
          HUB.signal.Post(["SVG Jax - unknown char", n, variant]);
        }
      }

      if (text.length == 1 && font.skew && font.skew[n]) {
        svg.skew = font.skew[n] * 1000;
      }
      if (svg.element.childNodes.length === 1) {
        svg.element = svg.element.firstChild;
        svg.removeable = false;
        svg.scale = scale;
      }
      return svg;
    },

    lookupChar: function(variant, n) {
      var i, m;
      if (!variant.FONTS) {
        var FONTS = this.FONTDATA.FONTS;
        var fonts = (variant.fonts || this.FONTDATA.VARIANT.normal.fonts);
        if (!(fonts instanceof Array)) {
          fonts = [fonts]
        }
        if (variant.fonts != fonts) {
          variant.fonts = fonts
        }
        variant.FONTS = [];
        for (i = 0, m = fonts.length; i < m; i++) {
          if (FONTS[fonts[i]]) {
            variant.FONTS.push(FONTS[fonts[i]])
          }
        }
      }
      for (i = 0, m = variant.FONTS.length; i < m; i++) {
        var font = variant.FONTS[i];
        if (typeof(font) === "string") {
          delete variant.FONTS;
          this.loadFont(font)
        }
        if (font[n]) {
          return font
        } else {
          this.findBlock(font, n)
        }
      }
      return {
        id: "unknown"
      };
    },

    findBlock: function(font, c) {
      if (font.Ranges) {
        // FIXME:  do binary search?
        for (var i = 0, m = font.Ranges.length; i < m; i++) {
          if (c < font.Ranges[i][0]) return;
          if (c <= font.Ranges[i][1]) {
            var file = font.Ranges[i][2];
            for (var j = font.Ranges.length - 1; j >= 0; j--) {
              if (font.Ranges[j][2] == file) {
                font.Ranges.splice(j, 1)
              }
            }
            this.loadFont(font.directory + "/" + file + ".js");
          }
        }
      }
    },

    loadFont: function(file) {
      HUB.RestartAfter(AJAX.Require(this.fontDir + "/" + file));
    },

    createDelimiter: function(code, HW, scale, font) {
      if (!scale) {
        scale = 1
      };
      var svg = BBOX.G();
      if (!code) {
        svg.Clean();
        delete svg.element;
        svg.w = svg.r = this.TeX.nulldelimiterspace * scale;
        return svg;
      }
      if (!(HW instanceof Array)) {
        HW = [HW, HW]
      }
      var hw = HW[1];
      HW = HW[0];
      var delim = {
        alias: code
      };
      while (delim.alias) {
        code = delim.alias;
        delim = this.FONTDATA.DELIMITERS[code];
        if (!delim) {
          delim = {
            HW: [0, this.FONTDATA.VARIANT[MML.VARIANT.NORMAL]]
          }
        }
      }
      if (delim.load) {
        HUB.RestartAfter(AJAX.Require(this.fontDir + "/fontdata-" + delim.load + ".js"))
      }
      for (var i = 0, m = delim.HW.length; i < m; i++) {
        if (delim.HW[i][0] * scale >= HW - 10 - SVG.config.blacker || (i == m - 1 && !delim.stretch)) {
          if (delim.HW[i][2]) {
            scale *= delim.HW[i][2]
          }
          if (delim.HW[i][3]) {
            code = delim.HW[i][3]
          }
          return this.createChar(scale, [code, delim.HW[i][1]], font).With({
            stretched: true
          });
        }
      }
      if (delim.stretch) {
        this["extendDelimiter" + delim.dir](svg, hw, delim.stretch, scale, font)
      }
      return svg;
    },

    createChar: function(scale, data, font) {
      var text = "",
          variant = {
            fonts: [data[1]],
            noRemap: true
          };
      if (font && font === MML.VARIANT.BOLD) {
        variant.fonts = [data[1] + "-bold", data[1]]
      }
      if (typeof(data[1]) !== "string") {
        variant = data[1]
      }
      if (data[0] instanceof Array) {
        for (var i = 0, m = data[0].length; i < m; i++) {
          text += String.fromCharCode(data[0][i])
        }
      } else {
        text = String.fromCharCode(data[0])
      }
      if (data[4]) {
        scale = scale * data[4]
      }
      var svg = this.HandleVariant(variant, scale, text);
      if (data[2]) {
        svg.x = data[2] * 1000
      }
      if (data[3]) {
        svg.y = data[3] * 1000
      }
      if (data[5]) {
        svg.h += data[5] * 1000
      }
      if (data[6]) {
        svg.d += data[6] * 1000
      }
      return svg;
    },
    extendDelimiterV: function(svg, H, delim, scale, font) {
      var top = this.createChar(scale, (delim.top || delim.ext), font);
      var bot = this.createChar(scale, (delim.bot || delim.ext), font);
      var h = top.h + top.d + bot.h + bot.d;
      var y = -top.h;
      svg.Add(top, 0, y);
      y -= top.d;
      if (delim.mid) {
        var mid = this.createChar(scale, delim.mid, font);
        h += mid.h + mid.d
      }
      if (delim.min && H < h * delim.min) {
        H = h * delim.min
      }
      if (H > h) {
        var ext = this.createChar(scale, delim.ext, font);
        var k = (delim.mid ? 2 : 1),
            eH = (H - h) / k,
            s = (eH + 100) / (ext.h + ext.d);
        while (k-- > 0) {
          var g = SVG.Element("g", {
            transform: "translate(" + ext.y + "," + (y - s * ext.h + 50 + ext.y) + ") scale(1," + s + ")"
          });
          g.appendChild(ext.element.cloneNode(false));
          svg.element.appendChild(g);
          y -= eH;
          if (delim.mid && k) {
            svg.Add(mid, 0, y - mid.h);
            y -= (mid.h + mid.d)
          }
        }
      } else if (delim.mid) {
        y += (h - H) / 2;
        svg.Add(mid, 0, y - mid.h);
        y += -(mid.h + mid.d) + (h - H) / 2;
      } else {
        y += (h - H);
      }
      svg.Add(bot, 0, y - bot.h);
      svg.Clean();
      svg.scale = scale;
      svg.isMultiChar = true;
    },
    extendDelimiterH: function(svg, W, delim, scale, font) {
      var left = this.createChar(scale, (delim.left || delim.rep), font);
      var right = this.createChar(scale, (delim.right || delim.rep), font);
      svg.Add(left, -left.l, 0);
      var w = (left.r - left.l) + (right.r - right.l),
          x = left.r - left.l;
      if (delim.mid) {
        var mid = this.createChar(scale, delim.mid, font);
        w += mid.w
      }
      if (delim.min && W < w * delim.min) {
        W = w * delim.min
      }
      if (W > w) {
        var rep = this.createChar(scale, delim.rep, font),
            fuzz = delim.fuzz || 0;
        var k = (delim.mid ? 2 : 1),
            rW = (W - w) / k,
            s = (rW + fuzz) / (rep.r - rep.l);
        while (k-- > 0) {
          var g = SVG.Element("g", {
            transform: "translate(" + (x - fuzz / 2 - s * rep.l + rep.x) + "," + rep.y + ") scale(" + s + ",1)"
          });
          g.appendChild(rep.element.cloneNode(false));
          svg.element.appendChild(g);
          x += rW;
          if (delim.mid && k) {
            svg.Add(mid, x, 0);
            x += mid.w
          }
        }
      } else if (delim.mid) {
        x -= (w - W) / 2;
        svg.Add(mid, x, 0);
        x += mid.w - (w - W) / 2;
      } else {
        x -= (w - W);
      }
      svg.Add(right, x - right.l, 0);
      svg.Clean();
      svg.scale = scale;
      svg.isMultiChar = true;
    },


    MATHSPACE: {
      veryverythinmathspace: 1 / 18,
      verythinmathspace: 2 / 18,
      thinmathspace: 3 / 18,
      mediummathspace: 4 / 18,
      thickmathspace: 5 / 18,
      verythickmathspace: 6 / 18,
      veryverythickmathspace: 7 / 18,
      negativeveryverythinmathspace: -1 / 18,
      negativeverythinmathspace: -2 / 18,
      negativethinmathspace: -3 / 18,
      negativemediummathspace: -4 / 18,
      negativethickmathspace: -5 / 18,
      negativeverythickmathspace: -6 / 18,
      negativeveryverythickmathspace: -7 / 18
    },

    //
    //  Units are em/1000 so quad is 1em
    //
    TeX: {
      x_height: 430.554,
      quad: 1000,
      num1: 676.508,
      num2: 393.732,
      num3: 443.73,
      denom1: 685.951,
      denom2: 344.841,
      sup1: 412.892,
      sup2: 362.892,
      sup3: 288.888,
      sub1: 150,
      sub2: 247.217,
      sup_drop: 386.108,
      sub_drop: 50,
      delim1: 2390,
      delim2: 1000,
      axis_height: 250,
      rule_thickness: 60,
      big_op_spacing1: 111.111,
      big_op_spacing2: 166.666,
      big_op_spacing3: 200,
      big_op_spacing4: 600,
      big_op_spacing5: 100,

      scriptspace: 100,
      nulldelimiterspace: 120,
      delimiterfactor: 901,
      delimitershortfall: 300,

      min_rule_thickness: 1.25, // in pixels
      min_root_space: 1.5 // in pixels
    },

    BIGDIMEN: 10000000,
    NBSP: "\u00A0"
  });

  var BBOX = SVG.BBOX = MathJax.Object.Subclass({
    type: "g",
    removeable: true,
    Init: function(def) {
      this.h = this.d = -SVG.BIGDIMEN;
      this.H = this.D = 0;
      this.w = this.r = 0;
      this.l = SVG.BIGDIMEN;
      this.x = this.y = 0;
      this.scale = 1;
      this.n = 0;
      if (this.type) {
        this.element = SVG.Element(this.type, def)
      }
    },
    With: function(def) {
      return HUB.Insert(this, def)
    },
    Add: function(svg, dx, dy, forcew, infront) {
      if (dx) {
        svg.x += dx
      };
      if (dy) {
        svg.y += dy
      };
      if (svg.element) {
        if (svg.removeable && svg.element.childNodes.length === 1 && svg.n === 1) {
          var child = svg.element.firstChild,
              nodeName = child.nodeName.toLowerCase();
          if (nodeName === "use" || nodeName === "rect") {
            svg.element = child;
            svg.scale = svg.childScale;
            var x = svg.childX,
                y = svg.childY;
            svg.x += x;
            svg.y += y;
            svg.h -= y;
            svg.d += y;
            svg.H -= y;
            svg.D += y;
            svg.w -= x;
            svg.r -= x;
            svg.l += x;
            svg.removeable = false;
            child.setAttribute("x", Math.floor(svg.x / svg.scale));
            child.setAttribute("y", Math.floor(svg.y / svg.scale));
          }
        }
        if (Math.abs(svg.x) < 1 && Math.abs(svg.y) < 1) {
          svg.remove = svg.removeable;
        } else {
          nodeName = svg.element.nodeName.toLowerCase();
          if (nodeName === "g") {
            if (!svg.element.firstChild) {
              svg.remove = svg.removeable
            } else {
              svg.element.setAttribute("transform", "translate(" + Math.floor(svg.x) + "," + Math.floor(svg.y) + ")")
            }
          } else if (nodeName === "line" || nodeName === "polygon" ||
                     nodeName === "path" || nodeName === "a") {
            svg.element.setAttribute("transform", "translate(" + Math.floor(svg.x) + "," + Math.floor(svg.y) + ")");
          } else {
            svg.element.setAttribute("x", Math.floor(svg.x / svg.scale));
            svg.element.setAttribute("y", Math.floor(svg.y / svg.scale));
          }
        }
        if (svg.remove) {
          this.n += svg.n;
          while (svg.element.firstChild) {
            if (infront && this.element.firstChild) {
              this.element.insertBefore(svg.element.firstChild, this.element.firstChild);
            } else {
              this.element.appendChild(svg.element.firstChild);
            }
          }
        } else {
          if (infront) {
            this.element.insertBefore(svg.element, this.element.firstChild)
          } else {
            this.element.appendChild(svg.element)
          }
        }
        delete svg.element;
      }
      if (svg.hasIndent) {
        this.hasIndent = svg.hasIndent
      }
      if (svg.tw != null) {
        this.tw = svg.tw
      }
      if (svg.d - svg.y > this.d) {
        this.d = svg.d - svg.y;
        if (this.d > this.D) {
          this.D = this.d
        }
      }
      if (svg.y + svg.h > this.h) {
        this.h = svg.y + svg.h;
        if (this.h > this.H) {
          this.H = this.h
        }
      }
      if (svg.D - svg.y > this.D) {
        this.D = svg.D - svg.y
      }
      if (svg.y + svg.H > this.H) {
        this.H = svg.y + svg.H
      }
      if (svg.x + svg.l < this.l) {
        this.l = svg.x + svg.l
      }
      if (svg.x + svg.r > this.r) {
        this.r = svg.x + svg.r
      }
      if (forcew || svg.x + svg.w + (svg.X || 0) > this.w) {
        this.w = svg.x + svg.w + (svg.X || 0)
      }
      this.childScale = svg.scale;
      this.childX = svg.x;
      this.childY = svg.y;
      this.n++;
      return svg;
    },
    Align: function(svg, align, dx, dy, shift) {
      dx = ({
        left: dx,
        center: (this.w - svg.w) / 2,
        right: this.w - svg.w - dx
      })[align] || 0;
      var w = this.w;
      this.Add(svg, dx + (shift || 0), dy);
      this.w = w;
    },
    Clean: function() {
      if (this.h === -SVG.BIGDIMEN) {
        this.h = this.d = this.l = 0
      }
      return this;
    }
  });

  BBOX.ROW = BBOX.Subclass({
    Init: function() {
      this.SUPER(arguments).Init.call(this);
      this.svg = [];
      this.sh = this.sd = 0;
    },
    Check: function(data) {
      var svg = data.toSVG();
      this.svg.push(svg);
      if (data.SVGcanStretch("Vertical")) {
        svg.mml = data
      }
      if (svg.h > this.sh) {
        this.sh = svg.h
      }
      if (svg.d > this.sd) {
        this.sd = svg.d
      }
      return svg;
    },
    Stretch: function() {
      for (var i = 0, m = this.svg.length; i < m; i++) {
        var svg = this.svg[i],
            mml = svg.mml;
        if (mml) {
          if (mml.forceStretch || mml.EditableSVGdata.h !== this.sh || mml.EditableSVGdata.d !== this.sd) {
            svg = mml.SVGstretchV(this.sh, this.sd);
          }
          mml.EditableSVGdata.HW = this.sh;
          mml.EditableSVGdata.D = this.sd;
        }
        if (svg.ic) {
          this.ic = svg.ic
        } else {
          delete this.ic
        }
        this.Add(svg, this.w, 0, true);
      }
      delete this.svg;
    }
  });

  BBOX.RECT = BBOX.Subclass({
    type: "rect",
    removeable: false,
    Init: function(h, d, w, def) {
      if (def == null) {
        def = {
          stroke: "none"
        }
      }
      def.width = Math.floor(w);
      def.height = Math.floor(h + d);
      this.SUPER(arguments).Init.call(this, def);
      this.w = this.r = w;
      this.h = this.H = h + d;
      this.d = this.D = this.l = 0;
      this.y = -d;
    }
  });

  BBOX.FRAME = BBOX.Subclass({
    type: "rect",
    removeable: false,
    Init: function(h, d, w, t, dash, color, def) {
      if (def == null) {
        def = {}
      };
      def.fill = "none";
      def["stroke-width"] = SVG.Fixed(t, 2);
      def.width = Math.floor(w - t);
      def.height = Math.floor(h + d - t);
      def.transform = "translate(" + Math.floor(t / 2) + "," + Math.floor(-d + t / 2) + ")";
      if (dash === "dashed") {
        def["stroke-dasharray"] = [Math.floor(6 * SVG.em), Math.floor(6 * SVG.em)].join(" ")
      }
      this.SUPER(arguments).Init.call(this, def);
      this.w = this.r = w;
      this.h = this.H = h;
      this.d = this.D = d;
      this.l = 0;
    }
  });

  BBOX.HLINE = BBOX.Subclass({
    type: "line",
    removeable: false,
    Init: function(w, t, dash, color, def) {
      if (def == null) {
        def = {
          "stroke-linecap": "square"
        }
      }
      if (color && color !== "") {
        def.stroke = color
      }
      def["stroke-width"] = SVG.Fixed(t, 2);
      def.x1 = def.y1 = def.y2 = Math.floor(t / 2);
      def.x2 = Math.floor(w - t / 2);
      if (dash === "dashed") {
        var n = Math.floor(Math.max(0, w - t) / (6 * t)),
            m = Math.floor(Math.max(0, w - t) / (2 * n + 1));
        def["stroke-dasharray"] = m + " " + m;
      }
      if (dash === "dotted") {
        def["stroke-dasharray"] = [1, Math.max(150, Math.floor(2 * t))].join(" ");
        def["stroke-linecap"] = "round";
      }
      this.SUPER(arguments).Init.call(this, def);
      this.w = this.r = w;
      this.l = 0;
      this.h = this.H = t;
      this.d = this.D = 0;
    }
  });

  BBOX.VLINE = BBOX.Subclass({
    type: "line",
    removeable: false,
    Init: function(h, t, dash, color, def) {
      if (def == null) {
        def = {
          "stroke-linecap": "square"
        }
      }
      if (color && color !== "") {
        def.stroke = color
      }
      def["stroke-width"] = SVG.Fixed(t, 2);
      def.x1 = def.x2 = def.y1 = Math.floor(t / 2);
      def.y2 = Math.floor(h - t / 2);
      if (dash === "dashed") {
        var n = Math.floor(Math.max(0, h - t) / (6 * t)),
            m = Math.floor(Math.max(0, h - t) / (2 * n + 1));
        def["stroke-dasharray"] = m + " " + m;
      }
      if (dash === "dotted") {
        def["stroke-dasharray"] = [1, Math.max(150, Math.floor(2 * t))].join(" ");
        def["stroke-linecap"] = "round";
      }
      this.SUPER(arguments).Init.call(this, def);
      this.w = this.r = t;
      this.l = 0;
      this.h = this.H = h;
      this.d = this.D = 0;
    }
  });

  BBOX.TEXT = BBOX.Subclass({
    type: "text",
    removeable: false,
    Init: function(scale, text, def) {
      if (!def) {
        def = {}
      };
      def.stroke = "none";
      if (def["font-style"] === "") delete def["font-style"];
      if (def["font-weight"] === "") delete def["font-weight"];
      this.SUPER(arguments).Init.call(this, def);
      SVG.addText(this.element, text);
      SVG.textSVG.appendChild(this.element);
      var bbox = this.element.getBBox();
      SVG.textSVG.removeChild(this.element);
      scale *= 1000 / SVG.em;
      this.element.setAttribute("transform", "scale(" + SVG.Fixed(scale) + ") matrix(1 0 0 -1 0 0)");
      this.w = this.r = bbox.width * scale;
      this.l = 0;
      this.h = this.H = -bbox.y * scale;
      this.d = this.D = (bbox.height + bbox.y) * scale;
    }
  });

  BBOX.G = BBOX;

  BBOX.NULL = BBOX.Subclass({
    Init: function() {
      this.SUPER(arguments).Init.apply(this, arguments);
      this.Clean();
    }
  });

  BBOX.GLYPH = BBOX.Subclass({
    type: "path",
    removeable: false,
    Init: function(scale, id, h, d, w, l, r, p) {
      var def, t = SVG.config.blacker,
          GLYPH = BBOX.GLYPH;
      var cache = SVG.config.useFontCache;
      var transform = (scale === 1 ? null : "scale(" + SVG.Fixed(scale) + ")");
      if (cache && !SVG.config.useGlobalCache) {
        id = "E" + GLYPH.n + "-" + id
      }
      if (!cache || !GLYPH.glyphs[id]) {
        def = {
          "stroke-width": t
        };
        if (cache) {
          def.id = id
        } else if (transform) {
          def.transform = transform
        }
        def.d = (p ? "M" + p + "Z" : "");
        this.SUPER(arguments).Init.call(this, def);
        if (cache) {
          GLYPH.defs.appendChild(this.element);
          GLYPH.glyphs[id] = true;
        }
      }
      if (cache) {
        def = {};
        if (transform) {
          def.transform = transform
        }
        this.element = SVG.Element("use", def);
        this.element.setAttributeNS(XLINKNS, "href", "#" + id);
      }
      this.h = (h + t) * scale;
      this.d = (d + t) * scale;
      this.w = (w + t / 2) * scale;
      this.l = (l + t / 2) * scale;
      this.r = (r + t / 2) * scale;
      this.H = Math.max(0, this.h);
      this.D = Math.max(0, this.d);
      this.x = this.y = 0;
      this.scale = scale;
    }
  }, {
    glyphs: {}, // which glpyhs have been used
    defs: null, // the SVG <defs> element where glyphs are stored
    n: 0 // the ID for local <defs> for self-contained SVG elements
  });

  HUB.Register.StartupHook("mml Jax Ready", function() {

    MML = MathJax.ElementJax.mml;

    function getCursorValue(direction) {
      if (isNaN(direction)) {
        switch(direction[0].toLowerCase()) {
          case 'u': return UP
          case 'd': return DOWN
          case 'l': return LEFT
          case 'r': return RIGHT
        }
        throw new Error('Invalid cursor value')
      } else {
        return direction
      }
    }

    MML.mbase.Augment({
      SVG: BBOX,

      getSVGBBox: function(elem) {
        var elem = elem || this.EditableSVGelem
        if (!elem || !elem.ownerSVGElement) return

        var bb = elem.getBBox()
        if (elem.nodeName === 'use') {
          bb.x += Number(elem.getAttribute('x'))
          bb.y += Number(elem.getAttribute('y'))
        }
        var transform = elem.getTransformToElement(elem.ownerSVGElement)
        var ptmp = elem.ownerSVGElement.createSVGPoint()
        var lx = 1/0, ly = 1/0, hx = -1/0, hy = -1/0

        check(bb.x, bb.y)
        check(bb.x+bb.width, bb.y)
        check(bb.x, bb.y+bb.height)
        check(bb.x+bb.width, bb.y+bb.height)

        return {
          x: lx,
          y: ly,
          width: hx-lx,
          height: hy-ly,
        }

        function check(x, y) {
          ptmp.x = x
          ptmp.y = y
          var p = ptmp.matrixTransform(transform)
          lx = Math.min(lx, p.x)
          ly = Math.min(ly, p.y)
          hx = Math.max(hx, p.x)
          hy = Math.max(hy, p.y)
        }
      },

      getBB: function(relativeTo) {
        var elem = this.EditableSVGelem;
        if (!elem) {
          console.error('Oh no! Couldn\'t find elem for ', this.type);
          return;
        }

        return elem.getBBox();
      },

      moveCursor: function(cursor, direction) {
        this.parent.moveCursorFromChild(cursor, direction, this)
      },

      moveCursorFromChild: function(cursor, direction, child) {
        throw new Error('Unimplemented as cursor container')
      },

      moveCursorFromParent: function(cursor, direction) {
        return false
      },

      moveCursorFromClick: function(cursor, x, y) {
        return false
      },

      drawCursor: function(cursor) {
        throw new Error('Unable to draw cursor')
      },

      toSVG: function() {
        this.SVGgetStyles();
        var variant = this.SVGgetVariant();
        var svg = this.SVG();
        this.SVGgetScale(svg);
        this.SVGhandleSpace(svg);
        for (var i = 0, m = this.data.length; i < m; i++) {
          if (this.data[i]) {
            var child = svg.Add(this.data[i].toSVG(variant, svg.scale), svg.w, 0, true);
            if (child.skew) {
              svg.skew = child.skew
            }
          }
        }
        svg.Clean();
        var text = this.data.join("");
        if (svg.skew && text.length !== 1) {
          delete svg.skew
        }
        if (svg.r > svg.w && text.length === 1 && !variant.noIC) {
          svg.ic = svg.r - svg.w;
          svg.w = svg.r
        }
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        return svg;
      },

      SVGchildSVG: function(i) {
        return (this.data[i] ? this.data[i].toSVG() : BBOX());
      },

      EditableSVGdataStretched: function(i, HW, D) {
        this.EditableSVGdata = {
          HW: HW,
          D: D
        };
        if (!this.data[i]) {
          return BBOX()
        }
        if (D != null) {
          return this.data[i].SVGstretchV(HW, D)
        }
        if (HW != null) {
          return this.data[i].SVGstretchH(HW)
        }
        return this.data[i].toSVG();
      },

      SVGsaveData: function(svg) {
        /*
          SVGsaveData is called every time a new svg element wants to be rendered
          SVGsaveData pushes CSS attributes etc. onto the actual svg elements
          setting this.EditableSVGelem to this svg.element will keep the copy fresh even when the parent
          re-renders the child's svg elements (e.g. with a stretch)
         */
        this.EditableSVGelem = svg.element
        if (!this.EditableSVGdata) {
          this.EditableSVGdata = {}
        }
        this.EditableSVGdata.w = svg.w, this.EditableSVGdata.x = svg.x;
        this.EditableSVGdata.h = svg.h, this.EditableSVGdata.d = svg.d;
        if (svg.y) {
          this.EditableSVGdata.h += svg.y;
          this.EditableSVGdata.d -= svg.y
        }
        if (svg.X != null) {
          this.EditableSVGdata.X = svg.X
        }
        if (svg.tw != null) {
          this.EditableSVGdata.tw = svg.tw
        }
        if (svg.skew) {
          this.EditableSVGdata.skew = svg.skew
        }
        if (svg.ic) {
          this.EditableSVGdata.ic = svg.ic
        }
        if (this["class"]) {
          svg.removeable = false;
          SVG.Element(svg.element, {
            "class": this["class"]
          })
        }
        // FIXME:  if an element is split by linebreaking, the ID will be the same on both parts
        // FIXME:  if an element has an id, its zoomed copy will have the same ID
        if (this.id) {
          svg.removeable = false;
          SVG.Element(svg.element, {
            "id": this.id
          })
        }
        if (this.href) {
          var a = SVG.Element("a", {
            "class": "mjx-svg-href"
          });
          a.setAttributeNS(XLINKNS, "href", this.href);
          a.onclick = this.SVGlink;
          SVG.addElement(a, "rect", {
            width: svg.w,
            height: svg.h + svg.d,
            y: -svg.d,
            fill: "none",
            stroke: "none",
            "pointer-events": "all"
          });
          if (svg.type === "svg") {
            // for svg element, put <a> inside the main <g> element
            var g = svg.element.firstChild;
            while (g.firstChild) {
              a.appendChild(g.firstChild)
            }
            g.appendChild(a);
          } else {
            a.appendChild(svg.element);
            svg.element = a;
          }
          svg.removeable = false;
        }
        if (SVG.config.addMMLclasses) {
          this.SVGaddClass(svg.element, "mjx-svg-" + this.type);
          svg.removeable = false;
        }
        var style = this.style;
        if (style && svg.element) {
          svg.element.style.cssText = style;
          if (svg.element.style.fontSize) {
            svg.element.style.fontSize = ""
          } // handled by scale
          svg.element.style.border = svg.element.style.padding = "";
          if (svg.removeable) {
            svg.removeable = (svg.element.style.cssText === "")
          }
        }
        this.SVGaddAttributes(svg);
      },
      SVGaddClass: function(node, name) {
        var classes = node.getAttribute("class");
        node.setAttribute("class", (classes ? classes + " " : "") + name);
      },
      SVGaddAttributes: function(svg) {
        //
        //  Copy RDFa, aria, and other tags from the MathML to the HTML-CSS
        //  output spans Don't copy those in the MML.nocopyAttributes list,
        //  the ignoreMMLattributes configuration list, or anything tha
        //  already exists as a property of the span (e.g., no "onlick", etc.)
        //  If a name in the ignoreMMLattributes object is set to false, then
        //  the attribute WILL be copied.
        //
        if (this.attrNames) {
          var copy = this.attrNames,
              skip = MML.nocopyAttributes,
              ignore = HUB.config.ignoreMMLattributes;
          var defaults = (this.type === "mstyle" ? MML.math.prototype.defaults : this.defaults);
          for (var i = 0, m = copy.length; i < m; i++) {
            var id = copy[i];
            if (ignore[id] == false || (!skip[id] && !ignore[id] &&
                                        defaults[id] == null && typeof(svg.element[id]) === "undefined")) {
              svg.element.setAttribute(id, this.attr[id]);
              svg.removeable = false;
            }
          }
        }
      },
      //
      //  WebKit currently scrolls to the BOTTOM of an svg element if it contains the
      //  target of the link, so implement link by hand, to the containing span element.
      //
      SVGlink: function() {
        var href = this.href.animVal;
        if (href.charAt(0) === "#") {
          var target = SVG.hashCheck(document.getElementById(href.substr(1)));
          if (target && target.scrollIntoView) {
            setTimeout(function() {
              target.parentNode.scrollIntoView(true)
            }, 1)
          }
        }
        document.location = href;
      },

      SVGgetStyles: function() {
        if (this.style) {
          var span = HTML.Element("span");
          span.style.cssText = this.style;
          this.styles = this.SVGprocessStyles(span.style);
        }
      },
      SVGprocessStyles: function(style) {
        var styles = {
          border: SVG.getBorders(style),
          padding: SVG.getPadding(style)
        };
        if (!styles.border) {
          delete styles.border
        }
        if (!styles.padding) {
          delete styles.padding
        }
        if (style.fontSize) {
          styles.fontSize = style.fontSize
        }
        if (style.color) {
          styles.color = style.color
        }
        if (style.backgroundColor) {
          styles.background = style.backgroundColor
        }
        if (style.fontStyle) {
          styles.fontStyle = style.fontStyle
        }
        if (style.fontWeight) {
          styles.fontWeight = style.fontWeight
        }
        if (style.fontFamily) {
          styles.fontFamily = style.fontFamily
        }
        if (styles.fontWeight && styles.fontWeight.match(/^\d+$/)) {
          styles.fontWeight = (parseInt(styles.fontWeight) > 600 ? "bold" : "normal")
        }
        return styles;
      },

      SVGhandleSpace: function(svg) {
        if (this.useMMLspacing) {
          if (this.type !== "mo") return;
          var values = this.getValues("scriptlevel", "lspace", "rspace");
          if (values.scriptlevel <= 0 || this.hasValue("lspace") || this.hasValue("rspace")) {
            var mu = this.SVGgetMu(svg);
            values.lspace = Math.max(0, SVG.length2em(values.lspace, mu));
            values.rspace = Math.max(0, SVG.length2em(values.rspace, mu));
            var core = this,
                parent = this.Parent();
            while (parent && parent.isEmbellished() && parent.Core() === core) {
              core = parent;
              parent = parent.Parent()
            }
            if (values.lspace) {
              svg.x += values.lspace
            }
            if (values.rspace) {
              svg.X = values.rspace
            }
          }
        } else {
          var space = this.texSpacing();
          this.SVGgetScale();
          if (space !== "") {
            svg.x += SVG.length2em(space, this.scale) * this.mscale
          }
        }
      },

      SVGhandleColor: function(svg) {
        var values = this.getValues("mathcolor", "color");
        if (this.styles && this.styles.color && !values.color) {
          values.color = this.styles.color
        }
        if (values.color && !this.mathcolor) {
          values.mathcolor = values.color
        }
        if (values.mathcolor) {
          SVG.Element(svg.element, {
            fill: values.mathcolor,
            stroke: values.mathcolor
          })
          svg.removeable = false;
        }
        var borders = (this.styles || {}).border,
            padding = (this.styles || {}).padding,
            bleft = ((borders || {}).left || 0),
            pleft = ((padding || {}).left || 0),
            id;
        values.background = (this.mathbackground || this.background ||
                             (this.styles || {}).background || MML.COLOR.TRANSPARENT);
        if (bleft + pleft) {
          //
          //  Make a box and move the contents of svg to it,
          //    then add it back into svg, but offset by the left amount
          //
          var dup = BBOX();
          for (id in svg) {
            if (svg.hasOwnProperty(id)) {
              dup[id] = svg[id]
            }
          }
          dup.x = 0;
          dup.y = 0;
          svg.element = SVG.Element("g");
          svg.removeable = true;
          svg.Add(dup, bleft + pleft, 0);
        }
        //
        //  Adjust size by padding and dashed borders (left is taken care of above)
        //
        if (padding) {
          svg.w += padding.right || 0;
          svg.h += padding.top || 0;
          svg.d += padding.bottom || 0
        }
        if (borders) {
          svg.w += borders.right || 0;
          svg.h += borders.top || 0;
          svg.d += borders.bottom || 0
        }
        //
        //  Add background color
        //
        if (values.background !== MML.COLOR.TRANSPARENT) {
          var nodeName = svg.element.nodeName.toLowerCase();
          if (nodeName !== "g" && nodeName !== "svg") {
            var g = SVG.Element("g");
            g.appendChild(svg.element);
            svg.element = g;
            svg.removeable = true;
          }
          svg.Add(BBOX.RECT(svg.h, svg.d, svg.w, {
            fill: values.background,
            stroke: "none"
          }), 0, 0, false, true)
        }
        //
        //  Add borders
        //
        if (borders) {
          var dd = 5; // fuzz factor to avoid anti-alias problems at edges
          var sides = {
            left: ["V", svg.h + svg.d, -dd, -svg.d],
            right: ["V", svg.h + svg.d, svg.w - borders.right + dd, -svg.d],
            top: ["H", svg.w, 0, svg.h - borders.top + dd],
            bottom: ["H", svg.w, 0, -svg.d - dd]
          }
          for (id in sides) {
            if (sides.hasOwnProperty(id)) {
              if (borders[id]) {
                var side = sides[id],
                    box = BBOX[side[0] + "LINE"];
                svg.Add(box(side[1], borders[id], borders[id + "Style"], borders[id + "Color"]), side[2], side[3]);
              }
            }
          }
        }
      },

      SVGhandleVariant: function(variant, scale, text) {
        return SVG.HandleVariant(variant, scale, text);
      },

      SVGgetVariant: function() {
        var values = this.getValues("mathvariant", "fontfamily", "fontweight", "fontstyle");
        var variant = values.mathvariant;
        if (this.variantForm) {
          variant = "-TeX-variant"
        }
        values.hasVariant = this.Get("mathvariant", true); // null if not explicitly specified
        if (!values.hasVariant) {
          values.family = values.fontfamily;
          values.weight = values.fontweight;
          values.style = values.fontstyle;
        }
        if (this.styles) {
          if (!values.style && this.styles.fontStyle) {
            values.style = this.styles.fontStyle
          }
          if (!values.weight && this.styles.fontWeight) {
            values.weight = this.styles.fontWeight
          }
          if (!values.family && this.styles.fontFamily) {
            values.family = this.styles.fontFamily
          }
        }
        if (values.family && !values.hasVariant) {
          if (!values.weight && values.mathvariant.match(/bold/)) {
            values.weight = "bold"
          }
          if (!values.style && values.mathvariant.match(/italic/)) {
            values.style = "italic"
          }
          variant = {
            forceFamily: true,
            font: {
              "font-family": values.family
            }
          };
          if (values.style) {
            variant.font["font-style"] = values.style
          }
          if (values.weight) {
            variant.font["font-weight"] = values.weight
          }
          return variant;
        }
        if (values.weight === "bold") {
          variant = {
            normal: MML.VARIANT.BOLD,
            italic: MML.VARIANT.BOLDITALIC,
            fraktur: MML.VARIANT.BOLDFRAKTUR,
            script: MML.VARIANT.BOLDSCRIPT,
            "sans-serif": MML.VARIANT.BOLDSANSSERIF,
            "sans-serif-italic": MML.VARIANT.SANSSERIFBOLDITALIC
          }[variant] || variant;
        } else if (values.weight === "normal") {
          variant = {
            bold: MML.VARIANT.normal,
            "bold-italic": MML.VARIANT.ITALIC,
            "bold-fraktur": MML.VARIANT.FRAKTUR,
            "bold-script": MML.VARIANT.SCRIPT,
            "bold-sans-serif": MML.VARIANT.SANSSERIF,
            "sans-serif-bold-italic": MML.VARIANT.SANSSERIFITALIC
          }[variant] || variant;
        }
        if (values.style === "italic") {
          variant = {
            normal: MML.VARIANT.ITALIC,
            bold: MML.VARIANT.BOLDITALIC,
            "sans-serif": MML.VARIANT.SANSSERIFITALIC,
            "bold-sans-serif": MML.VARIANT.SANSSERIFBOLDITALIC
          }[variant] || variant;
        } else if (values.style === "normal") {
          variant = {
            italic: MML.VARIANT.NORMAL,
            "bold-italic": MML.VARIANT.BOLD,
            "sans-serif-italic": MML.VARIANT.SANSSERIF,
            "sans-serif-bold-italic": MML.VARIANT.BOLDSANSSERIF
          }[variant] || variant;
        }
        if (!(variant in SVG.FONTDATA.VARIANT)) {
          // If the mathvariant value is invalid or not supported by this
          // font, fallback to normal. See issue 363.
          variant = "normal";
        }
        return SVG.FONTDATA.VARIANT[variant];
      },

      SVGgetScale: function(svg) {
        var scale = 1;
        if (this.mscale) {
          scale = this.scale;
        } else {
          var values = this.getValues("scriptlevel", "fontsize");
          values.mathsize = (this.isToken ? this : this.Parent()).Get("mathsize");
          if ((this.styles || {}).fontSize && !values.fontsize) {
            values.fontsize = this.styles.fontSize
          }
          if (values.fontsize && !this.mathsize) {
            values.mathsize = values.fontsize
          }
          if (values.scriptlevel !== 0) {
            if (values.scriptlevel > 2) {
              values.scriptlevel = 2
            }
            scale = Math.pow(this.Get("scriptsizemultiplier"), values.scriptlevel);
            values.scriptminsize = SVG.length2em(this.Get("scriptminsize")) / 1000;
            if (scale < values.scriptminsize) {
              scale = values.scriptminsize
            }
          }
          this.scale = scale;
          this.mscale = SVG.length2em(values.mathsize) / 1000;
        }
        if (svg) {
          svg.scale = scale;
          if (this.isToken) {
            svg.scale *= this.mscale
          }
        }
        return scale * this.mscale;
      },
      SVGgetMu: function(svg) {
        var mu = 1,
            values = this.getValues("scriptlevel", "scriptsizemultiplier");
        if (svg.scale && svg.scale !== 1) {
          mu = 1 / svg.scale
        }
        if (values.scriptlevel !== 0) {
          if (values.scriptlevel > 2) {
            values.scriptlevel = 2
          }
          mu = Math.sqrt(Math.pow(values.scriptsizemultiplier, values.scriptlevel));
        }
        return mu;
      },

      SVGnotEmpty: function(data) {
        while (data) {
          if ((data.type !== "mrow" && data.type !== "texatom") ||
              data.data.length > 1) {
            return true
          }
          data = data.data[0];
        }
        return false;
      },

      SVGcanStretch: function(direction) {
        var can = false;
        if (this.isEmbellished()) {
          var core = this.Core();
          if (core && core !== this) {
            can = core.SVGcanStretch(direction);
            if (can && core.forceStretch) {
              this.forceStretch = true
            }
          }
        }
        return can;
      },
      SVGstretchV: function(h, d) {
        return this.toSVG(h, d)
      },
      SVGstretchH: function(w) {
        return this.toSVG(w)
      },

      SVGlineBreaks: function() {
        return false
      }

    }, {
      SVGautoload: function() {
        var file = SVG.autoloadDir + "/" + this.type + ".js";
        HUB.RestartAfter(AJAX.Require(file));
      },
      SVGautoloadFile: function(name) {
        var file = SVG.autoloadDir + "/" + name + ".js";
        HUB.RestartAfter(AJAX.Require(file));
      }
    });

    MML.chars.Augment({
      toSVG: function(variant, scale, remap, chars) {
        var text = this.data.join("").replace(/[\u2061-\u2064]/g, ""); // remove invisibles
        if (remap) {
          text = remap(text, chars)
        }
        var charsThing = this.SVGhandleVariant(variant, scale, text);
        // this.EditableSVGelem = charsThing.element; we don't want this one
        return charsThing;
      }
    });

    MML.entity.Augment({
      toSVG: function(variant, scale, remap, chars) {
        var text = this.toString().replace(/[\u2061-\u2064]/g, ""); // remove invisibles
        if (remap) {
          text = remap(text, chars)
        }
        return this.SVGhandleVariant(variant, scale, text);
      }
    });

    MML.mo.Augment({
      toSVG: function(HW, D) {
        this.SVGgetStyles();
        var svg = this.svg = this.SVG();
        var scale = this.SVGgetScale(svg);
        this.SVGhandleSpace(svg);
        if (this.data.length == 0) {
          svg.Clean();
          this.SVGsaveData(svg);
          return svg
        }

        //  Stretch the operator, if that is requested
        if (D != null) {
          return this.SVGstretchV(HW, D)
        } else if (HW != null) {
          return this.SVGstretchH(HW)
        }

        //  Get the variant, and check for operator size
        var variant = this.SVGgetVariant();
        var values = this.getValues("largeop", "displaystyle");
        if (values.largeop) {
          variant = SVG.FONTDATA.VARIANT[values.displaystyle ? "-largeOp" : "-smallOp"]
        }

        //  Get character translation for superscript and accents
        var parent = this.CoreParent(),
            isScript = (parent && parent.isa(MML.msubsup) && this !== parent.data[0]),
            mapchars = (isScript ? this.remapChars : null);
        if (this.data.join("").length === 1 && parent && parent.isa(MML.munderover) &&
            this.CoreText(parent.data[parent.base]).length === 1) {
          var over = parent.data[parent.over],
              under = parent.data[parent.under];
          if (over && this === over.CoreMO() && parent.Get("accent")) {
            mapchars = SVG.FONTDATA.REMAPACCENT
          } else if (under && this === under.CoreMO() && parent.Get("accentunder")) {
            mapchars = SVG.FONTDATA.REMAPACCENTUNDER
          }
        }

        //  Primes must come from another font
        if (isScript && this.data.join("").match(/['`"\u00B4\u2032-\u2037\u2057]/)) {
          variant = SVG.FONTDATA.VARIANT["-TeX-variant"]
        }

        //  Typeset contents
        for (var i = 0, m = this.data.length; i < m; i++) {
          if (this.data[i]) {
            var text = this.data[i].toSVG(variant, scale, this.remap, mapchars),
                x = svg.w;
            if (x === 0 && -text.l > 10 * text.w) {
              x += -text.l
            } // initial combining character doesn't combine
            svg.Add(text, x, 0, true);
            if (text.skew) {
              svg.skew = text.skew
            }
          }
        }
        svg.Clean();
        if (this.data.join("").length !== 1) {
          delete svg.skew
        }

        //  Handle large operator centering
        if (values.largeop) {
          svg.y = SVG.TeX.axis_height - (svg.h - svg.d) / 2 / scale;
          if (svg.r > svg.w) {
            svg.ic = svg.r - svg.w;
            svg.w = svg.r
          }
        }

        //  Finish up
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);

        return svg;
      },
      SVGcanStretch: function(direction) {
        if (!this.Get("stretchy")) {
          return false
        }
        var c = this.data.join("");
        if (c.length > 1) {
          return false
        }
        var parent = this.CoreParent();
        if (parent && parent.isa(MML.munderover) &&
            this.CoreText(parent.data[parent.base]).length === 1) {
          var over = parent.data[parent.over],
              under = parent.data[parent.under];
          if (over && this === over.CoreMO() && parent.Get("accent")) {
            c = SVG.FONTDATA.REMAPACCENT[c] || c
          } else if (under && this === under.CoreMO() && parent.Get("accentunder")) {
            c = SVG.FONTDATA.REMAPACCENTUNDER[c] || c
          }
        }
        c = SVG.FONTDATA.DELIMITERS[c.charCodeAt(0)];
        var can = (c && c.dir == direction.substr(0, 1));
        if (!can) {
          delete this.svg
        }
        this.forceStretch = can && (this.Get("minsize", true) || this.Get("maxsize", true));
        return can;
      },
      SVGstretchV: function(h, d) {
        var svg = this.svg || this.toSVG();
        var values = this.getValues("symmetric", "maxsize", "minsize");
        var axis = SVG.TeX.axis_height * svg.scale,
            mu = this.SVGgetMu(svg),
            H;
        if (values.symmetric) {
          H = 2 * Math.max(h - axis, d + axis)
        } else {
          H = h + d
        }
        values.maxsize = SVG.length2em(values.maxsize, mu, svg.h + svg.d);
        values.minsize = SVG.length2em(values.minsize, mu, svg.h + svg.d);
        H = Math.max(values.minsize, Math.min(values.maxsize, H));
        if (H != values.minsize) {
          H = [Math.max(H * SVG.TeX.delimiterfactor / 1000, H - SVG.TeX.delimitershortfall), H]
        }
        svg = SVG.createDelimiter(this.data.join("").charCodeAt(0), H, svg.scale);
        if (values.symmetric) {
          H = (svg.h + svg.d) / 2 + axis
        } else {
          H = (svg.h + svg.d) * h / (h + d)
        }
        svg.y = H - svg.h;
        this.SVGhandleSpace(svg);
        this.SVGhandleColor(svg);
        delete this.svg.element;
        this.SVGsaveData(svg);
        svg.stretched = true;
        return svg;
      },
      SVGstretchH: function(w) {
        var svg = this.svg || this.toSVG(),
            mu = this.SVGgetMu(svg);
        var values = this.getValues("maxsize", "minsize", "mathvariant", "fontweight");
        // FIXME:  should take style="font-weight:bold" into account as well
        if ((values.fontweight === "bold" || parseInt(values.fontweight) >= 600) &&
            !this.Get("mathvariant", true)) {
          values.mathvariant = MML.VARIANT.BOLD
        }
        values.maxsize = SVG.length2em(values.maxsize, mu, svg.w);
        values.minsize = SVG.length2em(values.minsize, mu, svg.w);
        w = Math.max(values.minsize, Math.min(values.maxsize, w));
        svg = SVG.createDelimiter(this.data.join("").charCodeAt(0), w, svg.scale, values.mathvariant);
        this.SVGhandleSpace(svg);
        this.SVGhandleColor(svg);
        delete this.svg.element;
        this.SVGsaveData(svg);
        svg.stretched = true;
        return svg;
      }
    });

    MML.mn.Augment({
      cursorable: true,

      getCursorLength: function() {
        return this.data[0].data[0].length
      },

      moveCursor: function(cursor, direction) {
        direction = getCursorValue(direction)

        var vertical = direction === UP || direction === DOWN
        if (vertical) return this.parent.moveCursorFromChild(cursor, direction, this)

        var newPosition = cursor.position + (direction === LEFT ? -1 : 1)
        if (newPosition < 0 || newPosition > this.getCursorLength()) {
          this.parent.moveCursorFromChild(cursor, direction, this)
          return
        }
        cursor.moveTo(this, newPosition)
      },

      moveCursorFromChild: function(cursor, direction, child) {
        throw new Error('Unimplemented as cursor container')
      },

      moveCursorFromParent: function(cursor, direction) {
        direction = getCursorValue(direction)
        if (direction === LEFT) {
          cursor.moveTo(this, this.getCursorLength())
        } else if (direction === RIGHT) {
          cursor.moveTo(this, 0)
        } else if (cursor.renderedPosition &&
            this.moveCursorFromClick(cursor, cursor.renderedPosition.x, cursor.renderedPosition.y)) {
          return true
        } else {
          cursor.moveTo(this, 0)
        }
        return true
      },

      moveCursorFromClick: function(cursor, x, y) {
        for (childIdx = 0; childIdx < this.getCursorLength(); ++childIdx) {
          var bb = this.getSVGBBox(this.EditableSVGelem.children[childIdx]);
          var midpoint = bb.x + (bb.width / 2);

          if (x < midpoint) {
            cursor.moveTo(this, childIdx);
            return true;
          }
        }

        cursor.moveTo(this, this.data.length);
        return true;
      },

      drawCursor: function(cursor) {
        var bbox = this.getSVGBBox()
        var height = bbox.height
        var y = bbox.y
        var preedge, postedge
        if (cursor.position === 0) {
          preedge = bbox.x
        } else {
          var prebox = this.getSVGBBox(this.EditableSVGelem.children[cursor.position-1])
          preedge = prebox.x+prebox.width
        }
        if (cursor.position === this.getCursorLength()) {
          postedge = bbox.x+bbox.width
        } else {
          var postbox = this.getSVGBBox(this.EditableSVGelem.children[cursor.position])
          postedge = postbox.x
        }
        var x = (postedge + preedge) / 2
        var svgelem = this.EditableSVGelem.ownerSVGElement
        cursor.drawAt(svgelem, x, y, height)
      },
    })

    MML.mtext.Augment({
      toSVG: function() {
        if (SVG.config.mtextFontInherit || this.Parent().type === "merror") {
          this.SVGgetStyles();
          var svg = this.SVG(),
              scale = this.SVGgetScale(svg);
          this.SVGhandleSpace(svg);
          var variant = this.SVGgetVariant(),
              def = {
                direction: this.Get("dir")
              };
          if (variant.bold) {
            def["font-weight"] = "bold";
          }
          if (variant.italic) {
            def["font-style"] = "italic";
          }
          variant = this.Get("mathvariant");
          if (variant === "monospace") {
            def["class"] = "MJX-monospace"
          } else if (variant.match(/sans-serif/)) {
            def["class"] = "MJX-sans-serif"
          }
          svg.Add(BBOX.TEXT(scale * 100 / SVG.config.scale, this.data.join(""), def));
          svg.Clean();
          this.SVGhandleColor(svg);
          this.SVGsaveData(svg);
          return svg;
        } else {
          return this.SUPER(arguments).toSVG.call(this);
        }
      }
    });

    MML.merror.Augment({
      toSVG: function(HW, D) {
        this.SVGgetStyles();
        var svg = this.SVG(),
            scale = SVG.length2em(this.styles.fontSize || 1) / 1000;
        this.SVGhandleSpace(svg);
        var def = (scale !== 1 ? {
          transform: "scale(" + SVG.Fixed(scale) + ")"
        } : {});
        var bbox = BBOX(def);
        bbox.Add(this.SVGchildSVG(0));
        bbox.Clean();
        if (scale !== 1) {
          bbox.removeable = false;
          var adjust = ["w", "h", "d", "l", "r", "D", "H"];
          for (var i = 0, m = adjust.length; i < m; i++) {
            bbox[adjust[i]] *= scale
          }
        }
        svg.Add(bbox);
        svg.Clean();
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        return svg;
      },
      SVGgetStyles: function() {
        var span = HTML.Element("span", {
          style: SVG.config.merrorStyle
        });
        this.styles = this.SVGprocessStyles(span.style);
        if (this.style) {
          span.style.cssText = this.style;
          HUB.Insert(this.styles, this.SVGprocessStyles(span.style));
        }
      }
    });

    MML.ms.Augment({
      toSVG: MML.mbase.SVGautoload
    });

    MML.mglyph.Augment({
      toSVG: MML.mbase.SVGautoload
    });

    MML.mspace.Augment({
      toSVG: function() {
        this.SVGgetStyles();
        var values = this.getValues("height", "depth", "width");
        values.mathbackground = this.mathbackground;
        if (this.background && !this.mathbackground) {
          values.mathbackground = this.background
        }
        var svg = this.SVG();
        this.SVGgetScale(svg);
        var scale = this.mscale,
            mu = this.SVGgetMu(svg);
        svg.h = SVG.length2em(values.height, mu) * scale;
        svg.d = SVG.length2em(values.depth, mu) * scale;
        svg.w = svg.r = SVG.length2em(values.width, mu) * scale;
        if (svg.w < 0) {
          svg.x = svg.w;
          svg.w = svg.r = 0
        }
        if (svg.h < -svg.d) {
          svg.d = -svg.h
        }
        svg.l = 0;
        svg.Clean();
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        return svg;
      }
    });

    MML.mphantom.Augment({
      toSVG: function(HW, D) {
        this.SVGgetStyles();
        var svg = this.SVG();
        this.SVGgetScale(svg);
        if (this.data[0] != null) {
          this.SVGhandleSpace(svg);
          svg.Add(this.EditableSVGdataStretched(0, HW, D));
          svg.Clean();
          while (svg.element.firstChild) {
            svg.element.removeChild(svg.element.firstChild)
          }
        }
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        if (svg.removeable && !svg.element.firstChild) {
          delete svg.element
        }
        return svg;
      }
    });

    MML.mpadded.Augment({
      toSVG: function(HW, D) {
        this.SVGgetStyles();
        var svg = this.SVG();
        if (this.data[0] != null) {
          this.SVGgetScale(svg);
          this.SVGhandleSpace(svg);
          var pad = this.EditableSVGdataStretched(0, HW, D),
              mu = this.SVGgetMu(svg);
          var values = this.getValues("height", "depth", "width", "lspace", "voffset"),
              X = 0,
              Y = 0;
          if (values.lspace) {
            X = this.SVGlength2em(pad, values.lspace, mu)
          }
          if (values.voffset) {
            Y = this.SVGlength2em(pad, values.voffset, mu)
          }
          var h = pad.h,
              d = pad.d,
              w = pad.w,
              y = pad.y; // these can change durring the Add()
          svg.Add(pad, X, Y);
          svg.Clean();
          svg.h = h + y;
          svg.d = d - y;
          svg.w = w;
          svg.removeable = false;
          if (values.height !== "") {
            svg.h = this.SVGlength2em(svg, values.height, mu, "h", 0)
          }
          if (values.depth !== "") {
            svg.d = this.SVGlength2em(svg, values.depth, mu, "d", 0)
          }
          if (values.width !== "") {
            svg.w = this.SVGlength2em(svg, values.width, mu, "w", 0)
          }
          if (svg.h > svg.H) {
            svg.H = svg.h
          };
          if (svg.d > svg.D) {
            svg.D = svg.d
          }
        }
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        return svg;
      },
      SVGlength2em: function(svg, length, mu, d, m) {
        if (m == null) {
          m = -SVG.BIGDIMEN
        }
        var match = String(length).match(/width|height|depth/);
        var size = (match ? svg[match[0].charAt(0)] : (d ? svg[d] : 0));
        var v = SVG.length2em(length, mu, size / this.mscale) * this.mscale;
        if (d && String(length).match(/^\s*[-+]/)) {
          return Math.max(m, svg[d] + v)
        } else {
          return v
        }
      }
    });

    MML.mrow.Augment({
      SVG: BBOX.ROW,

      cursorable: true,

      isCursorPassthrough: function() {
        return this.data.length === 1 && this.data[0].cursorable
      },

      moveCursorFromParent: function(cursor, direction) {
        direction = getCursorValue(direction)
        if (this.isCursorPassthrough()) {
          return this.data[0].moveCursorFromParent(cursor, direction)
        }
        if (direction === LEFT) {
          cursor.moveTo(this, this.data.length)
        } else if (direction === RIGHT) {
          cursor.moveTo(this, 0)
        } else if (cursor.renderedPosition &&
            this.moveCursorFromClick(cursor, cursor.renderedPosition.x, cursor.renderedPosition.y)) {
          return true
        } else {
          cursor.moveTo(this, 0)
        }
        return true
      },

      moveCursorFromChild: function(cursor, direction, child) {
        if (this.isCursorPassthrough() || direction === UP || direction === DOWN) {
          return this.parent.moveCursorFromChild(cursor, direction, this)
        }
        direction = getCursorValue(direction)
        var childIdx
        for (childIdx = 0; childIdx < this.data.length; ++childIdx) {
          if (child === this.data[childIdx]) break
        }
        if (childIdx === this.data.length) throw new Error('Unable to find specified child in children')
        if (direction === LEFT) {
          cursor.moveTo(this, childIdx)
        } else if (direction === RIGHT) {
          cursor.moveTo(this, childIdx + 1)
        }
        return true
      },

      moveCursorFromClick: function(cursor, x, y) {
        // Identify which child was clicked
        for (childIdx = 0; childIdx < this.data.length; ++childIdx) {

          var child = this.data[childIdx];
          var bb = child.getSVGBBox();
          var midpoint = bb.x + (bb.width / 2);

          if (x < midpoint) {
            cursor.moveTo(this, childIdx);
            return true;
          }
        }

        cursor.moveTo(this, this.data.length);
        return true;
      },

      moveCursor: function(cursor, direction) {
        direction = getCursorValue(direction)

        var vertical = direction === UP || direction === DOWN
        if (vertical) return this.parent.moveCursorFromChild(cursor, direction, this)

        var newPosition = cursor.position + (direction === LEFT ? -1 : 1)
        if (newPosition < 0 || newPosition > this.data.length) {
          this.parent.moveCursorFromChild(cursor, direction, this)
          return
        }
        var childPosition = direction === LEFT ? cursor.position - 1 : cursor.position
        if (this.data[childPosition].moveCursorFromParent(cursor, direction)) return

        cursor.moveTo(this, newPosition)
      },

      drawCursor: function(cursor) {
        var bbox = this.getSVGBBox()
        var height = bbox.height
        var y = bbox.y
        var preedge, postedge
        if (cursor.position === 0) {
          preedge = bbox.x
        } else {
          var prebox = this.data[cursor.position-1].getSVGBBox()
          preedge = prebox.x+prebox.width
        }
        if (cursor.position === this.data.length) {
          postedge = bbox.x+bbox.width
        } else {
          var postbox = this.data[cursor.position].getSVGBBox()
          postedge = postbox.x
        }
        var x = (postedge + preedge) / 2
        var svgelem = this.EditableSVGelem.ownerSVGElement
        cursor.drawAt(svgelem, x, y, height)
      },

      toSVG: function(h, d) {
        this.SVGgetStyles();
        var svg = this.SVG();
        this.SVGhandleSpace(svg);
        if (d != null) {
          svg.sh = h;
          svg.sd = d
        }
        for (var i = 0, m = this.data.length; i < m; i++) {
          if (this.data[i]) {
            svg.Check(this.data[i]);
          }
        }
        svg.Stretch();
        svg.Clean();
        if (this.data.length === 1 && this.data[0]) {
          var data = this.data[0].EditableSVGdata;
          if (data.skew) {
            svg.skew = data.skew
          }
        }
        if (this.SVGlineBreaks(svg)) {
          svg = this.SVGmultiline(svg)
        }
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);

        return svg;
      },

      SVGlineBreaks: function(svg) {
        if (!this.parent.linebreakContainer) {
          return false
        }
        return (SVG.config.linebreaks.automatic &&
                svg.w > SVG.linebreakWidth) || this.hasNewline();
      },
      SVGmultiline: function(span) {
        MML.mbase.SVGautoloadFile("multiline")
      },
      SVGstretchH: function(w) {
        var svg = this.SVG();
        this.SVGhandleSpace(svg);
        for (var i = 0, m = this.data.length; i < m; i++) {
          svg.Add(this.EditableSVGdataStretched(i, w), svg.w, 0)
        }
        svg.Clean();
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        return svg;
      }
    });

    MML.mstyle.Augment({
      toSVG: function() {
        this.SVGgetStyles();
        var svg = this.SVG();
        if (this.data[0] != null) {
          this.SVGhandleSpace(svg);
          var math = svg.Add(this.data[0].toSVG());
          svg.Clean();
          if (math.ic) {
            svg.ic = math.ic
          }
          this.SVGhandleColor(svg);
        }
        this.SVGsaveData(svg);
        return svg;
      },
      SVGstretchH: function(w) {
        return (this.data[0] != null ? this.data[0].SVGstretchH(w) : BBOX.NULL());
      },
      SVGstretchV: function(h, d) {
        return (this.data[0] != null ? this.data[0].SVGstretchV(h, d) : BBOX.NULL());
      }
    });

    MML.mfrac.Augment({
      name: "mfrac",
      toSVG: function() {
        this.SVGgetStyles();
        var svg = this.SVG();
        var scale = this.SVGgetScale(svg);
        var frac = BBOX();
        frac.scale = svg.scale;
        this.SVGhandleSpace(frac);
        var num = this.SVGchildSVG(0),
            den = this.SVGchildSVG(1);
        var values = this.getValues("displaystyle", "linethickness", "numalign", "denomalign", "bevelled");
        var isDisplay = values.displaystyle;
        var a = SVG.TeX.axis_height * scale;
        if (values.bevelled) {
          var delta = (isDisplay ? 400 : 150);
          var H = Math.max(num.h + num.d, den.h + den.d) + 2 * delta;
          var bevel = SVG.createDelimiter(0x2F, H);
          frac.Add(num, 0, (num.d - num.h) / 2 + a + delta);
          frac.Add(bevel, num.w - delta / 2, (bevel.d - bevel.h) / 2 + a);
          frac.Add(den, num.w + bevel.w - delta, (den.d - den.h) / 2 + a - delta);
        } else {
          var W = Math.max(num.w, den.w);
          var t = SVG.thickness2em(values.linethickness, this.scale) * this.mscale,
              p, q, u, v;
          var mt = SVG.TeX.min_rule_thickness / SVG.em * 1000;
          if (isDisplay) {
            u = SVG.TeX.num1;
            v = SVG.TeX.denom1
          } else {
            u = (t === 0 ? SVG.TeX.num3 : SVG.TeX.num2);
            v = SVG.TeX.denom2
          }
          u *= scale;
          v *= scale;
          if (t === 0) { // \atop
            p = Math.max((isDisplay ? 7 : 3) * SVG.TeX.rule_thickness, 2 * mt); // force to at least 2 px
            q = (u - num.d) - (den.h - v);
            if (q < p) {
              u += (p - q) / 2;
              v += (p - q) / 2
            }
            frac.w = W;
            t = 0;
          } else { // \over
            p = Math.max((isDisplay ? 2 : 0) * mt + t, t / 2 + 1.5 * mt); // force to be at least 1.5px
            q = (u - num.d) - (a + t / 2);
            if (q < p) {
              u += p - q
            }
            q = (a - t / 2) - (den.h - v);
            if (q < p) {
              v += p - q
            }
            frac.Add(BBOX.RECT(t / 2, t / 2, W + 2 * t), 0, a);
          }
          frac.Align(num, values.numalign, t, u);
          frac.Align(den, values.denomalign, t, -v);
        }
        frac.Clean();
        svg.Add(frac, 0, 0);
        svg.Clean();
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        return svg;
      },

      cursorable: true,

      moveCursorFromClick: function(cursor, x, y) {
        var bb = this.getSVGBBox();
        var midlineY = bb.y + (bb.height / 2.0);
        var midlineX = bb.x + (bb.width / 2.0);

        cursor.position = {
          position: (x < midlineX) ? 0 : 1,
          half: (y < midlineY) ? 0 : 1,
        }

        if (this.data[cursor.position.half].cursorable) {
          this.data[cursor.position.half].moveCursorFromClick(cursor, x, y)
          return
        }

        cursor.moveTo(this, cursor.position)
      },

      moveCursor: function(cursor, direction) {
        if (cursor.position.half === undefined) throw new Error('Invalid cursor')
        if (cursor.position.position === 0 && direction === RIGHT) {
          cursor.position.position = 1
        } else if (cursor.position.position === 1 && direction === LEFT) {
          cursor.position.position = 0
        } else if (cursor.position.half === 0 && direction === DOWN) {
          return this.moveCursorIntoDenominator(cursor, direction)
        } else if (cursor.position.half === 1 && direction === UP) {
          return this.moveCursorIntoNumerator(cursor, direction)
        } else {
          return this.parent.moveCursorFromChild(cursor, direction, this)
        }
        cursor.moveTo(this, cursor.position)
      },

      moveCursorFromChild: function(cursor, direction, child, keep) {
        var isNumerator = this.data[0] === child
        var isDenominator = this.data[1] === child
        if (!isNumerator && !isDenominator) throw new Error('Specified child not found in children')

        if (isNumerator && direction === DOWN) {
          return this.moveCursorIntoDenominator(cursor, direction)
        } else if (isDenominator && direction === UP) {
          return this.moveCursorIntoNumerator(cursor, direction)
        } else if (keep) {
          return this.moveCursorIntoHalf(isNumerator ? 0 : 1, cursor, direction)
        } else {
          return this.parent.moveCursorFromChild(cursor, direction, this)
        }
      },
      moveCursorIntoHalf: function(half, cursor, direction) {
        if (this.data[half].cursorable) {
          // If the data is cursorable, it must take the cursor
          return this.data[half].moveCursorFromParent(cursor, direction)
        }
        var position = 0
        if (cursor.renderedPosition) {
          var bb = this.data[half].getSVGBBox()
          if (bb && cursor.renderedPosition.x > bb.x + bb.width/2) {
            position = 1
          }
        }
        cursor.moveTo(this, {
          half: half,
          position: position,
        })
        return true
      },
      moveCursorIntoNumerator: function(c, d) {
        return this.moveCursorIntoHalf(0, c, d)
      },
      moveCursorIntoDenominator: function(c, d) {
        return this.moveCursorIntoHalf(1, c, d)
      },

      moveCursorFromParent: function(cursor, direction) {
        direction = getCursorValue(direction)
        switch (direction) {
          case LEFT:
          case RIGHT:
            if (this.data[0].cursorable) {
              return this.data[0].moveCursorFromParent(cursor, direction)
            }
            cursor.moveTo(this, {
              half: 0,
              position: direction === RIGHT ? 0 : 1,
            })
            return true
          case UP:
            return this.moveCursorIntoDenominator(cursor, direction)
          case DOWN:
            return this.moveCursorIntoNumerator(cursor, direction)
        }
        return false
      },

      drawCursor: function(cursor) {
        if (cursor.position.half === undefined) throw new Error('Invalid cursor')
        var bbox = this.data[cursor.position.half].getSVGBBox()
        var height = bbox.height
        var x = bbox.x + (cursor.position.position ? bbox.width + 100 : -100)
        var y = bbox.y
        var svgelem = this.EditableSVGelem.ownerSVGElement
        return cursor.drawAt(svgelem, x, y, height)
      },

      SVGcanStretch: function(direction) {
        return false
      },

      SVGhandleSpace: function(svg) {
        if (!this.texWithDelims && !this.useMMLspacing) {
          //
          //  Add nulldelimiterspace around the fraction
          //   (TeXBook pg 150 and Appendix G rule 15e)
          //
          svg.x = svg.X = SVG.TeX.nulldelimiterspace * this.mscale;
        }
        this.SUPER(arguments).SVGhandleSpace.call(this, svg);
      }
    });

    MML.msqrt.Augment({
      toSVG: function() {
        this.SVGgetStyles();
        var svg = this.SVG(),
            scale = this.SVGgetScale(svg);
        this.SVGhandleSpace(svg);
        var base = this.SVGchildSVG(0),
            rule, surd;
        var t = SVG.TeX.rule_thickness * scale,
            p, q, H, x = 0;
        if (this.Get("displaystyle")) {
          p = SVG.TeX.x_height * scale
        } else {
          p = t
        }
        q = Math.max(t + p / 4, 1000 * SVG.TeX.min_root_space / SVG.em);
        H = base.h + base.d + q + t;
        surd = SVG.createDelimiter(0x221A, H, scale);
        if (surd.h + surd.d > H) {
          q = ((surd.h + surd.d) - (H - t)) / 2
        }
        rule = BBOX.RECT(t, 0, base.w);
        H = base.h + q + t;
        x = this.SVGaddRoot(svg, surd, x, surd.h + surd.d - H, scale);
        svg.Add(surd, x, H - surd.h);
        svg.Add(rule, x + surd.w, H - rule.h);
        svg.Add(base, x + surd.w, 0);
        svg.Clean();
        svg.h += t;
        svg.H += t;
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        return svg;
      },
      cursorable: true,
      moveCursorFromChild: function(c, d) {
        this.parent.moveCursorFromChild(c, d, this)
      },
      moveCursorFromParent: function(c, d) {
        return this.data[0].moveCursorFromParent(c, d)
      },
      SVGaddRoot: function(svg, surd, x, d, scale) {
        return x
      }
    });

    MML.mroot.Augment({
      toSVG: MML.msqrt.prototype.toSVG,
      SVGaddRoot: function(svg, surd, x, d, scale) {
        var dx = (surd.isMultiChar ? .55 : .65) * surd.w;
        if (this.data[1]) {
          var root = this.data[1].toSVG();
          root.x = 0;
          var h = this.SVGrootHeight(surd.h + surd.d, scale, root) - d;
          var w = Math.min(root.w, root.r); // remove extra right-hand padding, if any
          x = Math.max(w, dx);
          svg.Add(root, x - w, h);
        } else {
          dx = x
        }
        return x - dx;
      },
      cursorable: true,
      moveCursorFromChild: function(c, d) {
        this.parent.moveCursorFromChild(c, d, this)
      },
      moveCursorFromParent: function(c, d) {
        return this.data[0].moveCursorFromParent(c, d)
      },
      SVGrootHeight: function(d, scale, root) {
        return .45 * (d - 900 * scale) + 600 * scale + Math.max(0, root.d - 75);
      }
    });

    MML.mfenced.Augment({
      SVG: BBOX.ROW,
      toSVG: function() {
        this.SVGgetStyles();
        var svg = this.SVG();
        this.SVGhandleSpace(svg);
        if (this.data.open) {
          svg.Check(this.data.open)
        }
        if (this.data[0] != null) {
          svg.Check(this.data[0])
        }
        for (var i = 1, m = this.data.length; i < m; i++) {
          if (this.data[i]) {
            if (this.data["sep" + i]) {
              svg.Check(this.data["sep" + i])
            }
            svg.Check(this.data[i]);
          }
        }
        if (this.data.close) {
          svg.Check(this.data.close)
        }
        svg.Stretch();
        svg.Clean();
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        return svg;
      }
    });

    MML.menclose.Augment({
      toSVG: MML.mbase.SVGautoload
    });

    MML.maction.Augment({
      toSVG: MML.mbase.SVGautoload
    });

    MML.semantics.Augment({
      toSVG: function() {
        this.SVGgetStyles();
        var svg = this.SVG();
        if (this.data[0] != null) {
          this.SVGhandleSpace(svg);
          svg.Add(this.data[0].toSVG());
          svg.Clean();
        } else {
          svg.Clean()
        }
        this.SVGsaveData(svg);
        return svg;
      },
      SVGstretchH: function(w) {
        return (this.data[0] != null ? this.data[0].SVGstretchH(w) : BBOX.NULL());
      },
      SVGstretchV: function(h, d) {
        return (this.data[0] != null ? this.data[0].SVGstretchV(h, d) : BBOX.NULL());
      }
    });

    MML.munderover.Augment({
      toSVG: function(HW, D) {
        this.SVGgetStyles();
        var values = this.getValues("displaystyle", "accent", "accentunder", "align");
        if (!values.displaystyle && this.data[this.base] != null &&
            this.data[this.base].CoreMO().Get("movablelimits")) {
          return MML.msubsup.prototype.toSVG.call(this)
        }
        var svg = this.SVG(),
            scale = this.SVGgetScale(svg);
        this.SVGhandleSpace(svg);
        var boxes = [],
            stretch = [],
            box, i, m, W = -SVG.BIGDIMEN,
            WW = W;
        for (i = 0, m = this.data.length; i < m; i++) {
          if (this.data[i] != null) {
            if (i == this.base) {
              boxes[i] = this.EditableSVGdataStretched(i, HW, D);
              stretch[i] = (D != null || HW == null) && this.data[i].SVGcanStretch("Horizontal");
            } else {
              boxes[i] = this.data[i].toSVG();
              boxes[i].x = 0;
              delete boxes[i].X;
              stretch[i] = this.data[i].SVGcanStretch("Horizontal");
            }
            if (boxes[i].w > WW) {
              WW = boxes[i].w
            }
            if (!stretch[i] && WW > W) {
              W = WW
            }
          }
        }
        if (D == null && HW != null) {
          W = HW
        } else if (W == -SVG.BIGDIMEN) {
          W = WW
        }
        for (i = WW = 0, m = this.data.length; i < m; i++) {
          if (this.data[i]) {
            if (stretch[i]) {
              boxes[i] = this.data[i].SVGstretchH(W);
              if (i !== this.base) {
                boxes[i].x = 0;
                delete boxes[i].X
              }
            }
            if (boxes[i].w > WW) {
              WW = boxes[i].w
            }
          }
        }
        var t = SVG.TeX.rule_thickness * this.mscale;
        var base = boxes[this.base] || {
          w: 0,
          h: 0,
          d: 0,
          H: 0,
          D: 0,
          l: 0,
          r: 0,
          y: 0,
          scale: scale
        };
        var x, y, z1, z2, z3, dw, k, delta = 0;
        if (base.ic) {
          delta = 1.3 * base.ic + .05
        } // adjust faked IC to be more in line with expeted results
        for (i = 0, m = this.data.length; i < m; i++) {
          if (this.data[i] != null) {
            box = boxes[i];
            z3 = SVG.TeX.big_op_spacing5 * scale;
            var accent = (i != this.base && values[this.ACCENTS[i]]);
            if (accent && box.w <= 1) {
              box.x = -box.l;
              boxes[i] = BBOX.G().With({
                removeable: false
              });
              boxes[i].Add(box);
              boxes[i].Clean();
              boxes[i].w = -box.l;
              box = boxes[i];
            }
            dw = {
              left: 0,
              center: (WW - box.w) / 2,
              right: WW - box.w
            }[values.align];
            x = dw;
            y = 0;
            if (i == this.over) {
              if (accent) {
                k = t * scale;
                z3 = 0;
                if (base.skew) {
                  x += base.skew;
                  svg.skew = base.skew;
                  if (x + box.w > WW) {
                    svg.skew += (WW - box.w - x) / 2
                  }
                }
              } else {
                z1 = SVG.TeX.big_op_spacing1 * scale;
                z2 = SVG.TeX.big_op_spacing3 * scale;
                k = Math.max(z1, z2 - Math.max(0, box.d));
              }
              k = Math.max(k, 1500 / SVG.em);
              x += delta / 2;
              y = base.y + base.h + box.d + k;
              box.h += z3;
              if (box.h > box.H) {
                box.H = box.h
              }
            } else if (i == this.under) {
              if (accent) {
                k = 3 * t * scale;
                z3 = 0;
              } else {
                z1 = SVG.TeX.big_op_spacing2 * scale;
                z2 = SVG.TeX.big_op_spacing4 * scale;
                k = Math.max(z1, z2 - box.h);
              }
              k = Math.max(k, 1500 / SVG.em);
              x -= delta / 2;
              y = base.y - (base.d + box.h + k);
              box.d += z3;
              if (box.d > box.D) {
                box.D = box.d
              }
            }
            svg.Add(box, x, y);
          }
        }
        svg.Clean();
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        return svg;
      },
    });

    MML.msubsup.Augment({
      toSVG: function(HW, D) {
        this.SVGgetStyles();
        var svg = this.SVG(),
            scale = this.SVGgetScale(svg);
        this.SVGhandleSpace(svg);
        var mu = this.SVGgetMu(svg);
        var base = svg.Add(this.EditableSVGdataStretched(this.base, HW, D));
        var sscale = (this.data[this.sup] || this.data[this.sub] || this).SVGgetScale();
        var x_height = SVG.TeX.x_height * scale,
            s = SVG.TeX.scriptspace * scale;
        var sup, sub;
        if (this.SVGnotEmpty(this.data[this.sup])) {
          sup = this.data[this.sup].toSVG();
          sup.w += s;
          sup.r = Math.max(sup.w, sup.r);
        }
        if (this.SVGnotEmpty(this.data[this.sub])) {
          sub = this.data[this.sub].toSVG();
          sub.w += s;
          sub.r = Math.max(sub.w, sub.r);
        }
        var q = SVG.TeX.sup_drop * sscale,
            r = SVG.TeX.sub_drop * sscale;
        var u = base.h + (base.y || 0) - q,
            v = base.d - (base.y || 0) + r,
            delta = 0,
            p;
        if (base.ic) {
          base.w -= base.ic; // remove IC (added by mo and mi)
          delta = 1.3 * base.ic + .05; // adjust faked IC to be more in line with expeted results
        }
        if (this.data[this.base] &&
            (this.data[this.base].type === "mi" || this.data[this.base].type === "mo")) {
          if (this.data[this.base].data.join("").length === 1 && base.scale === 1 &&
              !base.stretched && !this.data[this.base].Get("largeop")) {
            u = v = 0
          }
        }
        var min = this.getValues("subscriptshift", "superscriptshift");
        min.subscriptshift = (min.subscriptshift === "" ? 0 : SVG.length2em(min.subscriptshift, mu));
        min.superscriptshift = (min.superscriptshift === "" ? 0 : SVG.length2em(min.superscriptshift, mu));
        var x = base.w + base.x;
        if (!sup) {
          if (sub) {
            v = Math.max(v, SVG.TeX.sub1 * scale, sub.h - (4 / 5) * x_height, min.subscriptshift);
            svg.Add(sub, x, -v);
            this.data[this.sub].EditableSVGdata.dy = -v;
          }
        } else {
          if (!sub) {
            values = this.getValues("displaystyle", "texprimestyle");
            p = SVG.TeX[(values.displaystyle ? "sup1" : (values.texprimestyle ? "sup3" : "sup2"))];
            u = Math.max(u, p * scale, sup.d + (1 / 4) * x_height, min.superscriptshift);
            svg.Add(sup, x + delta, u);
            this.data[this.sup].EditableSVGdata.dx = delta;
            this.data[this.sup].EditableSVGdata.dy = u;
          } else {
            v = Math.max(v, SVG.TeX.sub2 * scale);
            var t = SVG.TeX.rule_thickness * scale;
            if ((u - sup.d) - (sub.h - v) < 3 * t) {
              v = 3 * t - u + sup.d + sub.h;
              q = (4 / 5) * x_height - (u - sup.d);
              if (q > 0) {
                u += q;
                v -= q
              }
            }
            svg.Add(sup, x + delta, Math.max(u, min.superscriptshift));
            svg.Add(sub, x, -Math.max(v, min.subscriptshift));
            this.data[this.sup].EditableSVGdata.dx = delta;
            this.data[this.sup].EditableSVGdata.dy = Math.max(u, min.superscriptshift);
            this.data[this.sub].EditableSVGdata.dy = -Math.max(v, min.subscriptshift);
          }
        }
        svg.Clean();
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        return svg;
      },
    });

    var subsupcursor = {
      cursorable: true,
      // TODO: make cursoring less messy

      moveCursorFromParent: function(cursor, direction) {
        direction = getCursorValue(direction)
        var dest
        if (direction === RIGHT || direction === LEFT) {
          dest = this.data[this.base]
          if (dest.cursorable) {
            return dest.moveCursorFromParent(cursor, direction)
          }
          cursor.position = {
            section: this.base,
            pos: direction === LEFT ? 1 : 0,
          }
        } else if (direction === UP || direction === DOWN) {
          var small = direction === UP ? this.sub : this.sup
          var baseBB = this.data[this.base].getSVGBBox()
          if (!baseBB || !cursor.renderedPosition) {
            cursor.position = {
              section: this.data[small] ? small : this.base,
              pos: 0,
            }
          } else if (cursor.renderedPosition.x > baseBB.x+baseBB.width && this.data[small]) {
            if (this.data[small].cursorable) {
              return this.data[small].moveCursorFromParent(cursor, direction)
            }
            var bb = this.data[small].getSVGBBox()
            cursor.position = {
              section: small,
              pos: cursor.renderedPosition.x > bb.x + bb.width/2 ? 1 : 0,
            }
          } else {
            if (this.data[this.base].cursorable) {
              return this.data[this.base].moveCursorFromParent(cursor, direction)
            }
            cursor.position = {
              section: this.base,
              pos: cursor.renderedPosition.x > baseBB.x+baseBB.width/2 ? 1 : 0,
            }
          }
        }
        cursor.moveTo(this, cursor.position)
        return true;
      },

      moveCursorFromChild: function(cursor, direction, child) {
        direction = getCursorValue(direction)
        var section, pos;

        var childIdx
        for (childIdx = 0; childIdx < this.data.length; ++childIdx) {
          if (child === this.data[childIdx]) break
        }
        if (childIdx === this.data.length) throw new Error('Unable to find specified child in children')
        var currentSection = childIdx
        var old = [cursor.node, cursor.position]
        cursor.moveTo(this, {
          section: currentSection,
          pos: direction === RIGHT ? 1 : 0,
        })

        if (!this.moveCursor(cursor, direction)) {
          cursor.moveTo.apply(cursor, old)
          return false
        }
        return true
      },

      moveCursorFromClick: function(cursor, x, y) {
        var base = this.data[0]
        var baseBB = base.getSVGBBox();
        var sub = this.data[this.sub];
        var subBB = sub && sub.getSVGBBox();
        var sup = this.data[this.sup];
        var supBB = sup && sup.getSVGBBox();

        var section;
        var pos;

        // If the click is somewhere within the sup or sup, go there
        if (subBB && SVG.boxContains(subBB, x, y)) {
          if (sub.cursorable) {
            return sub.moveCursorFromClick(cursor, x, y)
          }
          section = this.sub;
          var midpoint = subBB.x + (subBB.width / 2.0);
          pos = (x < midpoint) ? 0 : 1;
        } else if (supBB && SVG.boxContains(supBB, x, y)) {
          if (sup.cursorable) {
            return sup.moveCursorFromClick(cursor, x, y)
          }
          section = this.sup;
          var midpoint = supBB.x + (supBB.width / 2.0);
          pos = (x < midpoint) ? 0 : 1;
        } else {
          // Click somewhere else, go by the midpoint
          if (base.cursorable) {
            return base.moveCursorFromClick(cursor, x, y)
          }
          section = this.base;
          var midpoint = baseBB.x + (baseBB.width / 2.0);
          pos = (x < midpoint) ? 0 : 1;
        }

        cursor.moveTo(this, {
          section: section,
          pos: pos,
        });
      },

      moveCursor: function(cursor, direction) {
        direction = getCursorValue(direction);

        var sup = this.data[this.sup]
        var sub = this.data[this.sub]

        if (cursor.position.section === this.base) {
          if (direction === UP) {
            if (sup) {
              if (sup.cursorable) {
                return sup.moveCursorFromParent(cursor, direction)
              }
              cursor.position = {
                section: this.sup,
                pos: 0,
              }
            } else {
              return this.parent.moveCursorFromChild(cursor, direction, this)
            }
          } else if (direction === DOWN) {
            if (sub) {
              if (sub.cursorable) {
                return sub.moveCursorFromParent(cursor, direction)
              }
              cursor.position = {
                section: this.sub,
                pos: 0,
              }
            } else {
              return this.parent.moveCursorFromChild(cursor, direction, this)
            }
          } else {
            if (direction === LEFT && cursor.position.pos === 0 || direction === RIGHT && cursor.position.pos === 1) {
              return this.parent.moveCursorFromChild(cursor, direction, this)
            }
            cursor.position.pos = cursor.position.pos ? 0 : 1
          }
        } else {
          var vertical = direction === UP || direction === DOWN
          var movingInVertically = vertical && (direction === UP) === (cursor.position.section === this.sub)
          var movingInHorizontally = cursor.position.pos === 0 && direction === LEFT
          var moveRightHorizontally = cursor.position.pos === 1 && direction === RIGHT
          var movingAway = vertical ? !movingInVertically : !this.rightMoveStay && moveRightHorizontally
          var movingIn = movingInVertically || movingInHorizontally || moveRightHorizontally && this.rightMoveStay
          if (movingAway) {
            return this.parent.moveCursorFromChild(cursor, direction, this)
          } else if (movingIn) {
            if (this.data[this.base].cursorable) {
              return this.data[this.base].moveCursorFromParent(cursor, cursor.position.section === this.sub ? UP : DOWN)
            }
            cursor.position = {
              section: this.base,
              pos: moveRightHorizontally ? 1 : this.endingPos || 0,
            }
          } else {
            cursor.position.pos = cursor.position.pos ? 0 : 1
          }
        }

        cursor.moveTo(this, cursor.position)
        return true
      },

      drawCursor: function(cursor) {
        var bb;
        var x, y, height;

        if (cursor.position.section === this.base) {
          bb = this.data[this.base].getSVGBBox()
          var mainBB = this.getSVGBBox()
          y = mainBB.y
          height = mainBB.height
        } else {
          bb = this.data[cursor.position.section].getSVGBBox()
          y = bb.y
          height = bb.height
        }

        x = cursor.position.pos === 0 ? bb.x : bb.x + bb.width;

        var svgelem = this.EditableSVGelem.ownerSVGElement
        return cursor.drawAt(svgelem, x, y, height)
      },
    }

    MML.munderover.Augment(subsupcursor)
    MML.msubsup.Augment(subsupcursor)
    MML.msubsup.Augment({endingPos: 1})
    MML.munderover.Augment({endingPos: 0, rightMoveStay: true})

    MML.mmultiscripts.Augment({
      toSVG: MML.mbase.SVGautoload
    });

    MML.mtable.Augment({
      toSVG: MML.mbase.SVGautoload
    });

    MML["annotation-xml"].Augment({
      toSVG: MML.mbase.SVGautoload
    });

    MML.math.Augment({
      SVG: BBOX.Subclass({
        type: "svg",
        removeable: false
      }),
      // TODO actually implement cursor
      cursorable: false,
      moveCursorFromChild: function(cursor, direction, child) {
        return false
      },
      toSVG: function(span, div, replace) {
        var CONFIG = SVG.config;

        //  All the data should be in an inferred row
        if (this.data[0]) {
          this.SVGgetStyles();
          MML.mbase.prototype.displayAlign = HUB.config.displayAlign;
          MML.mbase.prototype.displayIndent = HUB.config.displayIndent;
          if (String(HUB.config.displayIndent).match(/^0($|[a-z%])/i))
            MML.mbase.prototype.displayIndent = "0";

          //  Put content in a <g> with defaults and matrix that flips y axis.
          //  Put that in an <svg> with xlink defined.
          var box = BBOX.G();
          box.Add(this.data[0].toSVG(), 0, 0, true);
          box.Clean();
          this.SVGhandleColor(box);
          SVG.Element(box.element, {
            stroke: "currentColor",
            fill: "currentColor",
            "stroke-width": 0,
            transform: "matrix(1 0 0 -1 0 0)"
          });
          box.removeable = false;
          var svg = this.SVG();

          var recall = this.toSVG.bind(this, span, div, true)
          svg.element.addEventListener('keypress', function(e) {
            if (!globalCursor) return
            globalCursor.keypress(event, recall);
          })

          svg.element.setAttribute("xmlns:xlink", XLINKNS);
          if (CONFIG.useFontCache && !CONFIG.useGlobalCache) {
            svg.element.appendChild(BBOX.GLYPH.defs)
          }
          svg.Add(box);
          svg.Clean();
          this.SVGsaveData(svg);

          //  If this element is not the top-level math element
          //    remove the transform and return the svg object
          //    (issue #614).
          if (!span) {
            svg.element = svg.element.firstChild; // remove <svg> element
            svg.element.removeAttribute("transform");
            svg.removable = true;
            return svg;
          }

          //  Style the <svg> to get the right size and placement
          var l = Math.max(-svg.l, 0),
              r = Math.max(svg.r - svg.w, 0);
          var style = svg.element.style;
          svg.element.setAttribute("width", SVG.Ex(l + svg.w + r));
          svg.element.setAttribute("height", SVG.Ex(svg.H + svg.D + 2 * SVG.em));
          style.verticalAlign = SVG.Ex(-svg.D - 2 * SVG.em); // remove extra pixel added below plus padding from above
          style.marginLeft = SVG.Ex(-l);
          style.marginRight = SVG.Ex(-r);
          svg.element.setAttribute("viewBox", SVG.Fixed(-l, 1) + " " + SVG.Fixed(-svg.H - SVG.em, 1) + " " +
                                   SVG.Fixed(l + svg.w + r, 1) + " " + SVG.Fixed(svg.H + svg.D + 2 * SVG.em, 1));
          style.marginTop = style.marginBottom = "1px"; // 1px above and below to prevent lines from touching

          //  If there is extra height or depth, hide that
          if (svg.H > svg.h) {
            style.marginTop = SVG.Ex(svg.h - svg.H)
          }
          if (svg.D > svg.d) {
            style.marginBottom = SVG.Ex(svg.d - svg.D);
            style.verticalAlign = SVG.Ex(-svg.d);
          }

          //  Add it to the MathJax span
          var alttext = this.Get("alttext");
          if (alttext && !svg.element.getAttribute("aria-label")) span.setAttribute("aria-label", alttext);
          if (!svg.element.getAttribute("role")) span.setAttribute("role", "math");
          //        span.setAttribute("tabindex",0);  // causes focus outline, so disable for now

          // START DEBUG
          // ORIGINAL: span.appendChild(svg.element);
          svg.element.classList.add('rendered-svg-output')
          var previous = span.querySelector('.rendered-svg-output')
          if (replace && previous) {
            span.replaceChild(svg.element, previous)
          } else {
            span.appendChild(svg.element)
          }
          // END DEBUG
          svg.element = null;

          //  Handle indentalign and indentshift for single-line displays
          if (!this.isMultiline && this.Get("display") === "block" && !svg.hasIndent) {
            var values = this.getValues("indentalignfirst", "indentshiftfirst", "indentalign", "indentshift");
            if (values.indentalignfirst !== MML.INDENTALIGN.INDENTALIGN) {
              values.indentalign = values.indentalignfirst;
            }
            if (values.indentalign === MML.INDENTALIGN.AUTO) {
              values.indentalign = this.displayAlign;
            }
            if (values.indentshiftfirst !== MML.INDENTSHIFT.INDENTSHIFT) {
              values.indentshift = values.indentshiftfirst;
            }
            if (values.indentshift === "auto") {
              values.indentshift = "0";
            }
            var shift = SVG.length2em(values.indentshift, 1, SVG.cwidth);
            if (this.displayIndent !== "0") {
              var indent = SVG.length2em(this.displayIndent, 1, SVG.cwidth);
              shift += (values.indentalign === MML.INDENTALIGN.RIGHT ? -indent : indent);
            }
            div.style.textAlign = values.indentalign;
            if (shift) {
              HUB.Insert(style, ({
                left: {
                  marginLeft: SVG.Ex(shift)
                },
                right: {
                  marginRight: SVG.Ex(-shift)
                },
                center: {
                  marginLeft: SVG.Ex(shift),
                  marginRight: SVG.Ex(-shift)
                }
              })[values.indentalign]);
            }
          }
        }
        return span;
      }
    });

    MML.TeXAtom.Augment({
      toSVG: function(HW, D) {
        this.SVGgetStyles();
        var svg = this.SVG();
        this.SVGhandleSpace(svg);
        if (this.data[0] != null) {
          var box = this.EditableSVGdataStretched(0, HW, D),
              y = 0;
          if (this.texClass === MML.TEXCLASS.VCENTER) {
            y = SVG.TeX.axis_height - (box.h + box.d) / 2 + box.d;
          }
          svg.Add(box, 0, y);
          svg.ic = box.ic;
          svg.skew = box.skew;
        }
        this.SVGhandleColor(svg);
        this.SVGsaveData(svg);
        return svg;
      },

      cursorable: true,

      moveCursorFromParent: function(cursor, direction) {
        return this.data[0].moveCursorFromParent(cursor, direction);
      },

      moveCursorFromChild: function(cursor, direction, child) {
        return this.parent.moveCursorFromChild(cursor, direction, this);
      },

      moveCursorFromClick: function(cursor, x, y) {
        return this.data[0].moveCursorFromClick(cursor, x, y)
      },

      moveCursor: function(cursor, direction) {
        return this.parent.moveCursorFromChild(cursor, direction, this)
      },

      drawCursor: function(cursor) {
        console.error('TeXAtom drawCursor NOT IMPLEMENTED');
      }
    });

    //  Loading isn't complete until the element jax is modified,
    //  but can't call loadComplete within the callback for "mml Jax Ready"
    //  (it would call SVG's Require routine, asking for the mml jax again)
    //  so wait until after the mml jax has finished processing.
    //
    //  We also need to wait for the onload handler to run, since the loadComplete
    //  will call Config and Startup, which need to modify the body.
    HUB.Register.StartupHook("onLoad", function() {
      setTimeout(MathJax.Callback(["loadComplete", SVG, "jax.js"]), 0);
    });
  });

  MathJax.Object.Cursor = MathJax.Object.Subclass({

    BACKSlASH: 'backslash',
    NORMAL: 'normal',
    mode: 'normal',

    Init: function() {
      this.id = Math.random().toString(36).substring(2)
      this.width = 50
    },

    refocus: function() {
      if (!this.node || !this.node.EditableSVGelem || !this.node.EditableSVGelem.ownerSVGElement) return false
      this.node.EditableSVGelem.ownerSVGElement.parentNode.focus()
      this.draw()
    },

    moveToClick: function(event) {
      var target = event.target;
      var svg = target.nodeName === 'svg' ? target : target.ownerSVGElement;

      if (!svg) return;

      var cp = SVG.screenCoordsToElemCoords(svg, event.clientX, event.clientY);

      // Find the deepest cursorable node that was clicked
      jax = MathJax.Hub.getAllJax('#' + event.target.parentNode.id)[0];
      var current = jax.root
      while (true) {
        var matchedItems = current.data.filter(function(node) {
          if (node === null) return false;
          return SVG.nodeContainsScreenPoint(node, event.clientX, event.clientY);
        });
        if (matchedItems.length > 1) {
          console.error('huh? matched more than one child');
        } else if (matchedItems.length === 0) {
          break;
        }

        var matched = matchedItems[0];
        if (matched.cursorable) {
          current = matched
        } else {
          break;
        }
      }
      current.moveCursorFromClick(this, cp.x, cp.y);
    },

    moveTo: function(node, position) {
      // Does NOT redraw
      this.node = node;
      this.position = position;
    },

    move: function(direction) {
      this.node.moveCursor(this, direction)
    },

    draw: function() {
      this.node.drawCursor(this)
    },

    keydown: function(event, recall) {
      var direction
      switch (event.which) {
        case 8: this.backspace(event, recall); break;
        case 38: direction = UP; break
        case 40: direction = DOWN; break
        case 37: direction = LEFT; break
        case 39: direction = RIGHT; break
      }
      if (direction) {
        this.move(direction)
        this.draw()
        event.preventDefault()
      }
    },

    mousedown: function(event, recall) {
      event.preventDefault()
      this.moveToClick(event)
      this.refocus()
    },

    backspace: function(event, recall) {
      event.preventDefault();
      if (this.node && this.node.type === 'mrow') {
        this.node.data.splice(this.position - 1, 1);
        recall();
        this.move(LEFT);
        this.refocus();
      }
    },

    makeEntityMo: function(unicode) {
      var mo = new MML.mo();
      var entity = new MML.entity();
      entity.Append(unicode);
      mo.Append(entity);
      return mo;
    },

    makeEntityMi: function(unicode) {
      var mi = new MML.mi();
      var entity = new MML.entity();
      entity.Append(unicode);
      mi.Append(entity);
      return mi;
    },

    keypress: function(event, recall) {
      event.preventDefault();

      var code = event.charCode || event.keyCode || event.which;
      var c = String.fromCharCode(code);
      var toInsert;

      if (this.node && this.node.type === 'mrow') {

        // Backslash mode
        if (c === "\\") {
          if (this.mode !== this.BACKSLASH) {
            // Enter backslash mode
            this.mode = this.BACKSLASH;

            // Insert mrow
            var grayRow = MML.mrow();
            grayRow.Append(this.makeEntityMo('#x0005C'))
            this.node.data.splice(this.position, 0, null)
            this.node.SetData(this.position, grayRow)
            var oldClass = grayRow.class ? grayRow.class + ' ' : '';
            grayRow.class = oldClass + "backslash-mode";
            recall()
            this.move(RIGHT)
            this.refocus()

            // Move into the mrow
            this.node = grayRow;
            this.position = 1;
            this.draw();

            return;
          } else {
            console.log('TODO: insert a \\')
            // Just insert a \
          }

        } else if (c === " ") {
          if (this.mode === this.BACKSLASH) {
            // Exit backslash mode and enter the thing we had
            var latex = "\\";
            for (var i = 1; i < this.node.data.length; i++) {
              var mi = this.node.data[i];
              if (mi.type !== 'mi') {
                throw new Error('Found non-identifier in backslash expression');
              }
              var chars = mi.data[0];
              var c = chars.data[0];
              latex += c;
            }

            var unicode = SVG.mathLatexToUnicode[latex];
            if (!unicode) {
              unicode = SVG.latexToUnicode[latex];

              if (!unicode)
                throw new Error("Couldn't find unicode: ", latex);
            }

            var mrow = this.node;
            var parent = mrow.parent;
            var myIndex = parent.data.indexOf(mrow);

            // TODO: make sure this is loaded
            var def = MathJax.InputJax.TeX.Definitions;
            var withoutSlash = latex.substr(1);

            if (withoutSlash in def.mathchar0mo) {
              parent.SetData(myIndex, this.makeEntityMo(unicode))
            } else if (withoutSlash in def.mathchar0mi) {
              parent.SetData(myIndex, this.makeEntityMi(unicode))
            } else {
              console.error('Confused, not sure what kind of markup to use for ' + latex);
              parent.SetData(myIndex, this.makeEntityMi(unicode))
            }

            this.node = parent;
            this.position = myIndex + 1;

            recall();
            this.refocus();
            this.mode = this.NORMAL;

            return;
          } else {
            // Ignore spaces otherwise
            // TODO: in LyX, spaces move you up and out of the elem
            return;
          }
        }

        // Insertion
        if ((code > 47 && code < 58) || // numeric (0-9)
            (code > 64 && code < 91) || // upper alpha (A-Z)
            (code > 96 && code < 123)) { // lower alpha (a-z)
          // Alphanumeric, insert an mi
          toInsert = new MML.mi()
          toInsert.Append(c)
        } else if (c === '+' || c === '/') {
          toInsert = new MML.mo();
          toInsert.Append(c);
        } else if (c === '*') {
          toInsert = this.makeEntityMo('#x2217');
        } else if (c === "-") {
          toInsert = this.makeEntityMo('#x2212');
        }
      }

      this.node.data.splice(this.position, 0, null)
      this.node.SetData(this.position, toInsert)
      recall()
      this.move(RIGHT)
      this.refocus()

    },

    highlightBoxes: function(svg) {
      var cur = this.node;

      if (typeof(this.boxes) !== 'undefined') {
        this.boxes.forEach(function(elem) {
          elem.remove();
        });
      }

      this.boxes = [];

      while (cur) {
        if (cur.cursorable) {
          var bb = cur.getSVGBBox();
          if (!bb) return;
          this.boxes = this.boxes.concat(SVG.highlightBox(svg, bb));
        }
        cur = cur.parent;
      }
    },

    drawAt: function(svgelem, x, y, height) {
      this.renderedPosition = {x: x, y: y, height: height}
      var celem = svgelem.getElementById('cursor-'+this.id)
      if (!celem) {
        celem = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
        celem.setAttribute('fill', '#777777')
        celem.setAttribute('class', 'math-cursor')
        celem.id = 'cursor-'+this.id
        svgelem.appendChild(celem)
      } else {
        var oldclass = celem.getAttribute('class')
        celem.setAttribute('class', oldclass.split('blink').join(''))
      }
      celem.setAttribute('x', x)
      celem.setAttribute('y', y)
      celem.setAttribute('width', this.width)
      celem.setAttribute('height', height)
      clearTimeout(this.startBlink)
      this.startBlink = setTimeout(function() {
        celem.setAttribute('class', celem.getAttribute('class') + ' blink')
      }.bind(this), 500)

      this.highlightBoxes(svgelem);

      jax = MathJax.Hub.getAllJax('#' + svgelem.parentNode.id)[0];
      SVG.visualizeJax(jax, $('#mmlviz'));

      this.scrollIntoView(svgelem)
    },

    scrollIntoView: function(svgelem) {
      if (!this.renderedPosition) return false
      var x = this.renderedPosition.x
      var y = this.renderedPosition.y
      var height = this.renderedPosition.height
      var clientPoint = SVG.elemCoordsToScreenCoords(svgelem, x, y+height/2)
      var clientWidth = document.body.clientWidth
      var clientHeight = document.body.clientHeight
      var sx = 0, sy = 0
      if (clientPoint.x < 0 || clientPoint.x > clientWidth) {
        sx = clientPoint.x - clientWidth / 2
      }
      if (clientPoint.y < 0 || clientPoint.y > clientHeight) {
        sy = clientPoint.y - clientHeight / 2
      }
      if (sx || sy) {
        window.scrollBy(sx, sy)
      }
    },
  })

  HUB.Browser.Select({
    Opera: function(browser) {
      SVG.Augment({
        operaZoomRefresh: true // Opera needs a kick to redraw zoomed equations
      });
    }
  });

  HUB.Register.StartupHook("End Cookie", function() {
    if (HUB.config.menuSettings.zoom !== "None") {
      AJAX.Require("[MathJax]/extensions/MathZoom.js")
    }
  });

  if (!document.createElementNS) {
    //
    //  Try to handle SVG in IE8 and below, but fail
    //  (but don't crash on loading the file, so no delay for loadComplete)
    //
    if (!document.namespaces.svg) {
      document.namespaces.add("svg", SVGNS)
    }
    SVG.Augment({
      Element: function(type, def) {
        var obj = (typeof(type) === "string" ? document.createElement("svg:" + type) : type);
        obj.isMathJax = true;
        if (def) {
          for (var id in def) {
            if (def.hasOwnProperty(id)) {
              obj.setAttribute(id, def[id].toString())
            }
          }
        }
        return obj;
      }
    });
  }

})(MathJax.Ajax, MathJax.Hub, MathJax.HTML, MathJax.OutputJax.EditableSVG);
