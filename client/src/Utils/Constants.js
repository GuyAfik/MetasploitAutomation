export const EXPLOITS = ["unix/ftp/vsftpd_234_backdoor", "unix/irc/unreal_ircd_3281_backdoor", "unix/misc/distcc_exec", "exploit/multi/samba/usermap_script"];
export const PAYLOADS = {
    "unix/ftp/vsftpd_234_backdoor": ["cmd/unix/interact"],
    "unix/irc/unreal_ircd_3281_backdoor": ["cmd/unix/bind_perl", "payload/cmd/unix/bind_ruby", "cmd/unix/bind_ruby_ipv6"],
    "unix/misc/distcc_exec": ["cmd/unix/bind_perl"],
    "exploit/multi/samba/usermap_script": ["payload/cmd/unix/bind_awk", "payload/cmd/unix/bind_busybox_telnetd", "payload/cmd/unix/bind_inetd", "payload/cmd/unix/bind_lua", "payload/cmd/unix/bind_jjs"]
};
