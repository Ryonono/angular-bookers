import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'trim'
})

export class TrimPipe implements PipeTransform {
  // 自作のPipeでは、transform(value(引数))というメソッドが必ず必要であり？、返り値としてvalueを加工したものを返す
  transform(value: string) {
    if (typeof value !== 'string') {
      return value;
    }
    return value.trim();
  }
}

