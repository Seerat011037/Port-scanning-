/* ===== EDIT YOUR PROJECTS HERE =====
   Add a new object to this array for each project.
   Leave a link as "" to show a clearly labelled placeholder. */
const projects = [
  {
    title: "Local Network Port Scan",
    tag: "Network Recon | Elevate Labs Internship, Task 1",
    summary: "Mapped a virtual lab network with Nmap, identified exposed Windows and DNS services, and assessed their risk.",
    what: "A TCP SYN and service-version scan of a 256-address VirtualBox lab network (10.0.2.0/24) from a Kali Linux VM, completed on 05 Nov 2026.",
    why: "Port scanning is the first step attackers take and the first check defenders should run. I wanted to see network exposure the way an attacker would, then judge it as a defender.",
    objective: "Discover open ports on devices in a local network and understand network exposure and basic reconnaissance.",
    tools: ["Nmap 7.99", "Kali Linux", "VirtualBox", "ip / terminal"],
    did: [
      "Found my IP and range with ip a (10.0.2.15/24).",
      "Ran a baseline scan of my own VM, then a TCP SYN scan (-sS) of the whole subnet.",
      "Re-ran with service detection (-sV) to identify software and versions.",
      "Recorded hosts, ports and states, then researched each service and its risks.",
      "Saved results in text and XML formats for reporting."
    ],
    skills: ["Host discovery", "CIDR and subnetting", "TCP SYN scanning", "Service and version detection", "Reading open, closed and filtered states", "Basic OS fingerprinting", "Risk assessment"],
    outcome: "Three hosts found. The Windows host/gateway (10.0.2.2) exposed 135 (RPC), 445 (SMB) and 5357 (WSDAPI); the virtual DNS server (10.0.2.3) exposed 53 running Unbound. My Kali VM exposed no open ports. Most other ports were filtered, suggesting firewall filtering.",
    relevance: "SMB and RPC exposure is a classic route for ransomware spread and lateral movement. Regular scanning, firewalling 135/445 and disabling unneeded discovery services are standard hardening steps.",
    notes: "The Windows host role for 10.0.2.2 is my inference from the default VirtualBox NAT layout. Scans were run only on my own lab.",
    links: [
      { label: "GitHub repository", url: "" },
      { label: "Screenshots", url: "" },
      { label: "Write-up", url: "" },
      { label: "Demo", url: "" },
      { label: "Technical documentation", url: "" }
    ]
  }
];

/* ===== RENDER PROJECT CARDS ===== */
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const grid = document.getElementById("projectGrid");
projects.forEach((p, i) => {
  const b = document.createElement("button");
  b.className = "card proj";
  b.innerHTML = `<span class="tag">${esc(p.tag.split("|")[0].trim())}</span><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p>
    <div class="chips">${p.tools.map(t => `<span>${esc(t)}</span>`).join("")}</div><span class="more">View details &rarr;</span>`;
  b.addEventListener("click", () => openProject(i));
  grid.appendChild(b);
});

/* ===== PROJECT DETAIL MODAL ===== */
const modal = document.getElementById("modal");
const list = a => `<ul>${a.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
const sec = (h, body) => `<div class="sec"><h4>${h}</h4>${body}</div>`;

function openProject(i) {
  const p = projects[i];
  const links = p.links.map(l => l.url
    ? `<a class="link" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`
    : `<span class="link off" title="Add your URL in script.js">${esc(l.label)} (placeholder)</span>`).join("");
  modal.querySelector(".mbody").innerHTML = `
    <button class="close" onclick="modal.close()">Close</button>
    <span class="tag">${esc(p.tag)}</span><h3 style="font-size:1.6rem;margin:8px 0">${esc(p.title)}</h3>
    ${sec("What was the project?", `<p>${esc(p.what)}</p>`)}
    <div class="two">${sec("Why I did it", `<p>${esc(p.why)}</p>`)}${sec("Objective", `<p>${esc(p.objective)}</p>`)}</div>
    ${sec("Tools and technologies", `<div class="chips">${p.tools.map(t => `<span>${esc(t)}</span>`).join("")}</div>`)}
    ${sec("What I actually did", list(p.did))}
    <div class="two">${sec("Skills developed", list(p.skills))}${sec("Outcome", `<p>${esc(p.outcome)}</p>`)}</div>
    ${sec("Real-world relevance", `<p>${esc(p.relevance)}</p>`)}
    ${p.notes ? sec("Notes", `<p>${esc(p.notes)}</p>`) : ""}
    ${sec("Evidence", `<div>${links}</div>`)}`;
  modal.showModal();
}
modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });

/* ===== HERO TERMINAL ===== */
const lines = [
  ["p", "$ ip a | grep inet"], ["", "inet 10.0.2.15/24 scope global eth0"],
  ["p", "$ sudo nmap -sS -sV 10.0.2.0/24"], ["", "Nmap done: 256 IP addresses (3 hosts up)"],
  ["o", "10.0.2.2   135/tcp  msrpc"], ["o", "10.0.2.2   445/tcp  microsoft-ds"],
  ["o", "10.0.2.2   5357/tcp wsdapi"], ["o", "10.0.2.3   53/tcp   domain (Unbound)"],
  ["p", "$ _"]
];
const out = document.getElementById("termOut");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
lines.forEach(([c, t], i) => setTimeout(() => {
  out.innerHTML += `<span class="${c}">${esc(t)}</span>\n`;
}, reduce ? 0 : 500 + i * 550));

/* ===== NAV, SCROLL REVEAL, YEAR ===== */
const burger = document.querySelector(".burger"), menu = document.getElementById("menu");
burger.addEventListener("click", () => burger.setAttribute("aria-expanded", menu.classList.toggle("open")));
menu.addEventListener("click", () => menu.classList.remove("open"));
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.1 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));
document.getElementById("yr").textContent = new Date().getFullYear();
