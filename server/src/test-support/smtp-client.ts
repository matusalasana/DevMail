import net from "node:net";

/** Minimal SMTP client for tests: sends one message and returns the server's replies. */
export function sendRawMessage(
  port: number,
  options: { from: string; to: string[]; message: string },
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const socket = net.connect(port, "127.0.0.1");
    const replies: string[] = [];
    let buffer = "";

    const script = [
      "EHLO test.local",
      `MAIL FROM:<${options.from}>`,
      ...options.to.map((recipient) => `RCPT TO:<${recipient}>`),
      "DATA",
      `${options.message.replace(/\r?\n/g, "\r\n")}\r\n.`,
      "QUIT",
    ];
    let step = 0;

    socket.setEncoding("utf8");
    socket.setTimeout(5000, () => socket.destroy(new Error("SMTP test timeout")));
    socket.on("error", reject);
    socket.on("close", () => resolve(replies));
    socket.on("data", (chunk: string) => {
      buffer += chunk;
      // A reply is complete when its last line is "NNN text" (not "NNN-text").
      for (;;) {
        const match = /^\d{3} .*\r?\n/m.exec(buffer);
        if (!match) break;
        const replyEnd = match.index + match[0].length;
        replies.push(buffer.slice(0, replyEnd).trim());
        buffer = buffer.slice(replyEnd);

        const command = script[step++];
        if (command === undefined) {
          socket.end();
        } else {
          socket.write(`${command}\r\n`);
        }
      }
    });
  });
}
