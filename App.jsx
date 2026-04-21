import { useState, useMemo } from "react";

// ==================== DATA ====================
const PAPER_INFO = {
  P1: { name: "Pure Mathematics 1",   marks: 75 },
  P2: { name: "Pure Mathematics 2",   marks: 50 },
  P3: { name: "Pure Mathematics 3",   marks: 75 },
  M1: { name: "Mechanics",            marks: 50 },
  S1: { name: "Prob. & Statistics 1", marks: 50 },
  S2: { name: "Prob. & Statistics 2", marks: 50 },
};

const COMBOS = {
  AS: [
    { papers: ["P1","P2"], note: "Pure 1 + Pure 2" },
    { papers: ["P1","M1"], note: "Pure 1 + Mechanics" },
    { papers: ["P1","S1"], note: "Pure 1 + Statistics 1" },
  ],
  AL: [
    { papers: ["P1","P3","M1","S1"], note: "Pure 1&3 · Mechanics · Statistics 1" },
    { papers: ["P1","P3","S1","S2"], note: "Pure 1&3 · Statistics 1&2" },
  ],
};

const AS_CODE = {
  "P1+P2": {"1":"S1","2":"S4","3":"S7"},
  "M1+P1": {"1":"S2","2":"S5","3":"S8"},
  "P1+S1": {"1":"S3","2":"S6","3":"S9"},
};
const AL_CODE = {
  "M1+P1+P3+S1": {"1":"AX","2":"AY","3":"AZ"},
  "P1+P3+S1+S2": {"1":"CX","2":"CY","3":"CZ"},
};

const pk = ps => [...ps].sort().join("+");
const getCode = (lvl, ps, v) => ((lvl === "AS" ? AS_CODE : AL_CODE)[pk(ps)] ?? {})[v] ?? null;

const SESSIONS = [
  { id:"Jun2026", label:"June 2026 ⭐ Estimated", est:true, ref:"Jun2025", v:["1","2","3"] },
  { id:"Nov2025", label:"November 2025", v:["1","2","3"] },
  { id:"Jun2025", label:"June 2025",     v:["1","2","3"] },
  { id:"Nov2024", label:"November 2024", v:["1","2","3"] },
  { id:"Jun2024", label:"June 2024",     v:["1","2","3"] },
  { id:"Mar2024", label:"March 2024",    v:["2"] },
  { id:"Nov2023", label:"November 2023", v:["1","2","3"] },
  { id:"Jun2023", label:"June 2023",     v:["1","2","3"] },
  { id:"Mar2023", label:"March 2023",    v:["2"] },
  { id:"Nov2022", label:"November 2022", v:["1","2","3"] },
  { id:"Jun2022", label:"June 2022",     v:["1","2","3"] },
  { id:"Mar2022", label:"March 2022",    v:["2"] },
  { id:"Nov2021", label:"November 2021", v:["1","2","3"] },
  { id:"Jun2021", label:"June 2021",     v:["1","2","3"] },
  { id:"Nov2020", label:"November 2020", v:["1","2","3"] },
];

const AS_B = {
  Jun2025:{S1:{A:97,B:82,C:63,D:45,E:27},S2:{A:102,B:87,C:67,D:47,E:27},S3:{A:100,B:85,C:66,D:47,E:29},S4:{A:99,B:83,C:64,D:45,E:27},S5:{A:104,B:91,C:75,D:60,E:45},S6:{A:100,B:85,C:65,D:46,E:27},S7:{A:100,B:85,C:65,D:45,E:26},S8:{A:103,B:88,C:67,D:46,E:25},S9:{A:104,B:90,C:69,D:49,E:29}},
  Nov2025:{S1:{A:102,B:88,C:68,D:48,E:29},S2:{A:98,B:83,C:64,D:46,E:28},S3:{A:101,B:88,C:69,D:50,E:31},S4:{A:102,B:88,C:68,D:48,E:29},S5:{A:95,B:80,C:62,D:44,E:27},S6:{A:98,B:84,C:64,D:45,E:26},S7:{A:103,B:91,C:71,D:51,E:32},S8:{A:97,B:82,C:65,D:48,E:31},S9:{A:106,B:94,C:74,D:55,E:36}},
  Nov2024:{S1:{A:92,B:79,C:61,D:44,E:27},S2:{A:90,B:78,C:61,D:44,E:27},S3:{A:92,B:80,C:63,D:46,E:30},S4:{A:92,B:79,C:61,D:44,E:27},S5:{A:85,B:71,C:55,D:39,E:24},S6:{A:92,B:80,C:63,D:46,E:30},S7:{A:95,B:82,C:64,D:47,E:30},S8:{A:96,B:81,C:63,D:46,E:29},S9:{A:95,B:81,C:65,D:49,E:33}},
  Jun2024:{S1:{A:91,B:78,C:61,D:44,E:27},S2:{A:89,B:78,C:60,D:42,E:25},S3:{A:87,B:76,C:58,D:41,E:24},S4:{A:100,B:82,C:63,D:44,E:25},S5:{A:96,B:79,C:60,D:42,E:24},S6:{A:96,B:79,C:60,D:41,E:23},S7:{A:98,B:81,C:62,D:43,E:25},S8:{A:97,B:80,C:60,D:41,E:22},S9:{A:102,B:87,C:68,D:49,E:30}},
  Mar2024:{S4:{A:103,B:93,C:77,D:62,E:47},S5:{A:101,B:89,C:74,D:60,E:46},S6:{A:107,B:96,C:80,D:64,E:49}},
  Nov2023:{S1:{A:94,B:79,C:61,D:44,E:27},S2:{A:93,B:78,C:60,D:43,E:26},S3:{A:93,B:78,C:61,D:44,E:28},S4:{A:94,B:81,C:62,D:44,E:26},S5:{A:94,B:81,C:62,D:43,E:25},S6:{A:95,B:82,C:63,D:45,E:27},S7:{A:101,B:91,C:72,D:54,E:36},S8:{A:107,B:96,C:78,D:61,E:44},S9:{A:108,B:98,C:81,D:64,E:48}},
  Jun2023:{S1:{A:83,B:71,C:56,D:42,E:28},S2:{A:86,B:74,C:59,D:44,E:30},S3:{A:85,B:73,C:57,D:42,E:27},S4:{A:89,B:70,C:53,D:36,E:19},S5:{A:87,B:70,C:54,D:38,E:23},S6:{A:87,B:71,C:54,D:38,E:22},S7:{A:102,B:83,C:63,D:44,E:25},S8:{A:100,B:84,C:65,D:46,E:28},S9:{A:102,B:87,C:67,D:48,E:29}},
  Mar2023:{S4:{A:98,B:86,C:70,D:55,E:40},S5:{A:97,B:82,C:66,D:50,E:34},S6:{A:96,B:81,C:66,D:51,E:36}},
  Nov2022:{S1:{A:96,B:81,C:64,D:48,E:32},S2:{A:91,B:76,C:61,D:46,E:32},S3:{A:96,B:80,C:65,D:50,E:36},S4:{A:101,B:89,C:69,D:49,E:29},S5:{A:95,B:82,C:64,D:46,E:28},S6:{A:96,B:84,C:65,D:46,E:27},S7:{A:94,B:81,C:64,D:48,E:32},S8:{A:85,B:71,C:57,D:43,E:30},S9:{A:93,B:79,C:64,D:49,E:34}},
  Jun2022:{S1:{A:89,B:76,C:59,D:43,E:27},S2:{A:90,B:76,C:61,D:47,E:33},S3:{A:92,B:79,C:63,D:48,E:33},S4:{A:89,B:72,C:54,D:36,E:19},S5:{A:91,B:74,C:56,D:39,E:22},S6:{A:90,B:73,C:55,D:37,E:19},S7:{A:94,B:80,C:63,D:46,E:30},S8:{A:96,B:81,C:66,D:51,E:36},S9:{A:96,B:81,C:65,D:50,E:35}},
  Mar2022:{S4:{A:92,B:79,C:62,D:46,E:30},S5:{A:95,B:80,C:63,D:46,E:29},S6:{A:91,B:76,C:59,D:42,E:26}},
  Nov2021:{S1:{A:89,B:73,C:55,D:38,E:21},S2:{A:85,B:69,C:53,D:37,E:21},S3:{A:86,B:71,C:54,D:38,E:22},S4:{A:90,B:73,C:53,D:33,E:14},S5:{A:79,B:63,C:46,D:29,E:13},S6:{A:88,B:71,C:51,D:32,E:13},S7:{A:91,B:76,C:59,D:42,E:25},S8:{A:87,B:72,C:56,D:40,E:25},S9:{A:92,B:78,C:62,D:47,E:32}},
  Jun2021:{S1:{A:84,B:69,C:53,D:38,E:23},S2:{A:83,B:68,C:53,D:38,E:23},S3:{A:86,B:71,C:55,D:40,E:25},S4:{A:89,B:74,C:56,D:39,E:22},S5:{A:82,B:68,C:52,D:36,E:21},S6:{A:91,B:76,C:59,D:42,E:26},S7:{A:93,B:78,C:62,D:46,E:30},S8:{A:90,B:76,C:61,D:46,E:32},S9:{A:95,B:80,C:64,D:48,E:33}},
  Nov2020:{S1:{A:90,B:75,C:58,D:41,E:25},S2:{A:91,B:77,C:61,D:46,E:31},S3:{A:92,B:77,C:60,D:43,E:27},S4:{A:94,B:78,C:60,D:42,E:24},S5:{A:90,B:75,C:57,D:40,E:23},S6:{A:92,B:76,C:58,D:40,E:22},S7:{A:94,B:79,C:63,D:47,E:31},S8:{A:96,B:82,C:66,D:51,E:36},S9:{A:97,B:83,C:67,D:51,E:35}},
};

const AL_B = {
  Jun2025:{AX:{As:224,A:198,B:171,C:133,D:95,E:57},AY:{As:224,A:198,B:171,C:138,D:105,E:72},AZ:{As:223,A:197,B:170,C:131,D:93,E:55},CX:{As:221,A:195,B:169,C:133,D:97,E:61},CY:{As:224,A:198,B:169,C:132,D:95,E:59},CZ:{As:219,A:195,B:171,C:134,D:97,E:61}},
  Nov2025:{AX:{As:223,A:197,B:169,C:134,D:99,E:64},AY:{As:205,A:178,B:151,C:118,D:86,E:54},AZ:{As:225,A:200,B:171,C:137,D:103,E:70},CX:{As:227,A:205,B:179,C:143,D:107,E:71},CY:{As:204,A:179,B:154,C:122,D:90,E:59},CZ:{As:230,A:210,B:185,C:149,D:113,E:77}},
  Nov2024:{AX:{As:209,A:184,B:159,C:126,D:94,E:62},AY:{As:203,A:176,B:149,C:118,D:88,E:58},AZ:{As:220,A:191,B:160,C:128,D:96,E:64},CX:{As:215,A:189,B:163,C:131,D:99,E:67},CY:{As:210,A:185,B:160,C:127,D:95,E:63},CZ:{As:221,A:193,B:164,C:132,D:101,E:70}},
  Jun2024:{AX:{As:199,A:174,B:149,C:116,D:83,E:51},AY:{As:212,A:180,B:148,C:115,D:82,E:49},AZ:{As:222,A:195,B:164,C:129,D:94,E:60},CX:{As:201,A:175,B:149,C:117,D:85,E:53},CY:{As:215,A:183,B:151,C:118,D:85,E:53},CZ:{As:224,A:198,B:168,C:134,D:101,E:68}},
  Mar2024:{AY:{As:226,A:203,B:180,C:150,D:121,E:92},CY:{As:228,A:207,B:184,C:154,D:124,E:95}},
  Nov2023:{AX:{As:213,A:185,B:157,C:126,D:95,E:64},AY:{As:214,A:188,B:162,C:129,D:96,E:63},AZ:{As:234,A:219,B:197,C:165,D:133,E:101},CX:{As:217,A:188,B:159,C:129,D:99,E:69},CY:{As:211,A:184,B:157,C:125,D:93,E:61},CZ:{As:232,A:215,B:193,C:161,D:129,E:97}},
  Jun2023:{AX:{As:197,A:173,B:149,C:119,D:89,E:60},AY:{As:208,A:177,B:146,C:114,D:83,E:52},AZ:{As:223,A:197,B:169,C:134,D:100,E:66},CX:{As:198,A:175,B:152,C:121,D:90,E:60},CY:{As:206,A:178,B:150,C:119,D:88,E:58},CZ:{As:223,A:197,B:169,C:135,D:102,E:69}},
  Mar2023:{AY:{As:220,A:191,B:162,C:131,D:100,E:70},CY:{As:220,A:193,B:166,C:136,D:106,E:76}},
  Nov2022:{AX:{As:215,A:188,B:161,C:131,D:101,E:72},AY:{As:214,A:188,B:162,C:128,D:94,E:60},AZ:{As:207,A:180,B:153,C:124,D:96,E:68},CX:{As:222,A:194,B:165,C:135,D:106,E:77},CY:{As:216,A:191,B:166,C:132,D:98,E:64},CZ:{As:218,A:190,B:162,C:133,D:104,E:75}},
  Jun2022:{AX:{As:208,A:181,B:154,C:125,D:96,E:67},AY:{As:214,A:184,B:154,C:120,D:86,E:52},AZ:{As:217,A:190,B:163,C:134,D:105,E:77},CX:{As:208,A:182,B:156,C:126,D:96,E:66},CY:{As:216,A:186,B:156,C:122,D:89,E:56},CZ:{As:222,A:194,B:165,C:136,D:107,E:78}},
  Mar2022:{AY:{As:218,A:188,B:158,C:125,D:93,E:61},CY:{As:213,A:184,B:155,C:123,D:91,E:60}},
  Nov2021:{AX:{As:203,A:173,B:143,C:111,D:80,E:49},AY:{As:197,A:166,B:135,C:101,D:67,E:33},AZ:{As:207,A:179,B:151,C:121,D:91,E:61},CX:{As:209,A:180,B:151,C:120,D:89,E:59},CY:{As:202,A:172,B:142,C:108,D:74,E:41},CZ:{As:213,A:186,B:159,C:129,D:100,E:71}},
  Jun2021:{AX:{As:201,A:172,B:143,C:113,D:84,E:55},AY:{As:204,A:176,B:148,C:117,D:86,E:56},AZ:{As:213,A:186,B:159,C:129,D:100,E:71},CX:{As:204,A:175,B:146,C:116,D:86,E:57},CY:{As:211,A:184,B:157,C:125,D:94,E:63},CZ:{As:215,A:188,B:161,C:131,D:101,E:71}},
  Nov2020:{AX:{As:221,A:193,B:164,C:132,D:101,E:70},AY:{As:209,A:179,B:149,C:117,D:85,E:54},AZ:{As:224,A:199,B:171,C:139,D:108,E:77},CX:{As:223,A:196,B:166,C:133,D:101,E:69},CY:{As:209,A:179,B:149,C:117,D:85,E:54},CZ:{As:225,A:201,B:172,C:140,D:108,E:77}},
};

const GRADE_CFG = {
  As: { lbl:"A★", bg:"#5b21b6", ring:"#c4b5fd" },
  A:  { lbl:"A",  bg:"#1e40af", ring:"#93c5fd" },
  B:  { lbl:"B",  bg:"#065f46", ring:"#6ee7b7" },
  C:  { lbl:"C",  bg:"#92400e", ring:"#fcd34d" },
  D:  { lbl:"D",  bg:"#7c2d12", ring:"#fdba74" },
  E:  { lbl:"E",  bg:"#7f1d1d", ring:"#fca5a5" },
};

const sTheme = {
  hit:  { bg:"rgba(34,197,94,0.1)",   border:"rgba(34,197,94,0.5)",   text:"#4ade80", icon:"✅" },
  miss: { bg:"rgba(239,68,68,0.1)",   border:"rgba(239,68,68,0.5)",   text:"#f87171", icon:"✗"  },
  near: { bg:"rgba(201,168,76,0.1)",  border:"rgba(201,168,76,0.5)",  text:"#E8C97A", icon:"🎯" },
  no:   { bg:"rgba(239,68,68,0.1)",   border:"rgba(239,68,68,0.5)",   text:"#f87171", icon:"✗"  },
};

// ==================== MAIN ====================
export default function GradeCalc() {
  const [level, setLevel] = useState(null);
  const [sid,   setSid]   = useState("Jun2025");
  const [vari,  setVari]  = useState("2");
  const [combo, setCombo] = useState(null);
  const [pst,   setPst]   = useState({});

  const sess  = SESSIONS.find(s => s.id === sid);
  const effId = sess?.est ? sess.ref : sid;
  const oc    = useMemo(() => level && combo ? getCode(level, combo, vari) : null, [level, combo, vari]);
  const maxM  = level === "AL" ? 250 : 125;

  const bounds = useMemo(() => {
    if (!oc || !effId) return null;
    return level === "AS" ? AS_B[effId]?.[oc] : AL_B[effId]?.[oc];
  }, [oc, effId, level]);

  const analysis = useMemo(() => {
    if (!bounds || !combo) return null;
    const sat  = combo.filter(p => pst[p]?.sat);
    const todo = combo.filter(p => !pst[p]?.sat);
    const cur  = sat.reduce((s, p) => s + (Number(pst[p]?.score) || 0), 0);
    const maxR = todo.reduce((s, p) => s + PAPER_INFO[p].marks, 0);
    const maxP = cur + maxR;
    const keys = level === "AL" ? ["As","A","B","C","D","E"] : ["A","B","C","D","E"];
    const grades = keys.map(g => {
      const b = bounds[g];
      if (b === undefined) return null;
      const need = b - cur;
      let status, headline, sub;
      if (todo.length === 0) {
        status   = cur >= b ? "hit" : "miss";
        headline = cur >= b
          ? `Achieved — your total (${cur}) meets the boundary (${b})`
          : `Missed — you scored ${cur} but needed ${b}`;
      } else if (cur >= b) {
        status   = "hit";
        headline = `Already secured — current total ${cur} already meets boundary ${b}`;
      } else if (maxP >= b) {
        status   = "near";
        headline = `You need ${need} from ${todo.join(" + ")} to reach boundary ${b}`;
        sub      = `Max available from remaining papers: ${maxR}`;
      } else {
        status   = "no";
        headline = `Not possible — your max (${maxP}) falls short of boundary (${b})`;
        sub      = `Short by ${b - maxP} marks`;
      }
      return { g, b, status, headline, sub, cur, need, maxR, maxP };
    }).filter(Boolean);
    return { grades, cur, maxP, sat, todo };
  }, [bounds, combo, pst, level]);

  function pickLevel(l) { setLevel(l); setCombo(null); setPst({}); }
  function pickCombo(ps) {
    setCombo(ps);
    const s = {}; ps.forEach(p => { s[p] = { sat: false, score: "" }; }); setPst(s);
  }
  function toggleSat(p, v) { setPst(prev => ({ ...prev, [p]: { ...prev[p], sat: v } })); }
  function setScore(p, raw) {
    const n = Math.min(PAPER_INFO[p].marks, Math.max(0, parseInt(raw) || 0));
    setPst(prev => ({ ...prev, [p]: { ...prev[p], score: n } }));
  }
  function changeSess(id) {
    setSid(id);
    const s = SESSIONS.find(x => x.id === id);
    if (s && !s.v.includes(vari)) setVari(s.v[0]);
  }

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#0B0F1A", minHeight:"100vh", padding:"20px 10px" }}>
      <style>{`
        * { box-sizing: border-box; }
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes slideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .slide { animation: slideIn .22s ease both; }
        select, input, button { font-family: 'DM Sans', sans-serif; }
        input[type=number] { -moz-appearance: textfield; }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>

      <div style={{ maxWidth:"680px", margin:"0 auto" }}>

        {/* HEADER */}
        <div style={{ background:"linear-gradient(140deg,#0B0F1A 0%,#151E2D 60%,#1a2540 100%)", borderRadius:"16px 16px 0 0", padding:"28px 32px", color:"white", borderBottom:"3px solid #C9A84C", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"-30px", right:"-30px", width:"160px", height:"160px", background:"rgba(201,168,76,0.04)", borderRadius:"50%" }} />
          <div style={{ fontSize:"10px", letterSpacing:"3px", color:"#C9A84C", textTransform:"uppercase", marginBottom:"8px" }}>
            Cambridge International · 9709 Mathematics
          </div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"26px", fontWeight:"700", marginBottom:"4px" }}>
            Grade Boundary Calculator
          </div>
          <div style={{ fontSize:"13px", color:"#8A8F9E" }}>
            AS &amp; A Level · Sessions 2020–2025 · Official Cambridge thresholds
          </div>
        </div>

        {/* BODY */}
        <div style={{ background:"#111827", borderRadius:"0 0 16px 16px", boxShadow:"0 8px 40px rgba(0,0,0,0.5)", padding:"28px", border:"1px solid rgba(201,168,76,0.2)", borderTop:"none" }}>

          {/* STEP 1 */}
          <Section n="1" title="Choose Your Level">
            <div style={{ display:"flex", gap:"10px" }}>
              {[["AS","AS Level",125],["AL","A Level",250]].map(([val,lbl,max]) => (
                <button key={val} onClick={() => pickLevel(val)} style={{
                  flex:1, padding:"14px 16px", borderRadius:"10px", textAlign:"center", cursor:"pointer",
                  border:`2px solid ${level===val ? "#C9A84C" : "rgba(201,168,76,0.25)"}`,
                  background: level===val ? "rgba(201,168,76,0.15)" : "#151E2D",
                  color: level===val ? "#E8C97A" : "#8A8F9E", transition:"all .15s",
                }}>
                  <span style={{ fontSize:"16px", fontWeight:"700", display:"block", color: level===val ? "#E8C97A" : "#E8E8E0" }}>{lbl}</span>
                  <span style={{ display:"block", fontSize:"11px", color: level===val ? "#C9A84C" : "#8A8F9E", marginTop:"2px" }}>Max {max} marks</span>
                </button>
              ))}
            </div>
          </Section>

          {level && <div className="slide">

            {/* STEP 2 */}
            <Section n="2" title="Session & Variant">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 148px", gap:"14px", alignItems:"start" }}>
                <div>
                  <FieldLabel>Examination Session</FieldLabel>
                  <select value={sid} onChange={e => changeSess(e.target.value)} style={{
                    width:"100%", padding:"9px 12px", border:"1.5px solid rgba(201,168,76,0.3)",
                    borderRadius:"8px", fontSize:"13px", color:"#E8E8E0", background:"#151E2D",
                  }}>
                    {SESSIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <FieldLabel>Variant</FieldLabel>
                  <div style={{ display:"flex", gap:"6px" }}>
                    {["1","2","3"].map(v => {
                      const ok = sess?.v.includes(v);
                      return (
                        <button key={v} onClick={() => ok && setVari(v)} disabled={!ok} style={{
                          flex:1, padding:"9px 0", borderRadius:"8px",
                          border:`2px solid ${vari===v && ok ? "#C9A84C" : "rgba(201,168,76,0.2)"}`,
                          background: vari===v && ok ? "rgba(201,168,76,0.15)" : "#151E2D",
                          color: vari===v && ok ? "#E8C97A" : ok ? "#8A8F9E" : "#3a4155",
                          fontWeight:"700", fontSize:"14px", cursor: ok ? "pointer" : "not-allowed",
                          opacity: ok ? 1 : 0.4,
                        }}>V{v}</button>
                      );
                    })}
                  </div>
                </div>
              </div>
              {sess?.est && (
                <div className="slide" style={{ marginTop:"12px", padding:"11px 14px", background:"rgba(201,168,76,0.08)", border:"1px solid rgba(201,168,76,0.35)", borderRadius:"8px", fontSize:"12px", color:"#E8C97A", lineHeight:"1.6" }}>
                  <b>⭐ June 2026 boundaries not yet published.</b> June 2025 thresholds shown as reference — use as planning estimate only.
                </div>
              )}
            </Section>

            {/* STEP 3 */}
            <Section n="3" title="Paper Combination">
              {COMBOS[level].map(c => {
                const code  = getCode(level, c.papers, vari);
                const bdata = code && (level==="AS" ? AS_B[effId]?.[code] : AL_B[effId]?.[code]);
                const ok    = !!bdata;
                const isSel = combo && pk(combo) === pk(c.papers);
                const total = c.papers.reduce((s,p) => s + PAPER_INFO[p].marks, 0);
                return (
                  <button key={pk(c.papers)} onClick={() => ok && pickCombo(c.papers)} style={{
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    width:"100%", padding:"13px 16px", marginBottom:"8px", borderRadius:"10px",
                    border:`2px solid ${isSel ? "#C9A84C" : ok ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.05)"}`,
                    background: isSel ? "rgba(201,168,76,0.1)" : ok ? "#151E2D" : "#0f1624",
                    cursor: ok ? "pointer" : "not-allowed", textAlign:"left", transition:"border .15s,background .15s",
                  }}>
                    <div>
                      <span style={{ fontWeight:"700", fontSize:"15px", color: ok ? "#E8E8E0" : "#3a4155" }}>{c.papers.join(" + ")}</span>
                      <span style={{ display:"block", fontSize:"11px", color: isSel ? "#C9A84C" : "#8A8F9E", marginTop:"2px" }}>{c.note} · {total} marks total</span>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"4px" }}>
                      {code && ok && (
                        <span style={{ fontSize:"11px", fontWeight:"700", padding:"3px 10px", borderRadius:"20px", background: isSel ? "rgba(201,168,76,0.2)" : "rgba(201,168,76,0.1)", color:"#C9A84C", letterSpacing:"0.5px" }}>{code}</span>
                      )}
                      {!ok && <span style={{ fontSize:"11px", color:"#3a4155" }}>N/A this session</span>}
                    </div>
                  </button>
                );
              })}
            </Section>

            {combo && <div className="slide">

              {/* STEP 4 */}
              <Section n="4" title="Paper Scores">
                <p style={{ fontSize:"12px", color:"#8A8F9E", marginBottom:"14px" }}>
                  Mark each paper as <b style={{ color:"#E8C97A" }}>Already Sat</b> (enter score) or <b style={{ color:"#E8C97A" }}>To Sit</b> (calculator assumes maximum).
                </p>
                {combo.map(p => {
                  const info = PAPER_INFO[p];
                  const s    = pst[p] || { sat:false, score:"" };
                  const pct  = s.sat && s.score !== "" ? Math.round(Number(s.score)/info.marks*100) : null;
                  return (
                    <div key={p} className="slide" style={{
                      border:`1.5px solid ${s.sat ? "rgba(34,197,94,0.4)" : "rgba(201,168,76,0.3)"}`,
                      background: s.sat ? "rgba(34,197,94,0.06)" : "rgba(201,168,76,0.05)",
                      borderRadius:"10px", padding:"14px 18px", marginBottom:"10px",
                    }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"8px" }}>
                        <div>
                          <span style={{ fontWeight:"700", fontSize:"18px", color:"#E8C97A" }}>{p}</span>
                          <span style={{ color:"#8A8F9E", fontSize:"13px", marginLeft:"10px" }}>{info.name}</span>
                          <span style={{ color:"#3a4a66", fontSize:"12px", marginLeft:"4px" }}>/ {info.marks}</span>
                        </div>
                        <div style={{ display:"flex", gap:"6px" }}>
                          {[["To Sit",false,"rgba(201,168,76,0.1)","#E8C97A","#C9A84C"],["Sat ✓",true,"rgba(34,197,94,0.1)","#4ade80","#22c55e"]].map(([lbl,v,bg,col,bor]) => (
                            <button key={lbl} onClick={() => toggleSat(p,v)} style={{
                              padding:"5px 13px", borderRadius:"6px", fontSize:"12px", fontWeight:"700", cursor:"pointer",
                              border:`1.5px solid ${s.sat===v ? bor : "rgba(255,255,255,0.1)"}`,
                              background: s.sat===v ? bg : "#151E2D",
                              color: s.sat===v ? col : "#8A8F9E",
                            }}>{lbl}</button>
                          ))}
                        </div>
                      </div>
                      {s.sat && (
                        <div style={{ display:"flex", alignItems:"center", gap:"10px", marginTop:"12px" }}>
                          <span style={{ fontSize:"13px", color:"#8A8F9E" }}>Score:</span>
                          <input type="number" min={0} max={info.marks} value={s.score}
                            onChange={e => setScore(p, e.target.value)} style={{
                              width:"70px", padding:"6px 8px", border:"1.5px solid rgba(201,168,76,0.4)",
                              borderRadius:"7px", fontSize:"20px", fontWeight:"800",
                              textAlign:"center", color:"#E8C97A", background:"#151E2D",
                            }}/>
                          <span style={{ fontSize:"13px", color:"#3a4a66" }}>/ {info.marks}</span>
                          {pct !== null && (
                            <span style={{
                              fontSize:"12px", fontWeight:"700", padding:"3px 10px", borderRadius:"20px",
                              background: pct>=80 ? "rgba(34,197,94,0.1)" : pct>=60 ? "rgba(201,168,76,0.1)" : "rgba(239,68,68,0.1)",
                              color:      pct>=80 ? "#4ade80" : pct>=60 ? "#E8C97A" : "#f87171",
                            }}>{pct}%</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </Section>

              {/* RESULTS */}
              {analysis && bounds && (
                <div className="slide">
                  <Section n="📊" title="Grade Analysis">

                    {/* Stats */}
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"8px", marginBottom:"18px" }}>
                      {[
                        { lbl:"Current Total",   val:analysis.cur,  col:"#C9A84C", sub:`from ${analysis.sat.length} paper${analysis.sat.length!==1?"s":""}` },
                        { lbl:"Max Possible",    val:analysis.maxP, col:"#4ade80", sub:analysis.todo.length>0?`+${analysis.todo.map(p=>PAPER_INFO[p].marks).join("+")} remaining`:"all papers sat" },
                        { lbl:"Total Available", val:maxM,          col:"#8A8F9E", sub:level==="AL"?"A Level (250 pts)":"AS Level (125 pts)" },
                      ].map(({ lbl,val,col,sub }) => (
                        <div key={lbl} style={{ background:"#151E2D", borderRadius:"10px", padding:"14px 10px", textAlign:"center", border:"1px solid rgba(201,168,76,0.2)" }}>
                          <div style={{ fontSize:"28px", fontWeight:"800", color:col, lineHeight:1 }}>{val}</div>
                          <div style={{ fontSize:"10px", color:"#8A8F9E", marginTop:"4px", lineHeight:"1.3" }}>{lbl}</div>
                          <div style={{ fontSize:"10px", color:"#3a4a66" }}>{sub}</div>
                        </div>
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div style={{ marginBottom:"20px" }}>
                      <div style={{ height:"7px", background:"rgba(255,255,255,0.06)", borderRadius:"4px", overflow:"hidden" }}>
                        <div style={{
                          height:"100%", borderRadius:"4px",
                          width:`${Math.min(100, Math.round(analysis.maxP/maxM*100))}%`,
                          background:"linear-gradient(90deg,#C9A84C,#E8C97A)",
                          transition:"width .4s ease",
                        }}/>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:"10px", color:"#8A8F9E", marginTop:"4px" }}>
                        <span>Max achievable: <b style={{ color:"#E8C97A" }}>{analysis.maxP} / {maxM}</b></span>
                        <span>{Math.round(analysis.maxP/maxM*100)}%</span>
                      </div>
                    </div>

                    {/* Grade rows */}
                    {analysis.grades.map(r => {
                      const gc = GRADE_CFG[r.g];
                      const th = sTheme[r.status];
                      return (
                        <div key={r.g} style={{
                          display:"flex", alignItems:"flex-start", gap:"12px",
                          padding:"12px 16px", marginBottom:"8px", borderRadius:"10px",
                          background:th.bg, border:`1px solid ${th.border}`,
                        }}>
                          <div style={{
                            minWidth:"44px", height:"44px", borderRadius:"9px",
                            background:gc.bg, color:"white", display:"flex",
                            alignItems:"center", justifyContent:"center",
                            fontWeight:"800", fontSize:"15px", flexShrink:0,
                            boxShadow:`0 0 0 3px ${gc.ring}40`,
                          }}>{gc.lbl}</div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:"flex", alignItems:"baseline", gap:"7px", flexWrap:"wrap" }}>
                              <span style={{ fontSize:"13px" }}>{th.icon}</span>
                              <span style={{ fontSize:"13px", color:th.text, lineHeight:"1.4" }}>{r.headline}</span>
                            </div>
                            {r.sub && <div style={{ fontSize:"11px", color:"#8A8F9E", marginTop:"3px" }}>{r.sub}</div>}
                            {r.status === "near" && r.b > 0 && (
                              <div style={{ marginTop:"7px" }}>
                                <div style={{ height:"4px", background:"rgba(0,0,0,0.2)", borderRadius:"2px", overflow:"hidden" }}>
                                  <div style={{ height:"100%", background:"#C9A84C", borderRadius:"2px", width:`${Math.min(100,Math.round(r.cur/r.b*100))}%` }}/>
                                </div>
                                <span style={{ fontSize:"10px", color:"#8A8F9E" }}>{r.cur} / {r.b} boundary reached ({Math.round(r.cur/r.b*100)}%)</span>
                              </div>
                            )}
                          </div>
                          <div style={{ textAlign:"right", flexShrink:0 }}>
                            <div style={{ fontSize:"9px", color:"#8A8F9E", textTransform:"uppercase", letterSpacing:"0.5px" }}>boundary</div>
                            <div style={{ fontSize:"18px", fontWeight:"800", color:"#E8C97A" }}>{r.b}</div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Footer */}
                    <div style={{ marginTop:"16px", padding:"11px 14px", background:"rgba(201,168,76,0.05)", border:"1px solid rgba(201,168,76,0.2)", borderRadius:"8px", fontSize:"11px", color:"#8A8F9E", textAlign:"center", lineHeight:"1.5" }}>
                      Session: <b style={{ color:"#E8C97A" }}>{sess?.label}</b>{sess?.est ? " (June 2025 reference)" : ""} ·
                      Option: <b style={{ color:"#E8C97A" }}>{oc}</b> ·
                      Max: <b style={{ color:"#E8C97A" }}>{maxM}</b> ·
                      Source: Cambridge International official grade threshold documents
                    </div>
                  </Section>
                </div>
              )}

              {!bounds && oc && (
                <div className="slide" style={{ marginTop:"20px", padding:"14px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"10px", fontSize:"13px", color:"#f87171" }}>
                  ⚠️ No boundary data for <b>{sess?.label}</b> · Option <b>{oc}</b>. Try a different session or variant.
                </div>
              )}

            </div>}
          </div>}

        </div>

        <div style={{ textAlign:"center", fontSize:"11px", color:"#3a4a66", marginTop:"12px", marginBottom:"4px" }}>
          All data sourced from Cambridge International official grade threshold documents (9709 Mathematics, 2020–2025)
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────

function Section({ n, title, children }) {
  return (
    <div style={{ marginTop:"24px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"14px" }}>
        <span style={{ width:"22px", height:"22px", borderRadius:"50%", background:"#C9A84C", color:"#0B0F1A", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:"700", flexShrink:0 }}>
          {n}
        </span>
        <span style={{ fontSize:"11px", fontWeight:"700", letterSpacing:"1.5px", textTransform:"uppercase", color:"#8A8F9E" }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <div style={{ fontSize:"11px", fontWeight:"700", color:"#8A8F9E", letterSpacing:"0.5px", textTransform:"uppercase", marginBottom:"6px" }}>
      {children}
    </div>
  );
}
