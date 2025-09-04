using Avalonia;
using System;

namespace Baghdad;

class Program
{
    // Initialization code. Dont use any Avalonia, third-party APIs or any
    // SynchronizationContext-reliant code before AppMain is called: things arent initialized
    // yet and stuff might break.
    [STAThread]
    public static void Main(string[] args)
    {
        System.Threading.Thread.CurrentThread.CurrentUICulture = new System.Globalization.CultureInfo("ar-IQ");
        System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo("ar-IQ");

        BuildAvaloniaApp()
            .StartWithClassicDesktopLifetime(args);
    }

    // Avalonia configuration, dont remove; also used by visual designer.
    public static AppBuilder BuildAvaloniaApp()
        => AppBuilder.Configure<App>()
            .UsePlatformDetect()
            .WithInterFont()
            .LogToTrace();
}
