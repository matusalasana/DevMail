CREATE TABLE "emails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from" text NOT NULL,
	"to" text NOT NULL,
	"subject" text NOT NULL,
	"text_body" text,
	"html_body" text,
	"received_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
