export default interface IAiProvider {
  convertToJson(content: string, cityId: string): Promise<any>
}
