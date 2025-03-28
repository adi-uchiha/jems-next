// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Authentication (optional, but highly recommended)
const auth = (req: Request) => ({ id: "fakeId" }); // Replace with your actual auth logic

export const ourFileRouter = {
	uploadResume: f({
		pdf: { maxFileSize: "8MB" },
	})
		.middleware(async ({ req }) => {
			const user = await auth(req);
			if (!user) throw new UploadThingError("Unauthorized");
			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log("Upload complete for userId:", metadata.userId);
			console.log("File URL:", file.ufsUrl);
			const response = { uploadedBy: metadata.userId, fileUrl: file.ufsUrl };
			return response;
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;