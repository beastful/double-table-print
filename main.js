import './style.css'

// utils

const gafn = (n) => {
  return [...Array(n).keys()].map(i => i + 1);
}

const dta = (d) => {
  const [y, m] = d.split('-')
  return gafn(new Date(y, m, 0).getDate())
}

const getmru = (d) => {
  let [y, m] = d.split('-')
  let rum = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
  return rum[parseInt(m) - 1]
}

const maketable = (r, c, g) => {
  const table = document.createElement("table")
  let trh = document.createElement('tr')
  let tch = document.createElement('th')

  for (let ch of [g, ...c]) {
    let tch = document.createElement('th')
    tch.innerHTML = ch
    trh.appendChild(tch)
  }

  table.appendChild(trh)

  for (let tr of r) {
    let tre = document.createElement('tr')
    for (let tc of [tr, ...c.map(i => '')]) {
      let tce = document.createElement('td')
      tce.innerHTML = tc
      tre.appendChild(tce)
    }
    table.appendChild(tre)
  }

  return table
}

class LocalArray {
  constructor(el, inp, button) {
    this.onpush = () => {}
    this.__element__ = el
    this.__input__ = inp
    this.__pushbtn__ = button
    this.__array__ = localStorage.getItem("array");
    if(!this.__array__) {
      localStorage.setItem("array", JSON.stringify([
        "Оля",
        "Даша"
      ]))
      this.__array__ = localStorage.getItem("array")
    }
    this.__pushbtn__.addEventListener("click", () => {
      const name = this.__input__.value
      this.renew().parse().push(name).write().render()
    })
  }
  renew() {
    this.__array__ = localStorage.getItem("array")
    return this
  }
  parse() {
    this.__parsed__ = JSON.parse(this.__array__)
    return this
  }
  push(s) {
    this.__parsed__.push(s)
    return this
  }
  remove(i) {
    this.__parsed__.splice(i, 1)
    return this
  }
  view() {
    return this.__parsed__
  }
  write() {
    localStorage.setItem("array", JSON.stringify(this.__parsed__))
    return this
  }
  render() {
    this.__element__.innerHTML = ''
    for(let i = 0; i <= this.__parsed__.length - 1; i++) {
      let raw = document.createElement('div')
      let text = document.createElement('div')
      let btn = document.createElement('button')
      btn.className = "btn"
      raw.appendChild(btn)
      raw.appendChild(text)
      text.innerHTML = this.__parsed__[i]
      btn.innerHTML = "Удалить"
      raw.className = "localrow"
      btn.addEventListener("click", () => {
        this.renew().parse().remove(i).write().render()
      })

      this.__element__.appendChild(raw)
    }
    this.renew()
    this.onpush()
  }
}

class TableRenderer {
  constructor(el) {
    this.__element__ = el
  }
  render(r, c, g) {
    this.__element__.innerHTML = ''
    this.__element__.appendChild(maketable(r, c, g))
  }
}

class TableApp {
  constructor({ table, print, datePicker, table2 }) {
    this.__tablelement__ = table
    this.__table2lement__ = table2
    this.__printbutton__ = print
    this.__datepicker__ = datePicker
    this.__renderer__ = new TableRenderer(document.getElementById("table"))
    this.__renderer2__ = new TableRenderer(document.getElementById("table2"))
    this.__localarray__ = new LocalArray(document.getElementById('local'), document.getElementById('pushname'), document.getElementById('push'))
    this.__dateval__ = this.__datepicker__.value

    this.__datepicker__
      .addEventListener("change", this.datePick.bind(this))
    this.__printbutton__
      .addEventListener("click", this.onPrint.bind(this))
    this.renderTable()
    this.__localarray__.render()
    this.__localarray__.onpush = this.renderTable.bind(this)
  }
  renderTable() {
    this.__renderer__.render(this.__localarray__.parse().view(), dta(this.__dateval__), getmru(this.__dateval__))
    this.__renderer2__.render(this.__localarray__.parse().view(), dta(this.__dateval__), getmru(this.__dateval__))
  }
  datePick(e) {
    this.__dateval__ = this.__datepicker__.value
    this.renderTable()
  }
  onPrint() {
    window.print()
  }
}

const app = new TableApp({
  table: document.getElementById("table"),
  print: document.getElementById("print"),
  datePicker: document.getElementById("month"),
  table2: document.getElementById("table2"),
})





