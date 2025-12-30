export interface FacebookOutputDto {
  id: string;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
  picture: {
    data: {
      url?: string;
    };
  };
}
