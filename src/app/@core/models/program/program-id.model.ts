export class ProgramId {
    id: string;
    createdAt: number;
    title: string;
    parentFolderId?: string | null;

    constructor(title: string, parentFolderId: string | null = null){
      this.createdAt = new Date().getTime();
      this.title = title;
      this.parentFolderId = parentFolderId;
    }
  }
  