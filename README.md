# Port Scanning: Task 1, Scan Your Local Network for Open Ports

**Cyber Security Internship Portfolio | Elevate Labs (MSME, Govt. of India)**
**Author:** Seerat Fatima | **Email:** fatiibano645@gmail.com | **Date completed:** 05 Nov 2026 | **Task:** 1 of [total]

---

## 1. Objective

Learn how to discover open ports on devices in a local network, in order to understand **network exposure** and basic **network reconnaissance**.

**Tools used:** Nmap 7.99 (free), Kali Linux (VM). Wireshark was optional and is listed under "Next steps".

---

## 2. Lab Environment

| Item | Detail |
|---|---|
| Scanner machine | Kali Linux (VirtualBox VM) |
| Scanner IP | `10.0.2.15/24` (interface `eth0`) |
| Scanner MAC | `08:00:27:5a:87:bc` |
| Network range scanned | `10.0.2.0/24` (256 addresses) |
| Other interfaces | `lo` (127.0.0.1), `docker0` (172.17.0.1/16, DOWN) |

The `10.0.2.0/24` range is the typical default NAT network of a VirtualBox VM: `10.0.2.2` is the gateway (the Windows host), `10.0.2.3` is the virtual DNS server, and `10.0.2.15` is the VM itself.

> Scans were run only on my own lab network, which I own and am authorised to test.

---

## 3. What I Did (Step by Step)

| Step | Action | Command |
|---|---|---|
| 1 | Found my IP and network range | `ip a` |
| 2 | Scanned my own machine (baseline) | `nmap 10.0.2.15` |
| 3 | TCP SYN scan of the whole subnet | `sudo nmap -sS 10.0.2.0/24` |
| 4 | SYN scan plus service/version detection | `sudo nmap -sS -sV 10.0.2.0/24` |
| 5 | Noted hosts, ports and services | See results below |
| 6 | Researched services and risks | See sections 5 and 6 |
| 7 | Saved results | `sudo nmap -sS -sV 10.0.2.0/24 -oN scan_results.txt -oX scan_results.xml` |

---

## 4. Results (Evidence)

### Scan summary

| Scan | Started | Duration | Hosts up |
|---|---|---|---|
| `nmap 10.0.2.15` | 09:10 | 211.14 s | 1 |
| `nmap -sS 10.0.2.0/24` | 09:20 | 219.85 s | 3 |
| `nmap -sS -sV 10.0.2.0/24` | 09:24 | 231.54 s | 3 |

### Hosts and open ports

| Host | Role (my analysis) | Port | State | Service | Version (from `-sV`) |
|---|---|---|---|---|---|
| `10.0.2.2` | Windows host / gateway | 135/tcp | open | msrpc | Microsoft Windows RPC |
| `10.0.2.2` | | 445/tcp | open | microsoft-ds (SMB) | not confirmed (`?`) |
| `10.0.2.2` | | 5357/tcp | open | http (wsdapi) | Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP) |
| `10.0.2.3` | Virtual DNS server | 53/tcp | open | domain | Unbound |
| `10.0.2.15` | My Kali VM (scanner) | none | all 1000 ports filtered | n/a | n/a |

Notes:
- `10.0.2.2` showed 997 filtered ports; `10.0.2.3` showed 999 filtered ports.
- Nmap fingerprinted `10.0.2.2` as **Windows** (`cpe:/o:microsoft:windows`).
- The MAC `52:54:00:12:35:00` is reported by Nmap as "QEMU virtual NIC", which confirms the targets are virtual devices.

### Screenshots

| File | Shows |
|---|---|
| `screenshots/01_ip_a_and_first_scan.png` | `ip a` output and start of the first Nmap scan |
| `screenshots/02_syn_scan_subnet.png` | `-sS` scan results for `10.0.2.0/24` |
| `screenshots/03_service_scan_part1.png` | `-sS -sV` results (start) |
| `screenshots/04_service_scan_complete.png` | `-sS -sV` complete, 3 hosts up |

---

## 5. Services Found and Their Risks

| Port | Service | What it does | Potential risk |
|---|---|---|---|
| 135 | MS RPC | Lets Windows services locate and call each other remotely | Enumeration of services/endpoints; historically exploited (e.g. Blaster worm) |
| 445 | SMB | Windows file and printer sharing | Very common attack target: ransomware spread, lateral movement, EternalBlue-class flaws, weak or null sessions |
| 5357 | WSDAPI (HTTP) | Web Services for Devices discovery | Information disclosure about the device; unnecessary exposure on untrusted networks |
| 53 | DNS (Unbound) | Resolves domain names | Misconfigured resolvers can be abused for amplification or cache poisoning; DNS enumeration |

### Overall assessment

- The Windows host exposes **three** Windows network services. In a real network, SMB (445) and RPC (135) should never be reachable from untrusted segments.
- Most ports were **filtered**, which suggests a firewall is dropping unsolicited traffic, a good defensive sign.
- My Kali VM exposed **no** open ports, so it has a minimal attack surface.

### Recommended hardening

1. Block 135/445 at the firewall unless they are required, and restrict them to trusted IPs.
2. Disable SMBv1 and keep Windows fully patched.
3. Disable network discovery/SSDP/WSD services that are not needed.
4. Restrict DNS to internal clients only and keep Unbound updated.
5. Re-scan regularly to detect new or unexpected open ports.

---

## 6. Areas Covered

- Network reconnaissance and host discovery
- IP addressing, subnets and CIDR notation (`/24` = 256 addresses)
- TCP SYN ("half-open") scanning with `-sS`
- Service and version detection with `-sV`
- Interpreting port states: open, closed, filtered
- Basic OS fingerprinting (CPE)
- Mapping open ports to services and risks
- Saving scan output in text/XML format for reporting

---

## 7. Practical Learning and Key Takeaways

- **SYN scans need root.** `-sS` required `sudo` because it uses raw packets.
- **Scan time depends on filtering.** Scans took 3-4 minutes because filtered ports give no response, so Nmap waits and retries.
- **`filtered` is not the same as `closed`.** A firewall is silently dropping packets. Nmap cannot tell whether a service is behind it.
- **`-sV` adds real value.** It turned a bare `http` on 5357 into "Microsoft HTTPAPI httpd 2.0" and identified DNS as Unbound.
- **Scanning your own machine from itself** can show different results than scanning it from another host.
- **Always scan with permission.** Unauthorised port scanning can be illegal.

---

## 8. Interview Questions (My Answers)

**1. What is an open port?**
A port on a device where a service is listening and accepts connections, for example 445 for SMB.

**2. How does Nmap perform a TCP SYN scan?**
It sends a SYN packet. A SYN/ACK reply means the port is open, and Nmap then sends RST instead of completing the handshake, which is why it is called "half-open". A RST reply means closed. No reply means filtered.

**3. What risks are associated with open ports?**
Each open port is an entry point: vulnerable or misconfigured services, brute-force attacks, information leakage and lateral movement.

**4. Difference between TCP and UDP scanning?**
TCP is connection-oriented, so scans get clear handshake responses and are fast and reliable. UDP is connectionless, so open ports often give no reply (`open|filtered`) and closed ports return ICMP unreachable, which is slow and less certain.

**5. How can open ports be secured?**
Close unused services, use firewalls, patch software, use strong authentication and encryption, segment the network, and monitor with IDS/IPS.

**6. What is a firewall's role regarding ports?**
It allows or blocks traffic based on rules (IP, port, protocol), exposing only the required services.

**7. What is a port scan and why do attackers perform it?**
Probing a host for open ports and services. Attackers use it to map targets and find vulnerable services before attacking.

**8. How does Wireshark complement port scanning?**
Nmap tells you port states. Wireshark shows the actual packets (SYN, SYN/ACK, RST), so you can verify how the scan works and detect scans on your own network.

---

## 9. Repository Structure

```
task1-network-port-scan/
├── README.md
├── scan_results.txt        # Nmap normal output
├── scan_results.xml        # Nmap XML output (optional)
└── screenshots/
    ├── 01_ip_a_and_first_scan.png
    ├── 02_syn_scan_subnet.png
    ├── 03_service_scan_part1.png
    └── 04_service_scan_complete.png
```

---

## 10. Next Steps

- Capture the scan with Wireshark and analyse the SYN/SYN-ACK/RST exchange.
- Try a UDP scan (`sudo nmap -sU --top-ports 50 10.0.2.0/24`) and compare with TCP.
- Run `nmap -sC` and `--script vuln` on my own test targets.

---

*Disclaimer: This project was done in an isolated lab for educational purposes only.*
