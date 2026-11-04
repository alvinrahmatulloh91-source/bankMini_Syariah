// Decap Editorial Workflow stores in-progress entries on cms/<collection>/<entry> branches.
// Only those preview builds may accept incomplete fields; local and production builds stay strict.
export const isDecapDraftBuild = process.env.VERCEL_GIT_COMMIT_REF?.startsWith('cms/') ?? false;
