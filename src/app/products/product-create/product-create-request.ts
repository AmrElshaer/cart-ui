export class CreateProductRequest {
  constructor(
    public productName: string,
    public productCode: string,
    public tags?: string[],
    public description?: string
  ) {}
}
