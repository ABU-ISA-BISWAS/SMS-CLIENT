export class UserPhoto {
    private id?: number;
    private userId?: number;
    private imageData?: string;

    setId(id: number) {
        this.id = id;
    }
    setUserId(userId: number) {
        this.userId = userId;
    }
    setImageData(imageData: string) {
        this.imageData = imageData;
    }
}
