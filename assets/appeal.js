/* 误标申诉：提交与查询共用。anon key 仅用于调用公开的 appeal 接口。 */
(function (w) {
  var API = "https://qsaazvaroidmxgvljzgo.supabase.co/functions/v1/appeal";
  var ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzYWF6dmFyb2lkbXhndmxqemdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2NDk5NzEsImV4cCI6MjEwOTIyNTk3MX0.Rcfa8L7-nDibDoR99NYVUXC6w4GpnoqZQg4qN8r-9u8";

  function normalizeCN(raw) {
    var d = String(raw || "").replace(/\D/g, "");
    if (d.indexOf("0086") === 0) d = d.slice(4);
    else if (d.indexOf("86") === 0 && d.length >= 11) d = d.slice(2);
    if (/^1[3-9]\d{9}$/.test(d)) return "86" + d;
    if (/^0\d{9,11}$/.test(d)) return "86" + d.slice(1);
    return null;
  }
  function displayNumber(e164) {
    if (!e164) return "";
    if (/^861[3-9]\d{9}$/.test(e164)) return e164.slice(2);
    if (/^86\d{8,13}$/.test(e164)) return "0" + e164.slice(2);
    return e164;
  }
  function validContact(s) {
    var t = (s || "").trim();
    if (t.length < 3 || t.length > 80) return false;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return true;
    var d = t.replace(/\D/g, "");
    return /^1[3-9]\d{9}$/.test(d) || /^0\d{9,11}$/.test(d) || /^86[0-9]{8,13}$/.test(d);
  }
  function setErr(id, on, msg) {
    var el = document.getElementById(id);
    if (!el) return;
    if (msg) el.textContent = msg;
    el.classList.toggle("show", !!on);
  }
  function post(body) {
    return fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: ANON,
        Authorization: "Bearer " + ANON
      },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        return { res: res, data: data };
      });
    });
  }

  w.GMCAppeal = {
    STATUS_LABEL: { pending: "待处理", cleared: "已清除", whitelisted: "已加白名单", rejected: "已驳回" },
    STATUS_DESC: {
      pending: "正在人工核实，一般 3 个工作日内处理完。",
      cleared: "相关标记已清除，这个号码不再出现在拦截名单里。新的号码库生效后，用户端就会更新。",
      whitelisted: "已加入官方白名单，不会再被拦截。",
      rejected: "这次申诉未通过。如有新的情况，可以再次提交申诉。"
    },
    normalizeCN: normalizeCN,
    displayNumber: displayNumber,
    validContact: validContact,
    setErr: setErr,
    post: post
  };
})(window);
